using MediaBrowser.Model.Plugins;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Configuration for AI Upscaler Plugin
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
        
        // GPU & Performance
        public bool UseGPU { get; set; } = true;
        public string GPUType { get; set; } = "auto";
        public int MaxConcurrentJobs { get; set; } = 1;
        public int MaxMemoryUsage { get; set; } = 4096;
        public bool EnableTurboMode { get; set; } = false;
        
        // Processing Options
        public bool AutoMode { get; set; } = false;
        public bool ProcessOnlyLowQuality { get; set; } = true;
        public int MinResolutionThreshold { get; set; } = 720;
        public string OutputFormat { get; set; } = "mp4";
        public bool PreserveOriginal { get; set; } = true;
        
        // Advanced Features
        public bool EnableBatchProcessing { get; set; } = false;
        public bool EnableScheduledUpscaling { get; set; } = false;
        public string ScheduleTime { get; set; } = "02:00";
        public bool EnableLogging { get; set; } = true;
        public string LogLevel { get; set; } = "info";
        
        // Integration Settings
        public bool IntegrateWithTranscoding { get; set; } = false;
        public bool EnableAPIAccess { get; set; } = false;
        public bool ShowProgressInDashboard { get; set; } = true;
        public bool EnableWebhooks { get; set; } = false;
        public string WebhookUrl { get; set; } = "";
        
        // v1.3.4 NEW FEATURES
        
        // 1. Light Mode für schwächere Hardware
        public bool EnableLightMode { get; set; } = false;
        public bool AutoDetectHardware { get; set; } = true;
        public int LightModeMaxResolution { get; set; } = 1080;
        public string LightModeModel { get; set; } = "bicubic";
        
        // 2. Model Management System
        public bool EnableModelManager { get; set; } = true;
        public string ModelDownloadPath { get; set; } = "";
        public bool AutoDownloadModels { get; set; } = false;
        public int MaxModelCacheSize { get; set; } = 10240; // MB
        public bool ModelPriorizationEnabled { get; set; } = true;
        
        // 3. Frame Interpolation Control
        public bool EnableFrameInterpolation { get; set; } = false;
        public bool FrameInterpolationOptional { get; set; } = true;
        public double FrameInterpolationThreshold { get; set; } = 30.0; // FPS
        public string FrameInterpolationMethod { get; set; } = "motion_compensation";
        public bool SkipInterpolationFor24fps { get; set; } = true;
        
        // 4. Mobile/Server-side Support
        public bool EnableMobileSupport { get; set; } = false;
        public bool ServerSideUpscaling { get; set; } = false;
        public bool EnablePreUpscalingCache { get; set; } = false;
        public int MobileCacheSize { get; set; } = 2048; // MB
        public string MobileOptimizedModel { get; set; } = "srcnn";
        
        // 5. Enhanced Performance Settings
        public bool AdaptiveQualityEnabled { get; set; } = true;
        public bool BatteryOptimizationMode { get; set; } = false;
        public int CPUCoreLimit { get; set; } = 0; // 0 = auto
        public bool TemperatureThrottling { get; set; } = true;
        public int MaxTemperature { get; set; } = 85; // Celsius
    }
}