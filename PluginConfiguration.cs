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
        
        // v1.3.5 NEW FEATURES - AV1 CODEC SUPPORT
        
        // 1. AV1 Codec Support
        public bool EnableAV1Support { get; set; } = true;
        public bool AV1HardwareAcceleration { get; set; } = true;
        public string AV1Encoder { get; set; } = "auto"; // auto, nvenc_av1, qsv_av1, vaapi_av1
        public string AV1Decoder { get; set; } = "auto"; // auto, av1_nvdec, av1_qsv, av1_vaapi
        public int AV1CRF { get; set; } = 32; // Quality setting (lower = better quality)
        public string AV1Preset { get; set; } = "medium"; // ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow
        public bool AV1Film { get; set; } = false; // Film grain synthesis
        public int AV1Threads { get; set; } = 0; // 0 = auto
        
        // 2. Enhanced Subtitle Support
        public bool EnableAdvancedSubtitles { get; set; } = true;
        public bool AutoEmbedSubtitles { get; set; } = false;
        public bool ConvertPGSSubtitles { get; set; } = true;
        public string SubtitleFormat { get; set; } = "srt"; // srt, ass, vtt
        public bool DownloadMissingSubtitles { get; set; } = false;
        public string SubtitleLanguages { get; set; } = "en,de,fr,es"; // Comma-separated language codes
        
        // 3. Remote Streaming Optimization
        public bool EnableRemoteOptimization { get; set; } = true;
        public bool DynamicBitrateAdjustment { get; set; } = true;
        public int RemoteMaxBitrate { get; set; } = 8000; // kbps
        public int RemoteMinBitrate { get; set; } = 1000; // kbps
        public bool EnableLowLatencyStreaming { get; set; } = false;
        public int NetworkBufferSize { get; set; } = 5; // seconds
        public bool AdaptiveQualityForMobile { get; set; } = true;
        
        // 4. Enhanced Mobile Support
        public bool MobileOptimizedUI { get; set; } = true;
        public bool TouchFriendlyControls { get; set; } = true;
        public int MobileMaxResolution { get; set; } = 1080; // p
        public string MobilePreferredCodec { get; set; } = "h264"; // h264, hevc, av1
        public bool MobileBatteryMode { get; set; } = true;
        public int MobileFrameRate { get; set; } = 30; // fps
        
        // 5. Enhanced Error Handling & Diagnostics
        public bool EnableAdvancedDiagnostics { get; set; } = true;
        public bool AutoErrorReporting { get; set; } = false;
        public bool DetailedLogging { get; set; } = false;
        public int LogRetentionDays { get; set; } = 7;
        public bool EnablePerformanceMetrics { get; set; } = true;
        public bool ShowHardwareInfo { get; set; } = true;
        
        // 6. HDR and Advanced Video Features
        public bool EnableHDRSupport { get; set; } = true;
        public bool HDR10Support { get; set; } = true;
        public bool DolbyVisionSupport { get; set; } = false; // Experimental
        public bool EnableToneMapping { get; set; } = true;
        public string ToneMappingAlgorithm { get; set; } = "hable"; // hable, mobius, reinhard, bt2390
        
        // 7. Audio Enhancement
        public bool EnableAudioPassthrough { get; set; } = true;
        public bool DolbyAtmosSupport { get; set; } = false;
        public bool DTSHDSupport { get; set; } = false;
        public bool AutoDownmixAudio { get; set; } = true;
        public string AudioChannelLayout { get; set; } = "auto"; // auto, stereo, 5.1, 7.1
        
        // 8. Quick Settings UI Enhancement
        public bool EnableQuickSettings { get; set; } = true;
        public bool ShowQuickSettingsInPlayer { get; set; } = true;
        public string QuickSettingsPosition { get; set; } = "top-right"; // top-right, top-left, bottom-right, bottom-left
        public bool QuickSettingsAutoHide { get; set; } = true;
        public int QuickSettingsTimeout { get; set; } = 5; // seconds
    }
}