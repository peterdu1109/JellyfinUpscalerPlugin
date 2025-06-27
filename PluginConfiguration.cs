using System;
using System.Collections.Generic;
using MediaBrowser.Model.Plugins;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Configuration for AI Upscaler Plugin v1.3.5 - AV1 Edition
    /// Clean configuration without duplicates
    /// </summary>
    public class PluginConfiguration : BasePluginConfiguration
    {
        // Core Settings
        public bool Enabled { get; set; } = false;
        public string Language { get; set; } = "en";
        public bool ShowPlayerButton { get; set; } = true;
        public bool EnableNotifications { get; set; } = true;
        
        // AI Model Settings
        public string Model { get; set; } = "realesrgan";
        public int Scale { get; set; } = 2;
        public string Quality { get; set; } = "high";
        public bool UseAdvancedSettings { get; set; } = false;
        
        // AV1 Settings - NEW in v1.3.5
        public bool EnableAV1 { get; set; } = true;
        public int AV1Quality { get; set; } = 23; // CRF value 20-35
        public string AV1Preset { get; set; } = "medium"; // ultrafast, fast, medium, slow
        public int AV1FilmGrain { get; set; } = 0; // 0-50
        public bool AV1HardwareOnly { get; set; } = false;
        
        // Hardware Acceleration  
        public bool AutoDetectHardware { get; set; } = true;
        public string PreferredEncoder { get; set; } = "auto"; // auto, nvenc, qsv, vaapi, software
        public int MaxConcurrentStreams { get; set; } = 2;
        public bool EnableLightMode { get; set; } = false;
        
        // Video Processing
        public string UpscaleMethod { get; set; } = "Real-ESRGAN";
        public bool EnableUpscaling { get; set; } = true;
        public bool EnableSharpening { get; set; } = true;
        public int SharpeningStrength { get; set; } = 50;
        
        // Audio Settings
        public bool EnableAudioPassthrough { get; set; } = true;
        public string AudioCodec { get; set; } = "copy";
        
        // Subtitle Settings  
        public bool EnablePGSToSRT { get; set; } = true;
        public bool EnableSubtitlePassthrough { get; set; } = true;
        
        // Mobile/Touch Settings
        public bool EnableMobileOptimization { get; set; } = true;
        public bool EnableBatteryMode { get; set; } = true;
        public int MobileMaxResolution { get; set; } = 1080;
        
        // Performance Settings
        public bool EnablePerformanceMetrics { get; set; } = true;
        public bool EnableDebugLogging { get; set; } = false;
        public int ThermalThrottleTemperature { get; set; } = 85;
        
        // UI Settings
        public bool EnableQuickSettings { get; set; } = true;
        public string DefaultPreset { get; set; } = "auto";
        public bool EnableTouchOptimization { get; set; } = true;
        
        // Advanced Settings
        public bool EnableAPIAccess { get; set; } = true;
        public bool ShowProgressInDashboard { get; set; } = true;
        public int CacheSize { get; set; } = 2048; // MB
        public string TempDirectory { get; set; } = "";
        
        // Hardware Detection Settings
        public bool EnableGPUDetection { get; set; } = true;
        public bool EnableCPUFallback { get; set; } = true;
        public string ForcedGPUVendor { get; set; } = "auto"; // auto, nvidia, amd, intel
        
        // Content-specific Settings
        public bool EnableAnimeOptimization { get; set; } = true;
        public bool EnableMovieOptimization { get; set; } = true;
        public bool EnableTVOptimization { get; set; } = true;
        
        // Streaming Settings
        public bool EnableRemoteOptimization { get; set; } = true;
        public bool EnableAdaptiveBitrate { get; set; } = true;
        public int RemoteQualityReduction { get; set; } = 10; // Percentage
        
        // Experimental Features
        public bool EnableExperimentalFeatures { get; set; } = false;
        public bool EnableRealTimeProcessing { get; set; } = false;
        public bool EnableCloudProcessing { get; set; } = false;
    }
}