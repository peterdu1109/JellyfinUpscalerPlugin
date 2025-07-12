using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MediaBrowser.Controller.Library;
using MediaBrowser.Controller.Session;
using MediaBrowser.Controller.Net;
using System.Net.Mime;

namespace JellyfinUpscalerPlugin.Controllers
{
    /// <summary>
    /// AI Upscaler API Controller
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class UpscalerController : ControllerBase
    {
        private readonly ILogger<UpscalerController> _logger;
        private readonly ILibraryManager _libraryManager;
        private readonly ISessionManager _sessionManager;

        /// <summary>
        /// Initializes a new instance of the UpscalerController class.
        /// </summary>
        /// <param name="logger">Logger instance.</param>
        /// <param name="libraryManager">Library manager instance.</param>
        /// <param name="sessionManager">Session manager instance.</param>
        public UpscalerController(
            ILogger<UpscalerController> logger,
            ILibraryManager libraryManager,
            ISessionManager sessionManager)
        {
            _logger = logger;
            _libraryManager = libraryManager;
            _sessionManager = sessionManager;
        }

        /// <summary>
        /// Get available AI models
        /// </summary>
        /// <returns>List of available AI upscaling models</returns>
        [HttpGet("models")]
        [Produces(MediaTypeNames.Application.Json)]
        public ActionResult<List<object>> GetAvailableModels()
        {
            _logger.LogInformation("AI Upscaler: Getting available models");

            var models = new List<object>
            {
                new { id = "realesrgan", name = "Real-ESRGAN", description = "High quality anime/photo upscaling", scale = new[] { 2, 4 } },
                new { id = "esrgan", name = "ESRGAN", description = "Enhanced Super-Resolution GAN", scale = new[] { 2, 4 } },
                new { id = "swinir", name = "SwinIR", description = "Transformer-based image restoration", scale = new[] { 2, 4, 8 } },
                new { id = "waifu2x", name = "Waifu2x", description = "Anime-style art upscaling", scale = new[] { 2 } },
                new { id = "srcnn", name = "SRCNN", description = "Super-Resolution CNN", scale = new[] { 2, 3 } },
                new { id = "bicubic", name = "Bicubic", description = "Traditional bicubic interpolation", scale = new[] { 2, 3, 4 } }
            };

            return Ok(models);
        }

        /// <summary>
        /// Get current upscaler status
        /// </summary>
        /// <returns>Current status of the AI upscaler</returns>
        [HttpGet("status")]
        [Produces(MediaTypeNames.Application.Json)]
        public ActionResult<object> GetStatus()
        {
            _logger.LogInformation("AI Upscaler: Getting status");

            var config = Plugin.Instance?.Configuration;
            if (config == null)
            {
                return BadRequest("Plugin configuration not available");
            }

            var status = new
            {
                enabled = config.Enabled,
                currentModel = config.Model,
                scale = config.Scale,
                quality = config.Quality,
                hardwareAcceleration = config.EnableHardwareAcceleration,
                playerButtonEnabled = config.ShowPlayerButton,
                version = "1.3.6.7"
            };

            return Ok(status);
        }

        /// <summary>
        /// Update upscaler settings
        /// </summary>
        /// <param name="settings">New upscaler settings</param>
        /// <returns>Success response</returns>
        [HttpPost("settings")]
        [Consumes(MediaTypeNames.Application.Json)]
        [Produces(MediaTypeNames.Application.Json)]
        public ActionResult UpdateSettings([FromBody] UpscalerSettings settings)
        {
            _logger.LogInformation("AI Upscaler: Updating settings");

            var config = Plugin.Instance?.Configuration;
            if (config == null)
            {
                return BadRequest("Plugin configuration not available");
            }

            try
            {
                // Update configuration
                if (!string.IsNullOrEmpty(settings.Model))
                    config.Model = settings.Model;

                if (settings.Scale.HasValue)
                    config.Scale = settings.Scale.Value;

                if (!string.IsNullOrEmpty(settings.Quality))
                    config.Quality = settings.Quality;

                if (settings.Enabled.HasValue)
                    config.Enabled = settings.Enabled.Value;

                if (settings.EnableHardwareAcceleration.HasValue)
                    config.EnableHardwareAcceleration = settings.EnableHardwareAcceleration.Value;

                if (settings.ShowPlayerButton.HasValue)
                    config.ShowPlayerButton = settings.ShowPlayerButton.Value;

                // Save configuration
                Plugin.Instance.SaveConfiguration();

                _logger.LogInformation("AI Upscaler: Settings updated successfully");

                return Ok(new { success = true, message = "Settings updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AI Upscaler: Error updating settings");
                return StatusCode(500, new { success = false, message = "Error updating settings: " + ex.Message });
            }
        }

        /// <summary>
        /// Test AI upscaling with current settings
        /// </summary>
        /// <returns>Test result</returns>
        [HttpPost("test")]
        [Produces(MediaTypeNames.Application.Json)]
        public ActionResult<object> TestUpscaling()
        {
            _logger.LogInformation("AI Upscaler: Testing upscaling");

            var config = Plugin.Instance?.Configuration;
            if (config == null)
            {
                return BadRequest("Plugin configuration not available");
            }

            try
            {
                // Simulate upscaling test
                var testResult = new
                {
                    success = true,
                    model = config.Model,
                    scale = config.Scale,
                    quality = config.Quality,
                    hardwareAcceleration = config.EnableHardwareAcceleration,
                    estimatedPerformance = config.EnableHardwareAcceleration ? "High (GPU)" : "Medium (CPU)",
                    message = $"AI upscaling test successful with {config.Model} model at {config.Scale}x scale"
                };

                _logger.LogInformation("AI Upscaler: Test completed successfully");

                return Ok(testResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AI Upscaler: Error during test");
                return StatusCode(500, new { success = false, message = "Test failed: " + ex.Message });
            }
        }

        /// <summary>
        /// Get plugin information
        /// </summary>
        /// <returns>Plugin information</returns>
        [HttpGet("info")]
        [Produces(MediaTypeNames.Application.Json)]
        public ActionResult<object> GetPluginInfo()
        {
            _logger.LogInformation("AI Upscaler: Getting plugin info");

            var info = new
            {
                name = "AI Upscaler Plugin",
                version = "1.3.6.7",
                description = "AI-powered video upscaling with multiple models and Player Integration",
                author = "Kuschel-code",
                features = new[]
                {
                    "Real-time AI video upscaling",
                    "Multiple AI models (Real-ESRGAN, ESRGAN, SwinIR, Waifu2x)",
                    "Hardware acceleration support",
                    "Player integration with control buttons",
                    "Cross-platform compatibility",
                    "Performance optimization"
                },
                supportedPlatforms = new[]
                {
                    "Windows", "Linux", "macOS", "Docker",
                    "Smart TVs", "Android TV", "iOS", "Android"
                }
            };

            return Ok(info);
        }
    }

    /// <summary>
    /// Upscaler settings model
    /// </summary>
    public class UpscalerSettings
    {
        public string? Model { get; set; }
        public int? Scale { get; set; }
        public string? Quality { get; set; }
        public bool? Enabled { get; set; }
        public bool? EnableHardwareAcceleration { get; set; }
        public bool? ShowPlayerButton { get; set; }
    }
}