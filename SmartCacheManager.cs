using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Smart Cache Manager for AI Upscaler Plugin
    /// Provides intelligent caching with dynamic size adjustment and usage-based prioritization
    /// </summary>
    public class SmartCacheManager
    {
        private readonly ILogger<SmartCacheManager> _logger;
        private readonly PluginConfiguration _config;
        private readonly string _cacheDirectory;
        private readonly int _minCacheSize = 2048; // 2GB minimum
        private readonly int _maxCacheSize = 51200; // 50GB maximum
        
        private Dictionary<string, CacheEntry> _cacheIndex;
        private Dictionary<string, MediaUsageStats> _usageStats;
        
        public SmartCacheManager(ILogger<SmartCacheManager> logger)
        {
            _logger = logger;
            _config = Plugin.Instance?.Configuration ?? new PluginConfiguration();
            _cacheDirectory = Path.Combine(Path.GetTempPath(), "jellyfin-upscaler-cache");
            _cacheIndex = new Dictionary<string, CacheEntry>();
            _usageStats = new Dictionary<string, MediaUsageStats>();
            
            InitializeCache();
        }
        
        private void InitializeCache()
        {
            try
            {
                Directory.CreateDirectory(_cacheDirectory);
                LoadCacheIndex();
                LoadUsageStats();
                _logger.LogInformation($"🗄️ Smart Cache initialized at {_cacheDirectory}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to initialize smart cache");
            }
        }
        
        /// <summary>
        /// Calculate optimal cache size based on system resources and usage patterns
        /// </summary>
        public async Task<int> CalculateOptimalCacheSizeAsync()
        {
            try
            {
                var systemMetrics = await GatherSystemMetrics();
                
                // Calculate based on multiple factors
                var ramBasedSize = systemMetrics.TotalRAM / 4; // 25% of RAM
                var storageBasedSize = systemMetrics.AvailableStorage / 10; // 10% of storage
                var libraryBasedSize = systemMetrics.LibrarySize / 20; // 5% of library
                var usageBasedSize = CalculateUsageBasedSize();
                
                // Take the most conservative estimate that's still useful
                var optimalSize = new[] { ramBasedSize, storageBasedSize, libraryBasedSize, usageBasedSize }
                    .Where(size => size >= _minCacheSize)
                    .DefaultIfEmpty(_minCacheSize)
                    .Min();
                
                // Ensure within bounds
                optimalSize = Math.Max(_minCacheSize, Math.Min(_maxCacheSize, optimalSize));
                
                _logger.LogInformation($"📊 Optimal cache size calculated: {optimalSize}MB " +
                    $"(RAM: {ramBasedSize}MB, Storage: {storageBasedSize}MB, Library: {libraryBasedSize}MB, Usage: {usageBasedSize}MB)");
                
                return optimalSize;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Failed to calculate optimal cache size, using default");
                return _config.CacheSizeMB > 0 ? _config.CacheSizeMB : 10240; // 10GB default
            }
        }
        
        private async Task<SystemMetrics> GatherSystemMetrics()
        {
            return await Task.Run(() =>
            {
                var metrics = new SystemMetrics();
                
                try
                {
                    // RAM detection
                    var totalMemory = GC.GetTotalMemory(false);
                    metrics.TotalRAM = (int)(totalMemory / 1024 / 1024); // Convert to MB
                    
                    // Storage detection
                    var driveInfo = new DriveInfo(Path.GetPathRoot(_cacheDirectory));
                    metrics.AvailableStorage = (int)(driveInfo.AvailableFreeSpace / 1024 / 1024); // Convert to MB
                    
                    // Estimate library size (placeholder - would integrate with Jellyfin API)
                    metrics.LibrarySize = EstimateLibrarySize();
                    
                    _logger.LogDebug($"📊 System metrics: {metrics.TotalRAM}MB RAM, {metrics.AvailableStorage}MB storage, {metrics.LibrarySize}MB library");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "⚠️ Failed to gather some system metrics");
                }
                
                return metrics;
            });
        }
        
        private int EstimateLibrarySize()
        {
            // Placeholder - in real implementation, this would query Jellyfin's library
            // For now, return a reasonable estimate based on average library sizes
            return 1024 * 1024; // 1TB estimate
        }
        
        private int CalculateUsageBasedSize()
        {
            if (_usageStats.Count == 0)
                return _minCacheSize;
            
            // Calculate size needed for frequently accessed content
            var frequentlyAccessed = _usageStats.Values
                .Where(stats => stats.AccessCount > 3 && stats.LastAccessed > DateTime.Now.AddDays(-30))
                .Sum(stats => stats.EstimatedSizeMB);
            
            return Math.Max(_minCacheSize, frequentlyAccessed * 2); // 2x buffer for growth
        }
        
        /// <summary>
        /// Optimize cache by prioritizing frequently played content
        /// </summary>
        public async Task OptimizeCacheByUsageAsync()
        {
            try
            {
                _logger.LogInformation("🔄 Starting cache optimization by usage patterns...");
                
                var playHistory = await GetPlaybackHistoryAsync(TimeSpan.FromDays(30));
                var currentCacheSize = GetCurrentCacheSizeMB();
                var targetCacheSize = await CalculateOptimalCacheSizeAsync();
                
                // Identify frequently played content
                var frequentlyPlayed = playHistory
                    .GroupBy(p => p.MediaId)
                    .Select(g => new MediaPriority
                    {
                        MediaId = g.Key,
                        PlayCount = g.Count(),
                        LastPlayed = g.Max(p => p.Timestamp),
                        AverageQuality = g.Average(p => p.Quality),
                        Priority = CalculatePriority(g.Count(), g.Max(p => p.Timestamp))
                    })
                    .OrderByDescending(p => p.Priority)
                    .Take(100) // Top 100 most important items
                    .ToList();
                
                // Pre-cache high priority content
                await PreCacheHighPriorityContent(frequentlyPlayed);
                
                // Clean up low priority content if over size limit
                if (currentCacheSize > targetCacheSize)
                {
                    await CleanupLowPriorityContent(targetCacheSize - currentCacheSize);
                }
                
                _logger.LogInformation($"✅ Cache optimization completed. Cached {frequentlyPlayed.Count} high-priority items");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Cache optimization failed");
            }
        }
        
        private double CalculatePriority(int playCount, DateTime lastPlayed)
        {
            // Priority algorithm considering recency and frequency
            var daysSinceLastPlayed = (DateTime.Now - lastPlayed).TotalDays;
            var recencyFactor = Math.Max(0, 1.0 - (daysSinceLastPlayed / 30.0)); // Decay over 30 days
            var frequencyFactor = Math.Log(playCount + 1); // Logarithmic scaling for play count
            
            return recencyFactor * frequencyFactor;
        }
        
        private async Task<List<PlaybackRecord>> GetPlaybackHistoryAsync(TimeSpan timespan)
        {
            // Placeholder - in real implementation, this would query Jellyfin's playback history
            return await Task.FromResult(new List<PlaybackRecord>());
        }
        
        private async Task PreCacheHighPriorityContent(List<MediaPriority> priorities)
        {
            foreach (var priority in priorities.Take(20)) // Cache top 20 items
            {
                try
                {
                    if (!IsCached(priority.MediaId))
                    {
                        await PreCacheMediaAsync(priority.MediaId);
                        
                        // Update usage stats
                        if (!_usageStats.ContainsKey(priority.MediaId))
                        {
                            _usageStats[priority.MediaId] = new MediaUsageStats();
                        }
                        _usageStats[priority.MediaId].LastCached = DateTime.Now;
                        _usageStats[priority.MediaId].CacheReason = "High Priority";
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, $"⚠️ Failed to pre-cache media {priority.MediaId}");
                }
            }
        }
        
        private async Task PreCacheMediaAsync(string mediaId)
        {
            // Placeholder for actual pre-caching logic
            _logger.LogDebug($"📦 Pre-caching media: {mediaId}");
            await Task.Delay(100); // Simulate work
        }
        
        private bool IsCached(string mediaId)
        {
            return _cacheIndex.ContainsKey(mediaId) && 
                   File.Exists(Path.Combine(_cacheDirectory, _cacheIndex[mediaId].FileName));
        }
        
        private async Task CleanupLowPriorityContent(int targetReductionMB)
        {
            var itemsToRemove = _cacheIndex.Values
                .Where(entry => File.Exists(Path.Combine(_cacheDirectory, entry.FileName)))
                .OrderBy(entry => GetItemPriority(entry))
                .ToList();
            
            int removedSizeMB = 0;
            int removedCount = 0;
            
            foreach (var entry in itemsToRemove)
            {
                if (removedSizeMB >= targetReductionMB)
                    break;
                
                try
                {
                    var filePath = Path.Combine(_cacheDirectory, entry.FileName);
                    var fileInfo = new FileInfo(filePath);
                    var fileSizeMB = (int)(fileInfo.Length / 1024 / 1024);
                    
                    File.Delete(filePath);
                    _cacheIndex.Remove(entry.MediaId);
                    
                    removedSizeMB += fileSizeMB;
                    removedCount++;
                    
                    _logger.LogDebug($"🗑️ Removed cached item: {entry.MediaId} ({fileSizeMB}MB)");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, $"⚠️ Failed to remove cached item: {entry.MediaId}");
                }
            }
            
            _logger.LogInformation($"🧹 Cleanup completed: Removed {removedCount} items ({removedSizeMB}MB)");
            await SaveCacheIndexAsync();
        }
        
        private double GetItemPriority(CacheEntry entry)
        {
            if (_usageStats.TryGetValue(entry.MediaId, out var stats))
            {
                return CalculatePriority(stats.AccessCount, stats.LastAccessed);
            }
            
            // Low priority for items without usage stats
            return 0.1;
        }
        
        private int GetCurrentCacheSizeMB()
        {
            try
            {
                var directoryInfo = new DirectoryInfo(_cacheDirectory);
                if (!directoryInfo.Exists)
                    return 0;
                
                var totalBytes = directoryInfo.GetFiles("*", SearchOption.AllDirectories)
                    .Sum(file => file.Length);
                
                return (int)(totalBytes / 1024 / 1024);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Failed to calculate current cache size");
                return 0;
            }
        }
        
        /// <summary>
        /// Monitor cache usage and automatically adjust if needed
        /// </summary>
        public async Task MonitorAndAdjustAsync()
        {
            try
            {
                var currentSize = GetCurrentCacheSizeMB();
                var optimalSize = await CalculateOptimalCacheSizeAsync();
                
                if (currentSize > optimalSize * 1.2) // 20% tolerance
                {
                    _logger.LogInformation($"📊 Cache oversized ({currentSize}MB > {optimalSize}MB), triggering cleanup");
                    await CleanupLowPriorityContent(currentSize - optimalSize);
                }
                else if (currentSize < optimalSize * 0.5) // Under 50% utilization
                {
                    _logger.LogInformation($"📊 Cache underutilized ({currentSize}MB < {optimalSize / 2}MB), triggering pre-caching");
                    await OptimizeCacheByUsageAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Cache monitoring failed");
            }
        }
        
        private void LoadCacheIndex()
        {
            var indexPath = Path.Combine(_cacheDirectory, "cache-index.json");
            if (File.Exists(indexPath))
            {
                try
                {
                    var json = File.ReadAllText(indexPath);
                    _cacheIndex = JsonSerializer.Deserialize<Dictionary<string, CacheEntry>>(json) ?? new Dictionary<string, CacheEntry>();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "⚠️ Failed to load cache index, starting fresh");
                    _cacheIndex = new Dictionary<string, CacheEntry>();
                }
            }
        }
        
        private void LoadUsageStats()
        {
            var statsPath = Path.Combine(_cacheDirectory, "usage-stats.json");
            if (File.Exists(statsPath))
            {
                try
                {
                    var json = File.ReadAllText(statsPath);
                    _usageStats = JsonSerializer.Deserialize<Dictionary<string, MediaUsageStats>>(json) ?? new Dictionary<string, MediaUsageStats>();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "⚠️ Failed to load usage stats, starting fresh");
                    _usageStats = new Dictionary<string, MediaUsageStats>();
                }
            }
        }
        
        private async Task SaveCacheIndexAsync()
        {
            try
            {
                var indexPath = Path.Combine(_cacheDirectory, "cache-index.json");
                var json = JsonSerializer.Serialize(_cacheIndex, new JsonSerializerOptions { WriteIndented = true });
                await File.WriteAllTextAsync(indexPath, json);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Failed to save cache index");
            }
        }
        
        private async Task SaveUsageStatsAsync()
        {
            try
            {
                var statsPath = Path.Combine(_cacheDirectory, "usage-stats.json");
                var json = JsonSerializer.Serialize(_usageStats, new JsonSerializerOptions { WriteIndented = true });
                await File.WriteAllTextAsync(statsPath, json);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Failed to save usage stats");
            }
        }
        
        /// <summary>
        /// Record media access for usage tracking
        /// </summary>
        public async Task RecordMediaAccessAsync(string mediaId, int qualityLevel = 1)
        {
            if (!_usageStats.ContainsKey(mediaId))
            {
                _usageStats[mediaId] = new MediaUsageStats
                {
                    MediaId = mediaId,
                    FirstAccessed = DateTime.Now
                };
            }
            
            var stats = _usageStats[mediaId];
            stats.AccessCount++;
            stats.LastAccessed = DateTime.Now;
            stats.AverageQuality = (stats.AverageQuality + qualityLevel) / 2.0;
            
            // Periodically save stats (every 10 accesses)
            if (stats.AccessCount % 10 == 0)
            {
                await SaveUsageStatsAsync();
            }
        }
        
        /// <summary>
        /// Get cache statistics for monitoring
        /// </summary>
        public CacheStatistics GetCacheStatistics()
        {
            var currentSize = GetCurrentCacheSizeMB();
            var fileCount = _cacheIndex.Count;
            var hitRate = CalculateHitRate();
            
            return new CacheStatistics
            {
                CurrentSizeMB = currentSize,
                FileCount = fileCount,
                HitRate = hitRate,
                OptimalSizeMB = CalculateOptimalCacheSizeAsync().Result,
                LastOptimization = _cacheIndex.Values.DefaultIfEmpty().Max(e => e?.CreatedAt) ?? DateTime.MinValue
            };
        }
        
        private double CalculateHitRate()
        {
            if (_usageStats.Count == 0)
                return 0.0;
            
            var hits = _usageStats.Values.Count(s => s.CacheHits > 0);
            return (double)hits / _usageStats.Count;
        }
    }
    
    #region Support Classes
    
    public class SystemMetrics
    {
        public int TotalRAM { get; set; }
        public int AvailableStorage { get; set; }
        public int LibrarySize { get; set; }
    }
    
    public class CacheEntry
    {
        public string MediaId { get; set; }
        public string FileName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastAccessed { get; set; }
        public int SizeMB { get; set; }
        public string UpscaleModel { get; set; }
        public string Quality { get; set; }
    }
    
    public class MediaUsageStats
    {
        public string MediaId { get; set; }
        public int AccessCount { get; set; }
        public DateTime FirstAccessed { get; set; }
        public DateTime LastAccessed { get; set; }
        public DateTime LastCached { get; set; }
        public double AverageQuality { get; set; }
        public int EstimatedSizeMB { get; set; }
        public int CacheHits { get; set; }
        public string CacheReason { get; set; }
    }
    
    public class PlaybackRecord
    {
        public string MediaId { get; set; }
        public DateTime Timestamp { get; set; }
        public double Quality { get; set; }
        public TimeSpan Duration { get; set; }
    }
    
    public class MediaPriority
    {
        public string MediaId { get; set; }
        public int PlayCount { get; set; }
        public DateTime LastPlayed { get; set; }
        public double AverageQuality { get; set; }
        public double Priority { get; set; }
    }
    
    public class CacheStatistics
    {
        public int CurrentSizeMB { get; set; }
        public int OptimalSizeMB { get; set; }
        public int FileCount { get; set; }
        public double HitRate { get; set; }
        public DateTime LastOptimization { get; set; }
    }
    
    #endregion
}