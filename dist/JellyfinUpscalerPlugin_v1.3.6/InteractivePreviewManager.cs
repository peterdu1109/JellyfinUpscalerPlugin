using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Linq;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Interactive Upscaling Preview Manager
    /// Generates real-time preview comparisons of different AI models and settings
    /// </summary>
    public class InteractivePreviewManager
    {
        private readonly ILogger<InteractivePreviewManager> _logger;
        private readonly PluginConfiguration _config;
        private readonly Dictionary<string, PreviewSession> _activeSessions;
        private readonly string _previewCacheDir;
        
        public InteractivePreviewManager(ILogger<InteractivePreviewManager> logger, PluginConfiguration config)
        {
            _logger = logger;
            _config = config;
            _activeSessions = new Dictionary<string, PreviewSession>();
            _previewCacheDir = Path.Combine(Path.GetTempPath(), "JellyfinUpscaler", "Previews");
            
            InitializePreviewSystem();
        }
        
        private void InitializePreviewSystem()
        {
            try
            {
                Directory.CreateDirectory(_previewCacheDir);
                _logger.LogInformation($"🎬 Preview system initialized: {_previewCacheDir}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to initialize preview system");
            }
        }
        
        /// <summary>
        /// Create a new preview session for a video
        /// </summary>
        public async Task<PreviewSession> CreatePreviewSessionAsync(string videoPath, PreviewRequest request)
        {
            try
            {
                var sessionId = Guid.NewGuid().ToString();
                var session = new PreviewSession
                {
                    SessionId = sessionId,
                    VideoPath = videoPath,
                    Request = request,
                    CreatedAt = DateTime.Now,
                    Status = PreviewStatus.Initializing,
                    Previews = new List<PreviewResult>()
                };
                
                _activeSessions[sessionId] = session;
                
                _logger.LogInformation($"🎬 Creating preview session {sessionId} for {Path.GetFileName(videoPath)}");
                
                // Start preview generation in background
                _ = Task.Run(async () => await GeneratePreviewsAsync(session));
                
                return await Task.FromResult(session);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to create preview session");
                throw;
            }
        }
        
        private async Task GeneratePreviewsAsync(PreviewSession session)
        {
            try
            {
                session.Status = PreviewStatus.ExtractingClips;
                
                // Extract sample clips from the video
                var sampleClips = await ExtractSampleClipsAsync(session.VideoPath, session.Request);
                session.SampleClips = sampleClips;
                
                session.Status = PreviewStatus.GeneratingPreviews;
                
                // Generate previews for each requested model
                var tasks = new List<Task>();
                
                foreach (var model in session.Request.ModelsToCompare)
                {
                    tasks.Add(GenerateModelPreviewAsync(session, model, sampleClips));
                }
                
                await Task.WhenAll(tasks);
                
                session.Status = PreviewStatus.Completed;
                session.CompletedAt = DateTime.Now;
                
                _logger.LogInformation($"✅ Preview session {session.SessionId} completed with {session.Previews.Count} previews");
            }
            catch (Exception ex)
            {
                session.Status = PreviewStatus.Failed;
                session.ErrorMessage = ex.Message;
                _logger.LogError(ex, $"❌ Preview session {session.SessionId} failed");
            }
        }
        
        private async Task<List<VideoClip>> ExtractSampleClipsAsync(string videoPath, PreviewRequest request)
        {
            var clips = new List<VideoClip>();
            
            try
            {
                // Get video duration
                var duration = await GetVideoDurationAsync(videoPath);
                
                // Extract clips based on request type
                var clipPositions = request.ClipType switch
                {
                    ClipType.Automatic => GenerateAutomaticClipPositions(duration),
                    ClipType.Custom => request.CustomClipPositions ?? new[] { 0.1f, 0.5f, 0.9f },
                    ClipType.SceneDetection => await DetectInterestingScenesAsync(videoPath, duration),
                    _ => new[] { 0.1f, 0.5f, 0.9f }
                };
                
                for (int i = 0; i < clipPositions.Length; i++)
                {
                    var position = clipPositions[i];
                    var startTime = (int)(duration * position);
                    
                    var clip = await ExtractClipAsync(videoPath, startTime, request.ClipDurationSeconds, i);
                    if (clip != null)
                    {
                        clips.Add(clip);
                    }
                }
                
                _logger.LogInformation($"📎 Extracted {clips.Count} sample clips for preview");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to extract sample clips");
            }
            
            return clips;
        }
        
        private async Task<int> GetVideoDurationAsync(string videoPath)
        {
            try
            {
                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "ffprobe",
                        Arguments = $"-v quiet -show_entries format=duration -of csv=p=0 \"{videoPath}\"",
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        CreateNoWindow = true
                    }
                };
                
                process.Start();
                var output = await process.StandardOutput.ReadToEndAsync();
                await process.WaitForExitAsync();
                
                if (float.TryParse(output.Trim(), out var duration))
                {
                    return (int)duration;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get video duration");
            }
            
            return 300; // Default 5 minutes
        }
        
        private float[] GenerateAutomaticClipPositions(int duration)
        {
            // Generate clips at different points to show variety
            return new[]
            {
                0.1f,  // Opening scene
                0.25f, // Early content
                0.5f,  // Middle
                0.75f, // Late content
                0.9f   // Near end
            };
        }
        
        private async Task<float[]> DetectInterestingScenesAsync(string videoPath, int duration)
        {
            try
            {
                // Use FFmpeg scene detection to find interesting moments
                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "ffmpeg",
                        Arguments = $"-i \"{videoPath}\" -vf \"select='gt(scene,0.3)',showinfo\" -f null - 2>&1",
                        UseShellExecute = false,
                        RedirectStandardError = true,
                        CreateNoWindow = true
                    }
                };
                
                process.Start();
                var output = await process.StandardError.ReadToEndAsync();
                await process.WaitForExitAsync();
                
                var sceneChanges = ParseSceneChanges(output, duration);
                
                if (sceneChanges.Length > 0)
                {
                    return sceneChanges;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Scene detection failed, using automatic positions");
            }
            
            return GenerateAutomaticClipPositions(duration);
        }
        
        private float[] ParseSceneChanges(string ffmpegOutput, int duration)
        {
            var sceneChanges = new List<float>();
            
            try
            {
                var lines = ffmpegOutput.Split('\n');
                foreach (var line in lines)
                {
                    if (line.Contains("pts_time:"))
                    {
                        var timeIndex = line.IndexOf("pts_time:");
                        if (timeIndex >= 0)
                        {
                            var timeStr = line.Substring(timeIndex + 9).Split(' ')[0];
                            if (float.TryParse(timeStr, out var timeSeconds))
                            {
                                var position = timeSeconds / duration;
                                if (position > 0.05f && position < 0.95f) // Avoid very start/end
                                {
                                    sceneChanges.Add(position);
                                }
                            }
                        }
                    }
                }
                
                // Limit to 5 most interesting scenes
                sceneChanges.Sort();
                return sceneChanges.Take(5).ToArray();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to parse scene changes");
            }
            
            return Array.Empty<float>();
        }
        
        private async Task<VideoClip> ExtractClipAsync(string videoPath, int startTime, int duration, int clipIndex)
        {
            try
            {
                var clipFileName = $"clip_{clipIndex}_{startTime}s_{Guid.NewGuid():N}.mp4";
                var clipPath = Path.Combine(_previewCacheDir, clipFileName);
                
                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "ffmpeg",
                        Arguments = $"-ss {startTime} -i \"{videoPath}\" -t {duration} -c:v libx264 -preset ultrafast -crf 23 \"{clipPath}\"",
                        UseShellExecute = false,
                        RedirectStandardError = true,
                        CreateNoWindow = true
                    }
                };
                
                process.Start();
                await process.WaitForExitAsync();
                
                if (File.Exists(clipPath))
                {
                    var clip = new VideoClip
                    {
                        Index = clipIndex,
                        StartTime = startTime,
                        Duration = duration,
                        FilePath = clipPath,
                        FileName = clipFileName
                    };
                    
                    return clip;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to extract clip at {startTime}s");
            }
            
            return null;
        }
        
        private async Task GenerateModelPreviewAsync(PreviewSession session, string modelName, List<VideoClip> clips)
        {
            try
            {
                var preview = new PreviewResult
                {
                    ModelName = modelName,
                    ProcessedClips = new List<ProcessedClip>(),
                    StartTime = DateTime.Now
                };
                
                // Process each clip with this model
                foreach (var clip in clips)
                {
                    var processedClip = await ProcessClipWithModelAsync(clip, modelName, session.Request);
                    if (processedClip != null)
                    {
                        preview.ProcessedClips.Add(processedClip);
                    }
                }
                
                preview.EndTime = DateTime.Now;
                preview.ProcessingTime = preview.EndTime - preview.StartTime;
                
                // Calculate quality metrics
                preview.QualityMetrics = await CalculateQualityMetricsAsync(preview.ProcessedClips);
                
                lock (session.Previews)
                {
                    session.Previews.Add(preview);
                }
                
                _logger.LogInformation($"✅ Generated preview for model {modelName} in {preview.ProcessingTime.TotalSeconds:F1}s");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"❌ Failed to generate preview for model {modelName}");
            }
        }
        
        private async Task<ProcessedClip> ProcessClipWithModelAsync(VideoClip clip, string modelName, PreviewRequest request)
        {
            try
            {
                var outputFileName = $"upscaled_{modelName}_{clip.FileName}";
                var outputPath = Path.Combine(_previewCacheDir, outputFileName);
                
                // This would integrate with the actual upscaling engine
                // For now, we'll simulate processing
                var processedClip = new ProcessedClip
                {
                    OriginalClip = clip,
                    ModelName = modelName,
                    OutputPath = outputPath,
                    UpscaleFactor = request.UpscaleFactor,
                    ProcessingStartTime = DateTime.Now
                };
                
                // Simulate upscaling process (replace with actual upscaling call)
                await SimulateUpscalingAsync(clip.FilePath, outputPath, modelName, request);
                
                processedClip.ProcessingEndTime = DateTime.Now;
                processedClip.ProcessingDuration = processedClip.ProcessingEndTime - processedClip.ProcessingStartTime;
                
                // Extract frame for comparison
                processedClip.PreviewFramePath = await ExtractPreviewFrameAsync(outputPath);
                
                return processedClip;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to process clip with model {modelName}");
                return null;
            }
        }
        
        private async Task SimulateUpscalingAsync(string inputPath, string outputPath, string modelName, PreviewRequest request)
        {
            // Placeholder for actual upscaling integration
            // In real implementation, this would call the AI upscaling engine
            
            var upscaleFilter = $"scale={request.UpscaleFactor * 1920}:{request.UpscaleFactor * 1080}:flags=lanczos";
            
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "ffmpeg",
                    Arguments = $"-i \"{inputPath}\" -vf \"{upscaleFilter}\" -c:v libx264 -preset fast -crf 20 \"{outputPath}\"",
                    UseShellExecute = false,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                }
            };
            
            process.Start();
            await process.WaitForExitAsync();
            
            // Simulate processing time based on model complexity
            var delay = modelName switch
            {
                "Real-ESRGAN" => 2000,
                "HAT" => 1800,
                "EDSR" => 1500,
                "FSRCNN" => 500,
                _ => 1000
            };
            
            await Task.Delay(delay);
        }
        
        private async Task<string> ExtractPreviewFrameAsync(string videoPath)
        {
            try
            {
                var frameFileName = $"frame_{Guid.NewGuid():N}.jpg";
                var framePath = Path.Combine(_previewCacheDir, frameFileName);
                
                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "ffmpeg",
                        Arguments = $"-i \"{videoPath}\" -ss 1 -vframes 1 -q:v 2 \"{framePath}\"",
                        UseShellExecute = false,
                        RedirectStandardError = true,
                        CreateNoWindow = true
                    }
                };
                
                process.Start();
                await process.WaitForExitAsync();
                
                return File.Exists(framePath) ? framePath : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to extract preview frame");
                return null;
            }
        }
        
        private async Task<QualityMetrics> CalculateQualityMetricsAsync(List<ProcessedClip> clips)
        {
            try
            {
                var metrics = new QualityMetrics
                {
                    AverageProcessingTime = clips.Average(c => c.ProcessingDuration.TotalSeconds),
                    TotalProcessingTime = clips.Sum(c => c.ProcessingDuration.TotalSeconds),
                    ProcessedClipsCount = clips.Count,
                    SuccessRate = clips.Count(c => File.Exists(c.OutputPath)) / (float)clips.Count * 100
                };
                
                // Calculate quality scores (placeholder - would use actual quality assessment)
                metrics.EstimatedQualityScore = await EstimateQualityScoreAsync(clips);
                
                return metrics;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to calculate quality metrics");
                return new QualityMetrics();
            }
        }
        
        private async Task<float> EstimateQualityScoreAsync(List<ProcessedClip> clips)
        {
            // Placeholder quality estimation
            // In real implementation, this could use SSIM, PSNR, or other quality metrics
            
            await Task.Delay(100); // Simulate quality analysis
            
            return 0.85f; // Placeholder score
        }
        
        /// <summary>
        /// Get preview session status
        /// </summary>
        public PreviewSession GetPreviewSession(string sessionId)
        {
            _activeSessions.TryGetValue(sessionId, out var session);
            return session;
        }
        
        /// <summary>
        /// Get preview comparison data for UI
        /// </summary>
        public PreviewComparison GetPreviewComparison(string sessionId)
        {
            if (!_activeSessions.TryGetValue(sessionId, out var session))
            {
                return null;
            }
            
            var comparison = new PreviewComparison
            {
                SessionId = sessionId,
                Status = session.Status,
                ModelComparisons = new List<ModelComparison>()
            };
            
            foreach (var preview in session.Previews)
            {
                var modelComparison = new ModelComparison
                {
                    ModelName = preview.ModelName,
                    ProcessingTime = preview.ProcessingTime,
                    QualityScore = preview.QualityMetrics?.EstimatedQualityScore ?? 0,
                    PreviewFrames = preview.ProcessedClips
                        .Where(c => !string.IsNullOrEmpty(c.PreviewFramePath))
                        .Select(c => new PreviewFrame
                        {
                            ClipIndex = c.OriginalClip.Index,
                            StartTime = c.OriginalClip.StartTime,
                            FramePath = c.PreviewFramePath,
                            ProcessingTime = c.ProcessingDuration
                        })
                        .ToList()
                };
                
                comparison.ModelComparisons.Add(modelComparison);
            }
            
            return comparison;
        }
        
        /// <summary>
        /// Clean up old preview sessions
        /// </summary>
        public void CleanupOldSessions()
        {
            try
            {
                var cutoffTime = DateTime.Now.AddHours(-2); // Keep sessions for 2 hours
                var sessionsToRemove = _activeSessions
                    .Where(kvp => kvp.Value.CreatedAt < cutoffTime)
                    .Select(kvp => kvp.Key)
                    .ToList();
                
                foreach (var sessionId in sessionsToRemove)
                {
                    if (_activeSessions.TryGetValue(sessionId, out var session))
                    {
                        CleanupSessionFiles(session);
                        _activeSessions.Remove(sessionId);
                    }
                }
                
                if (sessionsToRemove.Count() > 0)
                {
                    _logger.LogInformation($"🧹 Cleaned up {sessionsToRemove.Count()} old preview sessions");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to cleanup old sessions");
            }
        }
        
        private void CleanupSessionFiles(PreviewSession session)
        {
            try
            {
                // Delete sample clips
                if (session.SampleClips != null)
                {
                    foreach (var clip in session.SampleClips)
                    {
                        if (File.Exists(clip.FilePath))
                        {
                            File.Delete(clip.FilePath);
                        }
                    }
                }
                
                // Delete processed clips and frames
                foreach (var preview in session.Previews)
                {
                    foreach (var processedClip in preview.ProcessedClips)
                    {
                        if (File.Exists(processedClip.OutputPath))
                        {
                            File.Delete(processedClip.OutputPath);
                        }
                        
                        if (File.Exists(processedClip.PreviewFramePath))
                        {
                            File.Delete(processedClip.PreviewFramePath);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Failed to cleanup files for session {session.SessionId}");
            }
        }
    }
    
    #region Supporting Classes and Enums
    
    public class PreviewRequest
    {
        public string[] ModelsToCompare { get; set; }
        public float UpscaleFactor { get; set; } = 2.0f;
        public ClipType ClipType { get; set; } = ClipType.Automatic;
        public int ClipDurationSeconds { get; set; } = 3;
        public float[] CustomClipPositions { get; set; }
        public PreviewQuality Quality { get; set; } = PreviewQuality.Medium;
    }
    
    public class PreviewSession
    {
        public string SessionId { get; set; }
        public string VideoPath { get; set; }
        public PreviewRequest Request { get; set; }
        public PreviewStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public List<VideoClip> SampleClips { get; set; }
        public List<PreviewResult> Previews { get; set; }
        public string ErrorMessage { get; set; }
    }
    
    public class VideoClip
    {
        public int Index { get; set; }
        public int StartTime { get; set; }
        public int Duration { get; set; }
        public string FilePath { get; set; }
        public string FileName { get; set; }
    }
    
    public class PreviewResult
    {
        public string ModelName { get; set; }
        public List<ProcessedClip> ProcessedClips { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public TimeSpan ProcessingTime { get; set; }
        public QualityMetrics QualityMetrics { get; set; }
    }
    
    public class ProcessedClip
    {
        public VideoClip OriginalClip { get; set; }
        public string ModelName { get; set; }
        public string OutputPath { get; set; }
        public float UpscaleFactor { get; set; }
        public DateTime ProcessingStartTime { get; set; }
        public DateTime ProcessingEndTime { get; set; }
        public TimeSpan ProcessingDuration { get; set; }
        public string PreviewFramePath { get; set; }
    }
    
    public class QualityMetrics
    {
        public double AverageProcessingTime { get; set; }
        public double TotalProcessingTime { get; set; }
        public int ProcessedClipsCount { get; set; }
        public float SuccessRate { get; set; }
        public float EstimatedQualityScore { get; set; }
    }
    
    public class PreviewComparison
    {
        public string SessionId { get; set; }
        public PreviewStatus Status { get; set; }
        public List<ModelComparison> ModelComparisons { get; set; }
    }
    
    public class ModelComparison
    {
        public string ModelName { get; set; }
        public TimeSpan ProcessingTime { get; set; }
        public float QualityScore { get; set; }
        public List<PreviewFrame> PreviewFrames { get; set; }
    }
    
    public class PreviewFrame
    {
        public int ClipIndex { get; set; }
        public int StartTime { get; set; }
        public string FramePath { get; set; }
        public TimeSpan ProcessingTime { get; set; }
    }
    
    public enum PreviewStatus
    {
        Initializing,
        ExtractingClips,
        GeneratingPreviews,
        Completed,
        Failed
    }
    
    public enum ClipType
    {
        Automatic,
        Custom,
        SceneDetection
    }
    
    public enum PreviewQuality
    {
        Low,
        Medium,
        High
    }
    
    #endregion
}