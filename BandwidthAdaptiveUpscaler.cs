using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Net.NetworkInformation;
using System.Diagnostics;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Bandwidth-Adaptive Upscaling System
    /// Dynamically adjusts upscaling quality based on network conditions
    /// </summary>
    public class BandwidthAdaptiveUpscaler
    {
        private readonly ILogger<BandwidthAdaptiveUpscaler> _logger;
        private readonly PluginConfiguration _config;
        private readonly Dictionary<string, NetworkProfile> _clientProfiles;
        private readonly NetworkMonitor _networkMonitor;
        
        public BandwidthAdaptiveUpscaler(ILogger<BandwidthAdaptiveUpscaler> logger, PluginConfiguration config)
        {
            _logger = logger;
            _config = config;
            _clientProfiles = new Dictionary<string, NetworkProfile>();
            _networkMonitor = new NetworkMonitor(logger);
        }
        
        /// <summary>
        /// Get adaptive upscaling settings based on current network conditions
        /// </summary>
        public async Task<AdaptiveUpscaleSettings> GetAdaptiveSettingsAsync(string clientId, VideoInfo videoInfo)
        {
            try
            {
                var networkStats = await _networkMonitor.GetNetworkStatsAsync(clientId);
                var clientProfile = GetOrCreateClientProfile(clientId);
                
                // Update client profile with current stats
                UpdateClientProfile(clientProfile, networkStats);
                
                var adaptiveSettings = CalculateAdaptiveSettings(networkStats, videoInfo, clientProfile);
                
                _logger.LogInformation($"🌐 Adaptive settings for {clientId}: {adaptiveSettings.TargetResolution} @ {adaptiveSettings.QualityLevel:P0}");
                
                return adaptiveSettings;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Failed to get adaptive settings, using defaults");
                return GetDefaultSettings(videoInfo);
            }
        }
        
        private NetworkProfile GetOrCreateClientProfile(string clientId)
        {
            if (!_clientProfiles.ContainsKey(clientId))
            {
                _clientProfiles[clientId] = new NetworkProfile
                {
                    ClientId = clientId,
                    FirstSeen = DateTime.Now,
                    AdaptationHistory = new List<AdaptationEvent>()
                };
            }
            
            return _clientProfiles[clientId];
        }
        
        private void UpdateClientProfile(NetworkProfile profile, NetworkStats stats)
        {
            profile.LastSeen = DateTime.Now;
            profile.AverageBandwidth = CalculateAverageBandwidth(profile.BandwidthHistory, stats.BandwidthBps);
            profile.AverageLatency = CalculateAverageLatency(profile.LatencyHistory, stats.LatencyMs);
            profile.PacketLoss = stats.PacketLossPercent;
            
            // Store historical data (keep last 10 measurements)
            profile.BandwidthHistory.Add(stats.BandwidthBps);
            if (profile.BandwidthHistory.Count > 10)
                profile.BandwidthHistory.RemoveAt(0);
            
            profile.LatencyHistory.Add(stats.LatencyMs);
            if (profile.LatencyHistory.Count > 10)
                profile.LatencyHistory.RemoveAt(0);
        }
        
        private long CalculateAverageBandwidth(List<long> history, long current)
        {
            history.Add(current);
            return history.Count > 0 ? (long)history.Average() : current;
        }
        
        private int CalculateAverageLatency(List<int> history, int current)
        {
            history.Add(current);
            return history.Count > 0 ? (int)history.Average() : current;
        }
        
        private AdaptiveUpscaleSettings CalculateAdaptiveSettings(NetworkStats stats, VideoInfo videoInfo, NetworkProfile profile)
        {
            var settings = new AdaptiveUpscaleSettings();
            
            // Base settings on bandwidth tiers
            if (stats.BandwidthBps >= 100_000_000) // 100 Mbps+ (Excellent)
            {
                settings = GetExcellentQualitySettings(videoInfo);
                settings.AdaptationReason = "Excellent bandwidth (100+ Mbps)";
            }
            else if (stats.BandwidthBps >= 50_000_000) // 50 Mbps+ (Very Good)
            {
                settings = GetHighQualitySettings(videoInfo);
                settings.AdaptationReason = "High bandwidth (50+ Mbps)";
            }
            else if (stats.BandwidthBps >= 25_000_000) // 25 Mbps+ (Good)
            {
                settings = GetMediumQualitySettings(videoInfo);
                settings.AdaptationReason = "Good bandwidth (25+ Mbps)";
            }
            else if (stats.BandwidthBps >= 10_000_000) // 10 Mbps+ (Fair)
            {
                settings = GetLowQualitySettings(videoInfo);
                settings.AdaptationReason = "Fair bandwidth (10+ Mbps)";
            }
            else // <10 Mbps (Poor)
            {
                settings = GetMinimalQualitySettings(videoInfo);
                settings.AdaptationReason = "Limited bandwidth (<10 Mbps)";
            }
            
            // Apply latency adjustments
            ApplyLatencyAdjustments(settings, stats.LatencyMs);
            
            // Apply packet loss adjustments
            ApplyPacketLossAdjustments(settings, stats.PacketLossPercent);
            
            // Apply historical learning
            ApplyHistoricalAdjustments(settings, profile);
            
            // Ensure settings are within bounds
            ValidateSettings(settings, videoInfo);
            
            return settings;
        }
        
        private AdaptiveUpscaleSettings GetExcellentQualitySettings(VideoInfo videoInfo)
        {
            return new AdaptiveUpscaleSettings
            {
                AIModel = "Real-ESRGAN",
                TargetResolution = GetOptimalUpscaleResolution(videoInfo, 4.0f),
                QualityLevel = 1.0f,
                ShaderMethod = "Lanczos",
                EnableColorCorrection = true,
                EnableZonedUpscaling = true,
                MaxConcurrentStreams = 2,
                CacheSize = 15360, // 15GB for excellent connections
                EnablePreCaching = true,
                BufferSizeSeconds = 30
            };
        }
        
        private AdaptiveUpscaleSettings GetHighQualitySettings(VideoInfo videoInfo)
        {
            return new AdaptiveUpscaleSettings
            {
                AIModel = "EDSR",
                TargetResolution = GetOptimalUpscaleResolution(videoInfo, 3.0f),
                QualityLevel = 0.85f,
                ShaderMethod = "Bicubic",
                EnableColorCorrection = true,
                EnableZonedUpscaling = false,
                MaxConcurrentStreams = 1,
                CacheSize = 10240, // 10GB
                EnablePreCaching = true,
                BufferSizeSeconds = 20
            };
        }
        
        private AdaptiveUpscaleSettings GetMediumQualitySettings(VideoInfo videoInfo)
        {
            return new AdaptiveUpscaleSettings
            {
                AIModel = "RRDBNet",
                TargetResolution = GetOptimalUpscaleResolution(videoInfo, 2.0f),
                QualityLevel = 0.7f,
                ShaderMethod = "Bicubic",
                EnableColorCorrection = true,
                EnableZonedUpscaling = false,
                MaxConcurrentStreams = 1,
                CacheSize = 5120, // 5GB
                EnablePreCaching = false,
                BufferSizeSeconds = 15
            };
        }
        
        private AdaptiveUpscaleSettings GetLowQualitySettings(VideoInfo videoInfo)
        {
            return new AdaptiveUpscaleSettings
            {
                AIModel = "FSRCNN",
                TargetResolution = GetOptimalUpscaleResolution(videoInfo, 2.0f),
                QualityLevel = 0.6f,
                ShaderMethod = "Bilinear",
                EnableColorCorrection = false,
                EnableZonedUpscaling = false,
                MaxConcurrentStreams = 1,
                CacheSize = 2048, // 2GB
                EnablePreCaching = false,
                BufferSizeSeconds = 10
            };
        }
        
        private AdaptiveUpscaleSettings GetMinimalQualitySettings(VideoInfo videoInfo)
        {
            return new AdaptiveUpscaleSettings
            {
                AIModel = "SRCNN",
                TargetResolution = Math.Min(1920, videoInfo.Width * 2).ToString() + "p", // Max 1080p
                QualityLevel = 0.5f,
                ShaderMethod = "Bilinear",
                EnableColorCorrection = false,
                EnableZonedUpscaling = false,
                MaxConcurrentStreams = 1,
                CacheSize = 1024, // 1GB
                EnablePreCaching = false,
                BufferSizeSeconds = 5
            };
        }
        
        private string GetOptimalUpscaleResolution(VideoInfo videoInfo, float maxUpscaleFactor)
        {
            var targetWidth = (int)(videoInfo.Width * maxUpscaleFactor);
            
            // Cap at common resolutions
            if (targetWidth >= 7680) return "8K";
            if (targetWidth >= 3840) return "4K";
            if (targetWidth >= 2560) return "1440p";
            if (targetWidth >= 1920) return "1080p";
            if (targetWidth >= 1280) return "720p";
            
            return "original";
        }
        
        private void ApplyLatencyAdjustments(AdaptiveUpscaleSettings settings, int latencyMs)
        {
            if (latencyMs > 200) // High latency
            {
                settings.BufferSizeSeconds = Math.Min(settings.BufferSizeSeconds * 2, 60); // Double buffer
                settings.EnablePreCaching = false; // Disable pre-caching for high latency
                settings.AdaptationReason += " + High latency adjustment";
            }
            else if (latencyMs < 20) // Very low latency
            {
                settings.BufferSizeSeconds = Math.Max(settings.BufferSizeSeconds / 2, 5); // Reduce buffer
                settings.EnablePreCaching = true; // Enable pre-caching for low latency
            }
        }
        
        private void ApplyPacketLossAdjustments(AdaptiveUpscaleSettings settings, double packetLossPercent)
        {
            if (packetLossPercent > 1.0) // >1% packet loss
            {
                // Reduce quality to improve reliability
                settings.QualityLevel = Math.Max(settings.QualityLevel * 0.8f, 0.3f);
                settings.BufferSizeSeconds = (int)Math.Min(settings.BufferSizeSeconds * 1.5, 45);
                settings.EnablePreCaching = false;
                settings.AdaptationReason += " + Packet loss mitigation";
            }
        }
        
        private void ApplyHistoricalAdjustments(AdaptiveUpscaleSettings settings, NetworkProfile profile)
        {
            // Learn from past adaptations
            var recentFailures = profile.AdaptationHistory
                .Where(e => e.Timestamp > DateTime.Now.AddMinutes(-10))
                .Count(e => !e.Successful);
            
            if (recentFailures > 2) // Recent connection issues
            {
                settings.QualityLevel = Math.Max(settings.QualityLevel * 0.7f, 0.3f);
                settings.AdaptationReason += " + Historical adjustment";
                
                _logger.LogDebug($"📉 Applied historical adjustment for {profile.ClientId}: {recentFailures} recent failures");
            }
            
            // Bandwidth stability check
            if (profile.BandwidthHistory.Count >= 5)
            {
                var variance = CalculateBandwidthVariance(profile.BandwidthHistory);
                if (variance > 0.3) // High variance in bandwidth
                {
                    settings.BufferSizeSeconds = (int)Math.Min(settings.BufferSizeSeconds * 1.3, 40);
                    settings.AdaptationReason += " + Unstable connection";
                }
            }
        }
        
        private double CalculateBandwidthVariance(List<long> bandwidthHistory)
        {
            if (bandwidthHistory.Count < 2) return 0;
            
            var average = bandwidthHistory.Average();
            var variance = bandwidthHistory.Sum(b => Math.Pow(b - average, 2)) / bandwidthHistory.Count;
            return Math.Sqrt(variance) / average; // Coefficient of variation
        }
        
        private void ValidateSettings(AdaptiveUpscaleSettings settings, VideoInfo videoInfo)
        {
            // Ensure quality level is within bounds
            settings.QualityLevel = Math.Max(0.1f, Math.Min(1.0f, settings.QualityLevel));
            
            // Ensure buffer size is reasonable
            settings.BufferSizeSeconds = Math.Max(5, Math.Min(60, settings.BufferSizeSeconds));
            
            // Ensure cache size is reasonable
            settings.CacheSize = Math.Max(512, Math.Min(20480, settings.CacheSize));
            
            // Validate AI model exists
            if (!_config.AvailableAIModels.Contains(settings.AIModel))
            {
                settings.AIModel = _config.AvailableAIModels.FirstOrDefault() ?? "Real-ESRGAN";
                _logger.LogWarning($"⚠️ Invalid AI model, fallback to {settings.AIModel}");
            }
        }
        
        private AdaptiveUpscaleSettings GetDefaultSettings(VideoInfo videoInfo)
        {
            return new AdaptiveUpscaleSettings
            {
                AIModel = _config.Model,
                TargetResolution = "1080p",
                QualityLevel = 0.7f,
                ShaderMethod = "Bicubic",
                EnableColorCorrection = _config.EnableAIColorCorrection,
                EnableZonedUpscaling = _config.EnableAutomaticZonedUpscaling,
                MaxConcurrentStreams = _config.MaxConcurrentStreams,
                CacheSize = _config.CacheSizeMB,
                EnablePreCaching = false,
                BufferSizeSeconds = 15,
                AdaptationReason = "Default settings (network detection failed)"
            };
        }
        
        /// <summary>
        /// Record adaptation result for learning
        /// </summary>
        public void RecordAdaptationResult(string clientId, AdaptiveUpscaleSettings settings, bool successful, string errorMessage = null)
        {
            if (_clientProfiles.TryGetValue(clientId, out var profile))
            {
                profile.AdaptationHistory.Add(new AdaptationEvent
                {
                    Timestamp = DateTime.Now,
                    Settings = settings,
                    Successful = successful,
                    ErrorMessage = errorMessage
                });
                
                // Keep only last 20 events
                if (profile.AdaptationHistory.Count > 20)
                {
                    profile.AdaptationHistory.RemoveAt(0);
                }
                
                _logger.LogDebug($"📊 Recorded adaptation result for {clientId}: {(successful ? "✅" : "❌")}");
            }
        }
        
        /// <summary>
        /// Get adaptation statistics for monitoring
        /// </summary>
        public AdaptationStatistics GetAdaptationStatistics()
        {
            var stats = new AdaptationStatistics
            {
                TotalClients = _clientProfiles.Count,
                ActiveClients = _clientProfiles.Count(p => p.Value.LastSeen > DateTime.Now.AddHours(-1)),
                AdaptationEvents = _clientProfiles.SelectMany(p => p.Value.AdaptationHistory).Count(),
                SuccessRate = CalculateOverallSuccessRate()
            };
            
            return stats;
        }
        
        private double CalculateOverallSuccessRate()
        {
            var allEvents = _clientProfiles.SelectMany(p => p.Value.AdaptationHistory).ToList();
            if (!allEvents.Any()) return 0.0;
            
            return (double)allEvents.Count(e => e.Successful) / allEvents.Count * 100.0;
        }
    }
    
    #region Support Classes
    
    public class NetworkMonitor
    {
        private readonly ILogger _logger;
        
        public NetworkMonitor(ILogger logger)
        {
            _logger = logger;
        }
        
        public async Task<NetworkStats> GetNetworkStatsAsync(string clientId)
        {
            var stats = new NetworkStats
            {
                ClientId = clientId,
                Timestamp = DateTime.Now
            };
            
            try
            {
                // Estimate bandwidth (placeholder - would integrate with actual network monitoring)
                stats.BandwidthBps = await EstimateBandwidthAsync(clientId);
                
                // Measure latency
                stats.LatencyMs = await MeasureLatencyAsync();
                
                // Estimate packet loss (placeholder)
                stats.PacketLossPercent = await EstimatePacketLossAsync();
                
                _logger.LogDebug($"📊 Network stats for {clientId}: {stats.BandwidthBps / 1_000_000}Mbps, {stats.LatencyMs}ms latency");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Failed to get network stats, using estimates");
                stats.BandwidthBps = 25_000_000; // 25 Mbps default
                stats.LatencyMs = 50; // 50ms default
                stats.PacketLossPercent = 0.1; // 0.1% default
            }
            
            return stats;
        }
        
        private async Task<long> EstimateBandwidthAsync(string clientId)
        {
            // Placeholder implementation
            // In a real implementation, this would:
            // 1. Check recent streaming stats from Jellyfin
            // 2. Perform small bandwidth tests
            // 3. Query system network statistics
            
            await Task.Delay(10); // Simulate async work
            return 25_000_000; // 25 Mbps estimate
        }
        
        private async Task<int> MeasureLatencyAsync()
        {
            try
            {
                var ping = new Ping();
                var reply = await ping.SendPingAsync("8.8.8.8", 5000);
                
                if (reply.Status == IPStatus.Success)
                {
                    return (int)reply.RoundtripTime;
                }
            }
            catch (Exception ex)
            {
                _logger.LogDebug(ex, "Ping failed, using default latency");
            }
            
            return 50; // Default 50ms
        }
        
        private async Task<double> EstimatePacketLossAsync()
        {
            // Placeholder - would implement actual packet loss detection
            await Task.Delay(5);
            return 0.1; // 0.1% default
        }
    }
    
    public class NetworkProfile
    {
        public string ClientId { get; set; }
        public DateTime FirstSeen { get; set; }
        public DateTime LastSeen { get; set; }
        public long AverageBandwidth { get; set; }
        public int AverageLatency { get; set; }
        public double PacketLoss { get; set; }
        public List<long> BandwidthHistory { get; set; } = new List<long>();
        public List<int> LatencyHistory { get; set; } = new List<int>();
        public List<AdaptationEvent> AdaptationHistory { get; set; } = new List<AdaptationEvent>();
    }
    
    public class NetworkStats
    {
        public string ClientId { get; set; }
        public DateTime Timestamp { get; set; }
        public long BandwidthBps { get; set; }
        public int LatencyMs { get; set; }
        public double PacketLossPercent { get; set; }
    }
    
    public class AdaptiveUpscaleSettings
    {
        public string AIModel { get; set; }
        public string TargetResolution { get; set; }
        public float QualityLevel { get; set; }
        public string ShaderMethod { get; set; }
        public bool EnableColorCorrection { get; set; }
        public bool EnableZonedUpscaling { get; set; }
        public int MaxConcurrentStreams { get; set; }
        public int CacheSize { get; set; }
        public bool EnablePreCaching { get; set; }
        public int BufferSizeSeconds { get; set; }
        public string AdaptationReason { get; set; }
    }
    
    public class AdaptationEvent
    {
        public DateTime Timestamp { get; set; }
        public AdaptiveUpscaleSettings Settings { get; set; }
        public bool Successful { get; set; }
        public string ErrorMessage { get; set; }
    }
    
    public class AdaptationStatistics
    {
        public int TotalClients { get; set; }
        public int ActiveClients { get; set; }
        public int AdaptationEvents { get; set; }
        public double SuccessRate { get; set; }
    }
    
    #endregion
}