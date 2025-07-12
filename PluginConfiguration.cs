using System;
using System.Collections.Generic;
using MediaBrowser.Model.Plugins;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Plugin Configuration - Enhanced v1.3.6.7 with Crash Prevention
    /// </summary>
    public class PluginConfiguration : BasePluginConfiguration
    {
        // Basic Settings
        public bool Enabled { get; set; } = true;
        public string Model { get; set; } = "realesrgan";
        public int Scale { get; set; } = 2;
        public string Quality { get; set; } = "balanced";
        public bool EnableHardwareAcceleration { get; set; } = true;
        public bool EnableUpscaling { get; set; } = true;
        public bool ShowPlayerButton { get; set; } = true;
        public bool EnableNotifications { get; set; } = true;
        public string Language { get; set; } = "en";
        
        // Version tracking
        public string PluginVersion { get; set; } = "1.3.6.7";
        public DateTime LastConfigUpdate { get; set; } = DateTime.UtcNow;
        
        // Available Models
        public List<string> AvailableAIModels { get; set; } = new List<string>
        {
            "realesrgan", "esrgan", "swinir", "waifu2x", "srcnn", "bicubic"
        };
        
        // Available Shaders
        public List<string> AvailableShaders { get; set; } = new List<string>
        {
            "bicubic", "bilinear", "lanczos"
        };
        
        // Performance Settings
        public int MaxConcurrentStreams { get; set; } = 2;
        public int CacheSizeMB { get; set; } = 1024;
        public bool AutoDetectHardware { get; set; } = true;
        public string PreferredEncoder { get; set; } = "auto";
        
        // Device Compatibility
        public bool EnableChromecastFix { get; set; } = true;
        public bool EnableAppleTVFix { get; set; } = true;
        public bool EnableRokuFix { get; set; } = true;
        public bool EnableFireTVFix { get; set; } = true;
        public bool EnableAndroidTVFix { get; set; } = true;
        public bool EnableWebOSFix { get; set; } = true;
        public bool EnableTizenFix { get; set; } = true;
        
        // Additional Settings
        public bool EnableDebugLogging { get; set; } = false;
        public bool EnablePerformanceMetrics { get; set; } = false;
        public bool EnableAPIAccess { get; set; } = true;
        public bool EnableCache { get; set; } = true;
        public bool AutoCleanupCache { get; set; } = true;
        public int MaxCacheAgeDays { get; set; } = 7;
        
        // Error Handling & Stability
        public bool EnableErrorReporting { get; set; } = true;
        public bool EnableAutoRecovery { get; set; } = true;
        public int MaxRetryAttempts { get; set; } = 3;
        public int RetryDelaySeconds { get; set; } = 5;
        public bool EnableSafeMode { get; set; } = false;
        public bool EnableFallbackMode { get; set; } = true;
        
        // Cross-Platform Compatibility
        public bool EnableLinuxCompatibility { get; set; } = true;
        public bool EnableMacOSCompatibility { get; set; } = true;
        public bool EnableWindowsCompatibility { get; set; } = true;
        public bool EnableDockerCompatibility { get; set; } = true;
        public bool EnableARMCompatibility { get; set; } = true;
        
        // Advanced Diagnostics
        public bool EnableHealthCheck { get; set; } = true;
        public bool EnableMemoryMonitoring { get; set; } = true;
        public bool EnableCPUMonitoring { get; set; } = true;
        public bool EnableNetworkMonitoring { get; set; } = false;
        public int DiagnosticIntervalMinutes { get; set; } = 15;
        
        // Device-Specific Enhancements
        public bool EnableSmartTVOptimization { get; set; } = true;
        public bool EnableMobileOptimization { get; set; } = true;
        public bool EnableDesktopOptimization { get; set; } = true;
        public bool EnableNASOptimization { get; set; } = true;
        

    }
}