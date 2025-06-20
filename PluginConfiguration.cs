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
    }
}