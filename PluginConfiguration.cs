using System;
using System.Collections.Generic;
using MediaBrowser.Model.Plugins;

namespace JellyfinUpscalerPlugin
{
    /// <summary>
    /// Enhanced Configuration for AI Upscaler Plugin v1.3.5 - Complete Edition
    /// Features: 14 KI-Models, 7 Shaders, Cross-Device Sync, Real-time Stats
    /// </summary>
    public class PluginConfiguration : BasePluginConfiguration
    {
        // ========================================
        // CORE SETTINGS
        // ========================================
        public bool Enabled { get; set; } = false;
        public string Language { get; set; } = "en";
        public bool ShowPlayerButton { get; set; } = true;
        public bool EnableNotifications { get; set; } = true;
        
        // ========================================
        // AI MODEL SETTINGS - 14 MODELS TOTAL
        // ========================================
        
        // Current Model Selection
        public string Model { get; set; } = "realesrgan";
        public int Scale { get; set; } = 2;
        public string Quality { get; set; } = "high";
        public bool UseAdvancedSettings { get; set; } = false;
        
        // Available AI Models (9 existing + 5 new)
        public List<string> AvailableAIModels { get; set; } = new List<string>
        {
            // === EXISTING MODELS (9) ===
            "realesrgan",           // High-quality upscaling for general content
            "esrgan-pro",           // Enhanced ESRGAN with better detail fidelity
            "swinir",               // Transformer-based for complex textures
            "srcnn-light",          // Lightweight 12MB model for weak hardware
            "waifu2x",              // Anime-optimized with clean lines
            "hat",                  // Hybrid Attention Transformer
            "edsr",                 // Enhanced Deep Super-Resolution
            "vdsr",                 // Very Deep Super-Resolution
            "rdn",                  // Residual Dense Network
            
            // === NEW MODELS (5) ===
            "srresnet",             // ESRGAN predecessor, efficient for basic upscaling
            "carn",                 // Cascaded Residual Network, lightweight
            "rrdbnet",              // ESRGAN basis, speed/quality balance
            "drln",                 // Densely Residual Laplacian, low noise
            "fsrcnn"                // Fast small model for limited resources
        };
        
        // Model-specific settings
        public Dictionary<string, ModelSettings> ModelConfigurations { get; set; } = new Dictionary<string, ModelSettings>
        {
            ["realesrgan"] = new ModelSettings { RequiredVRAM = 2048, OptimalScale = 4, ContentType = "general" },
            ["esrgan-pro"] = new ModelSettings { RequiredVRAM = 3072, OptimalScale = 4, ContentType = "movies" },
            ["swinir"] = new ModelSettings { RequiredVRAM = 4096, OptimalScale = 4, ContentType = "complex" },
            ["srcnn-light"] = new ModelSettings { RequiredVRAM = 512, OptimalScale = 2, ContentType = "lightweight" },
            ["waifu2x"] = new ModelSettings { RequiredVRAM = 1024, OptimalScale = 2, ContentType = "anime" },
            ["hat"] = new ModelSettings { RequiredVRAM = 6144, OptimalScale = 4, ContentType = "detailed" },
            ["edsr"] = new ModelSettings { RequiredVRAM = 2048, OptimalScale = 3, ContentType = "precise" },
            ["vdsr"] = new ModelSettings { RequiredVRAM = 1536, OptimalScale = 3, ContentType = "deep" },
            ["rdn"] = new ModelSettings { RequiredVRAM = 2560, OptimalScale = 4, ContentType = "textured" },
            ["srresnet"] = new ModelSettings { RequiredVRAM = 1024, OptimalScale = 2, ContentType = "basic" },
            ["carn"] = new ModelSettings { RequiredVRAM = 768, OptimalScale = 2, ContentType = "fast" },
            ["rrdbnet"] = new ModelSettings { RequiredVRAM = 1536, OptimalScale = 3, ContentType = "balanced" },
            ["drln"] = new ModelSettings { RequiredVRAM = 1280, OptimalScale = 2, ContentType = "denoise" },
            ["fsrcnn"] = new ModelSettings { RequiredVRAM = 256, OptimalScale = 2, ContentType = "minimal" }
        };
        
        // ========================================
        // SHADER SETTINGS - 7 SHADERS TOTAL
        // ========================================
        
        // Current Shader Selection
        public string ShaderMethod { get; set; } = "lanczos";
        
        // Available Shaders (3 existing + 4 new)
        public List<string> AvailableShaders { get; set; } = new List<string>
        {
            // === EXISTING SHADERS (3) ===
            "bicubic",              // Smooth interpolation, moderate performance
            "bilinear",             // Simple interpolation, very fast
            "lanczos",              // Sharp interpolation, detail-focused
            
            // === NEW SHADERS (4) ===
            "mitchell-netravali",   // Balance between sharpness and smoothness
            "catmull-rom",          // Sharp interpolation for high-res content
            "sinc",                 // High-precision filter, computationally intensive
            "nearest-neighbor"      // Ultra-fast, lowest quality (emergency fallback)
        };
        
        // Shader-specific settings
        public Dictionary<string, ShaderSettings> ShaderConfigurations { get; set; } = new Dictionary<string, ShaderSettings>
        {
            ["bicubic"] = new ShaderSettings { PerformanceCost = 2, Quality = 3, UseCase = "general" },
            ["bilinear"] = new ShaderSettings { PerformanceCost = 1, Quality = 2, UseCase = "weak-hardware" },
            ["lanczos"] = new ShaderSettings { PerformanceCost = 3, Quality = 4, UseCase = "detailed" },
            ["mitchell-netravali"] = new ShaderSettings { PerformanceCost = 2, Quality = 4, UseCase = "movies" },
            ["catmull-rom"] = new ShaderSettings { PerformanceCost = 3, Quality = 4, UseCase = "high-res" },
            ["sinc"] = new ShaderSettings { PerformanceCost = 5, Quality = 5, UseCase = "maximum-quality" },
            ["nearest-neighbor"] = new ShaderSettings { PerformanceCost = 1, Quality = 1, UseCase = "emergency" }
        };
        
        // ========================================
        // NEW FEATURE 1: KI-BASIERTE FARBKORREKTUR
        // ========================================
        public bool EnableAIColorCorrection { get; set; } = true;
        public string ColorCorrectionModel { get; set; } = "auto"; // auto, swinir-color, hat-color
        public bool AutoDetectContentType { get; set; } = true;
        public Dictionary<string, ColorProfile> ContentColorProfiles { get; set; } = new Dictionary<string, ColorProfile>
        {
            ["anime"] = new ColorProfile { Saturation = 1.15f, Contrast = 1.1f, Brightness = 1.0f },
            ["movies"] = new ColorProfile { Saturation = 1.05f, Contrast = 1.05f, Brightness = 1.0f },
            ["tv-shows"] = new ColorProfile { Saturation = 1.1f, Contrast = 1.08f, Brightness = 1.02f },
            ["documentaries"] = new ColorProfile { Saturation = 0.95f, Contrast = 1.15f, Brightness = 1.05f }
        };
        
        // ========================================
        // NEW FEATURE 2: AUTOMATISCHE UPSCALING-ZONEN
        // ========================================
        public bool EnableZonedUpscaling { get; set; } = true;
        public bool DetectFaces { get; set; } = true;
        public bool DetectText { get; set; } = true;
        public bool DetectObjects { get; set; } = false;
        public string FaceUpscalingModel { get; set; } = "realesrgan"; // Model for face regions
        public string TextUpscalingModel { get; set; } = "edsr"; // Model for text regions
        public string BackgroundShader { get; set; } = "bicubic"; // Shader for non-priority regions
        public int ZoneDetectionThreshold { get; set; } = 70; // Confidence threshold 0-100
        
        // ========================================
        // NEW FEATURE 3: CROSS-DEVICE SYNCHRONISATION
        // ========================================
        public bool EnableCrossDeviceSync { get; set; } = true;
        public bool SyncUpscalingProfiles { get; set; } = true;
        public bool SyncQualitySettings { get; set; } = true;
        public bool SyncPerformanceSettings { get; set; } = false; // Device-specific
        public string DefaultSyncedProfile { get; set; } = "balanced";
        public List<DeviceProfile> SyncedDeviceProfiles { get; set; } = new List<DeviceProfile>();
        
        // ========================================
        // NEW FEATURE 4: UPSCALING-STATISTIKEN IN ECHTZEIT
        // ========================================
        public bool EnableRealtimeStats { get; set; } = true;
        public bool ShowFPSOverlay { get; set; } = false;
        public bool ShowGPUUsage { get; set; } = true;
        public bool ShowProcessingTime { get; set; } = true;
        public bool ShowMemoryUsage { get; set; } = true;
        public bool ShowTemperature { get; set; } = true;
        public int StatsUpdateInterval { get; set; } = 1000; // milliseconds
        public bool LogPerformanceData { get; set; } = false;
        public bool EnableWebSocketStats { get; set; } = true;
        
        // ========================================
        // CACHE MANAGEMENT SETTINGS
        // ========================================
        public int CacheSizeMB { get; set; } = 10240; // 10GB default cache
        public bool EnableSmartCache { get; set; } = true;
        public bool AutoCleanupCache { get; set; } = true;
        public int MaxCacheAgeDays { get; set; } = 30;
        
        // ========================================
        // MISSING PROPERTIES FOR COMPATIBILITY
        // ========================================
        public bool EnableAutomaticZonedUpscaling { get; set; } = true;
        public bool EnableDynamicModelSwitching { get; set; } = false;
        
        // ========================================
        // ENHANCED AV1 SETTINGS
        // ========================================
        public bool EnableAV1 { get; set; } = true;
        public int AV1Quality { get; set; } = 23; // CRF value 20-35
        public string AV1Preset { get; set; } = "medium"; // ultrafast, fast, medium, slow
        public int AV1FilmGrain { get; set; } = 0; // 0-50
        public bool AV1HardwareOnly { get; set; } = false;
        public bool EnableAV1OptimizedUpscaling { get; set; } = true; // NEW: AV1-specific optimization
        public string AV1CompatibleModel { get; set; } = "drln"; // NEW: AV1-optimized model
        
        // ========================================
        // ENHANCED HARDWARE ACCELERATION
        // ========================================
        public bool AutoDetectHardware { get; set; } = true;
        public string PreferredEncoder { get; set; } = "auto"; // auto, nvenc, qsv, vaapi, software
        public int MaxConcurrentStreams { get; set; } = 2;
        public bool EnableLightMode { get; set; } = false;
        
        // Extended hardware support
        public bool EnableIntelQuickSync { get; set; } = true;
        public bool EnableNVIDIANVENC { get; set; } = true;
        public bool EnableAMDVCE { get; set; } = true;
        public bool EnableAppleVideoToolbox { get; set; } = true; // macOS support
        public bool EnableVAAPI { get; set; } = true; // Linux support
        public bool EnableMediaFoundation { get; set; } = true; // Windows support
        
        // ========================================
        // ENHANCED VIDEO PROCESSING
        // ========================================
        public string UpscaleMethod { get; set; } = "Real-ESRGAN";
        public bool EnableUpscaling { get; set; } = true;
        public bool EnableSharpening { get; set; } = true;
        public int SharpeningStrength { get; set; } = 50;
        
        // Enhanced processing options
        public bool EnableNoiseReduction { get; set; } = true;
        public int NoiseReductionStrength { get; set; } = 30;
        public bool EnableMotionBlurReduction { get; set; } = false;
        public bool EnableArtifactReduction { get; set; } = true;
        public bool EnableEdgeEnhancement { get; set; } = true;
        
        // ========================================
        // ENHANCED COMPATIBILITY SETTINGS
        // ========================================
        
        // Problematic device compatibility
        public bool EnableChromecastFix { get; set; } = true;
        public bool EnableAppleTVFix { get; set; } = true;
        public bool EnableRokuFix { get; set; } = true;
        public bool EnableFireTVFix { get; set; } = true;
        public bool EnableAndroidTVFix { get; set; } = true;
        public bool EnableWebOSFix { get; set; } = true;
        public bool EnableTizenFix { get; set; } = true;
        
        // Browser compatibility
        public bool EnableSafariCompatibility { get; set; } = true;
        public bool EnableEdgeCompatibility { get; set; } = true;
        public bool EnableFirefoxCompatibility { get; set; } = true;
        public bool EnableChromeCompatibility { get; set; } = true;
        
        // Mobile device compatibility
        public bool EnableiOSCompatibility { get; set; } = true;
        public bool EnableAndroidCompatibility { get; set; } = true;
        public bool EnableTabletOptimization { get; set; } = true;
        
        // Gaming device compatibility
        public bool EnableSteamDeckOptimization { get; set; } = true;
        public bool EnableSteamLinkCompatibility { get; set; } = true;
        public bool EnableNVIDIAShieldCompatibility { get; set; } = true;
        
        // ========================================
        // AUDIO/SUBTITLE SETTINGS
        // ========================================
        public bool EnableAudioPassthrough { get; set; } = true;
        public string AudioCodec { get; set; } = "copy";
        public bool EnablePGSToSRT { get; set; } = true;
        public bool EnableSubtitlePassthrough { get; set; } = true;
        
        // Enhanced subtitle support
        public bool EnableSRTOptimization { get; set; } = true;
        public bool EnableASSOptimization { get; set; } = true;
        public bool EnableVTTSupport { get; set; } = true;
        public bool EnableSubtitleUpscaling { get; set; } = true; // Upscale subtitle images
        
        // ========================================
        // MOBILE/TOUCH SETTINGS
        // ========================================
        public bool EnableMobileOptimization { get; set; } = true;
        public bool EnableBatteryMode { get; set; } = true;
        public int MobileMaxResolution { get; set; } = 1080;
        public bool EnableTouchOptimization { get; set; } = true;
        
        // Enhanced mobile settings
        public bool EnableDataSaverMode { get; set; } = false;
        public bool EnableLowLatencyMode { get; set; } = true;
        public int BatteryOptimizationLevel { get; set; } = 2; // 1=light, 2=medium, 3=aggressive
        
        // ========================================
        // PERFORMANCE SETTINGS
        // ========================================
        public bool EnablePerformanceMetrics { get; set; } = true;
        public bool EnableDebugLogging { get; set; } = false;
        public int ThermalThrottleTemperature { get; set; } = 85;
        
        // Enhanced performance monitoring
        public bool EnableAutoPerformanceTuning { get; set; } = true;
        public bool EnableThermalProtection { get; set; } = true;
        public bool EnableFrameRateLimiting { get; set; } = false;
        public int MaxFrameRate { get; set; } = 60;
        public bool EnableAdaptiveQuality { get; set; } = true;
        
        // ========================================
        // UI SETTINGS
        // ========================================
        public bool EnableQuickSettings { get; set; } = true;
        public string DefaultPreset { get; set; } = "auto";
        
        // Enhanced UI
        public bool EnableAdvancedUI { get; set; } = false;
        public bool EnableTooltips { get; set; } = true;
        public bool EnableKeyboardShortcuts { get; set; } = true;
        public bool EnableGestureControls { get; set; } = true;
        public string UITheme { get; set; } = "dark"; // dark, light, auto
        
        // ========================================
        // ADVANCED SETTINGS
        // ========================================
        public bool EnableAPIAccess { get; set; } = true;
        public bool ShowProgressInDashboard { get; set; } = true;
        public int CacheSize { get; set; } = 2048; // MB
        public string TempDirectory { get; set; } = "";
        
        // Enhanced API and caching
        public bool EnableModelCaching { get; set; } = true;
        public bool EnablePreloadModels { get; set; } = false;
        public int ModelCacheSize { get; set; } = 4096; // MB
        public bool EnableAsyncProcessing { get; set; } = true;
        
        // ========================================
        // HARDWARE DETECTION SETTINGS
        // ========================================
        public bool EnableGPUDetection { get; set; } = true;
        public bool EnableCPUFallback { get; set; } = true;
        public string ForcedGPUVendor { get; set; } = "auto"; // auto, nvidia, amd, intel
        
        // Enhanced hardware detection
        public bool EnableVRAMDetection { get; set; } = true;
        public bool EnableCUDADetection { get; set; } = true;
        public bool EnableOpenCLDetection { get; set; } = true;
        public bool EnableVulkanDetection { get; set; } = true;
        public bool EnableDirectMLDetection { get; set; } = true;
        
        // ========================================
        // CONTENT-SPECIFIC SETTINGS
        // ========================================
        public bool EnableAnimeOptimization { get; set; } = true;
        public bool EnableMovieOptimization { get; set; } = true;
        public bool EnableTVOptimization { get; set; } = true;
        
        // Enhanced content detection
        public bool EnableAutomaticContentDetection { get; set; } = true;
        public bool EnableGenreBasedOptimization { get; set; } = true;
        public bool EnableQualityBasedOptimization { get; set; } = true;
        public bool EnableAgeBasedOptimization { get; set; } = true; // Older content needs different processing
        
        // ========================================
        // STREAMING SETTINGS
        // ========================================
        public bool EnableRemoteOptimization { get; set; } = true;
        public bool EnableAdaptiveBitrate { get; set; } = true;
        public int RemoteQualityReduction { get; set; } = 10; // Percentage
        
        // Enhanced streaming
        public bool EnableBandwidthDetection { get; set; } = true;
        public bool EnableLatencyOptimization { get; set; } = true;
        public bool EnableNetworkAdaptiveQuality { get; set; } = true;
        public int BufferSize { get; set; } = 5; // seconds
        
        // ========================================
        // EXPERIMENTAL FEATURES
        // ========================================
        public bool EnableExperimentalFeatures { get; set; } = false;
        public bool EnableRealTimeProcessing { get; set; } = false;
        public bool EnableCloudProcessing { get; set; } = false;
        
        // New experimental features
        public bool EnableMLModelOptimization { get; set; } = false;
        public bool EnableQuantizedModels { get; set; } = false;
        public bool EnableDistributedProcessing { get; set; } = false;
        public bool EnableAdvancedCaching { get; set; } = false;
    }
    
    // ========================================
    // SUPPORTING CLASSES
    // ========================================
    
    public class ModelSettings
    {
        public int RequiredVRAM { get; set; }
        public int OptimalScale { get; set; }
        public string ContentType { get; set; }
        public bool IsHardwareAccelerated { get; set; } = true;
        public int PerformanceCost { get; set; } = 3; // 1-5 scale
    }
    
    public class ShaderSettings
    {
        public int PerformanceCost { get; set; } // 1-5 scale
        public int Quality { get; set; } // 1-5 scale
        public string UseCase { get; set; }
        public bool SupportsHardwareAcceleration { get; set; } = true;
    }
    
    public class ColorProfile
    {
        public float Saturation { get; set; } = 1.0f;
        public float Contrast { get; set; } = 1.0f;
        public float Brightness { get; set; } = 1.0f;
        public float Gamma { get; set; } = 1.0f;
        public float Hue { get; set; } = 0.0f;
    }
    
    public class DeviceProfile
    {
        public string DeviceId { get; set; }
        public string DeviceName { get; set; }
        public string PreferredModel { get; set; }
        public string PreferredShader { get; set; }
        public Dictionary<string, object> Settings { get; set; } = new Dictionary<string, object>();
        public DateTime LastSync { get; set; }
    }
}