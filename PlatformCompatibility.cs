using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Cross-Platform Compatibility Manager
    /// </summary>
    public static class PlatformCompatibility
    {
        /// <summary>
        /// Current platform information
        /// </summary>
        public static class CurrentPlatform
        {
            public static bool IsWindows => RuntimeInformation.IsOSPlatform(OSPlatform.Windows);
            public static bool IsLinux => RuntimeInformation.IsOSPlatform(OSPlatform.Linux);
            public static bool IsMacOS => RuntimeInformation.IsOSPlatform(OSPlatform.OSX);
            public static bool IsARM => RuntimeInformation.ProcessArchitecture == Architecture.Arm64;
            public static bool IsX64 => RuntimeInformation.ProcessArchitecture == Architecture.X64;
            public static bool IsDocker => Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
            
            public static string PlatformName
            {
                get
                {
                    if (IsWindows) return "Windows";
                    if (IsLinux) return "Linux";
                    if (IsMacOS) return "macOS";
                    return "Unknown";
                }
            }
            
            public static string Architecture => RuntimeInformation.ProcessArchitecture.ToString();
            public static string Framework => RuntimeInformation.FrameworkDescription;
        }
        
        /// <summary>
        /// Device-specific compatibility settings
        /// </summary>
        public static class DeviceSupport
        {
            /// <summary>
            /// Smart TV compatibility matrix
            /// </summary>
            public static Dictionary<string, bool> SmartTVSupport = new Dictionary<string, bool>
            {
                ["Chromecast"] = true,
                ["AppleTV"] = true,
                ["Roku"] = true,
                ["FireTV"] = true,
                ["AndroidTV"] = true,
                ["WebOS"] = true,
                ["Tizen"] = true,
                ["BrightScript"] = true
            };
            
            /// <summary>
            /// NAS platform compatibility
            /// </summary>
            public static Dictionary<string, bool> NASSupport = new Dictionary<string, bool>
            {
                ["Synology"] = true,
                ["QNAP"] = true,
                ["Unraid"] = true,
                ["TrueNAS"] = true,
                ["OpenMediaVault"] = true,
                ["FreeNAS"] = true,
                ["XPenology"] = true
            };
            
            /// <summary>
            /// Mobile platform support
            /// </summary>
            public static Dictionary<string, bool> MobileSupport = new Dictionary<string, bool>
            {
                ["iOS"] = true,
                ["Android"] = true,
                ["iPadOS"] = true,
                ["AndroidTV"] = true,
                ["WebBrowser"] = true
            };
        }
        
        /// <summary>
        /// AI Model compatibility by platform
        /// </summary>
        public static class AIModelSupport
        {
            /// <summary>
            /// Get supported AI models for current platform
            /// </summary>
            public static List<string> GetSupportedModels()
            {
                var models = new List<string>();
                
                // Universal models (work on all platforms)
                models.AddRange(new[]
                {
                    "bicubic",
                    "bilinear", 
                    "lanczos"
                });
                
                // Platform-specific models
                if (CurrentPlatform.IsWindows || CurrentPlatform.IsLinux)
                {
                    models.AddRange(new[]
                    {
                        "realesrgan",
                        "esrgan",
                        "swinir",
                        "waifu2x",
                        "srcnn"
                    });
                }
                
                // High-performance models for powerful systems
                if (HasHighPerformanceCapability())
                {
                    models.AddRange(new[]
                    {
                        "hat",
                        "edsr",
                        "rcan",
                        "san"
                    });
                }
                
                return models;
            }
            
            /// <summary>
            /// Check if system has high-performance capability
            /// </summary>
            private static bool HasHighPerformanceCapability()
            {
                try
                {
                    // Check processor count
                    var processorCount = Environment.ProcessorCount;
                    
                    // Check available memory (rough estimate)
                    var workingSet = Environment.WorkingSet;
                    
                    // High-performance if 4+ cores and 4GB+ memory
                    return processorCount >= 4 && workingSet > 4L * 1024 * 1024 * 1024;
                }
                catch
                {
                    return false;
                }
            }
        }
        
        /// <summary>
        /// Hardware acceleration support
        /// </summary>
        public static class HardwareAcceleration
        {
            /// <summary>
            /// Check if hardware acceleration is available
            /// </summary>
            public static bool IsAvailable()
            {
                try
                {
                    // Check for NVIDIA GPU (rough check)
                    if (CurrentPlatform.IsWindows)
                    {
                        return CheckWindowsGPU();
                    }
                    
                    // Check for Linux GPU support
                    if (CurrentPlatform.IsLinux)
                    {
                        return CheckLinuxGPU();
                    }
                    
                    // macOS Metal support
                    if (CurrentPlatform.IsMacOS)
                    {
                        return CheckMacOSGPU();
                    }
                    
                    return false;
                }
                catch
                {
                    return false;
                }
            }
            
            private static bool CheckWindowsGPU()
            {
                // Simple check - in real implementation would use WMI or DirectX
                return Environment.GetEnvironmentVariable("CUDA_PATH") != null ||
                       Environment.GetEnvironmentVariable("NVIDIA_VISIBLE_DEVICES") != null;
            }
            
            private static bool CheckLinuxGPU()
            {
                // Simple check - in real implementation would check /proc/driver/nvidia
                return Environment.GetEnvironmentVariable("CUDA_VISIBLE_DEVICES") != null ||
                       Environment.GetEnvironmentVariable("NVIDIA_VISIBLE_DEVICES") != null;
            }
            
            private static bool CheckMacOSGPU()
            {
                // macOS has Metal support on most modern systems
                return true;
            }
        }
        
        /// <summary>
        /// Get platform-specific configuration
        /// </summary>
        public static Dictionary<string, object> GetPlatformConfig()
        {
            return new Dictionary<string, object>
            {
                ["Platform"] = CurrentPlatform.PlatformName,
                ["Architecture"] = CurrentPlatform.Architecture,
                ["Framework"] = CurrentPlatform.Framework,
                ["IsDocker"] = CurrentPlatform.IsDocker,
                ["SupportedModels"] = AIModelSupport.GetSupportedModels(),
                ["HardwareAcceleration"] = HardwareAcceleration.IsAvailable(),
                ["SmartTVSupport"] = DeviceSupport.SmartTVSupport,
                ["NASSupport"] = DeviceSupport.NASSupport,
                ["MobileSupport"] = DeviceSupport.MobileSupport,
                ["ProcessorCount"] = Environment.ProcessorCount,
                ["WorkingSet"] = Environment.WorkingSet,
                ["IsHighPerformance"] = AIModelSupport.HasHighPerformanceCapability()
            };
        }
        
        /// <summary>
        /// Initialize platform-specific settings
        /// </summary>
        public static void InitializePlatformSettings(PluginConfiguration config)
        {
            if (config == null) return;
            
            try
            {
                // Enable platform-specific compatibility
                config.EnableWindowsCompatibility = CurrentPlatform.IsWindows;
                config.EnableLinuxCompatibility = CurrentPlatform.IsLinux;
                config.EnableMacOSCompatibility = CurrentPlatform.IsMacOS;
                config.EnableDockerCompatibility = CurrentPlatform.IsDocker;
                config.EnableARMCompatibility = CurrentPlatform.IsARM;
                
                // Set hardware acceleration based on capability
                config.EnableHardwareAcceleration = HardwareAcceleration.IsAvailable();
                
                // Configure AI models based on platform
                config.AvailableAIModels = AIModelSupport.GetSupportedModels();
                
                // Platform-specific optimizations
                if (CurrentPlatform.IsDocker)
                {
                    config.EnableSafeMode = true;
                    config.MaxConcurrentStreams = Math.Min(config.MaxConcurrentStreams, 1);
                }
                
                if (CurrentPlatform.IsARM)
                {
                    config.CacheSizeMB = Math.Min(config.CacheSizeMB, 512);
                    config.MaxConcurrentStreams = Math.Min(config.MaxConcurrentStreams, 1);
                }
            }
            catch (Exception ex)
            {
                ErrorHandler.HandleError(ex, "PlatformCompatibility.InitializePlatformSettings");
            }
        }
    }
}