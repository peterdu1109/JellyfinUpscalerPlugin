using MediaBrowser.Model.Plugins;

namespace Jellyfin.Plugin.Upscaler
{
    public class PluginConfiguration : BasePluginConfiguration
    {
        public string SelectedProfile { get; set; } = "Default";
        public bool EnableBenchmark { get; set; } = true;
    }
}
