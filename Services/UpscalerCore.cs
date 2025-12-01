using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Controller.MediaEncoding;
using MediaBrowser.Model.IO;
using Microsoft.ML.OnnxRuntime;
using OpenCvSharp;
using FFMpegCore;
using System.Drawing;
using System.Text.Json;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using Image = SixLabors.ImageSharp.Image;
using SixLabors.ImageSharp.PixelFormats;

namespace JellyfinUpscalerPlugin.Services
{
    /// <summary>
    /// Moteur de suréchantillonnage avec accélération matérielle IA
    /// </summary>
    public class UpscalerCore : IDisposable
    {
        private readonly ILogger<UpscalerCore> _logger;
        private readonly IMediaEncoder _mediaEncoder;
        private readonly IFileSystem _fileSystem;
        private readonly IApplicationPaths _appPaths;
        private readonly PluginConfiguration _config;
        
        private readonly Dictionary<string, InferenceSession> _modelSessions = new();
        private readonly Dictionary<string, SessionOptions> _sessionOptions = new();
        
        private static Dictionary<string, object> _hardwareCache = new();
        private static DateTime _lastHardwareCheck = DateTime.MinValue;
        
        private readonly Dictionary<string, PerformanceMetrics> _performanceMetrics = new();
        
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
            
            InitializeAIModels();
        }

        private void InitializeAIModels()
        {
            try
            {
                _logger.LogInformation("🚀 Initialisation des modèles IA avec ONNX Runtime...");
                
                var sessionOptions = new SessionOptions
                {
                    LogSeverityLevel = OrtLoggingLevel.ORT_LOGGING_LEVEL_WARNING,
                    EnableCpuMemArena = true,
                    EnableMemoryPattern = true,
                    GraphOptimizationLevel = GraphOptimizationLevel.ORT_ENABLE_ALL
                };

                try
                {
                    if (_config.EnableHardwareAcceleration)
                    {
                        try
                        {
                            sessionOptions.AppendExecutionProvider_CUDA(0);
                            _logger.LogInformation("✅ Accélération GPU CUDA activée");
                        }
                        catch
                        {
                            try
                            {
                                sessionOptions.AppendExecutionProvider_DML(0);
                                _logger.LogInformation("✅ Accélération GPU DirectML activée");
                            }
                            catch
                            {
                                _logger.LogWarning("⚠️ Accélération GPU non disponible, utilisation du CPU");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "⚠️ Échec de l'activation de l'accélération matérielle");
                }

                _sessionOptions["default"] = sessionOptions;
                LoadAvailableModels();
                
                _logger.LogInformation($"✅ Noyau IA initialisé avec {_modelSessions.Count} modèles");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Échec de l'initialisation des modèles IA");
            }
        }

        private void LoadAvailableModels()
        {
            var modelsPath = Path.Combine(_appPaths.DataPath, "plugins", "configurations", "JellyfinUpscalerPlugin", "models");
            
            if (!Directory.Exists(modelsPath))
            {
                Directory.CreateDirectory(modelsPath);
                _logger.LogInformation($"📁 Répertoire des modèles créé: {modelsPath}");
                return;
            }

            var modelFiles = Directory.GetFiles(modelsPath, "*.onnx");
            
            foreach (var modelFile in modelFiles)
            {
                try
                {
                    var modelName = Path.GetFileNameWithoutExtension(modelFile);
                    var session = new InferenceSession(modelFile, _sessionOptions["default"]);
                    _modelSessions[modelName] = session;
                    
                    _logger.LogInformation($"📦 Modèle IA chargé: {modelName}");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, $"⚠️ Échec du chargement du modèle: {Path.GetFileName(modelFile)}");
                }
            }
            
            if (_modelSessions.Count == 0)
            {
                _logger.LogWarning("⚠️ Aucun modèle ONNX trouvé. Veuillez ajouter des modèles IA dans le répertoire models.");
                CreatePlaceholderModels();
            }
        }

        private void CreatePlaceholderModels()
        {
            var placeholderModels = new[] { "realesrgan", "esrgan", "waifu2x", "srcnn", "fsrcnn", "edsr", "swinir", "hat" };
            
            foreach (var model in placeholderModels)
            {
                _modelSessions[model] = null;
                _logger.LogDebug($"📝 Placeholder créé pour le modèle: {model}");
            }
        }

        public async Task<HardwareProfile> DetectHardwareAsync()
        {
            if (_hardwareCache.ContainsKey("profile") && DateTime.Now - _lastHardwareCheck < TimeSpan.FromMinutes(5))
            {
                return _hardwareCache["profile"] as HardwareProfile;
            }

            _logger.LogInformation("🔍 Détection des capacités matérielles...");
            
            var profile = new HardwareProfile();
            
            try
            {
                await DetectGpuCapabilities(profile);
                await DetectSystemResources(profile);
                await DetectFFmpegAcceleration(profile);
                await DetectOpenCVAcceleration(profile);
                ApplyHardwareOptimizations(profile);
                
                _hardwareCache["profile"] = profile;
                _lastHardwareCheck = DateTime.Now;
                
                _logger.LogInformation($"✅ Profil matériel: {profile.GpuVendor} {profile.GpuModel}, CUDA: {profile.SupportsCUDA}");
                
                return profile;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Échec de la détection matérielle, utilisation du profil de secours");
                return GetFallbackProfile();
            }
        }

        private async Task DetectGpuCapabilities(HardwareProfile profile)
        {
            try
            {
                var providers = OrtEnv.Instance().GetAvailableProviders();
                profile.AvailableProviders = providers.ToList();
                
                if (providers.Contains("CUDAExecutionProvider"))
                {
                    profile.SupportsCUDA = true;
                    profile.GpuVendor = "NVIDIA";
                    await DetectNvidiaGpu(profile);
                }
                else if (providers.Contains("DmlExecutionProvider"))
                {
                    profile.SupportsDirectML = true;
                    profile.GpuVendor = "DirectML";
                    await DetectDirectMLGpu(profile);
                }
                else
                {
                    profile.GpuVendor = "CPU";
                    _logger.LogInformation("🖥️ Utilisation de l'inférence CPU");
                }
                
                _logger.LogInformation($"🔧 Fournisseurs disponibles: {string.Join(", ", providers)}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Échec de la détection GPU");
            }
        }

        private async Task DetectNvidiaGpu(HardwareProfile profile)
        {
            try
            {
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
                
                _logger.LogInformation($"🎮 GPU NVIDIA: {profile.GpuModel} ({profile.VramMB}MB VRAM)");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Échec de la détection GPU NVIDIA");
            }
        }

        private async Task DetectDirectMLGpu(HardwareProfile profile)
        {
            try
            {
                profile.GpuModel = "GPU Compatible DirectML";
                profile.SupportsDirectML = true;
                
                _logger.LogInformation("🎮 Accélération GPU DirectML disponible");
                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Échec de la détection DirectML");
            }
        }

        private async Task DetectSystemResources(HardwareProfile profile)
        {
            try
            {
                var totalMemory = GC.GetTotalMemory(false);
                profile.SystemRamMB = (int)(totalMemory / 1024 / 1024);
                profile.CpuCores = Environment.ProcessorCount;
                
                var tempPath = Path.GetTempPath();
                var driveInfo = new DriveInfo(Path.GetPathRoot(tempPath));
                profile.TempDiskSpaceGB = (int)(driveInfo.AvailableFreeSpace / 1024 / 1024 / 1024);
                
                _logger.LogInformation($"💾 Système: {profile.SystemRamMB}MB RAM, {profile.CpuCores} cœurs CPU, {profile.TempDiskSpaceGB}GB temp");
                
                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Échec de la détection des ressources système");
            }
        }

        private async Task DetectFFmpegAcceleration(HardwareProfile profile)
        {
            try
            {
                var ffmpegPath = _mediaEncoder.EncoderPath;
                if (string.IsNullOrEmpty(ffmpegPath))
                {
                    _logger.LogWarning("⚠️ Chemin FFmpeg non disponible");
                    return;
                }

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
                
                profile.AvailableHwAccels = output.Split('\n')
                    .Where(line => !string.IsNullOrWhiteSpace(line) && !line.Contains("Hardware"))
                    .Select(line => line.Trim())
                    .ToList();

                _logger.LogInformation($"🎬 Accélération FFmpeg: {string.Join(", ", profile.AvailableHwAccels)}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Échec de la détection d'accélération FFmpeg");
            }
        }

        private async Task DetectOpenCVAcceleration(HardwareProfile profile)
        {
            try
            {
                var buildInfo = Cv2.GetBuildInformation();
                profile.OpenCVInfo = buildInfo;
                profile.OpenCVSupportsCUDA = buildInfo.Contains("CUDA");
                
                _logger.LogInformation($"🖼️ OpenCV: CUDA={profile.OpenCVSupportsCUDA}");
                
                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Échec de la détection d'accélération OpenCV");
            }
        }

        private void ApplyHardwareOptimizations(HardwareProfile profile)
        {
            if (profile.SupportsCUDA && profile.VramMB > 4096)
            {
                profile.RecommendedModel = "realesrgan";
                profile.MaxConcurrentStreams = 2;
                profile.RecommendedScale = 4;
            }
            else if (profile.SupportsDirectML)
            {
                profile.RecommendedModel = "esrgan";
                profile.MaxConcurrentStreams = 1;
                profile.RecommendedScale = 2;
            }
            else if (profile.CpuCores >= 8)
            {
                profile.RecommendedModel = "fsrcnn";
                profile.MaxConcurrentStreams = 1;
                profile.RecommendedScale = 2;
            }
            else
            {
                profile.RecommendedModel = "bicubic";
                profile.MaxConcurrentStreams = 1;
                profile.RecommendedScale = 2;
            }
            
            _logger.LogInformation($"🎯 Optimisé: {profile.RecommendedModel} @ {profile.RecommendedScale}x, {profile.MaxConcurrentStreams} flux");
        }

        private string FindNvidiaSmi()
        {
            var possiblePaths = new[]
            {
                @"C:\Program Files\NVIDIA Corporation\NVSMI\nvidia-smi.exe",
                @"C:\Windows\System32\nvidia-smi.exe",
                "/usr/bin/nvidia-smi",
                "/usr/local/cuda/bin/nvidia-smi"
            };

            return possiblePaths.FirstOrDefault(File.Exists) ?? "";
        }

        private HardwareProfile GetFallbackProfile()
        {
            return new HardwareProfile
            {
                GpuVendor = "CPU",
                GpuModel = "Secours Logiciel",
                CpuCores = Environment.ProcessorCount,
                SystemRamMB = 4096,
                RecommendedModel = "bicubic",
                RecommendedScale = 2,
                MaxConcurrentStreams = 1
            };
        }

        public async Task<byte[]> UpscaleImageAsync(byte[] inputImage, string model, int scale = 2)
        {
            if (inputImage == null || inputImage.Length == 0)
                throw new ArgumentException("L'image d'entrée ne peut pas être null ou vide", nameof(inputImage));
            
            if (string.IsNullOrWhiteSpace(model))
                throw new ArgumentException("Le nom du modèle ne peut pas être null ou vide", nameof(model));
            
            if (scale < 1 || scale > 8)
                throw new ArgumentOutOfRangeException(nameof(scale), "L'échelle doit être entre 1 et 8");
            
            try
            {
                if (!_modelSessions.ContainsKey(model) || _modelSessions[model] == null)
                {
                    _logger.LogWarning($"⚠️ Modèle '{model}' non disponible, utilisation du suréchantillonnage de secours");
                    return FallbackUpscaleAsync(inputImage, scale);
                }

                var session = _modelSessions[model];
                using var image = Image.Load<Rgb24>(inputImage);
                
                if (image.Width * image.Height > 16777216)
                {
                    _logger.LogWarning($"⚠️ Image trop grande ({image.Width}x{image.Height}), utilisation du secours");
                    return FallbackUpscaleAsync(inputImage, scale);
                }
                
                _logger.LogInformation($"🔄 Suréchantillonnage {image.Width}x{image.Height} avec '{model}' à {scale}x");
                
                var inputTensor = PrepareInputTensor(image);
                var inputs = new List<NamedOnnxValue> { NamedOnnxValue.CreateFromTensor("input", inputTensor) };
                var outputs = session.Run(inputs);
                
                var outputTensor = outputs.First().AsEnumerable<float>().ToArray();
                var outputImage = ProcessOutputTensor(outputTensor, image.Width * scale, image.Height * scale);
                
                using var outputStream = new MemoryStream();
                outputImage.SaveAsJpeg(outputStream);
                
                _logger.LogInformation($"✅ Suréchantillonnage réussi vers {outputImage.Width}x{outputImage.Height}");
                return outputStream.ToArray();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"❌ Échec du suréchantillonnage IA pour '{model}': {ex.Message}");
                return FallbackUpscaleAsync(inputImage, scale);
            }
        }

        private byte[] FallbackUpscaleAsync(byte[] inputImage, int scale)
        {
            try
            {
                _logger.LogInformation($"📐 Utilisation du suréchantillonnage Lanczos3 de secours à {scale}x");
                
                using var image = Image.Load(inputImage);
                image.Mutate(x => x.Resize(image.Width * scale, image.Height * scale, KnownResamplers.Lanczos3));
                
                using var outputStream = new MemoryStream();
                image.SaveAsJpeg(outputStream);
                
                return outputStream.ToArray();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"❌ Échec du suréchantillonnage de secours: {ex.Message}");
                return inputImage;
            }
        }

        private Microsoft.ML.OnnxRuntime.Tensors.Tensor<float> PrepareInputTensor(Image<Rgb24> image)
        {
            var width = image.Width;
            var height = image.Height;
            var tensor = new Microsoft.ML.OnnxRuntime.Tensors.DenseTensor<float>(new[] { 1, 3, height, width });
            
            image.ProcessPixelRows(accessor =>
            {
                for (int y = 0; y < height; y++)
                {
                    var pixelRow = accessor.GetRowSpan(y);
                    for (int x = 0; x < width; x++)
                    {
                        var pixel = pixelRow[x];
                        tensor[0, 0, y, x] = pixel.R / 255.0f;
                        tensor[0, 1, y, x] = pixel.G / 255.0f;
                        tensor[0, 2, y, x] = pixel.B / 255.0f;
                    }
                }
            });
            
            return tensor;
        }

        private Image<Rgb24> ProcessOutputTensor(float[] tensorData, int width, int height)
        {
            var image = new Image<Rgb24>(width, height);
            
            image.ProcessPixelRows(accessor =>
            {
                for (int y = 0; y < height; y++)
                {
                    var pixelRow = accessor.GetRowSpan(y);
                    for (int x = 0; x < width; x++)
                    {
                        var r = Math.Clamp(tensorData[0 * height * width + y * width + x], 0.0f, 1.0f);
                        var g = Math.Clamp(tensorData[1 * height * width + y * width + x], 0.0f, 1.0f);
                        var b = Math.Clamp(tensorData[2 * height * width + y * width + x], 0.0f, 1.0f);
                        
                        pixelRow[x] = new Rgb24((byte)(r * 255), (byte)(g * 255), (byte)(b * 255));
                    }
                }
            });
            
            return image;
        }

        public void Dispose()
        {
            foreach (var session in _modelSessions.Values)
            {
                session?.Dispose();
            }
            _modelSessions.Clear();
            
            foreach (var option in _sessionOptions.Values)
            {
                option?.Dispose();
            }
            _sessionOptions.Clear();
        }
    }

    public class HardwareProfile
    {
        public string GpuVendor { get; set; } = "";
        public string GpuModel { get; set; } = "";
        public string DriverVersion { get; set; } = "";
        public int VramMB { get; set; }
        public int CpuCores { get; set; }
        public int SystemRamMB { get; set; }
        public int TempDiskSpaceGB { get; set; }
        
        public bool SupportsCUDA { get; set; }
        public bool SupportsDirectML { get; set; }
        public bool OpenCVSupportsCUDA { get; set; }
        
        public List<string> AvailableProviders { get; set; } = new();
        public List<string> AvailableHwAccels { get; set; } = new();
        public string OpenCVInfo { get; set; } = "";
        
        public string RecommendedModel { get; set; } = "";
        public int RecommendedScale { get; set; } = 2;
        public int MaxConcurrentStreams { get; set; } = 1;
    }

    public class PerformanceMetrics
    {
        public string ModelName { get; set; } = "";
        public double ProcessingTimeMs { get; set; }
        public double MemoryUsageMB { get; set; }
        public double CpuUsage { get; set; }
        public double GpuUsage { get; set; }
        public DateTime Timestamp { get; set; }
    }
}