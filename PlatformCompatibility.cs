using System;
using System.Runtime.InteropServices;
using System.IO;
using Microsoft.Extensions.Logging;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Platform compatibility detection for CasaOS, ARM64, and Docker environments
    /// </summary>
    public class PlatformCompatibility
    {
        private readonly ILogger<PlatformCompatibility> _logger;
        
        public PlatformCompatibility(ILogger<PlatformCompatibility> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Detect if running on CasaOS
        /// </summary>
        public bool IsCasaOS()
        {
            try
            {
                // Check for CasaOS-specific files and directories
                var casaOSIndicators = new[]
                {
                    "/etc/casaos/",
                    "/var/lib/casaos/",
                    "/usr/local/bin/casaos",
                    "/opt/casaos/",
                    "/etc/casaos-release"
                };

                foreach (var indicator in casaOSIndicators)
                {
                    if (Directory.Exists(indicator) || File.Exists(indicator))
                    {
                        _logger?.LogInformation($"CasaOS detected: {indicator}");
                        return true;
                    }
                }

                // Check environment variables
                var casaOSEnv = Environment.GetEnvironmentVariable("CASAOS_VERSION");
                if (!string.IsNullOrEmpty(casaOSEnv))
                {
                    _logger?.LogInformation($"CasaOS detected via environment: {casaOSEnv}");
                    return true;
                }

                // Check for Zimaboard (common CasaOS hardware)
                if (IsZimaboard())
                {
                    _logger?.LogInformation("Zimaboard detected (CasaOS likely)");
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error detecting CasaOS");
                return false;
            }
        }

        /// <summary>
        /// Check if running on ARM64 architecture
        /// </summary>
        public bool IsARM64()
        {
            try
            {
                var architecture = RuntimeInformation.ProcessArchitecture;
                return architecture == Architecture.Arm64;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error detecting ARM64 architecture");
                return false;
            }
        }

        /// <summary>
        /// Check if running on Raspberry Pi
        /// </summary>
        public bool IsRaspberryPi()
        {
            try
            {
                if (File.Exists("/proc/device-tree/model"))
                {
                    var model = File.ReadAllText("/proc/device-tree/model");
                    return model.Contains("Raspberry Pi");
                }

                if (File.Exists("/sys/firmware/devicetree/base/model"))
                {
                    var model = File.ReadAllText("/sys/firmware/devicetree/base/model");
                    return model.Contains("Raspberry Pi");
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error detecting Raspberry Pi");
                return false;
            }
        }

        /// <summary>
        /// Check if running on Zimaboard
        /// </summary>
        public bool IsZimaboard()
        {
            try
            {
                if (File.Exists("/proc/device-tree/model"))
                {
                    var model = File.ReadAllText("/proc/device-tree/model");
                    return model.Contains("Zimaboard") || model.Contains("ZimaBoard");
                }

                // Check DMI information
                if (File.Exists("/sys/class/dmi/id/product_name"))
                {
                    var productName = File.ReadAllText("/sys/class/dmi/id/product_name").Trim();
                    return productName.Contains("Zimaboard") || productName.Contains("ZimaBoard");
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error detecting Zimaboard");
                return false;
            }
        }

        /// <summary>
        /// Check if running in Docker container
        /// </summary>
        public bool IsDocker()
        {
            try
            {
                return File.Exists("/.dockerenv") || 
                       File.Exists("/proc/1/cgroup") && 
                       File.ReadAllText("/proc/1/cgroup").Contains("docker");
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error detecting Docker");
                return false;
            }
        }

        /// <summary>
        /// Get optimal configuration for current platform
        /// </summary>
        public PlatformConfiguration GetOptimalConfiguration()
        {
            var config = new PlatformConfiguration();

            try
            {
                config.IsCasaOS = IsCasaOS();
                config.IsARM64 = IsARM64();
                config.IsRaspberryPi = IsRaspberryPi();
                config.IsZimaboard = IsZimaboard();
                config.IsDocker = IsDocker();

                // CasaOS-specific optimizations
                if (config.IsCasaOS)
                {
                    config.RecommendedCacheSize = 512; // MB - Conservative for ARM
                    config.RecommendedConcurrentStreams = 1;
                    config.RecommendedModel = "srcnn-light"; // Lightweight model
                    config.EnableHardwareAcceleration = false; // Often limited on ARM
                    config.RequiresSpecialPermissions = true;
                }

                // ARM64-specific optimizations
                if (config.IsARM64)
                {
                    config.RecommendedCacheSize = Math.Min(config.RecommendedCacheSize, 1024);
                    config.RecommendedModel = "fsrcnn"; // Fast model for ARM
                    config.EnableEcoMode = true; // Power saving important
                }

                // Raspberry Pi specific
                if (config.IsRaspberryPi)
                {
                    config.RecommendedCacheSize = 256; // Very conservative
                    config.RecommendedConcurrentStreams = 1;
                    config.EnableEcoMode = true;
                    config.RequiresSpecialPermissions = true;
                }

                // Docker-specific
                if (config.IsDocker)
                {
                    config.RequiresSpecialPermissions = true;
                    config.RecommendedUID = 1000;
                    config.RecommendedGID = 1000;
                }

                _logger?.LogInformation($"Platform configuration: CasaOS={config.IsCasaOS}, ARM64={config.IsARM64}, Docker={config.IsDocker}");
                return config;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error getting optimal configuration");
                return new PlatformConfiguration(); // Default config
            }
        }
    }

    /// <summary>
    /// Platform-specific configuration
    /// </summary>
    public class PlatformConfiguration
    {
        public bool IsCasaOS { get; set; } = false;
        public bool IsARM64 { get; set; } = false;
        public bool IsRaspberryPi { get; set; } = false;
        public bool IsZimaboard { get; set; } = false;
        public bool IsDocker { get; set; } = false;
        
        public int RecommendedCacheSize { get; set; } = 2048; // MB
        public int RecommendedConcurrentStreams { get; set; } = 2;
        public string RecommendedModel { get; set; } = "realesrgan";
        public bool EnableHardwareAcceleration { get; set; } = true;
        public bool EnableEcoMode { get; set; } = false;
        public bool RequiresSpecialPermissions { get; set; } = false;
        public int RecommendedUID { get; set; } = 1000;
        public int RecommendedGID { get; set; } = 1000;
    }
}