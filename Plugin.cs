using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Runtime.InteropServices;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;
using Microsoft.Extensions.Logging;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// The main plugin class for Jellyfin Upscaler Plugin.
    /// </summary>
    public class Plugin : BasePlugin<PluginConfiguration>, IHasWebPages
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Plugin"/> class.
        /// </summary>
        /// <param name="applicationPaths">Instance of the <see cref="IApplicationPaths"/> interface.</param>
        /// <param name="xmlSerializer">Instance of the <see cref="IXmlSerializer"/> interface.</param>
        private readonly ILogger<Plugin> _logger;

        public Plugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer, ILogger<Plugin> logger)
            : base(applicationPaths, xmlSerializer)
        {
            Instance = this;
            _logger = logger;
            
            // Initialize plugin with system detection
            InitializePlugin();
        }

        /// <inheritdoc />
        public override string Name => "Jellyfin AI Upscaler Plugin";

        /// <inheritdoc />
        public override Guid Id => Guid.Parse("f87f700e-679d-43e6-9c7c-b3a410dc3f12");

        /// <inheritdoc />
        public override Version Version => new Version(1, 3, 1);

        /// <inheritdoc />
        public override string Description => "Professional AI-powered video upscaling with DLSS, FSR, XeSS, Real-ESRGAN, and multiple AI models";

        /// <summary>
        /// Gets the supported AI models.
        /// </summary>
        public static readonly string[] SupportedAIModels = new[]
        {
            "Real-ESRGAN",
            "ESRGAN", 
            "Waifu2x",
            "SwinIR",
            "EDSR",
            "HAT",
            "SRCNN",
            "VDSR", 
            "RDN"
        };

        /// <summary>
        /// Gets the supported hardware acceleration methods.
        /// </summary>
        public static readonly string[] SupportedAcceleration = new[]
        {
            "DLSS",
            "FSR",
            "XeSS",
            "CAS",
            "NIS"
        };

        /// <summary>
        /// Gets the current plugin instance.
        /// </summary>
        public static Plugin? Instance { get; private set; }

        /// <summary>
        /// Initialize plugin with system and hardware detection.
        /// </summary>
        private void InitializePlugin()
        {
            try
            {
                _logger?.LogInformation("🔥 Jellyfin AI Upscaler Plugin v{Version} - Initializing...", Version);
                
                // Detect operating system
                DetectOperatingSystem();
                
                // Detect available AI models
                DetectAvailableModels();
                
                // Apply Linux optimizations if needed
                if (IsLinux())
                {
                    ApplyLinuxOptimizations();
                }
                
                _logger?.LogInformation("✅ Plugin initialization completed successfully");
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "❌ Failed to initialize plugin");
            }
        }

        /// <summary>
        /// Detect the operating system.
        /// </summary>
        private void DetectOperatingSystem()
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                _logger?.LogInformation("🐧 Linux system detected - Enabling Linux optimizations");
                Configuration.LinuxOptimization = true;
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                _logger?.LogInformation("🪟 Windows system detected");
                Configuration.LinuxOptimization = false;
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
            {
                _logger?.LogInformation("🍎 macOS system detected");
                Configuration.LinuxOptimization = false;
                Configuration.MacOSOptimization = true;
                ApplyMacOSOptimizations();
            }
        }

        /// <summary>
        /// Detect available AI models.
        /// </summary>
        private void DetectAvailableModels()
        {
            var modelsPath = Path.Combine(ApplicationPaths.PluginsPath, "JellyfinUpscalerPlugin_1.3.1", "shaders");
            
            _logger?.LogInformation("🔍 Detecting available AI models in: {ModelsPath}", modelsPath);
            
            if (Directory.Exists(modelsPath))
            {
                foreach (var model in SupportedAIModels)
                {
                    var modelPath = Path.Combine(modelsPath, model, "model.json");
                    if (File.Exists(modelPath))
                    {
                        _logger?.LogInformation("✅ Found AI model: {Model}", model);
                        
                        // Enable model based on type
                        switch (model)
                        {
                            case "Real-ESRGAN":
                                Configuration.EnableRealESRGAN = true;
                                break;
                            case "SwinIR":
                                Configuration.EnableSwinIR = true;
                                break;
                            case "EDSR":
                                Configuration.EnableEDSR = true;
                                break;
                            case "HAT":
                                Configuration.EnableHAT = true;
                                break;
                        }
                    }
                    else
                    {
                        _logger?.LogWarning("⚠️ AI model not found: {Model}", model);
                    }
                }
            }
            else
            {
                _logger?.LogWarning("⚠️ Models directory not found: {ModelsPath}", modelsPath);
            }
        }

        /// <summary>
        /// Apply Linux-specific optimizations.
        /// </summary>
        private void ApplyLinuxOptimizations()
        {
            _logger?.LogInformation("🔧 Applying Linux optimizations...");
            
            // Set Linux-friendly defaults
            Configuration.GPUAcceleration = "Auto";
            Configuration.VRAMLimit = 4.0; // Conservative VRAM limit for Linux
            Configuration.PerformanceMonitoring = true;
            
            // Try to detect GPU type on Linux
            DetectLinuxGPU();
            
            SaveConfiguration();
        }

        /// <summary>
        /// Detect GPU type on Linux systems.
        /// </summary>
        private void DetectLinuxGPU()
        {
            try
            {
                // Try to detect NVIDIA GPU
                if (File.Exists("/proc/driver/nvidia/version"))
                {
                    _logger?.LogInformation("🎮 NVIDIA GPU detected on Linux");
                    Configuration.GPUAcceleration = "NVIDIA";
                    return;
                }

                // Try to detect AMD GPU
                if (Directory.Exists("/sys/class/drm") && 
                    Directory.GetDirectories("/sys/class/drm", "card*").Any(d => 
                        File.Exists(Path.Combine(d, "device/vendor")) &&
                        File.ReadAllText(Path.Combine(d, "device/vendor")).Trim() == "0x1002"))
                {
                    _logger?.LogInformation("🎮 AMD GPU detected on Linux");
                    Configuration.GPUAcceleration = "AMD";
                    return;
                }

                // Try to detect Intel GPU
                if (Directory.Exists("/sys/class/drm") && 
                    Directory.GetDirectories("/sys/class/drm", "card*").Any(d => 
                        File.Exists(Path.Combine(d, "device/vendor")) &&
                        File.ReadAllText(Path.Combine(d, "device/vendor")).Trim() == "0x8086"))
                {
                    _logger?.LogInformation("🎮 Intel GPU detected on Linux");
                    Configuration.GPUAcceleration = "Intel";
                    return;
                }

                _logger?.LogInformation("🖥️ No dedicated GPU detected, using CPU acceleration");
                Configuration.GPUAcceleration = "CPU";
            }
            catch (Exception ex)
            {
                _logger?.LogWarning(ex, "⚠️ Failed to detect GPU on Linux, using auto detection");
                Configuration.GPUAcceleration = "Auto";
            }
        }

        /// <summary>
        /// Apply macOS-specific optimizations.
        /// </summary>
        private void ApplyMacOSOptimizations()
        {
            _logger?.LogInformation("🔧 Applying macOS optimizations...");
            
            // Set macOS-friendly defaults
            Configuration.GPUAcceleration = "Metal";
            Configuration.VRAMLimit = 6.0; // macOS typically has unified memory
            Configuration.PerformanceMonitoring = true;
            Configuration.CrossPlatformMode = true;
            
            // Try to detect Apple Silicon vs Intel Mac
            DetectMacGPU();
            
            SaveConfiguration();
        }

        /// <summary>
        /// Detect GPU type on macOS systems.
        /// </summary>
        private void DetectMacGPU()
        {
            try
            {
                var architecture = RuntimeInformation.ProcessArchitecture;
                
                if (architecture == Architecture.Arm64)
                {
                    _logger?.LogInformation("🍎 Apple Silicon Mac detected (M1/M2/M3)");
                    Configuration.GPUAcceleration = "Metal";
                    Configuration.GPUVendorOverride = "Apple";
                    Configuration.VRAMLimit = 8.0; // Unified memory on Apple Silicon
                }
                else if (architecture == Architecture.X64)
                {
                    _logger?.LogInformation("🍎 Intel Mac detected");
                    Configuration.GPUAcceleration = "OpenGL";
                    Configuration.GPUVendorOverride = "Intel";
                    Configuration.VRAMLimit = 4.0; // Discrete or integrated GPU
                }
                else
                {
                    _logger?.LogInformation("🍎 Unknown Mac architecture: {Architecture}", architecture);
                    Configuration.GPUAcceleration = "Auto";
                }
            }
            catch (Exception ex)
            {
                _logger?.LogWarning(ex, "⚠️ Failed to detect Mac GPU type, using auto detection");
                Configuration.GPUAcceleration = "Auto";
            }
        }

        /// <summary>
        /// Check if running on Linux.
        /// </summary>
        /// <returns>True if running on Linux.</returns>
        private static bool IsLinux()
        {
            return RuntimeInformation.IsOSPlatform(OSPlatform.Linux);
        }

        /// <summary>
        /// Check if running on macOS.
        /// </summary>
        /// <returns>True if running on macOS.</returns>
        private static bool IsMacOS()
        {
            return RuntimeInformation.IsOSPlatform(OSPlatform.OSX);
        }

        /// <summary>
        /// Check if running on Windows.
        /// </summary>
        /// <returns>True if running on Windows.</returns>
        private static bool IsWindows()
        {
            return RuntimeInformation.IsOSPlatform(OSPlatform.Windows);
        }

        /// <summary>
        /// Get optimal AI model for content type.
        /// </summary>
        /// <param name="contentType">Type of content (anime, movie, tv, etc.)</param>
        /// <returns>Recommended AI model name.</returns>
        public string GetOptimalAIModel(string contentType)
        {
            return contentType.ToLowerInvariant() switch
            {
                "anime" or "animation" => "Waifu2x",
                "movie" or "film" => "Real-ESRGAN",
                "tv" or "series" => "EDSR",
                "documentary" => "SRCNN",
                _ => Configuration.AIModel
            };
        }

        /// <inheritdoc />
        public IEnumerable<PluginPageInfo> GetPages()
        {
            return new[]
            {
                new PluginPageInfo
                {
                    Name = this.Name,
                    EmbeddedResourcePath = string.Format(CultureInfo.InvariantCulture, "{0}.web.configurationpage.html", GetType().Namespace),
                    MenuSection = "server",
                    MenuIcon = "auto_awesome"
                }
            };
        }
    }
}