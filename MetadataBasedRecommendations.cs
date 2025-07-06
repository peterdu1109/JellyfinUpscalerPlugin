using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Metadata-Based AI Model Recommendations
    /// Automatically selects optimal AI models based on content metadata (genre, type, year, etc.)
    /// </summary>
    public class MetadataBasedRecommendations
    {
        private readonly ILogger<MetadataBasedRecommendations> _logger;
        private readonly PluginConfiguration _config;
        private readonly Dictionary<string, GenreProfile> _genreProfiles;
        private readonly Dictionary<string, ContentTypeProfile> _contentTypeProfiles;
        
        public MetadataBasedRecommendations(ILogger<MetadataBasedRecommendations> logger)
        {
            _logger = logger;
            _config = Plugin.Instance?.Configuration ?? new PluginConfiguration();
            _genreProfiles = InitializeGenreProfiles();
            _contentTypeProfiles = InitializeContentTypeProfiles();
        }
        
        /// <summary>
        /// Get AI model recommendation based on content metadata
        /// </summary>
        public ModelRecommendation GetRecommendation(ContentMetadata metadata, HardwareProfile hardware)
        {
            try
            {
                var recommendation = new ModelRecommendation
                {
                    ContentTitle = metadata.Title,
                    RecommendationReason = new List<string>()
                };
                
                // Analyze content type
                var contentTypeScore = AnalyzeContentType(metadata, recommendation);
                
                // Analyze genre
                var genreScore = AnalyzeGenre(metadata, recommendation);
                
                // Analyze release year (older content may need different handling)
                var ageScore = AnalyzeContentAge(metadata, recommendation);
                
                // Analyze resolution and quality
                var qualityScore = AnalyzeQuality(metadata, recommendation);
                
                // Hardware constraints
                var hardwareScore = AnalyzeHardware(hardware, recommendation);
                
                // Calculate final recommendation
                var finalModel = SelectOptimalModel(contentTypeScore, genreScore, ageScore, qualityScore, hardwareScore);
                
                recommendation.RecommendedModel = finalModel.Model;
                recommendation.ConfidenceScore = finalModel.Confidence;
                recommendation.AlternativeModels = finalModel.Alternatives;
                
                _logger.LogInformation($"🎯 Model recommendation for '{metadata.Title}': {finalModel.Model} ({finalModel.Confidence:P0} confidence)");
                
                return recommendation;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Failed to generate metadata-based recommendation, using fallback");
                return GetFallbackRecommendation(metadata);
            }
        }
        
        private Dictionary<string, GenreProfile> InitializeGenreProfiles()
        {
            return new Dictionary<string, GenreProfile>
            {
                ["anime"] = new GenreProfile
                {
                    Name = "Anime",
                    PreferredModels = new[] { "waifu2x", "Real-ESRGAN", "EDSR" },
                    Characteristics = new[] { "clean lines", "solid colors", "sharp edges" },
                    OptimalSettings = new GenreModelSettings
                    {
                        EnableSharpening = true,
                        EnableColorCorrection = true,
                        EnableNoiseReduction = false, // Anime usually clean
                        PreferredScale = 2.0f
                    }
                },
                
                ["action"] = new GenreProfile
                {
                    Name = "Action",
                    PreferredModels = new[] { "Real-ESRGAN", "HAT", "SwinIR" },
                    Characteristics = new[] { "motion blur", "fast scenes", "detailed textures" },
                    OptimalSettings = new GenreModelSettings
                    {
                        EnableSharpening = true,
                        EnableMotionBlurReduction = true,
                        EnableEdgeEnhancement = true,
                        PreferredScale = 2.5f
                    }
                },
                
                ["documentary"] = new GenreProfile
                {
                    Name = "Documentary",
                    PreferredModels = new[] { "EDSR", "SRCNN", "Real-ESRGAN" },
                    Characteristics = new[] { "real-world content", "text overlays", "mixed quality sources" },
                    OptimalSettings = new GenreModelSettings
                    {
                        EnableTextEnhancement = true,
                        EnableNoiseReduction = true,
                        EnableArtifactReduction = true,
                        PreferredScale = 2.0f
                    }
                },
                
                ["horror"] = new GenreProfile
                {
                    Name = "Horror",
                    PreferredModels = new[] { "SwinIR", "RRDBNet", "DRLN" },
                    Characteristics = new[] { "dark scenes", "low light", "film grain" },
                    OptimalSettings = new GenreModelSettings
                    {
                        EnableLowLightEnhancement = true,
                        EnableNoiseReduction = true,
                        PreserveDarkness = true,
                        PreferredScale = 2.0f
                    }
                },
                
                ["comedy"] = new GenreProfile
                {
                    Name = "Comedy",
                    PreferredModels = new[] { "FSRCNN", "CARN", "EDSR" },
                    Characteristics = new[] { "bright scenes", "dialogue heavy", "standard quality" },
                    OptimalSettings = new GenreModelSettings
                    {
                        EnableFaceEnhancement = true,
                        EnableColorCorrection = true,
                        FastProcessing = true,
                        PreferredScale = 2.0f
                    }
                },
                
                ["drama"] = new GenreProfile
                {
                    Name = "Drama",
                    PreferredModels = new[] { "Real-ESRGAN", "EDSR", "HAT" },
                    Characteristics = new[] { "natural lighting", "close-ups", "emotional scenes" },
                    OptimalSettings = new GenreModelSettings
                    {
                        EnableFaceEnhancement = true,
                        EnableSkinToneCorrection = true,
                        EnableDetailPreservation = true,
                        PreferredScale = 2.5f
                    }
                },
                
                ["science-fiction"] = new GenreProfile
                {
                    Name = "Sci-Fi",
                    PreferredModels = new[] { "HAT", "SwinIR", "Real-ESRGAN" },
                    Characteristics = new[] { "CGI elements", "special effects", "futuristic visuals" },
                    OptimalSettings = new GenreModelSettings
                    {
                        EnableCGIOptimization = true,
                        EnableEdgeEnhancement = true,
                        EnableMetallicEnhancement = true,
                        PreferredScale = 3.0f
                    }
                }
            };
        }
        
        private Dictionary<string, ContentTypeProfile> InitializeContentTypeProfiles()
        {
            return new Dictionary<string, ContentTypeProfile>
            {
                ["movie"] = new ContentTypeProfile
                {
                    Name = "Movie",
                    PreferredModels = new[] { "Real-ESRGAN", "HAT", "EDSR" },
                    QualityPriority = QualityPriority.High,
                    ProcessingTime = ProcessingTime.Extended,
                    CacheStrategy = CacheStrategy.FullMovie
                },
                
                ["series"] = new ContentTypeProfile
                {
                    Name = "TV Series",
                    PreferredModels = new[] { "EDSR", "RRDBNet", "FSRCNN" },
                    QualityPriority = QualityPriority.Balanced,
                    ProcessingTime = ProcessingTime.Standard,
                    CacheStrategy = CacheStrategy.EpisodeChunks
                },
                
                ["episode"] = new ContentTypeProfile
                {
                    Name = "TV Episode",
                    PreferredModels = new[] { "FSRCNN", "CARN", "EDSR" },
                    QualityPriority = QualityPriority.Speed,
                    ProcessingTime = ProcessingTime.Fast,
                    CacheStrategy = CacheStrategy.StreamingOptimized
                },
                
                ["music-video"] = new ContentTypeProfile
                {
                    Name = "Music Video",
                    PreferredModels = new[] { "waifu2x", "Real-ESRGAN", "HAT" },
                    QualityPriority = QualityPriority.High,
                    ProcessingTime = ProcessingTime.Standard,
                    CacheStrategy = CacheStrategy.FullContent
                },
                
                ["documentary"] = new ContentTypeProfile
                {
                    Name = "Documentary",
                    PreferredModels = new[] { "SRCNN", "DRLN", "RRDBNet" },
                    QualityPriority = QualityPriority.Preservation,
                    ProcessingTime = ProcessingTime.Extended,
                    CacheStrategy = CacheStrategy.ArchivalQuality
                }
            };
        }
        
        private float AnalyzeContentType(ContentMetadata metadata, ModelRecommendation recommendation)
        {
            var contentType = DetermineContentType(metadata);
            
            if (_contentTypeProfiles.TryGetValue(contentType.ToLowerInvariant(), out var profile))
            {
                recommendation.RecommendationReason.Add($"Content type: {profile.Name}");
                recommendation.ContentTypeProfile = profile;
                return 1.0f;
            }
            
            // Default for unknown content types
            recommendation.RecommendationReason.Add("Content type: Unknown (using default)");
            return 0.5f;
        }
        
        private string DetermineContentType(ContentMetadata metadata)
        {
            if (!string.IsNullOrEmpty(metadata.Type))
            {
                return metadata.Type.ToLowerInvariant();
            }
            
            // Infer from other metadata
            if (metadata.Runtime.HasValue)
            {
                return metadata.Runtime > 60 ? "movie" : "episode";
            }
            
            return "unknown";
        }
        
        private float AnalyzeGenre(ContentMetadata metadata, ModelRecommendation recommendation)
        {
            if (metadata.Genres == null || !metadata.Genres.Any())
            {
                recommendation.RecommendationReason.Add("No genre information available");
                return 0.3f;
            }
            
            var bestGenreMatch = metadata.Genres
                .Select(g => g.ToLowerInvariant())
                .FirstOrDefault(g => _genreProfiles.ContainsKey(g));
            
            if (bestGenreMatch != null)
            {
                var profile = _genreProfiles[bestGenreMatch];
                recommendation.RecommendationReason.Add($"Genre optimization: {profile.Name}");
                recommendation.GenreProfile = profile;
                return 1.0f;
            }
            
            // Partial matches or similar genres
            var partialMatch = FindPartialGenreMatch(metadata.Genres);
            if (partialMatch != null)
            {
                recommendation.RecommendationReason.Add($"Similar genre: {partialMatch.Name}");
                recommendation.GenreProfile = partialMatch;
                return 0.7f;
            }
            
            recommendation.RecommendationReason.Add($"Genres: {string.Join(", ", metadata.Genres)} (no specific optimization)");
            return 0.4f;
        }
        
        private GenreProfile FindPartialGenreMatch(string[] genres)
        {
            var lowerGenres = genres.Select(g => g.ToLowerInvariant()).ToArray();
            
            // Anime variations
            if (lowerGenres.Any(g => g.Contains("animation") || g.Contains("cartoon")))
                return _genreProfiles["anime"];
                
            // Action variations
            if (lowerGenres.Any(g => g.Contains("thriller") || g.Contains("adventure")))
                return _genreProfiles["action"];
                
            // Horror variations
            if (lowerGenres.Any(g => g.Contains("suspense") || g.Contains("mystery")))
                return _genreProfiles["horror"];
                
            // Sci-fi variations
            if (lowerGenres.Any(g => g.Contains("fantasy") || g.Contains("superhero")))
                return _genreProfiles["science-fiction"];
            
            return null;
        }
        
        private float AnalyzeContentAge(ContentMetadata metadata, ModelRecommendation recommendation)
        {
            if (!metadata.Year.HasValue)
            {
                recommendation.RecommendationReason.Add("Release year unknown");
                return 0.5f;
            }
            
            var age = DateTime.Now.Year - metadata.Year.Value;
            
            if (age <= 5) // Very recent content
            {
                recommendation.RecommendationReason.Add($"Recent content ({metadata.Year}) - modern encoding");
                recommendation.ContentAge = ContentAge.Recent;
                return 1.0f;
            }
            else if (age <= 15) // Modern content
            {
                recommendation.RecommendationReason.Add($"Modern content ({metadata.Year}) - good quality expected");
                recommendation.ContentAge = ContentAge.Modern;
                return 0.8f;
            }
            else if (age <= 30) // Older content
            {
                recommendation.RecommendationReason.Add($"Older content ({metadata.Year}) - may need artifact reduction");
                recommendation.ContentAge = ContentAge.Older;
                return 0.6f;
            }
            else // Very old content
            {
                recommendation.RecommendationReason.Add($"Classic content ({metadata.Year}) - likely needs restoration");
                recommendation.ContentAge = ContentAge.Classic;
                return 0.4f;
            }
        }
        
        private float AnalyzeQuality(ContentMetadata metadata, ModelRecommendation recommendation)
        {
            var score = 0.5f;
            
            // Resolution analysis
            if (metadata.Width.HasValue && metadata.Height.HasValue)
            {
                var pixels = metadata.Width.Value * metadata.Height.Value;
                
                if (pixels >= 3840 * 2160) // 4K
                {
                    recommendation.RecommendationReason.Add("4K source - minimal upscaling needed");
                    score += 0.3f;
                }
                else if (pixels >= 1920 * 1080) // 1080p
                {
                    recommendation.RecommendationReason.Add("1080p source - moderate upscaling beneficial");
                    score += 0.2f;
                }
                else if (pixels >= 1280 * 720) // 720p
                {
                    recommendation.RecommendationReason.Add("720p source - significant upscaling beneficial");
                    score += 0.1f;
                }
                else // Lower resolution
                {
                    recommendation.RecommendationReason.Add("Low resolution source - aggressive upscaling recommended");
                    score -= 0.1f;
                }
            }
            
            // Bitrate analysis (if available)
            if (metadata.Bitrate.HasValue)
            {
                if (metadata.Bitrate.Value >= 15000) // High bitrate
                {
                    recommendation.RecommendationReason.Add("High bitrate - good source quality");
                    score += 0.2f;
                }
                else if (metadata.Bitrate.Value <= 3000) // Low bitrate
                {
                    recommendation.RecommendationReason.Add("Low bitrate - compression artifacts expected");
                    score -= 0.1f;
                }
            }
            
            return Math.Max(0.1f, Math.Min(1.0f, score));
        }
        
        private float AnalyzeHardware(HardwareProfile hardware, ModelRecommendation recommendation)
        {
            var score = 0.5f;
            
            // VRAM analysis
            if (hardware.VramMB >= 8192) // 8GB+
            {
                recommendation.RecommendationReason.Add("High-end GPU - can handle complex models");
                score += 0.3f;
            }
            else if (hardware.VramMB >= 4096) // 4GB+
            {
                recommendation.RecommendationReason.Add("Mid-range GPU - balanced model selection");
                score += 0.1f;
            }
            else if (hardware.VramMB < 2048) // <2GB
            {
                recommendation.RecommendationReason.Add("Limited GPU memory - lightweight models preferred");
                score -= 0.2f;
            }
            
            // CPU cores
            if (hardware.CpuCores >= 8)
            {
                recommendation.RecommendationReason.Add("Multi-core CPU - can handle parallel processing");
                score += 0.1f;
            }
            else if (hardware.CpuCores <= 4)
            {
                recommendation.RecommendationReason.Add("Limited CPU cores - optimized processing needed");
                score -= 0.1f;
            }
            
            return Math.Max(0.1f, Math.Min(1.0f, score));
        }
        
        private ModelSelection SelectOptimalModel(float contentScore, float genreScore, float ageScore, float qualityScore, float hardwareScore)
        {
            var models = new List<ScoredModel>();
            
            // Score each available model
            foreach (var model in _config.AvailableAIModels)
            {
                var modelScore = CalculateModelScore(model, contentScore, genreScore, ageScore, qualityScore, hardwareScore);
                models.Add(new ScoredModel { Model = model, Score = modelScore });
            }
            
            // Sort by score
            var sortedModels = models.OrderByDescending(m => m.Score).ToList();
            
            return new ModelSelection
            {
                Model = sortedModels.First().Model,
                Confidence = sortedModels.First().Score,
                Alternatives = sortedModels.Skip(1).Take(2).Select(m => m.Model).ToArray()
            };
        }
        
        private float CalculateModelScore(string model, float contentScore, float genreScore, float ageScore, float qualityScore, float hardwareScore)
        {
            // Removed unused baseScore variable
            
            // Model-specific scoring
            var modelScore = model.ToLowerInvariant() switch
            {
                "real-esrgan" => 0.9f, // Generally excellent
                "hat" => 0.85f,        // Great for complex content
                "swinir" => 0.8f,      // Good for textures
                "edsr" => 0.75f,       // Balanced choice
                "waifu2x" => genreScore > 0.8f ? 0.9f : 0.6f, // Excellent for anime, average otherwise
                "fsrcnn" => hardwareScore < 0.5f ? 0.8f : 0.6f, // Good for limited hardware
                "srcnn" => 0.5f,       // Basic but fast
                "carn" => 0.7f,        // Good balance
                "rrdbnet" => 0.75f,    // Solid performance
                "drln" => 0.7f,        // Good denoising
                _ => 0.5f              // Unknown model
            };
            
            // Weight the scores
            var weightedScore = (
                modelScore * 0.3f +
                contentScore * 0.2f +
                genreScore * 0.2f +
                ageScore * 0.1f +
                qualityScore * 0.1f +
                hardwareScore * 0.1f
            );
            
            return Math.Max(0.1f, Math.Min(1.0f, weightedScore));
        }
        
        private ModelRecommendation GetFallbackRecommendation(ContentMetadata metadata)
        {
            return new ModelRecommendation
            {
                ContentTitle = metadata.Title,
                RecommendedModel = _config.Model ?? "Real-ESRGAN",
                ConfidenceScore = 0.5f,
                AlternativeModels = new[] { "EDSR", "FSRCNN" },
                RecommendationReason = new List<string> { "Fallback recommendation (metadata analysis failed)" }
            };
        }
        
        /// <summary>
        /// Get recommendations for a batch of content
        /// </summary>
        public Dictionary<string, ModelRecommendation> GetBatchRecommendations(IEnumerable<ContentMetadata> contentList, HardwareProfile hardware)
        {
            var recommendations = new Dictionary<string, ModelRecommendation>();
            
            foreach (var content in contentList)
            {
                try
                {
                    var recommendation = GetRecommendation(content, hardware);
                    recommendations[content.Id] = recommendation;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, $"Failed to get recommendation for {content.Title}");
                    recommendations[content.Id] = GetFallbackRecommendation(content);
                }
            }
            
            _logger.LogInformation($"📊 Generated {recommendations.Count} metadata-based recommendations");
            
            return recommendations;
        }
    }
    
    #region Supporting Classes and Enums
    
    public class ContentMetadata
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; } // movie, series, episode, etc.
        public string[] Genres { get; set; }
        public int? Year { get; set; }
        public int? Runtime { get; set; } // minutes
        public int? Width { get; set; }
        public int? Height { get; set; }
        public int? Bitrate { get; set; } // kbps
        public string Codec { get; set; }
        public string Language { get; set; }
        public float? Rating { get; set; } // IMDb rating, etc.
        public Dictionary<string, object> AdditionalMetadata { get; set; } = new Dictionary<string, object>();
    }
    
    public class ModelRecommendation
    {
        public string ContentTitle { get; set; }
        public string RecommendedModel { get; set; }
        public float ConfidenceScore { get; set; }
        public string[] AlternativeModels { get; set; }
        public List<string> RecommendationReason { get; set; }
        public GenreProfile GenreProfile { get; set; }
        public ContentTypeProfile ContentTypeProfile { get; set; }
        public ContentAge ContentAge { get; set; }
    }
    
    public class GenreProfile
    {
        public string Name { get; set; }
        public string[] PreferredModels { get; set; }
        public string[] Characteristics { get; set; }
        public GenreModelSettings OptimalSettings { get; set; }
    }
    
    public class ContentTypeProfile
    {
        public string Name { get; set; }
        public string[] PreferredModels { get; set; }
        public QualityPriority QualityPriority { get; set; }
        public ProcessingTime ProcessingTime { get; set; }
        public CacheStrategy CacheStrategy { get; set; }
    }
    
    public class GenreModelSettings
    {
        public bool EnableSharpening { get; set; }
        public bool EnableColorCorrection { get; set; }
        public bool EnableNoiseReduction { get; set; }
        public bool EnableMotionBlurReduction { get; set; }
        public bool EnableEdgeEnhancement { get; set; }
        public bool EnableArtifactReduction { get; set; }
        public bool EnableTextEnhancement { get; set; }
        public bool EnableLowLightEnhancement { get; set; }
        public bool EnableFaceEnhancement { get; set; }
        public bool EnableSkinToneCorrection { get; set; }
        public bool EnableDetailPreservation { get; set; }
        public bool EnableCGIOptimization { get; set; }
        public bool EnableMetallicEnhancement { get; set; }
        public bool PreserveDarkness { get; set; }
        public bool FastProcessing { get; set; }
        public float PreferredScale { get; set; } = 2.0f;
    }
    
    public class ModelSelection
    {
        public string Model { get; set; }
        public float Confidence { get; set; }
        public string[] Alternatives { get; set; }
    }
    
    public class ScoredModel
    {
        public string Model { get; set; }
        public float Score { get; set; }
    }
    
    public enum QualityPriority
    {
        Speed,
        Balanced,
        High,
        Preservation
    }
    
    public enum ProcessingTime
    {
        Fast,
        Standard,
        Extended
    }
    
    public enum CacheStrategy
    {
        StreamingOptimized,
        EpisodeChunks,
        FullContent,
        FullMovie,
        ArchivalQuality
    }
    
    public enum ContentAge
    {
        Recent,
        Modern,
        Older,
        Classic
    }
    
    #endregion
}
