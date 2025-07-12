using System;
using System.Collections.Generic;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;
using MediaBrowser.Controller.Plugins;
using System.IO;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// AI Upscaler Plugin for Jellyfin v1.3.6.7 - Enhanced with Crash Prevention
    /// </summary>
    public class Plugin : BasePlugin<PluginConfiguration>, IHasWebPages
    {
        /// <summary>
        /// Plugin version
        /// </summary>
        public const string PLUGIN_VERSION = "1.3.6.7";
        
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
            try
            {
                Instance = this;
                
                // Initialize default configuration with error handling
                InitializeConfiguration();
                
                // Log successful initialization
                System.Diagnostics.Debug.WriteLine($"AI Upscaler Plugin v{PLUGIN_VERSION} initialized successfully");
            }
            catch (Exception ex)
            {
                // Log initialization errors
                System.Diagnostics.Debug.WriteLine($"AI Upscaler Plugin initialization error: {ex.Message}");
                
                // Fallback initialization
                Instance = this;
                Configuration = new PluginConfiguration();
            }
        }
        
        /// <summary>
        /// Initialize plugin configuration safely
        /// </summary>
        private void InitializeConfiguration()
        {
            ErrorHandler.SafeExecute(() =>
            {
                if (Configuration == null)
                {
                    Configuration = new PluginConfiguration();
                }
                
                // Initialize defaults
                Configuration.InitializeDefaults();
                
                // Log platform information
                System.Diagnostics.Debug.WriteLine($"AI Upscaler Plugin v{PLUGIN_VERSION} - Platform: {System.Runtime.InteropServices.RuntimeInformation.OSDescription}");
                
                SaveConfiguration();
            }, "InitializeConfiguration");
        }
        
        /// <summary>
        /// Static instance
        /// </summary>
        public static Plugin Instance { get; private set; }
        
        /// <summary>
        /// Get plugin web pages for configuration
        /// </summary>
        public IEnumerable<PluginPageInfo> GetPages()
        {
            return new[]
            {
                new PluginPageInfo
                {
                    Name = "AI Upscaler Plugin",
                    EmbeddedResourcePath = "JellyfinUpscalerPlugin.Configuration.configurationpage.html"
                },
                new PluginPageInfo
                {
                    Name = "aiupscaler-config.js",
                    EmbeddedResourcePath = "JellyfinUpscalerPlugin.Configuration.config.js"
                },
                new PluginPageInfo
                {
                    Name = "aiupscaler-quickmenu.js", 
                    EmbeddedResourcePath = "JellyfinUpscalerPlugin.Configuration.quick-menu.js"
                },
                new PluginPageInfo
                {
                    Name = "aiupscaler-player.js",
                    EmbeddedResourcePath = "JellyfinUpscalerPlugin.Configuration.player-integration.js"
                }
            };
        }
    }
}