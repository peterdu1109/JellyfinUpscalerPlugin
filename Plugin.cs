using System;
using System.Collections.Generic;
using System.Globalization;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// AI Upscaler Plugin for Jellyfin - Minimal Working Version
    /// </summary>
    public class Plugin : BasePlugin<PluginConfiguration>, IHasWebPages
    {
        public override string Name => "🚀 AI Upscaler Plugin v1.3.3";
        public override Guid Id => new Guid("f87f700e-679d-43e6-9c7c-b3a410dc3f22");
        public override string Description => "Professional AI upscaling with multilingual support, 9 AI models, cross-platform GPU acceleration, and advanced player integration.";

        public Plugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer) 
            : base(applicationPaths, xmlSerializer)
        {
            Instance = this;
        }

        public static Plugin Instance { get; private set; }

        public IEnumerable<PluginPageInfo> GetPages()
        {
            return new[]
            {
                new PluginPageInfo
                {
                    Name = this.Name,
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.configurationpage.html"
                }
            };
        }
    }
}