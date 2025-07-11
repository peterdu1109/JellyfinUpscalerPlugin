using System.Collections.Generic;
using MediaBrowser.Model.Plugins;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Plugin Configuration - Simple & Serializable
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
    }
}