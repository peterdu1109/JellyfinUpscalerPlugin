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
    /// Enhanced AI Upscaler Plugin for Jellyfin v1.3.5 - Complete Edition
    /// Features: 14 KI-Models, 7 Shaders, Cross-Device Sync, Real-time Stats
    /// Compatible with: Jellyfin 10.10.0+, All platforms, All devices
    /// </summary>
    public class Plugin : BasePlugin<PluginConfiguration>, IHasWebPages
    {
        /// <summary>
        /// Plugin display name with version
        /// </summary>
        public override string Name => "🚀 AI Upscaler Plugin v1.3.5 - Complete Edition";
        
        /// <summary>
        /// Unique plugin identifier - NEVER change this!
        /// </summary>
        public override Guid Id => new Guid("f87f700e-679d-43e6-9c7c-b3a410dc3f22");
        
        /// <summary>
        /// Enhanced plugin description
        /// </summary>
        public override string Description => 
            "Professional AI upscaling with 14 KI-models (Real-ESRGAN, ESRGAN Pro, SwinIR, SRCNN Light, Waifu2x, HAT, EDSR, VDSR, RDN, SRResNet, CARN, RRDBNet, DRLN, FSRCNN), " +
            "7 shaders (Bicubic, Bilinear, Lanczos, Mitchell-Netravali, Catmull-Rom, Sinc, Nearest-Neighbor), " +
            "AV1 codec support, cross-device synchronization, real-time statistics, " +
            "enhanced compatibility for Chromecast/Apple TV/Roku/Fire TV/Android TV/WebOS/Tizen, " +
            "mobile optimization, hardware acceleration (NVIDIA RTX/Intel Arc/AMD RX), " +
            "and advanced player integration with touch-optimized UI.";
        
        /// <summary>
        /// Plugin constructor with enhanced initialization
        /// </summary>
        /// <param name="applicationPaths">Application paths</param>
        /// <param name="xmlSerializer">XML serializer</param>
        public Plugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer) 
            : base(applicationPaths, xmlSerializer)
        {
            Instance = this;
            
            // Initialize default configuration if needed
            if (Configuration == null)
            {
                Configuration = new PluginConfiguration();
                SaveConfiguration();
            }
            
            // Initialize enhanced features
            InitializeEnhancedFeatures();
        }
        
        /// <summary>
        /// Static plugin instance for global access
        /// </summary>
        public static Plugin Instance { get; private set; }
        
        /// <summary>
        /// Get web pages for plugin configuration
        /// </summary>
        /// <returns>Collection of plugin pages</returns>
        public IEnumerable<PluginPageInfo> GetPages()
        {
            return new[]
            {
                // Main configuration page
                new PluginPageInfo
                {
                    Name = "🚀 AI Upscaler Configuration",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.configurationpage.html"
                },
                
                // Advanced settings page
                new PluginPageInfo
                {
                    Name = "⚙️ Advanced AI Settings",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.advancedsettings.html"
                },
                
                // Model manager page
                new PluginPageInfo
                {
                    Name = "🤖 AI Model Manager",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.modelmanager.html"
                },
                
                // Performance monitor page
                new PluginPageInfo
                {
                    Name = "📊 Performance Monitor",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.performance.html"
                },
                
                // Compatibility settings page
                new PluginPageInfo
                {
                    Name = "🔧 Device Compatibility",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.compatibility.html"
                }
            };
        }
        
        /// <summary>
        /// Initialize enhanced features and compatibility settings
        /// </summary>
        private void InitializeEnhancedFeatures()
        {
            try
            {
                // Set up default AI models if not configured
                if (Configuration.AvailableAIModels == null || Configuration.AvailableAIModels.Count == 0)
                {
                    Configuration.AvailableAIModels = new List<string>
                    {
                        // Existing models (9)
                        "realesrgan", "esrgan-pro", "swinir", "srcnn-light", "waifu2x",
                        "hat", "edsr", "vdsr", "rdn",
                        
                        // New models (5)
                        "srresnet", "carn", "rrdbnet", "drln", "fsrcnn"
                    };
                }
                
                // Set up default shaders if not configured
                if (Configuration.AvailableShaders == null || Configuration.AvailableShaders.Count == 0)
                {
                    Configuration.AvailableShaders = new List<string>
                    {
                        // Existing shaders (3)
                        "bicubic", "bilinear", "lanczos",
                        
                        // New shaders (4)
                        "mitchell-netravali", "catmull-rom", "sinc", "nearest-neighbor"
                    };
                }
                
                // Initialize model configurations
                InitializeModelConfigurations();
                
                // Initialize shader configurations
                InitializeShaderConfigurations();
                
                // Initialize device compatibility settings
                InitializeDeviceCompatibility();
                
                // Initialize color profiles for content types
                InitializeColorProfiles();
                
                // Save updated configuration
                SaveConfiguration();
            }
            catch (Exception ex)
            {
                // Log error but don't fail plugin initialization
                System.Diagnostics.Debug.WriteLine($"Plugin initialization warning: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Initialize AI model configurations with hardware requirements
        /// </summary>
        private void InitializeModelConfigurations()
        {
            if (Configuration.ModelConfigurations == null)
            {
                Configuration.ModelConfigurations = new Dictionary<string, ModelSettings>();
            }
            
            // Add missing model configurations
            var modelConfigs = new Dictionary<string, ModelSettings>
            {
                // Existing models with enhanced settings
                ["realesrgan"] = new ModelSettings 
                { 
                    RequiredVRAM = 2048, OptimalScale = 4, ContentType = "general", 
                    IsHardwareAccelerated = true, PerformanceCost = 4 
                },
                ["esrgan-pro"] = new ModelSettings 
                { 
                    RequiredVRAM = 3072, OptimalScale = 4, ContentType = "movies", 
                    IsHardwareAccelerated = true, PerformanceCost = 5 
                },
                ["swinir"] = new ModelSettings 
                { 
                    RequiredVRAM = 4096, OptimalScale = 4, ContentType = "complex", 
                    IsHardwareAccelerated = true, PerformanceCost = 5 
                },
                ["srcnn-light"] = new ModelSettings 
                { 
                    RequiredVRAM = 512, OptimalScale = 2, ContentType = "lightweight", 
                    IsHardwareAccelerated = false, PerformanceCost = 1 
                },
                ["waifu2x"] = new ModelSettings 
                { 
                    RequiredVRAM = 1024, OptimalScale = 2, ContentType = "anime", 
                    IsHardwareAccelerated = true, PerformanceCost = 2 
                },
                ["hat"] = new ModelSettings 
                { 
                    RequiredVRAM = 6144, OptimalScale = 4, ContentType = "detailed", 
                    IsHardwareAccelerated = true, PerformanceCost = 5 
                },
                ["edsr"] = new ModelSettings 
                { 
                    RequiredVRAM = 2048, OptimalScale = 3, ContentType = "precise", 
                    IsHardwareAccelerated = true, PerformanceCost = 3 
                },
                ["vdsr"] = new ModelSettings 
                { 
                    RequiredVRAM = 1536, OptimalScale = 3, ContentType = "deep", 
                    IsHardwareAccelerated = true, PerformanceCost = 3 
                },
                ["rdn"] = new ModelSettings 
                { 
                    RequiredVRAM = 2560, OptimalScale = 4, ContentType = "textured", 
                    IsHardwareAccelerated = true, PerformanceCost = 4 
                },
                
                // New models
                ["srresnet"] = new ModelSettings 
                { 
                    RequiredVRAM = 1024, OptimalScale = 2, ContentType = "basic", 
                    IsHardwareAccelerated = true, PerformanceCost = 2 
                },
                ["carn"] = new ModelSettings 
                { 
                    RequiredVRAM = 768, OptimalScale = 2, ContentType = "fast", 
                    IsHardwareAccelerated = true, PerformanceCost = 2 
                },
                ["rrdbnet"] = new ModelSettings 
                { 
                    RequiredVRAM = 1536, OptimalScale = 3, ContentType = "balanced", 
                    IsHardwareAccelerated = true, PerformanceCost = 3 
                },
                ["drln"] = new ModelSettings 
                { 
                    RequiredVRAM = 1280, OptimalScale = 2, ContentType = "denoise", 
                    IsHardwareAccelerated = true, PerformanceCost = 2 
                },
                ["fsrcnn"] = new ModelSettings 
                { 
                    RequiredVRAM = 256, OptimalScale = 2, ContentType = "minimal", 
                    IsHardwareAccelerated = false, PerformanceCost = 1 
                }
            };
            
            // Add missing configurations
            foreach (var config in modelConfigs)
            {
                if (!Configuration.ModelConfigurations.ContainsKey(config.Key))
                {
                    Configuration.ModelConfigurations[config.Key] = config.Value;
                }
            }
        }
        
        /// <summary>
        /// Initialize shader configurations with performance metrics
        /// </summary>
        private void InitializeShaderConfigurations()
        {
            if (Configuration.ShaderConfigurations == null)
            {
                Configuration.ShaderConfigurations = new Dictionary<string, ShaderSettings>();
            }
            
            var shaderConfigs = new Dictionary<string, ShaderSettings>
            {
                // Existing shaders
                ["bicubic"] = new ShaderSettings 
                { 
                    PerformanceCost = 2, Quality = 3, UseCase = "general", 
                    SupportsHardwareAcceleration = true 
                },
                ["bilinear"] = new ShaderSettings 
                { 
                    PerformanceCost = 1, Quality = 2, UseCase = "weak-hardware", 
                    SupportsHardwareAcceleration = true 
                },
                ["lanczos"] = new ShaderSettings 
                { 
                    PerformanceCost = 3, Quality = 4, UseCase = "detailed", 
                    SupportsHardwareAcceleration = true 
                },
                
                // New shaders
                ["mitchell-netravali"] = new ShaderSettings 
                { 
                    PerformanceCost = 2, Quality = 4, UseCase = "movies", 
                    SupportsHardwareAcceleration = true 
                },
                ["catmull-rom"] = new ShaderSettings 
                { 
                    PerformanceCost = 3, Quality = 4, UseCase = "high-res", 
                    SupportsHardwareAcceleration = true 
                },
                ["sinc"] = new ShaderSettings 
                { 
                    PerformanceCost = 5, Quality = 5, UseCase = "maximum-quality", 
                    SupportsHardwareAcceleration = false 
                },
                ["nearest-neighbor"] = new ShaderSettings 
                { 
                    PerformanceCost = 1, Quality = 1, UseCase = "emergency", 
                    SupportsHardwareAcceleration = true 
                }
            };
            
            // Add missing configurations
            foreach (var config in shaderConfigs)
            {
                if (!Configuration.ShaderConfigurations.ContainsKey(config.Key))
                {
                    Configuration.ShaderConfigurations[config.Key] = config.Value;
                }
            }
        }
        
        /// <summary>
        /// Initialize device compatibility settings for problematic devices
        /// </summary>
        private void InitializeDeviceCompatibility()
        {
            // Enable compatibility fixes for common problematic devices
            Configuration.EnableChromecastFix = true;
            Configuration.EnableAppleTVFix = true;
            Configuration.EnableRokuFix = true;
            Configuration.EnableFireTVFix = true;
            Configuration.EnableAndroidTVFix = true;
            Configuration.EnableWebOSFix = true;
            Configuration.EnableTizenFix = true;
            
            // Enable browser compatibility
            Configuration.EnableSafariCompatibility = true;
            Configuration.EnableEdgeCompatibility = true;
            Configuration.EnableFirefoxCompatibility = true;
            Configuration.EnableChromeCompatibility = true;
            
            // Enable mobile compatibility
            Configuration.EnableiOSCompatibility = true;
            Configuration.EnableAndroidCompatibility = true;
            Configuration.EnableTabletOptimization = true;
            
            // Enable gaming device compatibility
            Configuration.EnableSteamDeckOptimization = true;
            Configuration.EnableSteamLinkCompatibility = true;
            Configuration.EnableNVIDIAShieldCompatibility = true;
        }
        
        /// <summary>
        /// Initialize color profiles for different content types
        /// </summary>
        private void InitializeColorProfiles()
        {
            if (Configuration.ContentColorProfiles == null)
            {
                Configuration.ContentColorProfiles = new Dictionary<string, ColorProfile>();
            }
            
            var colorProfiles = new Dictionary<string, ColorProfile>
            {
                ["anime"] = new ColorProfile 
                { 
                    Saturation = 1.15f, Contrast = 1.1f, Brightness = 1.0f, 
                    Gamma = 1.0f, Hue = 0.0f 
                },
                ["movies"] = new ColorProfile 
                { 
                    Saturation = 1.05f, Contrast = 1.05f, Brightness = 1.0f, 
                    Gamma = 1.0f, Hue = 0.0f 
                },
                ["tv-shows"] = new ColorProfile 
                { 
                    Saturation = 1.1f, Contrast = 1.08f, Brightness = 1.02f, 
                    Gamma = 1.0f, Hue = 0.0f 
                },
                ["documentaries"] = new ColorProfile 
                { 
                    Saturation = 0.95f, Contrast = 1.15f, Brightness = 1.05f, 
                    Gamma = 1.1f, Hue = 0.0f 
                },
                ["music-videos"] = new ColorProfile 
                { 
                    Saturation = 1.2f, Contrast = 1.15f, Brightness = 1.0f, 
                    Gamma = 0.95f, Hue = 0.0f 
                },
                ["sports"] = new ColorProfile 
                { 
                    Saturation = 1.08f, Contrast = 1.12f, Brightness = 1.03f, 
                    Gamma = 1.0f, Hue = 0.0f 
                }
            };
            
            // Add missing color profiles
            foreach (var profile in colorProfiles)
            {
                if (!Configuration.ContentColorProfiles.ContainsKey(profile.Key))
                {
                    Configuration.ContentColorProfiles[profile.Key] = profile.Value;
                }
            }
        }
        
        /// <summary>
        /// Get recommended AI model based on hardware and content
        /// </summary>
        /// <param name="contentType">Type of content (anime, movies, tv-shows, etc.)</param>
        /// <param name="availableVRAM">Available VRAM in MB</param>
        /// <returns>Recommended AI model name</returns>
        public string GetRecommendedModel(string contentType, int availableVRAM)
        {
            try
            {
                // Find suitable models based on VRAM requirements
                var suitableModels = new List<string>();
                
                foreach (var model in Configuration.ModelConfigurations)
                {
                    if (model.Value.RequiredVRAM <= availableVRAM)
                    {
                        // Prefer content-specific models
                        if (model.Value.ContentType == contentType || 
                            model.Value.ContentType == "general" ||
                            contentType == "general")
                        {
                            suitableModels.Add(model.Key);
                        }
                    }
                }
                
                // Return best suitable model
                if (suitableModels.Contains("realesrgan") && availableVRAM >= 2048)
                    return "realesrgan";
                if (suitableModels.Contains("waifu2x") && contentType == "anime")
                    return "waifu2x";
                if (suitableModels.Contains("esrgan-pro") && contentType == "movies" && availableVRAM >= 3072)
                    return "esrgan-pro";
                if (suitableModels.Contains("drln") && availableVRAM >= 1280)
                    return "drln";
                if (suitableModels.Contains("carn") && availableVRAM >= 768)
                    return "carn";
                if (suitableModels.Contains("srcnn-light"))
                    return "srcnn-light";
                if (suitableModels.Contains("fsrcnn"))
                    return "fsrcnn";
                
                return suitableModels.Count > 0 ? suitableModels[0] : "fsrcnn";
            }
            catch
            {
                return "fsrcnn"; // Safest fallback
            }
        }
        
        /// <summary>
        /// Get recommended shader based on hardware capabilities
        /// </summary>
        /// <param name="hardwareScore">Hardware performance score (1-10)</param>
        /// <param name="useCase">Use case (general, emergency, maximum-quality, etc.)</param>
        /// <returns>Recommended shader name</returns>
        public string GetRecommendedShader(int hardwareScore, string useCase = "general")
        {
            try
            {
                // Emergency mode - use fastest shader
                if (useCase == "emergency" || hardwareScore <= 2)
                    return "nearest-neighbor";
                
                // Weak hardware - use efficient shaders
                if (hardwareScore <= 4)
                    return "bilinear";
                
                // Medium hardware - use balanced shaders
                if (hardwareScore <= 6)
                    return "bicubic";
                
                // Good hardware - use quality shaders
                if (hardwareScore <= 8)
                {
                    return useCase == "movies" ? "mitchell-netravali" : "lanczos";
                }
                
                // High-end hardware - use best shaders
                if (useCase == "maximum-quality")
                    return "sinc";
                if (useCase == "high-res")
                    return "catmull-rom";
                
                return "lanczos"; // Default high-quality shader
            }
            catch
            {
                return "bicubic"; // Safe fallback
            }
        }
        
        /// <summary>
        /// Plugin version for compatibility checks
        /// </summary>
        public static string PluginVersion => "1.3.5";
        
        /// <summary>
        /// Check if plugin is compatible with current Jellyfin version
        /// </summary>
        /// <param name="jellyfinVersion">Jellyfin version</param>
        /// <returns>True if compatible</returns>
        public bool IsCompatibleWith(Version jellyfinVersion)
        {
            // Compatible with Jellyfin 10.10.0 and newer
            var minVersion = new Version(10, 10, 0);
            return jellyfinVersion >= minVersion;
        }
    }
}