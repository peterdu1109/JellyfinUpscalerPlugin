using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Enhanced Error Handler and Crash Prevention System
    /// </summary>
    public static class ErrorHandler
    {
        private static readonly List<string> _errorLog = new List<string>();
        private static readonly object _lockObject = new object();
        
        /// <summary>
        /// Handle plugin errors safely
        /// </summary>
        public static void HandleError(Exception ex, string context = "Unknown")
        {
            lock (_lockObject)
            {
                try
                {
                    var errorMessage = $"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] AI Upscaler Plugin Error in {context}: {ex.Message}";
                    
                    // Log to debug output
                    Debug.WriteLine(errorMessage);
                    
                    // Add to internal log
                    _errorLog.Add(errorMessage);
                    
                    // Keep only last 100 errors
                    if (_errorLog.Count > 100)
                    {
                        _errorLog.RemoveAt(0);
                    }
                    
                    // Try to log to file (safe)
                    TryLogToFile(errorMessage);
                }
                catch
                {
                    // Fail silently - don't crash on error handling
                }
            }
        }
        
        /// <summary>
        /// Try to log error to file safely
        /// </summary>
        private static void TryLogToFile(string message)
        {
            try
            {
                var logPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "Jellyfin", "plugins", "aiupscaler.log");
                var logDir = Path.GetDirectoryName(logPath);
                
                if (!Directory.Exists(logDir))
                {
                    Directory.CreateDirectory(logDir);
                }
                
                File.AppendAllText(logPath, message + Environment.NewLine);
            }
            catch
            {
                // Fail silently
            }
        }
        
        /// <summary>
        /// Get platform information for debugging
        /// </summary>
        public static string GetPlatformInfo()
        {
            try
            {
                var platform = "Unknown";
                var architecture = RuntimeInformation.ProcessArchitecture.ToString();
                var framework = RuntimeInformation.FrameworkDescription;
                
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                    platform = "Windows";
                else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                    platform = "Linux";
                else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
                    platform = "macOS";
                
                return $"Platform: {platform}, Architecture: {architecture}, Framework: {framework}";
            }
            catch
            {
                return "Platform: Unknown";
            }
        }
        
        /// <summary>
        /// Check if plugin is running in safe environment
        /// </summary>
        public static bool IsSafeEnvironment()
        {
            try
            {
                // Check .NET version
                var dotNetVersion = Environment.Version;
                if (dotNetVersion.Major < 6)
                    return false;
                
                // Check available memory
                var workingSet = Environment.WorkingSet;
                if (workingSet < 50 * 1024 * 1024) // Less than 50MB
                    return false;
                
                // Check processor count
                var processorCount = Environment.ProcessorCount;
                if (processorCount < 1)
                    return false;
                
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        /// <summary>
        /// Get error statistics
        /// </summary>
        public static Dictionary<string, object> GetErrorStatistics()
        {
            lock (_lockObject)
            {
                try
                {
                    return new Dictionary<string, object>
                    {
                        ["TotalErrors"] = _errorLog.Count,
                        ["LastError"] = _errorLog.Count > 0 ? _errorLog[_errorLog.Count - 1] : "None",
                        ["PlatformInfo"] = GetPlatformInfo(),
                        ["IsSafeEnvironment"] = IsSafeEnvironment(),
                        ["PluginVersion"] = Plugin.PLUGIN_VERSION,
                        ["Timestamp"] = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")
                    };
                }
                catch
                {
                    return new Dictionary<string, object>
                    {
                        ["Status"] = "Error retrieving statistics"
                    };
                }
            }
        }
        
        /// <summary>
        /// Safe execution wrapper
        /// </summary>
        public static T SafeExecute<T>(Func<T> action, T defaultValue = default(T), string context = "Unknown")
        {
            try
            {
                return action();
            }
            catch (Exception ex)
            {
                HandleError(ex, context);
                return defaultValue;
            }
        }
        
        /// <summary>
        /// Safe execution wrapper for void methods
        /// </summary>
        public static void SafeExecute(Action action, string context = "Unknown")
        {
            try
            {
                action();
            }
            catch (Exception ex)
            {
                HandleError(ex, context);
            }
        }
    }
}