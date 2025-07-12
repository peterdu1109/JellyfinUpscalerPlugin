using System;
using System.Collections.Generic;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// AI Upscaler Plugin for Jellyfin - Stable Version
    /// </summary>
    public class Plugin : BasePlugin<PluginConfiguration>, IHasWebPages
    {
        /// <summary>
        /// Plugin name
        /// </summary>
        public override string Name => "AI Upscaler Plugin";
        
        /// <summary>
        /// Plugin GUID
        /// </summary>
        public override Guid Id => new Guid("f87f700e-679d-43e6-9c7c-b3a410dc3f22");
        
        /// <summary>
        /// Plugin version
        /// </summary>
        public new Version Version => new Version(1, 3, 6, 7);
        
        /// <summary>
        /// Plugin description
        /// </summary>
        public override string Description => "AI-powered video upscaling with Quick Menu and Player Integration";
        
        /// <summary>
        /// Constructor
        /// </summary>
        public Plugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer) 
            : base(applicationPaths, xmlSerializer)
        {
            Instance = this;
        }
        
        /// <summary>
        /// Static instance
        /// </summary>
        public static Plugin Instance { get; private set; }
        
        /// <summary>
        /// Get plugin web pages
        /// </summary>
        public IEnumerable<PluginPageInfo> GetPages()
        {
            return new[]
            {
                new PluginPageInfo
                {
                    Name = "AI Upscaler Plugin",
                    EmbeddedResourcePath = "JellyfinUpscalerPlugin.Configuration.configurationpage.html"
                }
            };
        }
    }
}