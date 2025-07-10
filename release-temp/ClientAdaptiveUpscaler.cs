using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Client-Adaptive Upscaler
    /// Automatically adjusts upscaling based on client device characteristics (screen size, capabilities, etc.)
    /// </summary>
    public class ClientAdaptiveUpscaler
    {
        private readonly ILogger<ClientAdaptiveUpscaler> _logger;
        private readonly PluginConfiguration _config;
        private readonly Dictionary<string, ClientProfile> _clientProfiles;
        private readonly Dictionary<string, DeviceCapabilities> _deviceDatabase;
        
        public ClientAdaptiveUpscaler(ILogger<ClientAdaptiveUpscaler> logger)
        {
            _logger = logger;
            _config = Plugin.Instance?.Configuration ?? new PluginConfiguration();
            _clientProfiles = new Dictionary<string, ClientProfile>();
            _deviceDatabase = InitializeDeviceDatabase();
        }
        
        /// <summary>
        /// Get adaptive upscaling settings based on client device
        /// </summary>
        public async Task<ClientAdaptiveSettings> GetAdaptiveSettingsAsync(string clientId, ClientInfo clientInfo, VideoInfo videoInfo)
        {
            try
            {
                var clientProfile = await GetOrCreateClientProfileAsync(clientId, clientInfo);
                var adaptiveSettings = CalculateAdaptiveSettings(clientProfile, videoInfo);
                
                _logger.LogInformation($"📱 Client adaptive settings for {clientProfile.DeviceName}: {adaptiveSettings.TargetResolution} @ {adaptiveSettings.QualityLevel:P0}");
                
                // Update usage statistics
                UpdateClientUsage(clientProfile, adaptiveSettings);
                
                return adaptiveSettings;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"⚠️ Failed to get adaptive settings for client {clientId}");
                return GetDefaultClientSettings(videoInfo);
            }
        }
        
        private Dictionary<string, DeviceCapabilities> InitializeDeviceDatabase()
        {
            return new Dictionary<string, DeviceCapabilities>
            {
                // Mobile Devices
                ["android"] = new DeviceCapabilities
                {
                    DeviceType = DeviceType.Mobile,
                    TypicalScreenSizes = new[] { "1080x2340", "1440x3200", "1080x1920" },
                    PreferredMaxResolution = "1080p",
                    OptimalUpscaleFactor = 1.5f,
                    ProcessingPowerLevel = ProcessingPower.Low,
                    BatteryConstraints = true,
                    BandwidthSensitive = true
                },
                
                ["ios"] = new DeviceCapabilities
                {
                    DeviceType = DeviceType.Mobile,
                    TypicalScreenSizes = new[] { "1170x2532", "1284x2778", "828x1792" },
                    PreferredMaxResolution = "1080p",
                    OptimalUpscaleFactor = 2.0f,
                    ProcessingPowerLevel = ProcessingPower.Medium,
                    BatteryConstraints = true,
                    BandwidthSensitive = true
                },
                
                // Tablets
                ["ipad"] = new DeviceCapabilities
                {
                    DeviceType = DeviceType.Tablet,
                    TypicalScreenSizes = new[] { "2048x2732", "1620x2160", "2224x1668" },
                    PreferredMaxResolution = "1440p",
                    OptimalUpscaleFactor = 2.5f,
                    ProcessingPowerLevel = ProcessingPower.Medium,
                    BatteryConstraints = true,
                    BandwidthSensitive = false
                },
                
                ["android_tablet"] = new DeviceCapabilities
                {
                    DeviceType = DeviceType.Tablet,
                    TypicalScreenSizes = new[] { "1600x2560", "1200x1920", "1440x2560" },
                    PreferredMaxResolution = "1440p",
                    OptimalUpscaleFactor = 2.0f,
                    ProcessingPowerLevel = ProcessingPower.Low,
                    BatteryConstraints = true,
                    BandwidthSensitive = false
                },
                
                // Desktop/Laptop
                ["chrome"] = new DeviceCapabilities
                {
                    DeviceType = DeviceType.Desktop,
                    TypicalScreenSizes = new[] { "1920x1080", "2560x1440", "3840x2160" },
                    PreferredMaxResolution = "4K",
                    OptimalUpscaleFactor = 4.0f,
                    ProcessingPowerLevel = ProcessingPower.High,
                    BatteryConstraints = false,
                    BandwidthSensitive = false
                },
                
                ["firefox"] = new DeviceCapabilities
                {
                    DeviceType = DeviceType.Desktop,
                    TypicalScreenSizes = new[] { "1920x1080", "2560x1440", "3840x2160" },
                    PreferredMaxResolution = "4K",
                    OptimalUpscaleFactor = 4.0f,
                    ProcessingPowerLevel = ProcessingPower.High,
                    BatteryConstraints = false,
                    BandwidthSensitive = false
                },
                
                ["edge"] = new DeviceCapabilities
                {
                    DeviceType = DeviceType.Desktop,
                    TypicalScreenSizes = new[] { "1920x1080", "2560x1440", "3840x2160" },
                    PreferredMaxResolution = "4K",
                    OptimalUpscaleFactor = 4.0f,
                    ProcessingPowerLevel = ProcessingPower.High,
                    BatteryConstraints = false,
                    BandwidthSensitive = false
                },
                
                // TV/Set-top boxes
                ["jellyfin_androidtv"] = new DeviceCapabilities
                {
                    DeviceType = DeviceType.TV,
                    TypicalScreenSizes = new[] { "1920x1080", "3840x2160" },
                    PreferredMaxResolution = "4K",
                    OptimalUpscaleFactor = 4.0f,
                    ProcessingPowerLevel = ProcessingPower.Medium,
                    BatteryConstraints = false,
                    BandwidthSensitive = false
                },
                
                ["roku"] = new DeviceCapabilities
                {
                    DeviceType = DeviceType.TV,
                    TypicalScreenSizes = new[] { "1920x1080", "3840x2160" },
                    PreferredMaxResolution = "4K",
                    OptimalUpscaleFactor = 3.0f,
                    ProcessingPowerLevel = ProcessingPower.Low,
                    BatteryConstraints = false,
                    BandwidthSensitive = true
                },
                
                ["appletv"] = new DeviceCapabilities
                {
                    DeviceType = DeviceType.TV,
                    TypicalScreenSizes = new[] { "1920x1080", "3840x2160" },
                    PreferredMaxResolution = "4K",
                    OptimalUpscaleFactor = 4.0f,
                    ProcessingPowerLevel = ProcessingPower.High,
                    BatteryConstraints = false,
                    BandwidthSensitive = false
                }
            };
        }
        
        private async Task<ClientProfile> GetOrCreateClientProfileAsync(string clientId, ClientInfo clientInfo)
        {
            if (_clientProfiles.TryGetValue(clientId, out var existingProfile))
            {
                UpdateClientProfile(existingProfile, clientInfo);
                return existingProfile;
            }
            
            var newProfile = await CreateClientProfileAsync(clientId, clientInfo);
            _clientProfiles[clientId] = newProfile;
            
            _logger.LogInformation($"📱 New client profile created: {newProfile.DeviceName} ({newProfile.DeviceType})");
            
            return newProfile;
        }
        
        private async Task<ClientProfile> CreateClientProfileAsync(string clientId, ClientInfo clientInfo)
        {
            var profile = new ClientProfile
            {
                ClientId = clientId,
                DeviceName = clientInfo.DeviceName ?? "Unknown Device",
                ClientName = clientInfo.ClientName ?? "Unknown Client",
                FirstSeen = DateTime.Now,
                LastSeen = DateTime.Now
            };
            
            // Detect device capabilities
            var capabilities = DetectDeviceCapabilities(clientInfo);
            profile.Capabilities = capabilities;
            profile.DeviceType = capabilities.DeviceType;
            
            // Determine optimal screen resolution
            profile.OptimalResolution = await DetermineOptimalResolutionAsync(clientInfo, capabilities);
            
            // Set performance preferences
            profile.PerformanceProfile = DeterminePerformanceProfile(capabilities);
            
            return profile;
        }
        
        private DeviceCapabilities DetectDeviceCapabilities(ClientInfo clientInfo)
        {
            var userAgent = clientInfo.UserAgent?.ToLowerInvariant() ?? "";
            var clientName = clientInfo.ClientName?.ToLowerInvariant() ?? "";
            var deviceName = clientInfo.DeviceName?.ToLowerInvariant() ?? "";
            
            // Try exact matches first
            foreach (var (deviceKey, capabilities) in _deviceDatabase)
            {
                if (clientName.Contains(deviceKey) || userAgent.Contains(deviceKey) || deviceName.Contains(deviceKey))
                {
                    return capabilities;
                }
            }
            
            // Fallback detection based on patterns
            if (userAgent.Contains("mobile") || clientName.Contains("android") || clientName.Contains("ios"))
            {
                return _deviceDatabase.Values.FirstOrDefault(c => c.DeviceType == DeviceType.Mobile) 
                       ?? _deviceDatabase["android"];
            }
            
            if (userAgent.Contains("tablet") || clientName.Contains("ipad"))
            {
                return _deviceDatabase.Values.FirstOrDefault(c => c.DeviceType == DeviceType.Tablet) 
                       ?? _deviceDatabase["ipad"];
            }
            
            if (clientName.Contains("tv") || clientName.Contains("roku") || clientName.Contains("appletv"))
            {
                return _deviceDatabase.Values.FirstOrDefault(c => c.DeviceType == DeviceType.TV) 
                       ?? _deviceDatabase["jellyfin_androidtv"];
            }
            
            // Default to desktop
            return _deviceDatabase["chrome"];
        }
        
        private async Task<string> DetermineOptimalResolutionAsync(ClientInfo clientInfo, DeviceCapabilities capabilities)
        {
            // If client provides screen resolution, use it
            if (clientInfo.ScreenWidth.HasValue && clientInfo.ScreenHeight.HasValue)
            {
                var screenResolution = $"{clientInfo.ScreenWidth}x{clientInfo.ScreenHeight}";
                var optimalResolution = MapScreenResolutionToStreamingResolution(screenResolution);
                
                _logger.LogDebug($"📐 Client screen resolution: {screenResolution} → Optimal streaming: {optimalResolution}");
                
                return optimalResolution;
            }
            
            // Use device type defaults
            return capabilities.PreferredMaxResolution;
        }
        
        private string MapScreenResolutionToStreamingResolution(string screenResolution)
        {
            var parts = screenResolution.Split('x');
            if (parts.Length != 2) return "1080p";
            
            if (!int.TryParse(parts[0], out var width) || !int.TryParse(parts[1], out var height))
                return "1080p";
            
            var pixels = width * height;
            
            if (pixels >= 3840 * 2160) return "4K";        // 4K displays
            if (pixels >= 2560 * 1440) return "1440p";     // 1440p displays
            if (pixels >= 1920 * 1080) return "1080p";     // 1080p displays
            if (pixels >= 1280 * 720) return "720p";       // 720p displays
            
            return "480p"; // Very small screens
        }
        
        private PerformanceProfile DeterminePerformanceProfile(DeviceCapabilities capabilities)
        {
            return capabilities.ProcessingPowerLevel switch
            {
                ProcessingPower.High => PerformanceProfile.HighQuality,
                ProcessingPower.Medium => PerformanceProfile.Balanced,
                ProcessingPower.Low => PerformanceProfile.Performance,
                _ => PerformanceProfile.Balanced
            };
        }
        
        private void UpdateClientProfile(ClientProfile profile, ClientInfo clientInfo)
        {
            profile.LastSeen = DateTime.Now;
            profile.UsageCount++;
            
            // Update any changed information
            if (!string.IsNullOrEmpty(clientInfo.DeviceName))
                profile.DeviceName = clientInfo.DeviceName;
                
            if (!string.IsNullOrEmpty(clientInfo.ClientName))
                profile.ClientName = clientInfo.ClientName;
        }
        
        private ClientAdaptiveSettings CalculateAdaptiveSettings(ClientProfile clientProfile, VideoInfo videoInfo)
        {
            var settings = new ClientAdaptiveSettings
            {
                ClientId = clientProfile.ClientId,
                DeviceType = clientProfile.DeviceType,
                AdaptationReason = new List<string>()
            };
            
            // Base settings on device type
            ApplyDeviceTypeOptimizations(settings, clientProfile);
            
            // Apply screen size optimizations
            ApplyScreenSizeOptimizations(settings, clientProfile, videoInfo);
            
            // Apply performance optimizations
            ApplyPerformanceOptimizations(settings, clientProfile);
            
            // Apply battery/bandwidth optimizations
            ApplyResourceOptimizations(settings, clientProfile);
            
            // Validate and adjust settings
            ValidateAndAdjustSettings(settings, videoInfo);
            
            return settings;
        }
        
        private void ApplyDeviceTypeOptimizations(ClientAdaptiveSettings settings, ClientProfile clientProfile)
        {
            switch (clientProfile.DeviceType)
            {
                case DeviceType.Mobile:
                    settings.TargetResolution = "1080p";
                    settings.QualityLevel = 0.7f;
                    settings.AIModel = "FSRCNN"; // Fast model for mobile
                    settings.EnableBatteryOptimization = true;
                    settings.AdaptationReason.Add("Mobile device optimization");
                    break;
                    
                case DeviceType.Tablet:
                    settings.TargetResolution = "1440p";
                    settings.QualityLevel = 0.8f;
                    settings.AIModel = "CARN"; // Balanced model for tablets
                    settings.EnableBatteryOptimization = true;
                    settings.AdaptationReason.Add("Tablet optimization");
                    break;
                    
                case DeviceType.Desktop:
                    settings.TargetResolution = "4K";
                    settings.QualityLevel = 1.0f;
                    settings.AIModel = "Real-ESRGAN"; // High quality for desktop
                    settings.EnableBatteryOptimization = false;
                    settings.AdaptationReason.Add("Desktop optimization");
                    break;
                    
                case DeviceType.TV:
                    settings.TargetResolution = "4K";
                    settings.QualityLevel = 0.9f;
                    settings.AIModel = "EDSR"; // TV-optimized model
                    settings.EnableBatteryOptimization = false;
                    settings.AdaptationReason.Add("TV/Living room optimization");
                    break;
                    
                default:
                    settings.TargetResolution = "1080p";
                    settings.QualityLevel = 0.8f;
                    settings.AIModel = "EDSR";
                    settings.AdaptationReason.Add("Default device optimization");
                    break;
            }
        }
        
        private void ApplyScreenSizeOptimizations(ClientAdaptiveSettings settings, ClientProfile clientProfile, VideoInfo videoInfo)
        {
            var optimalRes = clientProfile.OptimalResolution;
            
            // Don't upscale beyond what the screen can display
            if (IsResolutionExcessive(videoInfo, optimalRes))
            {
                settings.TargetResolution = optimalRes;
                settings.QualityLevel *= 0.9f; // Slight quality reduction for efficiency
                settings.AdaptationReason.Add($"Limited to screen resolution: {optimalRes}");
                
                // Use more efficient model for unnecessary upscaling
                if (settings.AIModel == "Real-ESRGAN")
                    settings.AIModel = "EDSR";
                else if (settings.AIModel == "EDSR")
                    settings.AIModel = "FSRCNN";
            }
            
            // For very small screens, prioritize speed over quality
            if (optimalRes == "720p" || optimalRes == "480p")
            {
                settings.AIModel = "FSRCNN";
                settings.QualityLevel = Math.Min(settings.QualityLevel, 0.6f);
                settings.AdaptationReason.Add("Small screen - prioritizing performance");
            }
        }
        
        private bool IsResolutionExcessive(VideoInfo videoInfo, string targetResolution)
        {
            var videoPixels = videoInfo.Width * videoInfo.Height;
            
            var targetPixels = targetResolution switch
            {
                "4K" => 3840 * 2160,
                "1440p" => 2560 * 1440,
                "1080p" => 1920 * 1080,
                "720p" => 1280 * 720,
                "480p" => 854 * 480,
                _ => 1920 * 1080
            };
            
            // If video is already at or above target resolution, upscaling is excessive
            return videoPixels >= targetPixels;
        }
        
        private void ApplyPerformanceOptimizations(ClientAdaptiveSettings settings, ClientProfile clientProfile)
        {
            switch (clientProfile.PerformanceProfile)
            {
                case PerformanceProfile.Performance:
                    // Prioritize speed
                    if (settings.AIModel == "Real-ESRGAN") settings.AIModel = "FSRCNN";
                    else if (settings.AIModel == "EDSR") settings.AIModel = "CARN";
                    settings.QualityLevel *= 0.8f;
                    settings.ProcessingPriority = ProcessingPriority.Speed;
                    settings.AdaptationReason.Add("Performance-focused optimization");
                    break;
                    
                case PerformanceProfile.Balanced:
                    // Keep current settings but ensure they're reasonable
                    if (settings.AIModel == "Real-ESRGAN" && settings.QualityLevel < 0.9f)
                        settings.AIModel = "EDSR";
                    settings.ProcessingPriority = ProcessingPriority.Balanced;
                    settings.AdaptationReason.Add("Balanced optimization");
                    break;
                    
                case PerformanceProfile.HighQuality:
                    // Prioritize quality (keep current settings or enhance)
                    settings.ProcessingPriority = ProcessingPriority.Quality;
                    settings.AdaptationReason.Add("High-quality optimization");
                    break;
            }
        }
        
        private void ApplyResourceOptimizations(ClientAdaptiveSettings settings, ClientProfile clientProfile)
        {
            var capabilities = clientProfile.Capabilities;
            
            if (capabilities.BatteryConstraints)
            {
                settings.EnableBatteryOptimization = true;
                settings.QualityLevel *= 0.9f; // Small quality reduction for battery savings
                settings.AdaptationReason.Add("Battery optimization applied");
            }
            
            if (capabilities.BandwidthSensitive)
            {
                settings.EnableBandwidthOptimization = true;
                settings.BitrateReduction = 0.1f; // 10% bitrate reduction
                settings.AdaptationReason.Add("Bandwidth optimization applied");
            }
            
            // Low processing power devices get additional optimizations
            if (capabilities.ProcessingPowerLevel == ProcessingPower.Low)
            {
                settings.MaxConcurrentStreams = 1;
                settings.EnableFrameSkipping = true;
                settings.AdaptationReason.Add("Low processing power optimizations");
            }
        }
        
        private void ValidateAndAdjustSettings(ClientAdaptiveSettings settings, VideoInfo videoInfo)
        {
            // Ensure AI model is available
            if (!_config.AvailableAIModels.Contains(settings.AIModel))
            {
                settings.AIModel = _config.AvailableAIModels.FirstOrDefault() ?? "Real-ESRGAN";
                settings.AdaptationReason.Add($"Fallback model: {settings.AIModel}");
            }
            
            // Quality level bounds
            settings.QualityLevel = Math.Max(0.1f, Math.Min(1.0f, settings.QualityLevel));
            
            // Don't target resolution lower than source
            if (ShouldPreventDownscaling(videoInfo, settings.TargetResolution))
            {
                settings.TargetResolution = GetVideoResolutionCategory(videoInfo);
                settings.AdaptationReason.Add("Prevented downscaling below source resolution");
            }
        }
        
        private bool ShouldPreventDownscaling(VideoInfo videoInfo, string targetResolution)
        {
            var videoPixels = videoInfo.Width * videoInfo.Height;
            var targetPixels = GetResolutionPixels(targetResolution);
            
            return videoPixels > targetPixels * 1.2f; // Allow small reductions
        }
        
        private string GetVideoResolutionCategory(VideoInfo videoInfo)
        {
            var pixels = videoInfo.Width * videoInfo.Height;
            
            if (pixels >= 3840 * 2160) return "4K";
            if (pixels >= 2560 * 1440) return "1440p";
            if (pixels >= 1920 * 1080) return "1080p";
            if (pixels >= 1280 * 720) return "720p";
            
            return "480p";
        }
        
        private int GetResolutionPixels(string resolution)
        {
            return resolution switch
            {
                "4K" => 3840 * 2160,
                "1440p" => 2560 * 1440,
                "1080p" => 1920 * 1080,
                "720p" => 1280 * 720,
                "480p" => 854 * 480,
                _ => 1920 * 1080
            };
        }
        
        private ClientAdaptiveSettings GetDefaultClientSettings(VideoInfo videoInfo)
        {
            return new ClientAdaptiveSettings
            {
                TargetResolution = "1080p",
                QualityLevel = 0.8f,
                AIModel = _config.Model ?? "Real-ESRGAN",
                ProcessingPriority = ProcessingPriority.Balanced,
                AdaptationReason = new List<string> { "Default settings (client detection failed)" }
            };
        }
        
        private void UpdateClientUsage(ClientProfile profile, ClientAdaptiveSettings settings)
        {
            profile.TotalUpscaleRequests++;
            profile.LastUsedSettings = settings;
            
            // Track model usage
            if (profile.ModelUsageStats.ContainsKey(settings.AIModel))
                profile.ModelUsageStats[settings.AIModel]++;
            else
                profile.ModelUsageStats[settings.AIModel] = 1;
        }
        
        /// <summary>
        /// Get client statistics for monitoring and optimization
        /// </summary>
        public ClientStatistics GetClientStatistics()
        {
            var stats = new ClientStatistics
            {
                TotalClients = _clientProfiles.Count,
                ActiveClients = _clientProfiles.Count(p => p.Value.LastSeen > DateTime.Now.AddDays(-7)),
                DeviceTypeDistribution = _clientProfiles.GroupBy(p => p.Value.DeviceType)
                    .ToDictionary(g => g.Key.ToString(), g => g.Count()),
                PopularModels = _clientProfiles
                    .SelectMany(p => p.Value.ModelUsageStats)
                    .GroupBy(kvp => kvp.Key)
                    .OrderByDescending(g => g.Sum(kvp => kvp.Value))
                    .Take(5)
                    .ToDictionary(g => g.Key, g => g.Sum(kvp => kvp.Value))
            };
            
            return stats;
        }
    }
    
    #region Supporting Classes and Enums
    
    public class ClientInfo
    {
        public string DeviceName { get; set; }
        public string ClientName { get; set; }
        public string UserAgent { get; set; }
        public int? ScreenWidth { get; set; }
        public int? ScreenHeight { get; set; }
        public string Platform { get; set; }
        public string Version { get; set; }
    }
    
    public class ClientProfile
    {
        public string ClientId { get; set; }
        public string DeviceName { get; set; }
        public string ClientName { get; set; }
        public DeviceType DeviceType { get; set; }
        public DeviceCapabilities Capabilities { get; set; }
        public string OptimalResolution { get; set; }
        public PerformanceProfile PerformanceProfile { get; set; }
        public DateTime FirstSeen { get; set; }
        public DateTime LastSeen { get; set; }
        public int UsageCount { get; set; }
        public int TotalUpscaleRequests { get; set; }
        public ClientAdaptiveSettings LastUsedSettings { get; set; }
        public Dictionary<string, int> ModelUsageStats { get; set; } = new Dictionary<string, int>();
    }
    
    public class DeviceCapabilities
    {
        public DeviceType DeviceType { get; set; }
        public string[] TypicalScreenSizes { get; set; }
        public string PreferredMaxResolution { get; set; }
        public float OptimalUpscaleFactor { get; set; }
        public ProcessingPower ProcessingPowerLevel { get; set; }
        public bool BatteryConstraints { get; set; }
        public bool BandwidthSensitive { get; set; }
    }
    
    public class ClientAdaptiveSettings
    {
        public string ClientId { get; set; }
        public DeviceType DeviceType { get; set; }
        public string TargetResolution { get; set; }
        public float QualityLevel { get; set; }
        public string AIModel { get; set; }
        public ProcessingPriority ProcessingPriority { get; set; }
        public bool EnableBatteryOptimization { get; set; }
        public bool EnableBandwidthOptimization { get; set; }
        public float BitrateReduction { get; set; } = 0.0f;
        public int MaxConcurrentStreams { get; set; } = 1;
        public bool EnableFrameSkipping { get; set; }
        public List<string> AdaptationReason { get; set; } = new List<string>();
    }
    
    public class ClientStatistics
    {
        public int TotalClients { get; set; }
        public int ActiveClients { get; set; }
        public Dictionary<string, int> DeviceTypeDistribution { get; set; }
        public Dictionary<string, int> PopularModels { get; set; }
    }
    
    public enum DeviceType
    {
        Unknown,
        Mobile,
        Tablet,
        Desktop,
        TV,
        Console
    }
    
    public enum ProcessingPower
    {
        Low,
        Medium,
        High
    }
    
    public enum PerformanceProfile
    {
        Performance,
        Balanced,
        HighQuality
    }
    
    public enum ProcessingPriority
    {
        Speed,
        Balanced,
        Quality
    }
    
    #endregion
}
