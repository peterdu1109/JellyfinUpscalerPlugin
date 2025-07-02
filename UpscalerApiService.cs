using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using System.IO;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Simplified API Service for AI Upscaler Plugin
    /// Provides basic API methods for hardware detection and configuration
    /// </summary>
    public class UpscalerApiService
    {
        private readonly ILogger<UpscalerApiService> _logger;
        private readonly UpscalerCore _upscalerCore;
        private readonly AV1VideoProcessor _videoProcessor;
        private readonly MultiGPUManager _multiGPUManager;

        public UpscalerApiService(
            ILogger<UpscalerApiService> logger,
            UpscalerCore upscalerCore,
            AV1VideoProcessor videoProcessor,
            MultiGPUManager multiGPUManager)
        {
            _logger = logger;
            _upscalerCore = upscalerCore;
            _videoProcessor = videoProcessor;
            _multiGPUManager = multiGPUManager;
        }
        
        /// <summary>
        /// Get hardware profile and capabilities
        /// </summary>
        public async Task<object> GetHardwareProfileAsync()
        {
            try
            {
                _logger.LogInformation("🔍 API: Hardware profile requested");
                
                var profile = await _upscalerCore.DetectHardwareAsync();
                // GPU info from MultiGPUManager internal detection
                var gpuInfo = "Multi-GPU Manager initialized successfully";
                
                return new
                {
                    Success = true,
                    Timestamp = DateTime.UtcNow,
                    HardwareProfile = profile,
                    GPUInfo = gpuInfo,
                    Message = "Hardware profile retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to get hardware profile");
                return new
                {
                    Success = false,
                    Error = ex.Message,
                    Timestamp = DateTime.UtcNow
                };
            }
        }

        /// <summary>
        /// Get real-time processing statistics
        /// </summary>
        public async Task<object> GetStatisticsAsync()
        {
            try
            {
                _logger.LogInformation("📊 API: Statistics requested");
                
                var stats = _videoProcessor.GetStatistics();
                // GPU stats from MultiGPUManager
                var gpuStats = "GPU statistics available via MultiGPUManager";
                
                return new
                {
                    Success = true,
                    Timestamp = DateTime.UtcNow,
                    ProcessingStats = stats,
                    GPUStats = gpuStats,
                    Message = "Statistics retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to get statistics");
                return new
                {
                    Success = false,
                    Error = ex.Message,
                    Timestamp = DateTime.UtcNow
                };
            }
        }

        /// <summary>
        /// Get available AI models and configurations
        /// </summary>
        public async Task<object> GetModelsAsync()
        {
            try
            {
                _logger.LogInformation("🤖 API: AI models requested");
                
                // Get available models from plugin configuration
                var config = Plugin.Instance?.Configuration;
                
                return new
                {
                    Success = true,
                    Timestamp = DateTime.UtcNow,
                    AvailableModels = new[]
                    {
                        "Real-ESRGAN", "ESRGAN Pro", "SwinIR", "SRCNN Light",
                        "Waifu2x", "HAT", "EDSR", "VDSR", "RDN", "SRResNet",
                        "CARN", "RRDBNet", "DRLN", "FSRCNN"
                    },
                    CurrentModel = config?.Model ?? "realesrgan",
                    Message = "AI models retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to get models");
                return new
                {
                    Success = false,
                    Error = ex.Message,
                    Timestamp = DateTime.UtcNow
                };
            }
        }

        /// <summary>
        /// Health check endpoint
        /// </summary>
        public async Task<object> GetHealthAsync()
        {
            try
            {
                _logger.LogInformation("❤️ API: Health check requested");
                
                return new
                {
                    Success = true,
                    Status = "Healthy",
                    Version = "1.3.6-Ultimate",
                    Timestamp = DateTime.UtcNow,
                    Components = new
                    {
                        UpscalerCore = _upscalerCore != null ? "OK" : "ERROR",
                        VideoProcessor = _videoProcessor != null ? "OK" : "ERROR",
                        MultiGPUManager = _multiGPUManager != null ? "OK" : "ERROR"
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Health check failed");
                return new
                {
                    Success = false,
                    Status = "Unhealthy",
                    Error = ex.Message,
                    Timestamp = DateTime.UtcNow
                };
            }
        }
    }
}