using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MediaBrowser.Controller.MediaEncoding;
using MediaBrowser.Controller.Configuration;
// using MediaBrowser.Model.Services; // Not needed for ASP.NET Core
using System.Text.Json;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// API Controller for real AV1 upscaling functionality
    /// Provides endpoints for hardware detection, video processing, and settings management
    /// </summary>
    [ApiController]
    [Route("api/upscaler")]
    public class UpscalerApiController : ControllerBase
    {
        private readonly ILogger<UpscalerApiController> _logger;
        private readonly IMediaEncoder _mediaEncoder;
        private readonly IServerConfigurationManager _config;
        private readonly UpscalerCore _upscalerCore;
        private readonly AV1VideoProcessor _videoProcessor;
        
        public UpscalerApiController(
            ILogger<UpscalerApiController> logger,
            IMediaEncoder mediaEncoder,
            IServerConfigurationManager config,
            UpscalerCore upscalerCore,
            AV1VideoProcessor videoProcessor)
        {
            _logger = logger;
            _mediaEncoder = mediaEncoder;
            _config = config;
            _upscalerCore = upscalerCore;
            _videoProcessor = videoProcessor;
        }

        /// <summary>
        /// Get current hardware capabilities and AV1 support
        /// </summary>
        [HttpGet("hardware")]
        public async Task<ActionResult<HardwareProfileResponse>> GetHardwareProfile()
        {
            try
            {
                _logger.LogInformation("🔍 API: Hardware profile requested");
                
                var profile = await _upscalerCore.DetectHardwareAsync();
                
                var response = new HardwareProfileResponse
                {
                    SupportsAV1 = profile.SupportsAV1,
                    GpuVendor = profile.GpuVendor,
                    GpuModel = profile.GpuModel,
                    MaxResolution = profile.MaxAV1Resolution,
                    Encoder = profile.Av1Encoder,
                    VramMB = profile.VramMB,
                    SystemRamMB = profile.SystemRamMB,
                    LightModeRecommended = profile.LightModeRecommended,
                    IsMobile = profile.IsMobile,
                    MaxConcurrentStreams = profile.MaxConcurrentStreams,
                    RecommendedPreset = profile.RecommendedPreset,
                    AvailableEncoders = profile.AvailableHwAccels,
                    LastDetection = profile.LastDetection
                };
                
                _logger.LogInformation($"✅ API: Hardware profile returned - {profile.GpuVendor} {profile.GpuModel}, AV1: {profile.SupportsAV1}");
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ API: Hardware detection failed");
                return StatusCode(500, new { Error = "Hardware detection failed", Details = ex.Message });
            }
        }

        /// <summary>
        /// Process video with AV1 upscaling
        /// </summary>
        [HttpPost("process")]
        public async Task<ActionResult<ProcessingResponse>> ProcessVideo([FromBody] ProcessingRequest request)
        {
            try
            {
                _logger.LogInformation($"🚀 API: Processing request for item {request.ItemId}");
                
                // Validate request
                if (string.IsNullOrEmpty(request.ItemId) || string.IsNullOrEmpty(request.MediaSourceId))
                {
                    return BadRequest(new { Error = "Missing required parameters" });
                }
                
                // Get video processing options from request
                var options = new VideoProcessingOptions
                {
                    VideoCodec = GetCodecFromSettings(request.Settings),
                    UseHardwareAcceleration = request.Settings.HardwareAccel,
                    CRF = request.Settings.Profile switch
                    {
                        "gaming" => 20,
                        "movies" => 22,
                        "tv" => 25,
                        _ => 23
                    },
                    Preset = request.HardwareProfile.LightModeRecommended ? "fast" : "medium",
                    MaxWidth = GetMaxWidth(request.Settings.Resolution),
                    MaxHeight = GetMaxHeight(request.Settings.Resolution),
                    Sharpening = request.Settings.Sharpness,
                    UpscaleFactor = CalculateUpscaleFactor(request.Settings)
                };
                
                // Construct file paths (this would normally come from Jellyfin's media info)
                var mediaPath = GetMediaPath(request.ItemId, request.MediaSourceId);
                var outputPath = GetOutputPath(request.ItemId, options);
                
                // Process the video
                var result = await _videoProcessor.ProcessVideoAsync(mediaPath, outputPath, options);
                
                var response = new ProcessingResponse
                {
                    Success = result.Success,
                    Method = options.VideoCodec,
                    ProcessingTime = result.ProcessingTime,
                    OutputSize = result.OutputSize,
                    Error = result.Error,
                    NewStreamUrl = result.Success ? GetStreamUrl(outputPath) : null
                };
                
                if (result.Success)
                {
                    _logger.LogInformation($"✅ API: Processing completed successfully in {result.ProcessingTime.TotalSeconds:F1}s");
                }
                else
                {
                    _logger.LogWarning($"❌ API: Processing failed - {result.Error}");
                }
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ API: Video processing failed");
                return StatusCode(500, new { Error = "Video processing failed", Details = ex.Message });
            }
        }

        /// <summary>
        /// Get current processing statistics
        /// </summary>
        [HttpGet("stats")]
        public ActionResult<ProcessingStatisticsResponse> GetStatistics()
        {
            try
            {
                var stats = _videoProcessor.GetStatistics();
                
                var response = new ProcessingStatisticsResponse
                {
                    ActiveJobs = stats.ActiveJobs,
                    QueuedJobs = stats.QueuedJobs,
                    TotalProcessed = stats.TotalJobsProcessed,
                    AverageProcessingTime = stats.AverageProcessingTime,
                    ServerUptime = DateTime.Now - DateTime.Today, // Simplified
                    MemoryUsage = GC.GetTotalMemory(false) / 1024 / 1024 // MB
                };
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ API: Failed to get statistics");
                return StatusCode(500, new { Error = "Failed to get statistics", Details = ex.Message });
            }
        }

        /// <summary>
        /// Test AV1 encoding capability
        /// </summary>
        [HttpPost("test-av1")]
        public async Task<ActionResult<AV1TestResponse>> TestAV1Encoding()
        {
            try
            {
                _logger.LogInformation("🧪 API: AV1 capability test requested");
                
                var hardwareProfile = await _upscalerCore.DetectHardwareAsync();
                
                var testResult = new AV1TestResponse
                {
                    SupportsAV1 = hardwareProfile.SupportsAV1,
                    Encoder = hardwareProfile.Av1Encoder,
                    TestPassed = hardwareProfile.Av1TestPassed,
                    GpuInfo = $"{hardwareProfile.GpuVendor} {hardwareProfile.GpuModel}",
                    MaxResolution = hardwareProfile.MaxAV1Resolution,
                    RecommendedSettings = new Dictionary<string, object>
                    {
                        { "crf", hardwareProfile.LightModeRecommended ? 28 : 23 },
                        { "preset", hardwareProfile.LightModeRecommended ? "fast" : "medium" },
                        { "max_resolution", hardwareProfile.MaxAV1Resolution },
                        { "concurrent_streams", hardwareProfile.MaxConcurrentStreams }
                    }
                };
                
                _logger.LogInformation($"✅ API: AV1 test completed - Support: {hardwareProfile.SupportsAV1}");
                
                return Ok(testResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ API: AV1 test failed");
                return StatusCode(500, new { Error = "AV1 test failed", Details = ex.Message });
            }
        }

        /// <summary>
        /// Get available presets
        /// </summary>
        [HttpGet("presets")]
        public ActionResult<PresetResponse> GetPresets()
        {
            var presets = new PresetResponse
            {
                Presets = new Dictionary<string, PresetInfo>
                {
                    ["gaming"] = new PresetInfo
                    {
                        Name = "Gaming",
                        Description = "4K AV1 optimization for gaming content",
                        Resolution = "4K",
                        Codec = "AV1",
                        Sharpness = 75,
                        HDR = "HDR10",
                        Audio = "7.1"
                    },
                    ["apple"] = new PresetInfo
                    {
                        Name = "Apple TV",
                        Description = "4K Dolby Vision for Apple devices",
                        Resolution = "4K",
                        Codec = "Auto",
                        Sharpness = 60,
                        HDR = "Dolby Vision",
                        Audio = "5.1"
                    },
                    ["mobile"] = new PresetInfo
                    {
                        Name = "Mobile",
                        Description = "Battery-optimized H.264",
                        Resolution = "1080p",
                        Codec = "H.264",
                        Sharpness = 40,
                        HDR = "SDR",
                        Audio = "Stereo"
                    },
                    ["server"] = new PresetInfo
                    {
                        Name = "Server",
                        Description = "1440p HEVC for server streaming",
                        Resolution = "1440p",
                        Codec = "HEVC",
                        Sharpness = 50,
                        HDR = "Auto",
                        Audio = "Passthrough"
                    }
                }
            };
            
            return Ok(presets);
        }

        /// <summary>
        /// Get plugin configuration
        /// </summary>
        [HttpGet("config")]
        public ActionResult<PluginConfiguration> GetConfiguration()
        {
            var config = Plugin.Instance?.Configuration;
            return Ok(config);
        }

        /// <summary>
        /// Update plugin configuration
        /// </summary>
        [HttpPost("config")]
        public ActionResult UpdateConfiguration([FromBody] PluginConfiguration config)
        {
            try
            {
                Plugin.Instance.UpdateConfiguration(config);
                _logger.LogInformation("✅ API: Configuration updated");
                return Ok(new { Success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ API: Configuration update failed");
                return StatusCode(500, new { Error = "Configuration update failed", Details = ex.Message });
            }
        }

        // Helper methods
        private string GetCodecFromSettings(UpscalerSettings settings)
        {
            return settings.Av1Transcode switch
            {
                "force-av1" => "av1_nvenc",
                "force-hevc" => "hevc_nvenc",
                "force-h264" => "h264_nvenc",
                _ => "auto"
            };
        }

        private int GetMaxWidth(string resolution)
        {
            return resolution switch
            {
                "4k" => 3840,
                "1440p" => 2560,
                "1080p" => 1920,
                "720p" => 1280,
                _ => 1920
            };
        }

        private int GetMaxHeight(string resolution)
        {
            return resolution switch
            {
                "4k" => 2160,
                "1440p" => 1440,
                "1080p" => 1080,
                "720p" => 720,
                _ => 1080
            };
        }

        private int CalculateUpscaleFactor(UpscalerSettings settings)
        {
            // This would be calculated based on input vs target resolution
            return settings.Resolution switch
            {
                "4k" => 2,
                "1440p" => 1,
                _ => 1
            };
        }

        private string GetMediaPath(string itemId, string mediaSourceId)
        {
            // In a real implementation, this would query Jellyfin's database
            // for the actual file path of the media item
            return $"/media/{itemId}/{mediaSourceId}.mkv";
        }

        private string GetOutputPath(string itemId, VideoProcessingOptions options)
        {
            var outputDir = Path.Combine(_config.ApplicationPaths.TempDirectory, "upscaler");
            Directory.CreateDirectory(outputDir);
            
            var fileName = $"{itemId}_{options.VideoCodec}_{options.MaxWidth}x{options.MaxHeight}.mp4";
            return Path.Combine(outputDir, fileName);
        }

        private string GetStreamUrl(string filePath)
        {
            // Generate streaming URL for the processed file
            var fileName = Path.GetFileName(filePath);
            return $"/videos/upscaled/{fileName}";
        }
    }

    // API Request/Response Models
    public class ProcessingRequest
    {
        public string ItemId { get; set; }
        public string MediaSourceId { get; set; }
        public UpscalerSettings Settings { get; set; }
        public HardwareProfileRequest HardwareProfile { get; set; }
    }

    public class UpscalerSettings
    {
        public string Profile { get; set; }
        public string Resolution { get; set; }
        public int Sharpness { get; set; }
        public string Av1Transcode { get; set; }
        public string HdrMode { get; set; }
        public string AudioMode { get; set; }
        public bool Enabled { get; set; }
        public bool HardwareAccel { get; set; }
        public bool BatteryMode { get; set; }
    }

    public class HardwareProfileRequest
    {
        public bool SupportsAV1 { get; set; }
        public string GpuVendor { get; set; }
        public bool LightModeRecommended { get; set; }
        public bool IsMobile { get; set; }
    }

    public class HardwareProfileResponse
    {
        public bool SupportsAV1 { get; set; }
        public string GpuVendor { get; set; }
        public string GpuModel { get; set; }
        public string MaxResolution { get; set; }
        public string Encoder { get; set; }
        public int VramMB { get; set; }
        public int SystemRamMB { get; set; }
        public bool LightModeRecommended { get; set; }
        public bool IsMobile { get; set; }
        public int MaxConcurrentStreams { get; set; }
        public string RecommendedPreset { get; set; }
        public List<string> AvailableEncoders { get; set; }
        public DateTime LastDetection { get; set; }
    }

    public class ProcessingResponse
    {
        public bool Success { get; set; }
        public string Method { get; set; }
        public TimeSpan ProcessingTime { get; set; }
        public long OutputSize { get; set; }
        public string Error { get; set; }
        public string NewStreamUrl { get; set; }
    }

    public class ProcessingStatisticsResponse
    {
        public int ActiveJobs { get; set; }
        public int QueuedJobs { get; set; }
        public int TotalProcessed { get; set; }
        public double AverageProcessingTime { get; set; }
        public TimeSpan ServerUptime { get; set; }
        public long MemoryUsage { get; set; }
    }

    public class AV1TestResponse
    {
        public bool SupportsAV1 { get; set; }
        public string Encoder { get; set; }
        public bool TestPassed { get; set; }
        public string GpuInfo { get; set; }
        public string MaxResolution { get; set; }
        public Dictionary<string, object> RecommendedSettings { get; set; }
    }

    public class PresetResponse
    {
        public Dictionary<string, PresetInfo> Presets { get; set; }
    }

    public class PresetInfo
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Resolution { get; set; }
        public string Codec { get; set; }
        public int Sharpness { get; set; }
        public string HDR { get; set; }
        public string Audio { get; set; }
    }
}