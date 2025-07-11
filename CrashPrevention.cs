using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Advanced Crash Prevention and Recovery System
    /// </summary>
    public static class CrashPrevention
    {
        private static readonly Dictionary<string, DateTime> _lastFailures = new Dictionary<string, DateTime>();
        private static readonly object _lockObject = new object();
        private static int _consecutiveFailures = 0;
        private static bool _safeMode = false;
        private static readonly Timer _healthCheckTimer;
        
        static CrashPrevention()
        {
            // Initialize health check timer
            _healthCheckTimer = new Timer(PerformHealthCheck, null, TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(5));
        }
        
        /// <summary>
        /// Execute operation with crash prevention
        /// </summary>
        public static T SafeExecute<T>(Func<T> operation, T fallbackValue = default(T), string operationName = "Unknown")
        {
            if (_safeMode && IsHighRiskOperation(operationName))
            {
                ErrorHandler.HandleError(new InvalidOperationException($"Safe mode active, blocking high-risk operation: {operationName}"), "CrashPrevention.SafeExecute");
                return fallbackValue;
            }
            
            try
            {
                var result = operation();
                RecordSuccess(operationName);
                return result;
            }
            catch (Exception ex)
            {
                RecordFailure(operationName, ex);
                return fallbackValue;
            }
        }
        
        /// <summary>
        /// Execute async operation with crash prevention
        /// </summary>
        public static async Task<T> SafeExecuteAsync<T>(Func<Task<T>> operation, T fallbackValue = default(T), string operationName = "Unknown")
        {
            if (_safeMode && IsHighRiskOperation(operationName))
            {
                ErrorHandler.HandleError(new InvalidOperationException($"Safe mode active, blocking high-risk operation: {operationName}"), "CrashPrevention.SafeExecuteAsync");
                return fallbackValue;
            }
            
            try
            {
                var result = await operation();
                RecordSuccess(operationName);
                return result;
            }
            catch (Exception ex)
            {
                RecordFailure(operationName, ex);
                return fallbackValue;
            }
        }
        
        /// <summary>
        /// Check if operation is high risk
        /// </summary>
        private static bool IsHighRiskOperation(string operationName)
        {
            var highRiskOperations = new[]
            {
                "AI_Processing",
                "Hardware_Acceleration",
                "GPU_Operations",
                "Memory_Intensive",
                "Network_Operations"
            };
            
            foreach (var riskOp in highRiskOperations)
            {
                if (operationName.Contains(riskOp))
                    return true;
            }
            
            return false;
        }
        
        /// <summary>
        /// Record operation success
        /// </summary>
        private static void RecordSuccess(string operationName)
        {
            lock (_lockObject)
            {
                _consecutiveFailures = 0;
                
                if (_safeMode && _consecutiveFailures == 0)
                {
                    _safeMode = false;
                    ErrorHandler.HandleError(new InvalidOperationException("Safe mode disabled - system recovered"), "CrashPrevention.RecordSuccess");
                }
            }
        }
        
        /// <summary>
        /// Record operation failure
        /// </summary>
        private static void RecordFailure(string operationName, Exception ex)
        {
            lock (_lockObject)
            {
                _consecutiveFailures++;
                _lastFailures[operationName] = DateTime.UtcNow;
                
                ErrorHandler.HandleError(ex, $"CrashPrevention.{operationName}");
                
                // Enable safe mode after 3 consecutive failures
                if (_consecutiveFailures >= 3)
                {
                    _safeMode = true;
                    ErrorHandler.HandleError(new InvalidOperationException($"Safe mode enabled after {_consecutiveFailures} consecutive failures"), "CrashPrevention.RecordFailure");
                }
            }
        }
        
        /// <summary>
        /// Get system health status
        /// </summary>
        public static Dictionary<string, object> GetHealthStatus()
        {
            lock (_lockObject)
            {
                return new Dictionary<string, object>
                {
                    ["IsSafeMode"] = _safeMode,
                    ["ConsecutiveFailures"] = _consecutiveFailures,
                    ["LastFailures"] = new Dictionary<string, DateTime>(_lastFailures),
                    ["MemoryUsage"] = GetMemoryUsage(),
                    ["CPUUsage"] = GetCPUUsage(),
                    ["PlatformInfo"] = GetPlatformName(),
                    ["IsHighPerformance"] = IsHighPerformanceSystem(),
                    ["Timestamp"] = DateTime.UtcNow
                };
            }
        }
        
        /// <summary>
        /// Get memory usage information
        /// </summary>
        private static Dictionary<string, object> GetMemoryUsage()
        {
            try
            {
                var workingSet = Environment.WorkingSet;
                var gcMemory = GC.GetTotalMemory(false);
                
                return new Dictionary<string, object>
                {
                    ["WorkingSet"] = workingSet,
                    ["GCMemory"] = gcMemory,
                    ["WorkingSetMB"] = workingSet / (1024 * 1024),
                    ["GCMemoryMB"] = gcMemory / (1024 * 1024)
                };
            }
            catch
            {
                return new Dictionary<string, object>
                {
                    ["Status"] = "Unable to retrieve memory information"
                };
            }
        }
        
        /// <summary>
        /// Get CPU usage information
        /// </summary>
        private static Dictionary<string, object> GetCPUUsage()
        {
            try
            {
                var processorCount = Environment.ProcessorCount;
                var currentProcess = Process.GetCurrentProcess();
                var totalProcessorTime = currentProcess.TotalProcessorTime;
                
                return new Dictionary<string, object>
                {
                    ["ProcessorCount"] = processorCount,
                    ["TotalProcessorTime"] = totalProcessorTime.TotalSeconds,
                    ["ProcessorArchitecture"] = RuntimeInformation.ProcessArchitecture.ToString()
                };
            }
            catch
            {
                return new Dictionary<string, object>
                {
                    ["Status"] = "Unable to retrieve CPU information"
                };
            }
        }
        
        /// <summary>
        /// Check if system is high performance
        /// </summary>
        private static bool IsHighPerformanceSystem()
        {
            try
            {
                var processorCount = Environment.ProcessorCount;
                var workingSet = Environment.WorkingSet;
                
                // Consider high performance if 4+ cores and 8GB+ RAM
                return processorCount >= 4 && workingSet > 8L * 1024 * 1024 * 1024;
            }
            catch
            {
                return false;
            }
        }
        
        /// <summary>
        /// Get platform name
        /// </summary>
        private static string GetPlatformName()
        {
            try
            {
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                    return "Windows";
                else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                    return "Linux";
                else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
                    return "macOS";
                else
                    return "Unknown";
            }
            catch
            {
                return "Unknown";
            }
        }
        
        /// <summary>
        /// Perform periodic health check
        /// </summary>
        private static void PerformHealthCheck(object state)
        {
            try
            {
                var healthStatus = GetHealthStatus();
                
                // Log health status
                var memoryInfo = (Dictionary<string, object>)healthStatus["MemoryUsage"];
                var workingSetMB = (long)memoryInfo["WorkingSetMB"];
                
                if (workingSetMB > 1000) // More than 1GB
                {
                    ErrorHandler.HandleError(new InvalidOperationException($"High memory usage detected: {workingSetMB}MB"), "CrashPrevention.PerformHealthCheck");
                    
                    // Force garbage collection
                    GC.Collect();
                    GC.WaitForPendingFinalizers();
                    GC.Collect();
                }
                
                // Check for old failures and reset if necessary
                CleanupOldFailures();
            }
            catch (Exception ex)
            {
                ErrorHandler.HandleError(ex, "CrashPrevention.PerformHealthCheck");
            }
        }
        
        /// <summary>
        /// Clean up old failure records
        /// </summary>
        private static void CleanupOldFailures()
        {
            lock (_lockObject)
            {
                var cutoffTime = DateTime.UtcNow.AddMinutes(-30);
                var toRemove = new List<string>();
                
                foreach (var kvp in _lastFailures)
                {
                    if (kvp.Value < cutoffTime)
                    {
                        toRemove.Add(kvp.Key);
                    }
                }
                
                foreach (var key in toRemove)
                {
                    _lastFailures.Remove(key);
                }
            }
        }
        
        /// <summary>
        /// Force enable safe mode
        /// </summary>
        public static void EnableSafeMode()
        {
            lock (_lockObject)
            {
                _safeMode = true;
                ErrorHandler.HandleError(new InvalidOperationException("Safe mode manually enabled"), "CrashPrevention.EnableSafeMode");
            }
        }
        
        /// <summary>
        /// Force disable safe mode
        /// </summary>
        public static void DisableSafeMode()
        {
            lock (_lockObject)
            {
                _safeMode = false;
                _consecutiveFailures = 0;
                ErrorHandler.HandleError(new InvalidOperationException("Safe mode manually disabled"), "CrashPrevention.DisableSafeMode");
            }
        }
    }
}