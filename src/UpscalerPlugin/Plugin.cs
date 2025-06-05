using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;
using System;

namespace Jellyfin.Plugin.Upscaler
{
    public class UpscalerPlugin : BasePlugin, IPlugin, IHasWebPages
    {
        public UpscalerPlugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer)
            : base(applicationPaths, xmlSerializer)
        {
        }

        public override string Name => "Upscaling";

        public override string Description => "Enhance video quality with real-time upscaling for supported devices.";

        public override Guid Id => new Guid("f87f700e-679d-43e6-9c7c-b3a410dc3f12");

        public PluginPageInfo[] GetPages() => new[]
        {
            new PluginPageInfo
            {
                Name = "upscaler",
                EmbeddedResourcePath = GetType().Namespace + ".Web.index.html"
            }
        };
    }
}
