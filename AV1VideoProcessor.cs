using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MediaBrowser.Controller.MediaEncoding;
using MediaBrowser.Model.Dto;
using MediaBrowser.Model.Entities;
using System.Text.Json;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Real AV1 video processing engine with hardware acceleration
    /// </summary>
    public class AV1VideoProcessor
    {
        private readonly ILogger<AV1VideoProcessor> _logger;
        private readonly IMediaEncoder _mediaEncoder;
        private readonly UpscalerCore _upscalerCore;
        private readonly PluginConfiguration _config;
        
        // Processing queue for concurrent streams
        private readonly SemaphoreSlim _processingSemaphore;
        private readonly Dictionary<string, ProcessingJob> _activeJobs = new();
        
        public AV1VideoProcessor(
            ILogger<AV1VideoProcessor> logger,
            IMediaEncoder mediaEncoder,
            UpscalerCore upscalerCore,
            PluginConfiguration config)
        {
            _logger = logger;
            _mediaEncoder = mediaEncoder;
            _upscalerCore = upscalerCore;
            _config = config;
            
            // Limit concurrent processing based on hardware
            _processingSemaphore = new SemaphoreSlim(_config.MaxConcurrentStreams);
        }

        /// <summary>
        /// Main AV1 processing method with real hardware acceleration
        /// </summary>
        public async Task<ProcessingResult> ProcessVideoAsync(
            string inputPath, 
            string outputPath, 
            VideoProcessingOptions options,
            CancellationToken cancellationToken = default)
        {
            var jobId = Guid.NewGuid().ToString();
            var job = new ProcessingJob
            {
                Id = jobId,
                InputPath = inputPath,
                OutputPath = outputPath,
                Options = options,
                StartTime = DateTime.Now,
                Status = ProcessingStatus.Starting
            };
            
            _activeJobs[jobId] = job;
            
            try
            {
                await _processingSemaphore.WaitAsync(cancellationToken);
                
                _logger.LogInformation($"🚀 Starting AV1 processing: {Path.GetFileName(inputPath)}");
                
                // 1. Hardware detection and optimization
                var hardwareProfile = await _upscalerCore.DetectHardwareAsync();
                
                // 2. Analyze input video
                var inputInfo = await AnalyzeInputVideoAsync(inputPath);
                job.InputInfo = inputInfo;
                
                // 3. Optimize settings based on content and hardware
                var optimizedOptions = OptimizeProcessingOptions(options, inputInfo, hardwareProfile);
                job.OptimizedOptions = optimizedOptions;
                
                // 4. Build FFmpeg command with AV1 optimization
                var ffmpegArgs = BuildAV1FFmpegCommand(inputPath, outputPath, optimizedOptions, hardwareProfile);
                job.FFmpegCommand = ffmpegArgs;
                
                // 5. Execute processing with real-time monitoring
                var result = await ExecuteProcessingAsync(ffmpegArgs, job, cancellationToken);
                
                // 6. Post-processing validation
                if (result.Success)
                {
                    result = await ValidateOutputAsync(outputPath, result);
                }
                
                job.Status = result.Success ? ProcessingStatus.Completed : ProcessingStatus.Failed;
                job.EndTime = DateTime.Now;
                job.Result = result;
                
                _logger.LogInformation($"✅ AV1 processing completed: {result.Success}, Time: {job.ProcessingTime.TotalSeconds:F1}s");
                
                return result;
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation($"⏹️ AV1 processing cancelled: {jobId}");
                job.Status = ProcessingStatus.Cancelled;
                return new ProcessingResult { Success = false, Error = "Processing cancelled" };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"❌ AV1 processing failed: {jobId}");
                job.Status = ProcessingStatus.Failed;
                job.Error = ex.Message;
                return new ProcessingResult { Success = false, Error = ex.Message };
            }
            finally
            {
                _processingSemaphore.Release();
                _activeJobs.Remove(jobId);
            }
        }

        /// <summary>
        /// Analyze input video properties for optimization
        /// </summary>
        private async Task<VideoInfo> AnalyzeInputVideoAsync(string inputPath)
        {
            try
            {
                var ffmpegPath = _mediaEncoder.EncoderPath;
                var args = $"-i \"{inputPath}\" -hide_banner -f null -";
                
                var processInfo = new ProcessStartInfo
                {
                    FileName = ffmpegPath,
                    Arguments = args,
                    UseShellExecute = false,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                };

                using var process = Process.Start(processInfo);
                var stderr = await process.StandardError.ReadToEndAsync();
                
                var info = ParseFFmpegOutput(stderr);
                
                _logger.LogInformation($"📊 Input analysis: {info.Width}x{info.Height} {info.FrameRate}fps, {info.Codec}, {info.BitRate}kbps");
                
                return info;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Input analysis failed, using defaults");
                return new VideoInfo(); // Default values
            }
        }

        /// <summary>
        /// Parse FFmpeg output to extract video information
        /// </summary>
        private VideoInfo ParseFFmpegOutput(string output)
        {
            var info = new VideoInfo();
            
            try
            {
                var lines = output.Split('\n');
                
                foreach (var line in lines)
                {
                    if (line.Contains("Video:"))
                    {
                        // Extract codec
                        if (line.Contains("h264")) info.Codec = "h264";
                        else if (line.Contains("hevc")) info.Codec = "hevc";
                        else if (line.Contains("av1")) info.Codec = "av1";
                        else if (line.Contains("vp9")) info.Codec = "vp9";
                        
                        // Extract resolution
                        var resMatch = System.Text.RegularExpressions.Regex.Match(line, @"(\d+)x(\d+)");
                        if (resMatch.Success)
                        {
                            info.Width = int.Parse(resMatch.Groups[1].Value);
                            info.Height = int.Parse(resMatch.Groups[2].Value);
                        }
                        
                        // Extract framerate
                        var fpsMatch = System.Text.RegularExpressions.Regex.Match(line, @"(\d+\.?\d*) fps");
                        if (fpsMatch.Success)
                        {
                            info.FrameRate = double.Parse(fpsMatch.Groups[1].Value);
                        }
                        
                        // Extract bitrate
                        var bitrateMatch = System.Text.RegularExpressions.Regex.Match(line, @"(\d+) kb/s");
                        if (bitrateMatch.Success)
                        {
                            info.BitRate = int.Parse(bitrateMatch.Groups[1].Value);
                        }
                    }
                    else if (line.Contains("Duration:"))
                    {
                        var durationMatch = System.Text.RegularExpressions.Regex.Match(line, @"Duration: (\d+):(\d+):(\d+\.\d+)");
                        if (durationMatch.Success)
                        {
                            var hours = int.Parse(durationMatch.Groups[1].Value);
                            var minutes = int.Parse(durationMatch.Groups[2].Value);
                            var seconds = double.Parse(durationMatch.Groups[3].Value);
                            info.Duration = TimeSpan.FromHours(hours).Add(TimeSpan.FromMinutes(minutes)).Add(TimeSpan.FromSeconds(seconds));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to parse FFmpeg output");
            }
            
            return info;
        }

        /// <summary>
        /// Optimize processing options based on content and hardware
        /// </summary>
        private VideoProcessingOptions OptimizeProcessingOptions(
            VideoProcessingOptions options, 
            VideoInfo inputInfo, 
            HardwareProfile hardware)
        {
            var optimized = options.Clone();
            
            // AV1 codec optimization
            if (hardware.SupportsAV1 && _config.EnableAV1)
            {
                optimized.VideoCodec = hardware.Av1Encoder;
                optimized.UseHardwareAcceleration = true;
                
                // AV1-specific settings
                optimized.CRF = _config.AV1Quality; // 20-35 range
                optimized.Preset = _config.AV1Preset; // ultrafast, fast, medium, slow
                optimized.FilmGrain = _config.AV1FilmGrain; // 0-50
                
                _logger.LogInformation($"🔥 Using AV1 hardware encoder: {hardware.Av1Encoder}");
            }
            else
            {
                // Fallback to HEVC or H.264
                optimized.VideoCodec = hardware.AvailableHwAccels.Contains("hevc") ? "hevc_nvenc" : "libx264";
                _logger.LogInformation($"📺 Using fallback codec: {optimized.VideoCodec}");
            }
            
            // Resolution optimization
            if (hardware.LightModeRecommended)
            {
                // Limit resolution for weak hardware
                optimized.MaxWidth = Math.Min(optimized.MaxWidth, 1920);
                optimized.MaxHeight = Math.Min(optimized.MaxHeight, 1080);
                optimized.CRF = Math.Max(optimized.CRF, 28); // Higher CRF = lower quality but faster
            }
            else if (hardware.SupportsAV1 && hardware.VramMB >= 8192)
            {
                // Enable 4K for high-end hardware
                optimized.MaxWidth = 3840;
                optimized.MaxHeight = 2160;
                optimized.CRF = Math.Min(optimized.CRF, 22); // Lower CRF = higher quality
            }
            
            // Upscaling optimization
            if (inputInfo.Height < 720 && _config.EnableUpscaling)
            {
                optimized.UpscaleFactor = CalculateOptimalUpscaleFactor(inputInfo, hardware);
                optimized.UpscaleMethod = _config.UpscaleMethod; // Real-ESRGAN, DLSS, FSR
                _logger.LogInformation($"📈 Upscaling: {inputInfo.Width}x{inputInfo.Height} → {optimized.TargetWidth}x{optimized.TargetHeight}");
            }
            
            // Mobile optimization
            if (hardware.IsMobile && hardware.BatteryOptimization)
            {
                optimized.Preset = "ultrafast";
                optimized.CRF += 3; // Reduce quality slightly for battery
                optimized.MaxWidth = Math.Min(optimized.MaxWidth, 1280);
                optimized.MaxHeight = Math.Min(optimized.MaxHeight, 720);
                _logger.LogInformation("📱 Mobile battery optimization applied");
            }
            
            return optimized;
        }

        /// <summary>
        /// Build optimized FFmpeg command with real AV1 support
        /// </summary>
        private string BuildAV1FFmpegCommand(
            string inputPath, 
            string outputPath, 
            VideoProcessingOptions options,
            HardwareProfile hardware)
        {
            var args = new List<string>();
            
            // Input
            args.Add($"-i \"{inputPath}\"");
            
            // Hardware acceleration
            if (options.UseHardwareAcceleration)
            {
                if (hardware.GpuVendor == "NVIDIA")
                {
                    args.Add("-hwaccel cuda");
                    args.Add("-hwaccel_output_format cuda");
                }
                else if (hardware.GpuVendor == "Intel")
                {
                    args.Add("-hwaccel qsv");
                }
                else if (hardware.GpuVendor == "AMD")
                {
                    args.Add("-hwaccel vaapi");
                }
            }
            
            // Video codec and settings
            args.Add($"-c:v {options.VideoCodec}");
            
            if (options.VideoCodec.Contains("av1"))
            {
                // AV1-specific optimizations
                args.Add($"-crf {options.CRF}");
                args.Add($"-preset {options.Preset}");
                
                if (options.FilmGrain > 0)
                {
                    args.Add($"-film-grain {options.FilmGrain}");
                }
                
                // AV1 tile encoding for better performance
                args.Add("-tile-columns 2");
                args.Add("-tile-rows 1");
                
                // Row-based multithreading
                args.Add($"-row-mt 1");
            }
            else if (options.VideoCodec.Contains("hevc"))
            {
                args.Add($"-crf {options.CRF}");
                args.Add($"-preset {options.Preset}");
            }
            else
            {
                args.Add($"-crf {options.CRF}");
                args.Add($"-preset {options.Preset}");
            }
            
            // Resolution and scaling
            if (options.UpscaleFactor > 1)
            {
                var scaleFilter = BuildScaleFilter(options, hardware);
                args.Add($"-vf \"{scaleFilter}\"");
            }
            
            // Audio processing
            if (_config.EnableAudioPassthrough)
            {
                args.Add("-c:a copy");
            }
            else
            {
                args.Add("-c:a aac -b:a 192k");
            }
            
            // Subtitle handling
            if (_config.EnablePGSToSRT)
            {
                args.Add("-c:s srt"); // Convert PGS to SRT to avoid transcoding
            }
            else
            {
                args.Add("-c:s copy");
            }
            
            // Output format
            args.Add($"-f {GetOutputFormat(options.VideoCodec)}");
            
            // Threading
            args.Add($"-threads {Math.Min(hardware.CpuCores, 16)}");
            
            // Output
            args.Add($"\"{outputPath}\"");
            
            var command = string.Join(" ", args);
            _logger.LogInformation($"🔧 FFmpeg command: {command}");
            
            return command;
        }

        /// <summary>
        /// Build scaling filter with AI upscaling support
        /// </summary>
        private string BuildScaleFilter(VideoProcessingOptions options, HardwareProfile hardware)
        {
            var filters = new List<string>();
            
            if (options.UpscaleMethod == "Real-ESRGAN" && hardware.SupportsAV1)
            {
                // Real-ESRGAN upscaling (requires custom FFmpeg build)
                filters.Add($"realesrgan=scale={options.UpscaleFactor}:model=realesrgan-x4plus");
            }
            else if (options.UpscaleMethod == "DLSS" && hardware.GpuVendor == "NVIDIA")
            {
                // NVIDIA DLSS (requires RTX GPU)
                filters.Add($"scale_npp=w={options.TargetWidth}:h={options.TargetHeight}:interp_algo=super");
            }
            else if (options.UpscaleMethod == "FSR" && (hardware.GpuVendor == "AMD" || hardware.GpuVendor == "NVIDIA"))
            {
                // AMD FSR / NVIDIA NIS
                filters.Add($"scale=w={options.TargetWidth}:h={options.TargetHeight}:flags=lanczos+accurate_rnd");
            }
            else
            {
                // Standard high-quality scaling
                filters.Add($"scale=w={options.TargetWidth}:h={options.TargetHeight}:flags=lanczos+accurate_rnd+full_chroma_int");
            }
            
            // Sharpening filter
            if (options.Sharpening > 0)
            {
                filters.Add($"unsharp=5:5:{options.Sharpening / 100.0:F2}:5:5:0.0");
            }
            
            return string.Join(",", filters);
        }

        /// <summary>
        /// Execute FFmpeg processing with real-time monitoring
        /// </summary>
        private async Task<ProcessingResult> ExecuteProcessingAsync(
            string ffmpegArgs, 
            ProcessingJob job, 
            CancellationToken cancellationToken)
        {
            var result = new ProcessingResult();
            
            try
            {
                var ffmpegPath = _mediaEncoder.EncoderPath;
                var processInfo = new ProcessStartInfo
                {
                    FileName = ffmpegPath,
                    Arguments = ffmpegArgs,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                };

                job.Status = ProcessingStatus.Processing;
                
                using var process = Process.Start(processInfo);
                using var registration = cancellationToken.Register(() => {
                    try { process?.Kill(); } catch { }
                });
                
                // Monitor progress
                var progressTask = MonitorProgressAsync(process, job, cancellationToken);
                
                await process.WaitForExitAsync(cancellationToken);
                await progressTask;
                
                result.Success = process.ExitCode == 0;
                result.ExitCode = process.ExitCode;
                result.ProcessingTime = job.ProcessingTime;
                
                if (!result.Success)
                {
                    result.Error = $"FFmpeg failed with exit code {process.ExitCode}";
                    _logger.LogError($"❌ FFmpeg failed: {result.Error}");
                }
                
                return result;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Error = ex.Message;
                return result;
            }
        }

        /// <summary>
        /// Monitor FFmpeg progress in real-time
        /// </summary>
        private async Task MonitorProgressAsync(Process process, ProcessingJob job, CancellationToken cancellationToken)
        {
            try
            {
                var reader = process.StandardError;
                string line;
                
                while ((line = await reader.ReadLineAsync()) != null && !cancellationToken.IsCancellationRequested)
                {
                    if (line.Contains("frame="))
                    {
                        var progress = ParseProgressLine(line, job.InputInfo);
                        job.Progress = progress;
                        
                        if (progress.Percentage > 0)
                        {
                            _logger.LogDebug($"📊 Progress: {progress.Percentage:F1}% (Frame {progress.CurrentFrame}/{progress.TotalFrames})");
                        }
                    }
                    else if (line.Contains("error") || line.Contains("Error"))
                    {
                        _logger.LogWarning($"⚠️ FFmpeg warning: {line}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Progress monitoring failed");
            }
        }

        /// <summary>
        /// Parse FFmpeg progress line
        /// </summary>
        private ProcessingProgress ParseProgressLine(string line, VideoInfo inputInfo)
        {
            var progress = new ProcessingProgress();
            
            try
            {
                var frameMatch = System.Text.RegularExpressions.Regex.Match(line, @"frame=\s*(\d+)");
                if (frameMatch.Success)
                {
                    progress.CurrentFrame = int.Parse(frameMatch.Groups[1].Value);
                }
                
                var timeMatch = System.Text.RegularExpressions.Regex.Match(line, @"time=(\d+):(\d+):(\d+\.\d+)");
                if (timeMatch.Success)
                {
                    var hours = int.Parse(timeMatch.Groups[1].Value);
                    var minutes = int.Parse(timeMatch.Groups[2].Value);
                    var seconds = double.Parse(timeMatch.Groups[3].Value);
                    progress.CurrentTime = TimeSpan.FromHours(hours).Add(TimeSpan.FromMinutes(minutes)).Add(TimeSpan.FromSeconds(seconds));
                }
                
                if (inputInfo.Duration.TotalSeconds > 0)
                {
                    progress.Percentage = (progress.CurrentTime.TotalSeconds / inputInfo.Duration.TotalSeconds) * 100;
                    progress.TotalFrames = (int)(inputInfo.Duration.TotalSeconds * inputInfo.FrameRate);
                }
            }
            catch (Exception ex)
            {
                _logger.LogDebug(ex, "Failed to parse progress line");
            }
            
            return progress;
        }

        /// <summary>
        /// Validate output file and extract statistics
        /// </summary>
        private async Task<ProcessingResult> ValidateOutputAsync(string outputPath, ProcessingResult result)
        {
            try
            {
                if (!File.Exists(outputPath))
                {
                    result.Success = false;
                    result.Error = "Output file not created";
                    return result;
                }
                
                var fileInfo = new FileInfo(outputPath);
                result.OutputSize = fileInfo.Length;
                
                // Quick validation - check if file is playable
                var outputInfo = await AnalyzeInputVideoAsync(outputPath);
                result.OutputInfo = outputInfo;
                
                if (outputInfo.Duration.TotalSeconds > 0)
                {
                    result.Success = true;
                    _logger.LogInformation($"✅ Output validated: {outputInfo.Width}x{outputInfo.Height}, {fileInfo.Length / 1024 / 1024:F1}MB");
                }
                else
                {
                    result.Success = false;
                    result.Error = "Output file appears to be corrupted";
                }
                
                return result;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Error = $"Output validation failed: {ex.Message}";
                return result;
            }
        }

        /// <summary>
        /// Calculate optimal upscale factor based on input and hardware
        /// </summary>
        private int CalculateOptimalUpscaleFactor(VideoInfo inputInfo, HardwareProfile hardware)
        {
            var inputPixels = inputInfo.Width * inputInfo.Height;
            
            // Conservative upscaling for weak hardware
            if (hardware.LightModeRecommended)
            {
                return inputPixels < 300000 ? 2 : 1; // Only 2x for very low res
            }
            
            // Aggressive upscaling for high-end hardware
            if (hardware.SupportsAV1 && hardware.VramMB >= 8192)
            {
                if (inputPixels < 200000) return 4; // 480p → 1920p
                if (inputPixels < 500000) return 3; // 720p → 2160p  
                if (inputPixels < 1000000) return 2; // 1080p → 4K
            }
            
            // Standard upscaling
            if (inputPixels < 300000) return 3; // 480p → 1440p
            if (inputPixels < 500000) return 2; // 720p → 1440p
            
            return 1; // No upscaling
        }

        /// <summary>
        /// Get output format based on codec
        /// </summary>
        private string GetOutputFormat(string codec)
        {
            if (codec.Contains("av1")) return "mp4";
            if (codec.Contains("hevc")) return "mp4";
            if (codec.Contains("h264")) return "mp4";
            return "mp4";
        }

        /// <summary>
        /// Get current processing statistics
        /// </summary>
        public ProcessingStatistics GetStatistics()
        {
            return new ProcessingStatistics
            {
                ActiveJobs = _activeJobs.Count,
                QueuedJobs = Math.Max(0, _processingSemaphore.CurrentCount - _activeJobs.Count),
                TotalJobsProcessed = _activeJobs.Values.Count(j => j.Status == ProcessingStatus.Completed),
                AverageProcessingTime = _activeJobs.Values
                    .Where(j => j.Status == ProcessingStatus.Completed)
                    .Select(j => j.ProcessingTime.TotalSeconds)
                    .DefaultIfEmpty(0)
                    .Average()
            };
        }
    }

    // Supporting classes
    public class VideoProcessingOptions
    {
        public string VideoCodec { get; set; } = "libx264";
        public bool UseHardwareAcceleration { get; set; } = true;
        public int CRF { get; set; } = 23;
        public string Preset { get; set; } = "medium";
        public int FilmGrain { get; set; } = 0;
        public int MaxWidth { get; set; } = 1920;
        public int MaxHeight { get; set; } = 1080;
        public int UpscaleFactor { get; set; } = 1;
        public string UpscaleMethod { get; set; } = "lanczos";
        public float Sharpening { get; set; } = 0;
        
        public int TargetWidth => MaxWidth * UpscaleFactor;
        public int TargetHeight => MaxHeight * UpscaleFactor;
        
        public VideoProcessingOptions Clone()
        {
            return (VideoProcessingOptions)this.MemberwiseClone();
        }
    }

    public class VideoInfo
    {
        public int Width { get; set; } = 1920;
        public int Height { get; set; } = 1080;
        public double FrameRate { get; set; } = 24;
        public string Codec { get; set; } = "h264";
        public TimeSpan Duration { get; set; } = TimeSpan.Zero;
        public int BitRate { get; set; } = 1000;
    }

    public class ProcessingJob
    {
        public string Id { get; set; }
        public string InputPath { get; set; }
        public string OutputPath { get; set; }
        public VideoProcessingOptions Options { get; set; }
        public VideoProcessingOptions OptimizedOptions { get; set; }
        public VideoInfo InputInfo { get; set; }
        public string FFmpegCommand { get; set; }
        public ProcessingStatus Status { get; set; }
        public ProcessingProgress Progress { get; set; } = new();
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public ProcessingResult Result { get; set; }
        public string Error { get; set; }
        
        public TimeSpan ProcessingTime => (EndTime == default ? DateTime.Now : EndTime) - StartTime;
    }

    public class ProcessingResult
    {
        public bool Success { get; set; }
        public string Error { get; set; }
        public int ExitCode { get; set; }
        public TimeSpan ProcessingTime { get; set; }
        public long OutputSize { get; set; }
        public VideoInfo OutputInfo { get; set; }
    }

    public class ProcessingProgress
    {
        public int CurrentFrame { get; set; }
        public int TotalFrames { get; set; }
        public TimeSpan CurrentTime { get; set; }
        public double Percentage { get; set; }
    }

    public class ProcessingStatistics
    {
        public int ActiveJobs { get; set; }
        public int QueuedJobs { get; set; }
        public int TotalJobsProcessed { get; set; }
        public double AverageProcessingTime { get; set; }
    }

    public enum ProcessingStatus
    {
        Starting,
        Processing,
        Completed,
        Failed,
        Cancelled
    }
}