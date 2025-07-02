using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Controller.Configuration;
using MediaBrowser.Controller.Entities;
using MediaBrowser.Controller.Library;
using MediaBrowser.Controller.MediaEncoding;
using MediaBrowser.Model.IO;
// using System.Management; // Not available in .NET Core
using System.Text.Json;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Core upscaling engine with real AV1 hardware acceleration
    /// </summary>
    public class UpscalerCore
    {
        private readonly ILogger<UpscalerCore> _logger;
        private readonly IMediaEncoder _mediaEncoder;
        private readonly IFileSystem _fileSystem;
        private readonly IApplicationPaths _appPaths;
        private readonly PluginConfiguration _config;
        
        // Hardware detection cache
        private static Dictionary<string, object> _hardwareCache = new();
        private static DateTime _lastHardwareCheck = DateTime.MinValue;
        
        public UpscalerCore(
            ILogger<UpscalerCore> logger,
            IMediaEncoder mediaEncoder,
            IFileSystem fileSystem,
            IApplicationPaths appPaths,
            PluginConfiguration config)
        {
            _logger = logger;
            _mediaEncoder = mediaEncoder;
            _fileSystem = fileSystem;
            _appPaths = appPaths;
            _config = config;
        }

        /// <summary>
        /// Real AV1 hardware detection and optimization
        /// </summary>
        public async Task<HardwareProfile> DetectHardwareAsync()
        {
            // Cache hardware detection for 5 minutes
            if (_hardwareCache.ContainsKey("profile") && 
                DateTime.Now - _lastHardwareCheck < TimeSpan.FromMinutes(5))
            {
                return await Task.FromResult(_hardwareCache["profile"] as HardwareProfile);
            }

            _logger.LogInformation("ðŸ” Detecting hardware capabilities for AV1 support...");
            
            var profile = new HardwareProfile();
            
            try
            {
                // 1. GPU Detection via FFmpeg
                await DetectGpuCapabilities(profile);
                
                // 2. System Resources
                await DetectSystemResources(profile);
                
                // 3. AV1 Encoder Support
                await DetectAV1Support(profile);
                
                // 4. Optimize based on hardware
                ApplyHardwareOptimizations(profile);
                
                _hardwareCache["profile"] = profile;
                _lastHardwareCheck = DateTime.Now;
                
                _logger.LogInformation($"âœ… Hardware Profile: {profile.GpuVendor} {profile.GpuModel}, AV1: {profile.SupportsAV1}");
                
                return await Task.FromResult(profile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "âŒ Hardware detection failed, using fallback profile");
                return GetFallbackProfile();
            }
        }

        /// <summary>
        /// Enhanced GPU detection using multiple methods (FFmpeg + System + Fallback simulation)
        /// </summary>
        private async Task DetectGpuCapabilities(HardwareProfile profile)
        {
            try
            {
                _logger.LogInformation("🔍 Starting enhanced GPU detection...");
                
                // Method 1: Try real FFmpeg hardware enumeration
                var realGpus = await TryDetectRealGPUs();
                if (realGpus != null && realGpus.Count > 0)
                {
                    ApplyRealGPUProfile(profile, realGpus);
                    _logger.LogInformation($"✅ Real GPU detection successful: {realGpus.Count} devices");
                    return;
                }
                
                // Method 2: Try system-level detection
                var systemGpus = await TryDetectSystemGPUs();
                if (systemGpus != null && systemGpus.Count > 0)
                {
                    ApplySystemGPUProfile(profile, systemGpus);
                    _logger.LogInformation($"✅ System GPU detection successful: {systemGpus.Count} devices");
                    return;
                }
                
                // Method 3: Fallback to intelligent simulation (existing method)
                _logger.LogInformation("⚠️ Real detection failed, using intelligent simulation");
                await DetectGpuCapabilitiesSimulated(profile);
                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Enhanced GPU detection failed, using fallback");
                await DetectGpuCapabilitiesSimulated(profile);
            }
        }
        
        /// <summary>
        /// Try to detect real GPUs using FFmpeg
        /// </summary>
        private async Task<List<string>> TryDetectRealGPUs()
        {
            try
            {
                var process = new System.Diagnostics.Process
                {
                    StartInfo = new System.Diagnostics.ProcessStartInfo
                    {
                        FileName = "ffmpeg",
                        Arguments = "-f lavfi -i testsrc2=duration=1:size=320x240:rate=1 -f null -",
                        UseShellExecute = false,
                        RedirectStandardError = true,
                        CreateNoWindow = true
                    }
                };
                
                process.Start();
                var output = await process.StandardError.ReadToEndAsync();
                await process.WaitForExitAsync();
                
                var gpus = new List<string>();
                if (output.Contains("cuda"))
                    gpus.Add("NVIDIA CUDA");
                if (output.Contains("dxva2"))
                    gpus.Add("DirectX Video Acceleration");
                if (output.Contains("qsv"))
                    gpus.Add("Intel Quick Sync");
                if (output.Contains("vaapi"))
                    gpus.Add("VA-API");
                
                return gpus;
            }
            catch
            {
                return null;
            }
        }
        
        /// <summary>
        /// Try to detect GPUs using system queries
        /// </summary>
        private async Task<List<string>> TryDetectSystemGPUs()
        {
            try
            {
                var gpus = new List<string>();
                
                // Windows: Try WMI query
                if (Environment.OSVersion.Platform == PlatformID.Win32NT)
                {
                    var process = new System.Diagnostics.Process
                    {
                        StartInfo = new System.Diagnostics.ProcessStartInfo
                        {
                            FileName = "wmic",
                            Arguments = "path win32_VideoController get name",
                            UseShellExecute = false,
                            RedirectStandardOutput = true,
                            CreateNoWindow = true
                        }
                    };
                    
                    process.Start();
                    var output = await process.StandardOutput.ReadToEndAsync();
                    await process.WaitForExitAsync();
                    
                    var lines = output.Split('\n');
                    foreach (var line in lines)
                    {
                        var trimmed = line.Trim();
                        if (!string.IsNullOrEmpty(trimmed) && !trimmed.Equals("Name", StringComparison.OrdinalIgnoreCase))
                        {
                            gpus.Add(trimmed);
                        }
                    }
                }
                // Linux: Try lspci
                else if (Environment.OSVersion.Platform == PlatformID.Unix)
                {
                    var process = new System.Diagnostics.Process
                    {
                        StartInfo = new System.Diagnostics.ProcessStartInfo
                        {
                            FileName = "lspci",
                            Arguments = "-mm",
                            UseShellExecute = false,
                            RedirectStandardOutput = true,
                            CreateNoWindow = true
                        }
                    };
                    
                    process.Start();
                    var output = await process.StandardOutput.ReadToEndAsync();
                    await process.WaitForExitAsync();
                    
                    var lines = output.Split('\n');
                    foreach (var line in lines)
                    {
                        if (line.Contains("VGA") || line.Contains("3D"))
                        {
                            gpus.Add(line);
                        }
                    }
                }
                
                return gpus.Count > 0 ? gpus : null;
            }
            catch
            {
                return null;
            }
        }
        
        /// <summary>
        /// Apply real GPU detection results to profile
        /// </summary>
        private void ApplyRealGPUProfile(HardwareProfile profile, List<string> gpus)
        {
            foreach (var gpu in gpus)
            {
                if (gpu.Contains("NVIDIA") || gpu.Contains("CUDA"))
                {
                    profile.GpuVendor = "NVIDIA";
                    profile.SupportsNVENC = true;
                    profile.SupportsAV1 = true;
                }
                else if (gpu.Contains("AMD") || gpu.Contains("Radeon"))
                {
                    profile.GpuVendor = "AMD";
                    profile.SupportsVCE = true;
                    profile.SupportsAV1 = true;
                }
                else if (gpu.Contains("Intel") || gpu.Contains("QSV"))
                {
                    profile.GpuVendor = "Intel";
                    profile.SupportsQuickSync = true;
                    profile.SupportsAV1 = true;
                }
            }
        }
        
        /// <summary>
        /// Apply system GPU detection results to profile
        /// </summary>
        private void ApplySystemGPUProfile(HardwareProfile profile, List<string> gpus)
        {
            profile.GpuModel = string.Join(", ", gpus.Take(3));
            
            foreach (var gpu in gpus)
            {
                var gpuLower = gpu.ToLower();
                if (gpuLower.Contains("nvidia") || gpuLower.Contains("geforce") || gpuLower.Contains("rtx"))
                {
                    profile.GpuVendor = "NVIDIA";
                    profile.SupportsNVENC = true;
                    profile.SupportsAV1 = gpuLower.Contains("rtx") || gpuLower.Contains("40");
                }
                else if (gpuLower.Contains("amd") || gpuLower.Contains("radeon"))
                {
                    profile.GpuVendor = "AMD";
                    profile.SupportsVCE = true;
                    profile.SupportsAV1 = gpuLower.Contains("rx 7") || gpuLower.Contains("rx 6");
                }
                else if (gpuLower.Contains("intel"))
                {
                    profile.GpuVendor = "Intel";
                    profile.SupportsQuickSync = true;
                    profile.SupportsAV1 = gpuLower.Contains("arc") || gpuLower.Contains("xe");
                }
            }
        }
        
        /// <summary>
        /// Fallback simulated GPU detection (preserves original logic)
        /// </summary>
        private async Task DetectGpuCapabilitiesSimulated(HardwareProfile profile)
        {
            try
            {
                // Original FFmpeg hardware enumeration (preserved)
                var ffmpegPath = _mediaEncoder.EncoderPath;
                var processInfo = new ProcessStartInfo
                {
                    FileName = ffmpegPath,
                    Arguments = "-hide_banner -hwaccels",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                };

                using var process = Process.Start(processInfo);
                var output = await process.StandardOutput.ReadToEndAsync();
                var error = await process.StandardError.ReadToEndAsync();
                
                profile.AvailableHwAccels = output.Split('\n')
                    .Where(line => !string.IsNullOrWhiteSpace(line) && !line.Contains("Hardware"))
                    .Select(line => line.Trim())
                    .ToList();

                // Detect specific GPU vendors
                if (profile.AvailableHwAccels.Any(h => h.Contains("cuda") || h.Contains("nvenc")))
                {
                    profile.GpuVendor = "NVIDIA";
                    await DetectNvidiaGpu(profile);
                }
                else if (profile.AvailableHwAccels.Any(h => h.Contains("qsv")))
                {
                    profile.GpuVendor = "Intel";
                    await DetectIntelGpu(profile);
                }
                else if (profile.AvailableHwAccels.Any(h => h.Contains("vaapi") || h.Contains("amf")))
                {
                    profile.GpuVendor = "AMD";
                    await DetectAmdGpu(profile);
                }

                _logger.LogInformation($"ðŸ“Š Detected GPU: {profile.GpuVendor} {profile.GpuModel}");
                _logger.LogInformation($"ðŸ”§ Available HW Accels: {string.Join(", ", profile.AvailableHwAccels)}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "âš ï¸ GPU detection via FFmpeg failed");
            }
        }

        /// <summary>
        /// NVIDIA GPU specific detection with AV1 capabilities
        /// </summary>
        private async Task DetectNvidiaGpu(HardwareProfile profile)
        {
            try
            {
                // Try nvidia-smi for detailed info
                var nvidiaSmiPath = FindNvidiaSmi();
                if (!string.IsNullOrEmpty(nvidiaSmiPath))
                {
                    var processInfo = new ProcessStartInfo
                    {
                        FileName = nvidiaSmiPath,
                        Arguments = "--query-gpu=name,driver_version,memory.total --format=csv,noheader,nounits",
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        CreateNoWindow = true
                    };

                    using var process = Process.Start(processInfo);
                    var output = await process.StandardOutput.ReadToEndAsync();
                    
                    if (!string.IsNullOrEmpty(output))
                    {
                        var parts = output.Trim().Split(',');
                        if (parts.Length >= 3)
                        {
                            profile.GpuModel = parts[0].Trim();
                            profile.DriverVersion = parts[1].Trim();
                            profile.VramMB = int.TryParse(parts[2].Trim(), out var vram) ? vram : 0;
                        }
                    }
                }

                // Check for AV1 support (RTX 3000+ series)
                if (profile.GpuModel.Contains("RTX 30") || profile.GpuModel.Contains("RTX 40") || 
                    profile.GpuModel.Contains("RTX 50") || profile.GpuModel.Contains("A4000") ||
                    profile.GpuModel.Contains("A5000") || profile.GpuModel.Contains("A6000"))
                {
                    profile.SupportsAV1 = true;
                    profile.Av1Encoder = "nvenc_av1";
                    profile.Av1Decoder = "av1_cuvid";
                    profile.MaxAV1Resolution = "4K";
                    
                    _logger.LogInformation($"ðŸ”¥ NVIDIA AV1 Hardware Support Detected: {profile.GpuModel}");
                }
                else
                {
                    _logger.LogInformation($"â„¹ï¸ NVIDIA GPU without AV1 support: {profile.GpuModel}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "âš ï¸ NVIDIA specific detection failed");
            }
        }

        /// <summary>
        /// Intel GPU detection with Arc AV1 support
        /// </summary>
        private async Task DetectIntelGpu(HardwareProfile profile)
        {
            try
            {
                // Intel Arc detection
                profile.GpuVendor = "Intel";
                
                // Check for Intel Arc AV1 support
                var ffmpegPath = _mediaEncoder.EncoderPath;
                var processInfo = new ProcessStartInfo
                {
                    FileName = ffmpegPath,
                    Arguments = "-hide_banner -encoders | findstr av1",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    CreateNoWindow = true
                };

                using var process = Process.Start(processInfo);
                var output = await process.StandardOutput.ReadToEndAsync();
                
                if (output.Contains("av1_qsv"))
                {
                    profile.SupportsAV1 = true;
                    profile.Av1Encoder = "av1_qsv";
                    profile.Av1Decoder = "av1_qsv";
                    profile.MaxAV1Resolution = "4K";
                    profile.GpuModel = "Intel Arc (AV1 Capable)";
                    
                    _logger.LogInformation($"ðŸ”¥ Intel Arc AV1 Hardware Support Detected!");
                }
                else
                {
                    profile.GpuModel = "Intel Graphics (No AV1)";
                    _logger.LogInformation($"â„¹ï¸ Intel GPU without AV1 support");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "âš ï¸ Intel GPU detection failed");
            }
        }

        /// <summary>
        /// AMD GPU detection with RX 7000 AV1 support  
        /// </summary>
        private async Task DetectAmdGpu(HardwareProfile profile)
        {
            try
            {
                profile.GpuVendor = "AMD";
                
                // AMD RX 7000 series has AV1 support
                var ffmpegPath = _mediaEncoder.EncoderPath;
                var processInfo = new ProcessStartInfo
                {
                    FileName = ffmpegPath,
                    Arguments = "-hide_banner -encoders | findstr av1",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    CreateNoWindow = true
                };

                using var process = Process.Start(processInfo);
                var output = await process.StandardOutput.ReadToEndAsync();
                
                if (output.Contains("av1_vaapi") || output.Contains("av1_amf"))
                {
                    profile.SupportsAV1 = true;
                    profile.Av1Encoder = output.Contains("av1_amf") ? "av1_amf" : "av1_vaapi";
                    profile.Av1Decoder = "av1_vaapi";
                    profile.MaxAV1Resolution = "4K";
                    profile.GpuModel = "AMD RX 7000+ (AV1 Capable)";
                    
                    _logger.LogInformation($"ðŸ”¥ AMD AV1 Hardware Support Detected!");
                }
                else
                {
                    profile.GpuModel = "AMD Graphics (No AV1)";
                    _logger.LogInformation($"â„¹ï¸ AMD GPU without AV1 support");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "âš ï¸ AMD GPU detection failed");
            }
        }

        /// <summary>
        /// Detect system resources (RAM, CPU, etc.)
        /// </summary>
        private async Task DetectSystemResources(HardwareProfile profile)
        {
            try
            {
                // RAM Detection
                var totalRam = await Task.Run(() => GC.GetTotalMemory(false));
                profile.SystemRamMB = (int)(totalRam / 1024 / 1024);
                
                // CPU Detection
                profile.CpuCores = Environment.ProcessorCount;
                
                // Disk space for temp files
                var tempPath = Path.GetTempPath();
                var driveInfo = new DriveInfo(Path.GetPathRoot(tempPath));
                profile.TempDiskSpaceGB = (int)(driveInfo.AvailableFreeSpace / 1024 / 1024 / 1024);
                
                _logger.LogInformation($"ðŸ’¾ System: {profile.SystemRamMB}MB RAM, {profile.CpuCores} CPU cores, {profile.TempDiskSpaceGB}GB temp space");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "âš ï¸ System resource detection failed");
            }
        }

        /// <summary>
        /// Test actual AV1 encoding capability
        /// </summary>
        private async Task DetectAV1Support(HardwareProfile profile)
        {
            if (!profile.SupportsAV1) 
            {
                await Task.CompletedTask;
                return;
            }
            
            try
            {
                _logger.LogInformation("ðŸ§ª Testing AV1 encoding capability...");
                
                // Create test video (1 second, 256x256)
                var testInput = Path.Combine(Path.GetTempPath(), "av1_test_input.mp4");
                var testOutput = Path.Combine(Path.GetTempPath(), "av1_test_output.av1");
                
                // Generate test input
                await GenerateTestVideo(testInput);
                
                // Test AV1 encoding
                var ffmpegPath = _mediaEncoder.EncoderPath;
                var arguments = $"-y -i \"{testInput}\" -c:v {profile.Av1Encoder} -preset fast -crf 30 -t 1 \"{testOutput}\"";
                
                var processInfo = new ProcessStartInfo
                {
                    FileName = ffmpegPath,
                    Arguments = arguments,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                };

                using var process = Process.Start(processInfo);
                await process.WaitForExitAsync();
                
                if (process.ExitCode == 0 && File.Exists(testOutput))
                {
                    profile.Av1TestPassed = true;
                    _logger.LogInformation("âœ… AV1 encoding test successful!");
                }
                else
                {
                    profile.Av1TestPassed = false;
                    profile.SupportsAV1 = false;
                    _logger.LogWarning("âŒ AV1 encoding test failed, disabling AV1 support");
                }
                
                // Cleanup
                File.Delete(testInput);
                File.Delete(testOutput);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "âš ï¸ AV1 capability test failed");
                profile.Av1TestPassed = false;
            }
        }

        /// <summary>
        /// Apply hardware-specific optimizations
        /// </summary>
        private void ApplyHardwareOptimizations(HardwareProfile profile)
        {
            // Light Mode for weak systems
            if (profile.SystemRamMB < 8192 || profile.VramMB < 4096)
            {
                profile.LightModeRecommended = true;
                profile.MaxConcurrentStreams = 1;
                profile.RecommendedPreset = "fast";
                _logger.LogInformation("ðŸ’¡ Light Mode recommended for this system");
            }
            else if (profile.SupportsAV1 && profile.VramMB >= 8192)
            {
                profile.MaxConcurrentStreams = 4;
                profile.RecommendedPreset = "medium";
                profile.OptimalResolution = "4K";
                _logger.LogInformation("ðŸš€ High-performance mode available");
            }
            else
            {
                profile.MaxConcurrentStreams = 2;
                profile.RecommendedPreset = "fast";
                profile.OptimalResolution = "1440p";
            }

            // Mobile detection (simple heuristic)
            try
            {
                // Simple mobile detection based on available memory and CPU cores
                if (profile.SystemRamMB < 4096 && profile.CpuCores <= 4)
                {
                    profile.IsMobile = true;
                    profile.BatteryOptimization = true;
                    _logger.LogInformation("ðŸ“± Mobile device detected (low RAM/CPU), enabling battery optimization");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "âš ï¸ Mobile detection failed, assuming desktop");
            }
        }

        /// <summary>
        /// Generate test video for capability testing
        /// </summary>
        private async Task GenerateTestVideo(string outputPath)
        {
            var ffmpegPath = _mediaEncoder.EncoderPath;
            var arguments = $"-f lavfi -i testsrc=duration=1:size=256x256:rate=24 -c:v libx264 -preset ultrafast \"{outputPath}\"";
            
            var processInfo = new ProcessStartInfo
            {
                FileName = ffmpegPath,
                Arguments = arguments,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(processInfo);
            await process.WaitForExitAsync();
        }

        /// <summary>
        /// Find nvidia-smi executable
        /// </summary>
        private string FindNvidiaSmi()
        {
            var possiblePaths = new[]
            {
                @"C:\Program Files\NVIDIA Corporation\NVSMI\nvidia-smi.exe",
                @"C:\Windows\System32\nvidia-smi.exe",
                @"/usr/bin/nvidia-smi",
                @"/usr/local/bin/nvidia-smi"
            };

            return possiblePaths.FirstOrDefault(File.Exists);
        }

        /// <summary>
        /// Fallback profile for unknown hardware
        /// </summary>
        private HardwareProfile GetFallbackProfile()
        {
            return new HardwareProfile
            {
                GpuVendor = "Unknown",
                GpuModel = "Generic GPU",
                SupportsAV1 = false,
                Av1Encoder = "libsvtav1", // Software fallback
                LightModeRecommended = true,
                MaxConcurrentStreams = 1,
                RecommendedPreset = "fast",
                OptimalResolution = "1080p"
            };
        }
    }
}
