using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using System.Threading;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Multi-GPU Manager
    /// Distributes upscaling workload across multiple GPUs for improved performance
    /// </summary>
    public class MultiGPUManager
    {
        private readonly ILogger<MultiGPUManager> _logger;
        private readonly PluginConfiguration _config;
        private readonly Dictionary<int, GPUDevice> _availableGPUs;
        private readonly ConcurrentQueue<UpscalingTask> _taskQueue;
        private readonly Dictionary<int, GPUWorkload> _gpuWorkloads;
        private readonly SemaphoreSlim _schedulerSemaphore;
        private bool _isEnabled;
        
        public MultiGPUManager(ILogger<MultiGPUManager> logger)
        {
            _logger = logger;
            _config = Plugin.Instance?.Configuration ?? new PluginConfiguration();
            _availableGPUs = new Dictionary<int, GPUDevice>();
            _taskQueue = new ConcurrentQueue<UpscalingTask>();
            _gpuWorkloads = new Dictionary<int, GPUWorkload>();
            _schedulerSemaphore = new SemaphoreSlim(1, 1);
            
            InitializeMultiGPU();
        }
        
        private void InitializeMultiGPU()
        {
            try
            {
                var gpuDevices = DetectAvailableGPUs();
                
                if (gpuDevices.Count <= 1)
                {
                    _logger.LogInformation("📊 Single GPU detected - Multi-GPU disabled");
                    _isEnabled = false;
                    return;
                }
                
                foreach (var gpu in gpuDevices)
                {
                    _availableGPUs[gpu.DeviceId] = gpu;
                    _gpuWorkloads[gpu.DeviceId] = new GPUWorkload
                    {
                        DeviceId = gpu.DeviceId,
                        CurrentTasks = new List<UpscalingTask>(),
                        TotalProcessingTime = TimeSpan.Zero,
                        TaskCount = 0
                    };
                }
                
                _isEnabled = true;
                _logger.LogInformation($"🚀 Multi-GPU initialized with {gpuDevices.Count} GPUs: {string.Join(", ", gpuDevices.Select(g => g.Name))}");
                
                // Start workload balancer
                _ = Task.Run(WorkloadBalancerLoop);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to initialize Multi-GPU support");
                _isEnabled = false;
            }
        }
        
        private List<GPUDevice> DetectAvailableGPUs()
        {
            var gpus = new List<GPUDevice>();
            
            try
            {
                // Detect NVIDIA GPUs
                var nvidiaGPUs = DetectNVIDIAGPUs();
                gpus.AddRange(nvidiaGPUs);
                
                // Detect AMD GPUs
                var amdGPUs = DetectAMDGPUs();
                gpus.AddRange(amdGPUs);
                
                // Detect Intel GPUs
                var intelGPUs = DetectIntelGPUs();
                gpus.AddRange(intelGPUs);
                
                _logger.LogInformation($"🔍 Detected {gpus.Count} GPU devices");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to detect GPU devices");
            }
            
            return gpus;
        }
        
        private List<GPUDevice> DetectNVIDIAGPUs()
        {
            var gpus = new List<GPUDevice>();
            
            try
            {
                // Simulate NVIDIA GPU detection
                // In real implementation, this would use NVIDIA Management Library (NVML)
                for (int i = 0; i < 2; i++) // Simulate 2 NVIDIA GPUs
                {
                    gpus.Add(new GPUDevice
                    {
                        DeviceId = i,
                        Name = $"NVIDIA GeForce RTX 4080 #{i}",
                        Vendor = GPUVendor.NVIDIA,
                        MemoryMB = 16384,
                        ComputeCapability = "8.9",
                        MaxConcurrentTasks = 3,
                        PowerEfficiency = 0.85f,
                        PerformanceIndex = 95.0f,
                        SupportedModels = new[] { "Real-ESRGAN", "HAT", "EDSR", "SwinIR" }
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to detect NVIDIA GPUs");
            }
            
            return gpus;
        }
        
        private List<GPUDevice> DetectAMDGPUs()
        {
            var gpus = new List<GPUDevice>();
            
            try
            {
                // Simulate AMD GPU detection
                // In real implementation, this would use AMD Display Library (ADL)
                gpus.Add(new GPUDevice
                {
                    DeviceId = 100,
                    Name = "AMD Radeon RX 7900 XTX",
                    Vendor = GPUVendor.AMD,
                    MemoryMB = 24576,
                    ComputeCapability = "RDNA3",
                    MaxConcurrentTasks = 2,
                    PowerEfficiency = 0.75f,
                    PerformanceIndex = 88.0f,
                    SupportedModels = new[] { "Real-ESRGAN", "EDSR", "FSRCNN" }
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to detect AMD GPUs");
            }
            
            return gpus;
        }
        
        private List<GPUDevice> DetectIntelGPUs()
        {
            var gpus = new List<GPUDevice>();
            
            try
            {
                // Simulate Intel GPU detection
                // In real implementation, this would use Intel Graphics Performance API
                gpus.Add(new GPUDevice
                {
                    DeviceId = 200,
                    Name = "Intel Arc A770",
                    Vendor = GPUVendor.Intel,
                    MemoryMB = 16384,
                    ComputeCapability = "Xe-HPG",
                    MaxConcurrentTasks = 2,
                    PowerEfficiency = 0.90f,
                    PerformanceIndex = 78.0f,
                    SupportedModels = new[] { "EDSR", "FSRCNN", "SRCNN" }
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to detect Intel GPUs");
            }
            
            return gpus;
        }
        
        /// <summary>
        /// Submit upscaling task to multi-GPU queue
        /// </summary>
        public async Task<UpscalingResult> SubmitUpscalingTaskAsync(UpscalingRequest request)
        {
            if (!_isEnabled)
            {
                return await FallbackToSingleGPU(request);
            }
            
            try
            {
                var task = new UpscalingTask
                {
                    Id = Guid.NewGuid().ToString(),
                    Request = request,
                    Priority = CalculateTaskPriority(request),
                    SubmittedAt = DateTime.Now,
                    Status = TaskStatus.Queued
                };
                
                _taskQueue.Enqueue(task);
                
                _logger.LogInformation($"📤 Task {task.Id} queued for multi-GPU processing");
                
                // Wait for task completion
                return await WaitForTaskCompletion(task.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Multi-GPU task submission failed");
                return await FallbackToSingleGPU(request);
            }
        }
        
        private int CalculateTaskPriority(UpscalingRequest request)
        {
            var priority = 5; // Default priority
            
            // Higher priority for real-time streaming
            if (request.IsRealTime) priority += 3;
            
            // Higher priority for smaller files (process faster)
            if (request.FileSizeMB < 100) priority += 2;
            
            // Lower priority for batch processing
            if (request.IsBatchProcessing) priority -= 2;
            
            return Math.Max(1, Math.Min(10, priority));
        }
        
        private async Task WorkloadBalancerLoop()
        {
            while (_isEnabled)
            {
                try
                {
                    await _schedulerSemaphore.WaitAsync();
                    
                    // Process queued tasks
                    while (_taskQueue.TryDequeue(out var task))
                    {
                        var bestGPU = SelectOptimalGPU(task);
                        if (bestGPU != null)
                        {
                            await AssignTaskToGPU(task, bestGPU);
                        }
                        else
                        {
                            // No GPU available, re-queue task
                            _taskQueue.Enqueue(task);
                            break;
                        }
                    }
                    
                    // Update GPU statistics
                    UpdateGPUStatistics();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in workload balancer");
                }
                finally
                {
                    _schedulerSemaphore.Release();
                }
                
                await Task.Delay(100); // Check every 100ms
            }
        }
        
        private GPUDevice SelectOptimalGPU(UpscalingTask task)
        {
            var availableGPUs = _availableGPUs.Values
                .Where(gpu => CanHandleTask(gpu, task))
                .OrderBy(gpu => CalculateGPUScore(gpu, task))
                .ToList();
            
            return availableGPUs.FirstOrDefault();
        }
        
        private bool CanHandleTask(GPUDevice gpu, UpscalingTask task)
        {
            // Check if GPU supports the required AI model
            if (!gpu.SupportedModels.Contains(task.Request.AIModel))
                return false;
            
            // Check if GPU has available slots
            var workload = _gpuWorkloads[gpu.DeviceId];
            if (workload.CurrentTasks.Count >= gpu.MaxConcurrentTasks)
                return false;
            
            // Check memory requirements
            var estimatedMemoryUsage = EstimateMemoryUsage(task.Request);
            var currentMemoryUsage = CalculateCurrentMemoryUsage(gpu.DeviceId);
            
            return (currentMemoryUsage + estimatedMemoryUsage) <= (gpu.MemoryMB * 0.9f);
        }
        
        private float CalculateGPUScore(GPUDevice gpu, UpscalingTask task)
        {
            var workload = _gpuWorkloads[gpu.DeviceId];
            
            // Lower score = better choice
            var score = 0.0f;
            
            // Current workload factor (0-1)
            var workloadFactor = (float)workload.CurrentTasks.Count / gpu.MaxConcurrentTasks;
            score += workloadFactor * 40;
            
            // Performance factor (inverse - higher performance = lower score)
            var performanceFactor = (100 - gpu.PerformanceIndex) / 100;
            score += performanceFactor * 30;
            
            // Memory usage factor
            var memoryUsage = CalculateCurrentMemoryUsage(gpu.DeviceId) / gpu.MemoryMB;
            score += memoryUsage * 20;
            
            // Model compatibility factor
            var isOptimalModel = IsOptimalModelForGPU(task.Request.AIModel, gpu);
            if (!isOptimalModel) score += 10;
            
            return score;
        }
        
        private bool IsOptimalModelForGPU(string aiModel, GPUDevice gpu)
        {
            return gpu.Vendor switch
            {
                GPUVendor.NVIDIA => aiModel.Contains("Real-ESRGAN") || aiModel.Contains("HAT"),
                GPUVendor.AMD => aiModel.Contains("EDSR") || aiModel.Contains("Real-ESRGAN"),
                GPUVendor.Intel => aiModel.Contains("FSRCNN") || aiModel.Contains("EDSR"),
                _ => true
            };
        }
        
        private float EstimateMemoryUsage(UpscalingRequest request)
        {
            // Estimate memory usage based on input resolution and model
            var pixels = request.InputWidth * request.InputHeight;
            var baseMemory = pixels / 1000000.0f * 100; // ~100MB per megapixel
            
            var modelMultiplier = request.AIModel switch
            {
                "Real-ESRGAN" => 2.5f,
                "HAT" => 3.0f,
                "SwinIR" => 2.0f,
                "EDSR" => 1.5f,
                "FSRCNN" => 0.8f,
                "SRCNN" => 0.6f,
                _ => 1.0f
            };
            
            return baseMemory * modelMultiplier * request.UpscaleFactor;
        }
        
        private float CalculateCurrentMemoryUsage(int gpuId)
        {
            var workload = _gpuWorkloads[gpuId];
            return workload.CurrentTasks.Sum(t => EstimateMemoryUsage(t.Request));
        }
        
        private async Task AssignTaskToGPU(UpscalingTask task, GPUDevice gpu)
        {
            try
            {
                task.AssignedGPU = gpu;
                task.Status = TaskStatus.Processing;
                task.StartedAt = DateTime.Now;
                
                var workload = _gpuWorkloads[gpu.DeviceId];
                workload.CurrentTasks.Add(task);
                workload.TaskCount++;
                
                _logger.LogInformation($"🎯 Task {task.Id} assigned to {gpu.Name}");
                
                // Start processing on GPU
                _ = Task.Run(() => ProcessTaskOnGPU(task, gpu));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to assign task to GPU {gpu.Name}");
                task.Status = TaskStatus.Failed;
                task.ErrorMessage = ex.Message;
            }
        }
        
        private async Task ProcessTaskOnGPU(UpscalingTask task, GPUDevice gpu)
        {
            try
            {
                _logger.LogInformation($"⚡ Processing task {task.Id} on {gpu.Name}");
                
                // Simulate GPU processing
                var processingTime = EstimateProcessingTime(task.Request, gpu);
                await Task.Delay(processingTime);
                
                // Simulate successful processing
                task.Result = new UpscalingResult
                {
                    Success = true,
                    OutputPath = $"upscaled_{task.Id}.mp4",
                    ProcessingTime = DateTime.Now - task.StartedAt.Value,
                    GPUUsed = gpu.Name,
                    Quality = CalculateQuality(task.Request, gpu)
                };
                
                task.Status = TaskStatus.Completed;
                task.CompletedAt = DateTime.Now;
                
                _logger.LogInformation($"✅ Task {task.Id} completed on {gpu.Name} in {task.Result.ProcessingTime.TotalSeconds:F1}s");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Task processing failed on {gpu.Name}");
                task.Status = TaskStatus.Failed;
                task.ErrorMessage = ex.Message;
                task.Result = new UpscalingResult { Success = false, ErrorMessage = ex.Message };
            }
            finally
            {
                // Remove task from GPU workload
                var workload = _gpuWorkloads[gpu.DeviceId];
                workload.CurrentTasks.Remove(task);
                workload.TotalProcessingTime += task.CompletedAt.GetValueOrDefault(DateTime.Now) - task.StartedAt.GetValueOrDefault(DateTime.Now);
            }
        }
        
        private int EstimateProcessingTime(UpscalingRequest request, GPUDevice gpu)
        {
            var baseTime = (request.InputWidth * request.InputHeight) / 1000000.0f * 1000; // 1s per megapixel
            
            var modelFactor = request.AIModel switch
            {
                "Real-ESRGAN" => 3.0f,
                "HAT" => 4.0f,
                "SwinIR" => 2.5f,
                "EDSR" => 2.0f,
                "FSRCNN" => 0.5f,
                "SRCNN" => 0.3f,
                _ => 1.0f
            };
            
            var gpuFactor = 100.0f / gpu.PerformanceIndex;
            var scaleFactor = request.UpscaleFactor * request.UpscaleFactor;
            
            return (int)(baseTime * modelFactor * gpuFactor * scaleFactor);
        }
        
        private float CalculateQuality(UpscalingRequest request, GPUDevice gpu)
        {
            var baseQuality = 0.8f;
            
            // Better GPUs = better quality
            baseQuality += (gpu.PerformanceIndex - 50) / 100.0f * 0.2f;
            
            // Better models = better quality
            var modelQuality = request.AIModel switch
            {
                "Real-ESRGAN" => 0.95f,
                "HAT" => 0.92f,
                "SwinIR" => 0.88f,
                "EDSR" => 0.85f,
                "FSRCNN" => 0.75f,
                "SRCNN" => 0.70f,
                _ => 0.80f
            };
            
            return Math.Min(1.0f, (baseQuality + modelQuality) / 2);
        }
        
        private async Task<UpscalingResult> WaitForTaskCompletion(string taskId)
        {
            var timeout = TimeSpan.FromMinutes(30); // 30 minute timeout
            var startTime = DateTime.Now;
            
            while (DateTime.Now - startTime < timeout)
            {
                // Check all GPU workloads for completed task
                foreach (var workload in _gpuWorkloads.Values)
                {
                    var completedTask = workload.CurrentTasks
                        .FirstOrDefault(t => t.Id == taskId && t.Status == TaskStatus.Completed);
                    
                    if (completedTask != null)
                    {
                        return completedTask.Result;
                    }
                    
                    var failedTask = workload.CurrentTasks
                        .FirstOrDefault(t => t.Id == taskId && t.Status == TaskStatus.Failed);
                    
                    if (failedTask != null)
                    {
                        return failedTask.Result ?? new UpscalingResult 
                        { 
                            Success = false, 
                            ErrorMessage = failedTask.ErrorMessage 
                        };
                    }
                }
                
                await Task.Delay(1000); // Check every second
            }
            
            return new UpscalingResult 
            { 
                Success = false, 
                ErrorMessage = "Task timed out" 
            };
        }
        
        private async Task<UpscalingResult> FallbackToSingleGPU(UpscalingRequest request)
        {
            _logger.LogInformation("🔄 Falling back to single GPU processing");
            
            // Simulate single GPU processing
            await Task.Delay(5000);
            
            return new UpscalingResult
            {
                Success = true,
                OutputPath = $"upscaled_single_{Guid.NewGuid():N}.mp4",
                ProcessingTime = TimeSpan.FromSeconds(5),
                GPUUsed = "Single GPU",
                Quality = 0.85f
            };
        }
        
        private void UpdateGPUStatistics()
        {
            foreach (var (gpuId, workload) in _gpuWorkloads)
            {
                var gpu = _availableGPUs[gpuId];
                var utilization = (float)workload.CurrentTasks.Count / gpu.MaxConcurrentTasks * 100;
                
                // Update GPU utilization statistics
                workload.CurrentUtilization = utilization;
                
                if (utilization > 80)
                {
                    _logger.LogDebug($"🔥 High GPU utilization on {gpu.Name}: {utilization:F1}%");
                }
            }
        }
        
        /// <summary>
        /// Get multi-GPU statistics
        /// </summary>
        public MultiGPUStatistics GetStatistics()
        {
            var stats = new MultiGPUStatistics
            {
                IsEnabled = _isEnabled,
                TotalGPUs = _availableGPUs.Count,
                GPUDetails = new List<GPUStatistics>()
            };
            
            foreach (var (gpuId, gpu) in _availableGPUs)
            {
                var workload = _gpuWorkloads[gpuId];
                
                stats.GPUDetails.Add(new GPUStatistics
                {
                    GPUName = gpu.Name,
                    Vendor = gpu.Vendor.ToString(),
                    MemoryMB = gpu.MemoryMB,
                    CurrentUtilization = workload.CurrentUtilization,
                    TotalTasksProcessed = workload.TaskCount,
                    TotalProcessingTime = workload.TotalProcessingTime,
                    CurrentActiveTasks = workload.CurrentTasks.Count,
                    MaxConcurrentTasks = gpu.MaxConcurrentTasks
                });
            }
            
            return stats;
        }
        
        /// <summary>
        /// Get current multi-GPU status for API reporting
        /// </summary>
        public MultiGPUStatus GetCurrentStatus()
        {
            try
            {
                var gpuStatuses = new List<GPUStatus>();
                
                foreach (var gpu in _availableGPUs.Values)
                {
                    var workload = _gpuWorkloads[gpu.DeviceId];
                    
                    gpuStatuses.Add(new GPUStatus
                    {
                        DeviceId = gpu.DeviceId,
                        Name = gpu.Name,
                        Vendor = gpu.Vendor.ToString(),
                        MemoryMB = gpu.MemoryMB,
                        CurrentTasks = workload.CurrentTasks.Count,
                        MaxConcurrentTasks = gpu.MaxConcurrentTasks,
                        PerformanceIndex = gpu.PerformanceIndex,
                        PowerEfficiency = gpu.PowerEfficiency,
                        CurrentMemoryUsage = CalculateCurrentMemoryUsage(gpu.DeviceId),
                        TotalProcessingTime = workload.TotalProcessingTime,
                        TaskCount = workload.TaskCount
                    });
                }
                
                return new MultiGPUStatus
                {
                    IsEnabled = _isEnabled,
                    TotalGPUs = _availableGPUs.Count,
                    ActiveGPUs = _availableGPUs.Values.Count(g => _gpuWorkloads[g.DeviceId].CurrentTasks.Count > 0),
                    QueuedTasks = _taskQueue.Count,
                    GPUs = gpuStatuses,
                    LastUpdated = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get multi-GPU status");
                return new MultiGPUStatus
                {
                    IsEnabled = false,
                    TotalGPUs = 0,
                    ActiveGPUs = 0,
                    QueuedTasks = 0,
                    GPUs = new List<GPUStatus>(),
                    LastUpdated = DateTime.UtcNow,
                    ErrorMessage = ex.Message
                };
            }
        }
    }
    
    // Data Transfer Objects for API compatibility
    public class MultiGPUStatus
    {
        public bool IsEnabled { get; set; }
        public int TotalGPUs { get; set; }
        public int ActiveGPUs { get; set; }
        public int QueuedTasks { get; set; }
        public List<GPUStatus> GPUs { get; set; } = new List<GPUStatus>();
        public DateTime LastUpdated { get; set; }
        public string ErrorMessage { get; set; }
    }
    
    public class GPUStatus
    {
        public int DeviceId { get; set; }
        public string Name { get; set; }
        public string Vendor { get; set; }
        public int MemoryMB { get; set; }
        public int CurrentTasks { get; set; }
        public int MaxConcurrentTasks { get; set; }
        public float PerformanceIndex { get; set; }
        public float PowerEfficiency { get; set; }
        public float CurrentMemoryUsage { get; set; }
        public TimeSpan TotalProcessingTime { get; set; }
        public int TaskCount { get; set; }
    }
    
    #region Supporting Classes and Enums
    
    public class GPUDevice
    {
        public int DeviceId { get; set; }
        public string Name { get; set; }
        public GPUVendor Vendor { get; set; }
        public int MemoryMB { get; set; }
        public string ComputeCapability { get; set; }
        public int MaxConcurrentTasks { get; set; }
        public float PowerEfficiency { get; set; }
        public float PerformanceIndex { get; set; }
        public string[] SupportedModels { get; set; }
    }
    
    public class GPUWorkload
    {
        public int DeviceId { get; set; }
        public List<UpscalingTask> CurrentTasks { get; set; }
        public TimeSpan TotalProcessingTime { get; set; }
        public int TaskCount { get; set; }
        public float CurrentUtilization { get; set; }
    }
    
    public class UpscalingTask
    {
        public string Id { get; set; }
        public UpscalingRequest Request { get; set; }
        public int Priority { get; set; }
        public DateTime SubmittedAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public TaskStatus Status { get; set; }
        public GPUDevice AssignedGPU { get; set; }
        public UpscalingResult Result { get; set; }
        public string ErrorMessage { get; set; }
    }
    
    public class UpscalingRequest
    {
        public string InputPath { get; set; }
        public string OutputPath { get; set; }
        public string AIModel { get; set; }
        public float UpscaleFactor { get; set; }
        public int InputWidth { get; set; }
        public int InputHeight { get; set; }
        public float FileSizeMB { get; set; }
        public bool IsRealTime { get; set; }
        public bool IsBatchProcessing { get; set; }
    }
    
    public class UpscalingResult
    {
        public bool Success { get; set; }
        public string OutputPath { get; set; }
        public TimeSpan ProcessingTime { get; set; }
        public string GPUUsed { get; set; }
        public float Quality { get; set; }
        public string ErrorMessage { get; set; }
    }
    
    public class MultiGPUStatistics
    {
        public bool IsEnabled { get; set; }
        public int TotalGPUs { get; set; }
        public List<GPUStatistics> GPUDetails { get; set; }
    }
    
    public class GPUStatistics
    {
        public string GPUName { get; set; }
        public string Vendor { get; set; }
        public int MemoryMB { get; set; }
        public float CurrentUtilization { get; set; }
        public int TotalTasksProcessed { get; set; }
        public TimeSpan TotalProcessingTime { get; set; }
        public int CurrentActiveTasks { get; set; }
        public int MaxConcurrentTasks { get; set; }
    }
    
    public enum GPUVendor
    {
        Unknown,
        NVIDIA,
        AMD,
        Intel
    }
    
    public enum TaskStatus
    {
        Queued,
        Processing,
        Completed,
        Failed
    }
    
    #endregion
}