using MediaBrowser.Model.Plugins;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Plugin configuration class for Jellyfin Upscaler Plugin.
    /// </summary>
    public class PluginConfiguration : BasePluginConfiguration
    {
        /// <summary>
        /// Gets or sets the selected enhancement profile.
        /// </summary>
        public string SelectedProfile { get; set; } = "Default";

        /// <summary>
        /// Gets or sets the maximum FPS for AI processing.
        /// </summary>
        public string MaxFPSForAI { get; set; } = "60 FPS";

        /// <summary>
        /// Gets or sets the minimum resolution for AI processing.
        /// </summary>
        public string MinResolutionForAI { get; set; } = "720p";

        /// <summary>
        /// Gets or sets the maximum resolution for AI processing.
        /// </summary>
        public string MaxResolutionForAI { get; set; } = "2160p";

        /// <summary>
        /// Gets or sets the sharpness level.
        /// </summary>
        public int Sharpness { get; set; } = 2;

        /// <summary>
        /// Gets or sets the saturation level.
        /// </summary>
        public double Saturation { get; set; } = 1.0;

        /// <summary>
        /// Gets or sets the contrast level.
        /// </summary>
        public double Contrast { get; set; } = 1.0;

        /// <summary>
        /// Gets or sets the denoising level.
        /// </summary>
        public int Denoising { get; set; } = 1;

        /// <summary>
        /// Gets or sets a value indicating whether benchmark testing is enabled.
        /// </summary>
        public bool EnableBenchmarkTest { get; set; } = false;

        /// <summary>
        /// Gets or sets a value indicating whether adaptive quality is enabled.
        /// </summary>
        public bool AdaptiveQuality { get; set; } = true;

        /// <summary>
        /// Gets or sets a value indicating whether performance monitoring is enabled.
        /// </summary>
        public bool PerformanceMonitoring { get; set; } = false;

        /// <summary>
        /// Gets or sets the AI model to use for upscaling.
        /// </summary>
        public string AIModel { get; set; } = "ESRGAN";

        /// <summary>
        /// Gets or sets the scale factor for upscaling.
        /// </summary>
        public double ScaleFactor { get; set; } = 2.0;

        /// <summary>
        /// Gets or sets a value indicating whether Real-ESRGAN is enabled.
        /// </summary>
        public bool EnableRealESRGAN { get; set; } = true;

        /// <summary>
        /// Gets or sets a value indicating whether SwinIR is enabled.
        /// </summary>
        public bool EnableSwinIR { get; set; } = false;

        /// <summary>
        /// Gets or sets a value indicating whether EDSR is enabled.
        /// </summary>
        public bool EnableEDSR { get; set; } = false;

        /// <summary>
        /// Gets or sets a value indicating whether HAT is enabled.
        /// </summary>
        public bool EnableHAT { get; set; } = false;

        /// <summary>
        /// Gets or sets the GPU acceleration method.
        /// </summary>
        public string GPUAcceleration { get; set; } = "Auto";

        /// <summary>
        /// Gets or sets a value indicating whether Linux optimization is enabled.
        /// </summary>
        public bool LinuxOptimization { get; set; } = false;

        /// <summary>
        /// Gets or sets the VRAM usage limit in GB.
        /// </summary>
        public double VRAMLimit { get; set; } = 4.0;

        /// <summary>
        /// Gets or sets a value indicating whether SRCNN is enabled.
        /// </summary>
        public bool EnableSRCNN { get; set; } = false;

        /// <summary>
        /// Gets or sets a value indicating whether VDSR is enabled.
        /// </summary>
        public bool EnableVDSR { get; set; } = false;

        /// <summary>
        /// Gets or sets a value indicating whether RDN is enabled.
        /// </summary>
        public bool EnableRDN { get; set; } = false;

        /// <summary>
        /// Gets or sets the content type detection threshold.
        /// </summary>
        public double ContentDetectionThreshold { get; set; } = 0.8;

        /// <summary>
        /// Gets or sets a value indicating whether automatic model switching is enabled.
        /// </summary>
        public bool AutoModelSwitching { get; set; } = true;

        /// <summary>
        /// Gets or sets the thermal throttling temperature in Celsius.
        /// </summary>
        public int ThermalThrottleTemp { get; set; } = 80;

        /// <summary>
        /// Gets or sets a value indicating whether dynamic quality adjustment is enabled.
        /// </summary>
        public bool DynamicQualityAdjustment { get; set; } = true;

        /// <summary>
        /// Gets or sets the minimum FPS threshold for quality adjustment.
        /// </summary>
        public int MinFPSThreshold { get; set; } = 24;

        /// <summary>
        /// Gets or sets the target performance impact percentage (0-100).
        /// </summary>
        public int TargetPerformanceImpact { get; set; } = 15;

        /// <summary>
        /// Gets or sets a value indicating whether macOS optimization is enabled.
        /// </summary>
        public bool MacOSOptimization { get; set; } = false;

        /// <summary>
        /// Gets or sets the platform-specific renderer.
        /// </summary>
        public string PlatformRenderer { get; set; } = "Auto";

        /// <summary>
        /// Gets or sets a value indicating whether cross-platform compatibility mode is enabled.
        /// </summary>
        public bool CrossPlatformMode { get; set; } = true;

        /// <summary>
        /// Gets or sets the AI model cache size in MB.
        /// </summary>
        public int ModelCacheSize { get; set; } = 512;

        /// <summary>
        /// Gets or sets a value indicating whether model preloading is enabled.
        /// </summary>
        public bool ModelPreloading { get; set; } = false;

        /// <summary>
        /// Gets or sets the number of worker threads for AI processing.
        /// </summary>
        public int WorkerThreads { get; set; } = 0; // 0 = auto-detect

        /// <summary>
        /// Gets or sets a value indicating whether batch processing is enabled.
        /// </summary>
        public bool BatchProcessing { get; set; } = false;

        /// <summary>
        /// Gets or sets the batch size for processing multiple frames.
        /// </summary>
        public int BatchSize { get; set; } = 4;

        /// <summary>
        /// Gets or sets a value indicating whether memory optimization is enabled.
        /// </summary>
        public bool MemoryOptimization { get; set; } = true;

        /// <summary>
        /// Gets or sets the tile overlap percentage for seamless processing.
        /// </summary>
        public int TileOverlapPercent { get; set; } = 10;

        /// <summary>
        /// Gets or sets a value indicating whether progressive enhancement is enabled.
        /// </summary>
        public bool ProgressiveEnhancement { get; set; } = false;

        /// <summary>
        /// Gets or sets the quality enhancement factor (1.0-3.0).
        /// </summary>
        public double QualityEnhancementFactor { get; set; } = 1.5;

        /// <summary>
        /// Gets or sets a value indicating whether HDR passthrough is enabled.
        /// </summary>
        public bool HDRPassthrough { get; set; } = true;

        /// <summary>
        /// Gets or sets a value indicating whether color space conversion is automatic.
        /// </summary>
        public bool AutoColorSpaceConversion { get; set; } = true;

        /// <summary>
        /// Gets or sets the custom model path for user-provided models.
        /// </summary>
        public string CustomModelPath { get; set; } = "";

        /// <summary>
        /// Gets or sets a value indicating whether telemetry is enabled.
        /// </summary>
        public bool EnableTelemetry { get; set; } = false;

        /// <summary>
        /// Gets or sets the logging level for the plugin.
        /// </summary>
        public string LogLevel { get; set; } = "Information";

        /// <summary>
        /// Gets or sets a value indicating whether debug mode is enabled.
        /// </summary>
        public bool DebugMode { get; set; } = false;

        /// <summary>
        /// Gets or sets the GPU vendor override (Auto, NVIDIA, AMD, Intel, Apple).
        /// </summary>
        public string GPUVendorOverride { get; set; } = "Auto";

        /// <summary>
        /// Gets or sets a value indicating whether multi-GPU support is enabled.
        /// </summary>
        public bool MultiGPUSupport { get; set; } = false;

        /// <summary>
        /// Gets or sets the preferred GPU index for multi-GPU systems.
        /// </summary>
        public int PreferredGPUIndex { get; set; } = 0;
    }
}