using MediaBrowser.Model.Plugins;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Configuration for AI Upscaler Plugin
    /// </summary>
    public class PluginConfiguration : BasePluginConfiguration
    {
        public bool Enabled { get; set; } = false;
        public string Model { get; set; } = "realesrgan";
        public int Scale { get; set; } = 2;
        public bool UseGPU { get; set; } = true;
        public int MaxConcurrentJobs { get; set; } = 1;
        public bool AutoMode { get; set; } = false;
    }
}