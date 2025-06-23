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
    }
}