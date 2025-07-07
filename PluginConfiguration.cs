using System;
using System.Collections.Generic;
using MediaBrowser.Model.Plugins;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Plugin Configuration - Functional Edition v1.3.6.2
    /// </summary>
    public class PluginConfiguration : BasePluginConfiguration
    {
        // Core Settings
        public bool Enabled { get; set; } = true;
        public string Language { get; set; } = "en";
        public bool ShowPlayerButton { get; set; } = true;
        public bool EnableNotifications { get; set; } = true;
        public string Model { get; set; } = "realesrgan";
        public int Scale { get; set; } = 2;
        public string Quality { get; set; } = "balanced";
        public bool AutoDetectHardware { get; set; } = true;
        public string PreferredEncoder { get; set; } = "auto";
        public int MaxConcurrentStreams { get; set; } = 2;
        public bool EnableHardwareAcceleration { get; set; } = true;
        public bool EnableUpscaling { get; set; } = true;
        public bool EnableSharpening { get; set; } = false;
        public int SharpeningStrength { get; set; } = 50;
        public bool EnableNoiseReduction { get; set; } = false;
        public int NoiseReductionStrength { get; set; } = 30;
        
        // Extended Settings for compatibility
        public bool EnableRealtimeStats { get; set; } = true;
        public int StatsUpdateInterval { get; set; } = 1000;
        public bool EnableDynamicModelSwitching { get; set; } = true;
        public bool EnableCrossDeviceSync { get; set; } = false;
        public bool EnableAIColorCorrection { get; set; } = false;
        public bool EnableLightMode { get; set; } = false;
        public int CacheSizeMB { get; set; } = 1024;
        public bool EnableZonedUpscaling { get; set; } = false;
        public bool EnableWebSocketStats { get; set; } = false;
        public bool LogPerformanceData { get; set; } = false;
        public bool EnableAudioPassthrough { get; set; } = true;
        public string AudioCodec { get; set; } = "aac";
        public bool EnableSubtitlePassthrough { get; set; } = true;
        
        // Collections
        public List<string> AvailableAIModels { get; set; } = new List<string>
        {
            "realesrgan", "esrgan", "srcnn", "waifu2x", "bicubic", "bilinear", "lanczos"
        };
        
        public List<string> AvailableShaders { get; set; } = new List<string>
        {
            "bicubic", "bilinear", "lanczos"
        };
        
        public List<DeviceProfile> SyncedDeviceProfiles { get; set; } = new List<DeviceProfile>();
        public Dictionary<string, ColorProfile> ColorProfiles { get; set; } = new Dictionary<string, ColorProfile>();
        public Dictionary<string, ColorProfile> ContentColorProfiles { get; set; } = new Dictionary<string, ColorProfile>();
        public Dictionary<string, object> CustomSettings { get; set; } = new Dictionary<string, object>();
        public Dictionary<string, object> ModelConfigurations { get; set; } = new Dictionary<string, object>();
        
        // Advanced Settings
        public bool EnableAutomaticContentDetection { get; set; } = false;
        public bool EnableAV1 { get; set; } = true;
        public string AV1Quality { get; set; } = "medium";
        public string AV1Preset { get; set; } = "medium";
        public bool AV1FilmGrain { get; set; } = false;
        public bool EnableAV1OptimizedUpscaling { get; set; } = false;
        public string AV1CompatibleModel { get; set; } = "realesrgan";
        public string FaceUpscalingModel { get; set; } = "realesrgan";
        public string TextUpscalingModel { get; set; } = "srcnn";
        public string BackgroundShader { get; set; } = "bicubic";
        public bool EnableBatteryMode { get; set; } = false;
        public int BatteryOptimizationLevel { get; set; } = 1;
        public int MobileMaxResolution { get; set; } = 1080;
        public bool EnableThermalThrottling { get; set; } = true;
        public int ThermalThrottleTemperature { get; set; } = 85;
        public bool EnableGPUMemoryManagement { get; set; } = true;
        public int GPUMemoryLimit { get; set; } = 4096;
        public bool EnableMobileOptimization { get; set; } = true;
        public bool EnableTabletOptimization { get; set; } = true;
        
        // Device Compatibility
        public bool EnableAppleTVFix { get; set; } = true;
        public bool EnableRokuFix { get; set; } = true;
        public bool EnableFireTVFix { get; set; } = true;
        public bool EnableAndroidTVFix { get; set; } = true;
        public bool EnableWebOSFix { get; set; } = true;
        public bool EnableTizenFix { get; set; } = true;
        public bool EnableSafariCompatibility { get; set; } = true;
        public bool EnableEdgeCompatibility { get; set; } = true;
        public bool EnableFirefoxCompatibility { get; set; } = true;
        public bool EnableChromeCompatibility { get; set; } = true;
        public bool EnableiOSCompatibility { get; set; } = true;
        public bool EnableAndroidCompatibility { get; set; } = true;
        public bool EnableSteamDeckOptimization { get; set; } = true;
        public bool EnableSteamLinkCompatibility { get; set; } = true;
        public bool EnableNVIDIAShieldCompatibility { get; set; } = true;
        
        // Additional missing properties
        public bool EnableAutomaticZonedUpscaling { get; set; } = false;
        public bool DetectFaces { get; set; } = false;
        public bool DetectText { get; set; } = false;
        public float ZoneDetectionThreshold { get; set; } = 0.5f;
        public bool EnableEdgeEnhancement { get; set; } = false;
        public bool EnableMotionBlurReduction { get; set; } = false;
        public bool EnableIntelQuickSync { get; set; } = true;
        public bool EnablePlugin { get; set; } = true;
        public bool EnableChromecastFix { get; set; } = true;
        public Dictionary<string, object> ShaderConfigurations { get; set; } = new Dictionary<string, object>();
    }
    
    /// <summary>
    /// Color profile for content-specific optimization
    /// </summary>
    public class ColorProfile
    {
        public float Saturation { get; set; } = 1.0f;
        public float Contrast { get; set; } = 1.0f;
        public float Brightness { get; set; } = 1.0f;
        public float Gamma { get; set; } = 1.0f;
        public float Hue { get; set; } = 0.0f;
    }
    
    /// <summary>
    /// Device profile for cross-device synchronization
    /// </summary>
    public class DeviceProfile
    {
        public string DeviceId { get; set; } = "";
        public string Name { get; set; } = "";
        public string PreferredModel { get; set; } = "realesrgan";
        public int PreferredScale { get; set; } = 2;
        public string PreferredQuality { get; set; } = "balanced";
        public bool IsActive { get; set; } = true;
    }
    
    /// <summary>
    /// Model settings for AI models
    /// </summary>
    public class ModelSettings
    {
        public string Name { get; set; } = "";
        public bool IsHardwareAccelerated { get; set; } = false;
        public int RequiredVRAM { get; set; } = 512;
        public string ContentType { get; set; } = "general";
        public bool IsEnabled { get; set; } = true;
        public Dictionary<string, object> Parameters { get; set; } = new Dictionary<string, object>();
    }
    
    /// <summary>
    /// Shader settings
    /// </summary>
    public class ShaderSettings
    {
        public string Name { get; set; } = "";
        public bool IsEnabled { get; set; } = true;
        public Dictionary<string, object> Parameters { get; set; } = new Dictionary<string, object>();
    }
}