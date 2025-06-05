using System;
using System.Collections.Generic;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Controller.Plugins;
using MediaBrowser.Model.Plugins;

namespace JellyfinUpscalerPlugin
{
    public class PluginEntryPoint : BasePlugin, IHasWebPages
    {
        public override Guid Id => new Guid("f87f700e-679d-43e6-9c7c-b3a410dc3f12");
        public override string Name => "Upscaling";
        public override string Description => "Enhance video quality with real-time upscaling for supported devices.";

        public PluginEntryPoint()
            : base()
        {
        }

        public IEnumerable<PluginPageInfo> GetPages()
        {
            return new PluginPageInfo[] { };
        }

        // Additional service registration can be added here if needed
    }
}
