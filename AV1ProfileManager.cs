using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// AV1-Optimized Profile Manager
    /// Automatically detects AV1 content and selects optimized AI models
    /// </summary>
    public class AV1ProfileManager
    {
        private readonly ILogger<AV1ProfileManager> _logger;
        private readonly PluginConfiguration _config;
        
        public AV1ProfileManager(ILogger<AV1ProfileManager> logger)
        {
            _logger = logger;
            _config = Plugin.Instance?.Configuration ?? new PluginConfiguration();
        }
        
        /// <summary>
        /// Get AV1-optimized upscaling profile based on video characteristics
        /// </summary>
        public UpscalerProfile GetAV1OptimizedProfile(VideoInfo video, HardwareProfile hardware)
        {
            if (video.Codec == "av01" || video.Codec == "AV1")
            {
                _logger.LogInformation("🎬 AV1 content detected, selecting optimized profile");
                return CreateAV1OptimizedProfile(video, hardware);
            }
            
            return GetDefaultProfile(video, hardware);
        }
        
        private UpscalerProfile CreateAV1OptimizedProfile(VideoInfo video, HardwareProfile hardware)
        {
            var profile = new UpscalerProfile
            {
                Name = "AV1-Optimized",
                Description = "Optimized for AV1 codec artifacts and characteristics",
                IsAV1Optimized = true
            };
            
            // Select AI models optimized for AV1 grain and artifacts
            profile.PreferredModels = SelectAV1OptimizedModels(video, hardware);
            
            // AV1-specific processing settings
            profile.EnableColorCorrection = true; // AV1 often needs color correction
            profile.EnableDenoising = true; // AV1 grain reduction
            profile.EnableArtifactReduction = true; // AV1 block artifacts
            profile.PreprocessAV1Grain = true; // Remove AV1 film grain before upscaling
            
            // AV1 hardware acceleration settings
            profile.HardwareAcceleration = DetectAV1HardwareSupport(hardware);
            profile.UseAV1Decoder = true; // Use hardware AV1 decoder if available
            
            // Adaptive settings based on AV1 content characteristics
            profile.CustomSettings = GetAV1CustomSettings(video);
            
            _logger.LogInformation($"✅ AV1 profile created: {profile.PreferredModels.Length} models, HW: {profile.HardwareAcceleration}");
            
            return profile;
        }
        
        private string[] SelectAV1OptimizedModels(VideoInfo video, HardwareProfile hardware)
        {
            var models = new List<string>();
            
            // Primary model selection based on content and hardware
            if (hardware.VramMB >= 8192) // 8GB+ VRAM
            {
                if (video.Width >= 3840) // 4K content
                {
                    models.Add("Real-ESRGAN"); // Best quality for 4K AV1
                    models.Add("HAT"); // Backup for complex scenes
                }
                else if (video.Width >= 1920) // 1080p content
                {
                    models.Add("EDSR"); // Balanced for 1080p AV1
                    models.Add("SwinIR"); // Good for AV1 textures
                }
                else // 720p and below
                {
                    models.Add("SRCNN"); // Fast for lower resolutions
                    models.Add("Waifu2x"); // Clean upscaling
                }
            }
            else if (hardware.VramMB >= 4096) // 4GB+ VRAM
            {
                models.Add("EDSR"); // Good balance
                models.Add("RRDBNet"); // AV1-friendly
                models.Add("DRLN"); // Denoise-focused
            }
            else // Lower VRAM
            {
                models.Add("FSRCNN"); // Minimal resources
                models.Add("CARN"); // Fast processing
                models.Add("SRCNN"); // Fallback
            }
            
            // Add AV1-specific models from v1.3.5
            models.Add("DRLN"); // Excellent for AV1 grain
            models.Add("RRDBNet"); // Balanced for AV1 artifacts
            
            return models.Take(3).ToArray(); // Max 3 models for efficiency
        }
        
        private bool DetectAV1HardwareSupport(HardwareProfile hardware)
        {
            // Intel Arc GPUs have excellent AV1 support
            var gpuName = hardware.DeviceName ?? "";
            if (gpuName.Contains("Arc") || gpuName.Contains("Intel"))
            {
                _logger.LogDebug("🔵 Intel Arc detected - enabling AV1 hardware acceleration");
                return true;
            }
            
            // NVIDIA RTX 4000+ series
            if (gpuName.Contains("RTX 40") || gpuName.Contains("RTX 4"))
            {
                _logger.LogDebug("🟢 NVIDIA RTX 4000+ detected - enabling AV1 hardware acceleration");
                return true;
            }
            
            // AMD RX 7000+ series
            if (gpuName.Contains("RX 7") || gpuName.Contains("RX 6700"))
            {
                _logger.LogDebug("🔴 AMD RX 7000+ detected - enabling AV1 hardware acceleration");
                return true;
            }
            
            _logger.LogDebug("⚪ No AV1 hardware acceleration detected");
            return false;
        }
        
        private List<CustomSetting> GetAV1CustomSettings(VideoInfo video)
        {
            var settings = new List<CustomSetting>();
            
            // AV1-specific preprocessing
            settings.Add(new CustomSetting { Key = "grain_synthesis", Value = "false", Type = "bool" });
            settings.Add(new CustomSetting { Key = "enable_restoration", Value = "true", Type = "bool" });
            settings.Add(new CustomSetting { Key = "cdf_update_freq", Value = "2", Type = "int" });
            settings.Add(new CustomSetting { Key = "enable_warped_motion", Value = "true", Type = "bool" });
            
            // Quality settings based on AV1 characteristics
            if (video.BitRate < 5000) // Low bitrate AV1
            {
                settings.Add(new CustomSetting { Key = "denoise_strength", Value = "0.8", Type = "float" });
                settings.Add(new CustomSetting { Key = "artifact_reduction", Value = "0.9", Type = "float" });
                settings.Add(new CustomSetting { Key = "sharpening", Value = "0.3", Type = "float" });
            }
            else if (video.BitRate > 15000) // High bitrate AV1
            {
                settings.Add(new CustomSetting { Key = "denoise_strength", Value = "0.2", Type = "float" });
                settings.Add(new CustomSetting { Key = "artifact_reduction", Value = "0.3", Type = "float" });
                settings.Add(new CustomSetting { Key = "sharpening", Value = "0.7", Type = "float" });
            }
            else // Medium bitrate
            {
                settings.Add(new CustomSetting { Key = "denoise_strength", Value = "0.5", Type = "float" });
                settings.Add(new CustomSetting { Key = "artifact_reduction", Value = "0.6", Type = "float" });
                settings.Add(new CustomSetting { Key = "sharpening", Value = "0.5", Type = "float" });
            }
            
            // AV1 color space considerations
            if (video.ColorSpace == "bt2020")
            {
                settings.Add(new CustomSetting { Key = "color_primaries", Value = "bt2020", Type = "string" });
                settings.Add(new CustomSetting { Key = "enable_hdr_tone_mapping", Value = "true", Type = "bool" });
            }
            
            return settings;
        }
        
        private UpscalerProfile GetDefaultProfile(VideoInfo video, HardwareProfile hardware)
        {
            // Return standard profile for non-AV1 content
            return new UpscalerProfile
            {
                Name = "Standard",
                PreferredModels = new[] { _config.Model, "Real-ESRGAN", "EDSR" },
                HardwareAcceleration = true, // Default to true, will be adjusted based on actual hardware
                EnableColorCorrection = _config.EnableAIColorCorrection,
                EnableDenoising = _config.EnableNoiseReduction
            };
        }
        
        /// <summary>
        /// Automatically detect and apply the best profile for given content
        /// </summary>
        public UpscalerProfile AutoSelectProfile(VideoInfo video, HardwareProfile hardware)
        {
            var profile = GetAV1OptimizedProfile(video, hardware);
            
            // Additional optimizations based on content type
            if (video.FrameRate >= 50) // High frame rate content
            {
                profile = OptimizeForHighFrameRate(profile);
            }
            
            if (video.Width >= 3840) // 4K content
            {
                profile = OptimizeFor4K(profile, hardware);
            }
            
            // Apply user preferences
            ApplyUserPreferences(profile);
            
            _logger.LogInformation($"🎯 Auto-selected profile: {profile.Name} for {video.Width}x{video.Height} {video.Codec}");
            
            return profile;
        }
        
        private UpscalerProfile OptimizeForHighFrameRate(UpscalerProfile profile)
        {
            // Optimize for 50/60fps content
            profile.MaxConcurrentStreams = Math.Max(1, profile.MaxConcurrentStreams - 1);
            profile.FrameSkipping = true; // Skip frames if needed
            profile.FastMode = true; // Enable fast processing
            
            // Prefer faster models for high FPS
            var fastModels = new[] { "FSRCNN", "CARN", "SRCNN" };
            profile.PreferredModels = profile.PreferredModels
                .Where(m => fastModels.Contains(m))
                .Concat(fastModels)
                .Take(3)
                .ToArray();
            
            return profile;
        }
        
        private UpscalerProfile OptimizeFor4K(UpscalerProfile profile, HardwareProfile hardware)
        {
            if (hardware.VramMB < 8192) // Insufficient VRAM for 4K
            {
                profile.TileSize = 512; // Smaller tiles for 4K
                profile.MaxUpscaleFactor = 2.0f; // Limit upscaling
                _logger.LogWarning("⚠️ 4K content with limited VRAM - using tiled processing");
            }
            else
            {
                profile.TileSize = 1024; // Larger tiles for better quality
                profile.MaxUpscaleFactor = 4.0f; // Allow full upscaling
            }
            
            return profile;
        }
        
        private void ApplyUserPreferences(UpscalerProfile profile)
        {
            // Apply user's quality preferences
            if (_config.Quality == "fast")
            {
                profile.QualityLevel = 0.6f;
                profile.FastMode = true;
            }
            else if (_config.Quality == "high")
            {
                profile.QualityLevel = 1.0f;
                profile.FastMode = false;
            }
            
            // Apply user's model preference if compatible
            if (!string.IsNullOrEmpty(_config.Model) && 
                _config.AvailableAIModels.Contains(_config.Model))
            {
                var userModel = _config.Model;
                var models = profile.PreferredModels.ToList();
                models.Remove(userModel);
                models.Insert(0, userModel); // Put user model first
                profile.PreferredModels = models.Take(3).ToArray();
            }
        }
        
        /// <summary>
        /// Get available AV1-optimized profiles
        /// </summary>
        public List<UpscalerProfile> GetAvailableAV1Profiles()
        {
            return new List<UpscalerProfile>
            {
                new UpscalerProfile
                {
                    Name = "AV1 High Quality",
                    Description = "Maximum quality for AV1 content (requires 8GB+ VRAM)",
                    PreferredModels = new[] { "Real-ESRGAN", "HAT", "SwinIR" },
                    HardwareAcceleration = true,
                    QualityLevel = 1.0f,
                    IsAV1Optimized = true
                },
                new UpscalerProfile
                {
                    Name = "AV1 Balanced",
                    Description = "Balanced quality and performance for AV1 content",
                    PreferredModels = new[] { "EDSR", "RRDBNet", "DRLN" },
                    HardwareAcceleration = true,
                    QualityLevel = 0.8f,
                    IsAV1Optimized = true
                },
                new UpscalerProfile
                {
                    Name = "AV1 Performance",
                    Description = "Fast processing for AV1 content (minimal resources)",
                    PreferredModels = new[] { "FSRCNN", "CARN", "SRCNN" },
                    HardwareAcceleration = false,
                    QualityLevel = 0.6f,
                    IsAV1Optimized = true
                }
            };
        }
    }
    
    /// <summary>
    /// Enhanced Upscaler Profile with AV1 support
    /// </summary>
    public class UpscalerProfile
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string[] PreferredModels { get; set; } = Array.Empty<string>();
        public bool HardwareAcceleration { get; set; }
        public float QualityLevel { get; set; } = 0.8f;
        public int MaxConcurrentStreams { get; set; } = 1;
        public bool EnableColorCorrection { get; set; }
        public bool EnableDenoising { get; set; }
        public bool EnableArtifactReduction { get; set; }
        public List<CustomSetting> CustomSettings { get; set; } = new List<CustomSetting>();
        
        // AV1-specific properties
        public bool IsAV1Optimized { get; set; }
        public bool PreprocessAV1Grain { get; set; }
        public bool UseAV1Decoder { get; set; }
        
        // Performance optimization
        public bool FastMode { get; set; }
        public bool FrameSkipping { get; set; }
        public int TileSize { get; set; } = 512;
        public float MaxUpscaleFactor { get; set; } = 4.0f;
    }
}