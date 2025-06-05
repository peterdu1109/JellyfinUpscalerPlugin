using System;
using System.Collections.Generic;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Controller.Plugins;
using Microsoft.Extensions.DependencyInjection;

namespace JellyfinUpscalerPlugin
{
    public class PluginEntryPoint : BasePlugin, IHasWebPages
    {
        public override Guid Id => new Guid("f87f700e-679d-43e6-9c7c-b3a410dc3f12");
        public override string Name => "Upscaling";
        public override string Description => "Enhance video quality with real-time upscaling for supported devices.";

        public PluginEntryPoint(IApplicationPaths appPaths, IXmlSerializer xmlSerializer)
            : base(appPaths, xmlSerializer)
        {
        }

        public IEnumerable<PluginPageInfo> GetPages()
        {
            return new PluginPageInfo[] { };
        }

        public override void ConfigureServices(IServiceCollection services)
        {
            // Register services if needed
        }
    }
}
