using System;
using System.Collections.Generic;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// AI Upscaler Plugin for Jellyfin v1.3.6.5 - Simplified & Fixed
    /// </summary>
    public class Plugin : BasePlugin<PluginConfiguration>
    {
        /// <summary>
        /// Plugin version
        /// </summary>
        public const string PLUGIN_VERSION = "1.3.6.5";
        
        /// <summary>
        /// Plugin name
        /// </summary>
        public override string Name => "AI Upscaler Plugin";
        
        /// <summary>
        /// Plugin GUID
        /// </summary>
        public override Guid Id => new Guid("f87f700e-679d-43e6-9c7c-b3a410dc3f22");
        
        /// <summary>
        /// Plugin description
        /// </summary>
        public override string Description => "AI-powered video upscaling for Jellyfin";
        
        /// <summary>
        /// Plugin constructor
        /// </summary>
        /// <param name="applicationPaths">Application paths</param>
        /// <param name="xmlSerializer">XML serializer</param>
        public Plugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer) 
            : base(applicationPaths, xmlSerializer)
        {
            Instance = this;
            
            // Initialize default configuration
            if (Configuration == null)
            {
                Configuration = new PluginConfiguration();
                SaveConfiguration();
            }
        }
        
        /// <summary>
        /// Static instance
        /// </summary>
        public static Plugin Instance { get; private set; }
    }
}