# ⚙️ Advanced Configuration Guide

> **Complete guide to configure and optimize your AI upscaling experience**

---

## 🎯 **Quick Configuration (30 Seconds)**

### **1. Access Plugin Settings**
1. Play any video in Jellyfin
2. Look for **"🔥 AI Pro"** button in video player (top-right)
3. Click to open settings panel

### **2. Auto-Configuration**
The plugin automatically:
- ✅ **Detects your hardware** (NVIDIA/AMD/Intel)
- ✅ **Enables compatible AI methods** (DLSS/FSR/XeSS)
- ✅ **Sets optimal scale factor** based on GPU power
- ✅ **Configures language** to match Jellyfin

### **3. One-Click Profiles**
Choose your content type for instant optimization:
- **🎬 Movies**: Real-ESRGAN, 2.5x scale, HDR boost
- **📺 Anime**: Waifu2x-cunet, 2.0x scale, color enhancement
- **📻 TV Shows**: FSR 2.1, 2.0x scale, balanced performance
- **🎛️ Custom**: Manual fine-tuning

---

## 🌐 **Language Configuration**

### **Automatic Language Detection**
```
Language Setting: Auto (Follow Jellyfin) ← Recommended
```

**How it works:**
1. Plugin reads Jellyfin's language setting
2. Automatically switches interface language
3. Updates in real-time when you change Jellyfin language
4. No restart required

### **Manual Language Override**
```
Language Settings:
├── 🇺🇸 English
├── 🇩🇪 Deutsch  
├── 🇫🇷 Français
├── 🇪🇸 Español
├── 🇯🇵 日本語
├── 🇰🇷 한국어
├── 🇮🇹 Italiano
└── 🇵🇹 Português
```

**To change manually:**
1. Open plugin settings
2. Click **Language** dropdown
3. Select preferred language
4. Click **Save**
5. Restart Jellyfin if prompted

---

## 🎮 **Hardware Configuration**

### **NVIDIA RTX Configuration**

#### **RTX 40-Series (Optimal)**
```json
{
  "ai_method": "dlss30",
  "scale_factor": 4.0,
  "frame_generation": true,
  "rtx_hdr": true,
  "dlss_preset": "quality",
  "recommended_for": ["4K displays", "High-end gaming"]
}
```

#### **RTX 30-Series (High)**
```json
{
  "ai_method": "dlss24", 
  "scale_factor": 2.5,
  "frame_generation": false,
  "rtx_hdr": true,
  "dlss_preset": "balanced",
  "recommended_for": ["1440p displays", "Balanced performance"]
}
```

#### **RTX 20-Series (Good)**
```json
{
  "ai_method": "dlss20",
  "scale_factor": 2.0,
  "frame_generation": false,
  "rtx_hdr": false,
  "dlss_preset": "performance",
  "recommended_for": ["1080p displays", "Performance focus"]
}
```

### **AMD Radeon Configuration**

#### **RX 7000-Series (FSR 3.0)**
```json
{
  "ai_method": "fsr30",
  "scale_factor": 3.0,
  "fluid_motion": true,
  "anti_lag": true,
  "fsr_preset": "quality",
  "recommended_for": ["4K displays", "High refresh rate"]
}
```

#### **RX 6000-Series (FSR 2.1)**
```json
{
  "ai_method": "fsr21",
  "scale_factor": 2.5,
  "fluid_motion": false,
  "anti_lag": true,
  "fsr_preset": "balanced",
  "recommended_for": ["1440p displays", "Good performance"]
}
```

### **Intel Arc Configuration**

#### **Arc A-Series (XeSS)**
```json
{
  "ai_method": "xess",
  "scale_factor": 2.5,
  "xess_preset": "quality",
  "deep_link": true,
  "recommended_for": ["1440p displays", "Balanced approach"]
}
```

---

## 📊 **Performance Configuration**

### **Performance Profiles**

#### **🚀 Maximum Quality**
```json
{
  "profile": "maximum_quality",
  "ai_method": "real_esrgan",
  "scale_factor": 4.0,
  "hdr_enhancement": true,
  "frame_interpolation": true,
  "motion_compensation": true,
  "sharpness": 0.8,
  "saturation": 1.2,
  "gpu_usage_target": 90,
  "recommended_gpu": "RTX 4080+, RX 7800 XT+"
}
```

#### **⚖️ Balanced**
```json
{
  "profile": "balanced",
  "ai_method": "dlss24",
  "scale_factor": 2.5,
  "hdr_enhancement": false,
  "frame_interpolation": false,
  "motion_compensation": true,
  "sharpness": 0.5,
  "saturation": 1.0,
  "gpu_usage_target": 70,
  "recommended_gpu": "RTX 3070, RX 6700 XT"
}
```

#### **⚡ Performance**
```json
{
  "profile": "performance",
  "ai_method": "fsr21",
  "scale_factor": 2.0,
  "hdr_enhancement": false,
  "frame_interpolation": false,
  "motion_compensation": false,
  "sharpness": 0.3,
  "saturation": 1.0,
  "gpu_usage_target": 50,
  "recommended_gpu": "GTX 1660, RX 580"
}
```

### **Power Efficiency Settings**

#### **🔋 Battery Saver (Laptops/Handhelds)**
```json
{
  "profile": "battery_saver",
  "ai_method": "fsr21",
  "scale_factor": 1.5,
  "power_limit": 75,
  "thermal_limit": 75,
  "frame_rate_limit": 30,
  "adaptive_quality": true,
  "background_processing": false
}
```

#### **🌡️ Thermal Throttling Protection**
```json
{
  "thermal_management": {
    "max_gpu_temp": 80,
    "max_cpu_temp": 85,
    "throttle_behavior": "reduce_quality",
    "emergency_shutdown": 90,
    "fan_curve": "aggressive"
  }
}
```

---

## 🎨 **Quality Settings**

### **Image Enhancement**

#### **🎬 Movie Optimization**
```json
{
  "content_type": "movies",
  "ai_method": "real_esrgan",
  "scale_factor": 2.5,
  "settings": {
    "sharpness": 0.6,
    "saturation": 1.1,
    "contrast": 1.2,
    "brightness": 0.0,
    "hdr_tone_mapping": "reinhard",
    "noise_reduction": 0.3,
    "detail_enhancement": 0.7
  }
}
```

#### **📺 Anime Optimization**
```json
{
  "content_type": "anime",
  "ai_method": "waifu2x",
  "scale_factor": 2.0,
  "settings": {
    "sharpness": 0.3,
    "saturation": 1.3,
    "contrast": 1.1,
    "brightness": 0.1,
    "cel_shading_enhance": true,
    "line_art_preserve": true,
    "color_vibrancy": 1.2
  }
}
```

#### **📻 TV Shows Optimization**
```json
{
  "content_type": "tv_shows",
  "ai_method": "fsr21",
  "scale_factor": 2.0,
  "settings": {
    "sharpness": 0.4,
    "saturation": 1.0,
    "contrast": 1.0,
    "brightness": 0.0,
    "text_clarity": true,
    "face_enhancement": true,
    "scene_cut_detection": true
  }
}
```

### **Advanced Quality Controls**

#### **🔧 Fine-Tuning Parameters**
```javascript
const advancedSettings = {
  // AI Model Parameters
  model_precision: "fp16", // fp32, fp16, int8
  batch_size: "auto", // 1, 2, 4, auto
  temporal_consistency: true,
  
  // Image Processing
  pre_processing: {
    denoise_strength: 0.2,
    deblock_strength: 0.1,
    deringing: true
  },
  
  post_processing: {
    unsharp_mask: 0.3,
    gamma_correction: 1.0,
    color_space: "rec2020" // rec709, rec2020, dci-p3
  },
  
  // Performance Optimization
  gpu_memory_management: "dynamic",
  cpu_fallback: true,
  cache_models: true
};
```

---

## 🎯 **Content-Specific Configuration**

### **Automatic Content Detection**

The plugin can automatically detect content type and apply optimal settings:

```javascript
const contentDetection = {
  anime: {
    triggers: ["cel_shading", "high_saturation", "clean_lines"],
    confidence_threshold: 0.8,
    apply_profile: "anime_optimized"
  },
  
  live_action: {
    triggers: ["natural_skin_tones", "realistic_lighting", "film_grain"],
    confidence_threshold: 0.7,
    apply_profile: "movie_optimized"
  },
  
  cgi_animation: {
    triggers: ["perfect_gradients", "digital_artifacts", "3d_rendering"],
    confidence_threshold: 0.75,
    apply_profile: "cgi_optimized"
  }
};
```

### **Library-Based Auto-Configuration**

Configure different settings per Jellyfin library:

```json
{
  "library_configurations": {
    "Anime": {
      "default_profile": "anime",
      "ai_method": "waifu2x",
      "auto_detect_seasons": true,
      "prefer_quality_over_speed": true
    },
    
    "Movies": {
      "default_profile": "movies", 
      "ai_method": "real_esrgan",
      "hdr_auto_enable": true,
      "prefer_balanced_approach": true
    },
    
    "TV Shows": {
      "default_profile": "tv_shows",
      "ai_method": "fsr21",
      "optimize_for_binge_watching": true,
      "prefer_speed_over_quality": false
    }
  }
}
```

---

## 📈 **Performance Monitoring Configuration**

### **Real-Time Statistics**

```json
{
  "performance_monitor": {
    "enabled": true,
    "update_interval": 1000,
    "display_metrics": [
      "gpu_usage",
      "gpu_memory",
      "cpu_usage", 
      "fps",
      "frame_time",
      "processing_time",
      "power_consumption",
      "temperature"
    ],
    "overlay_position": "top_right",
    "overlay_opacity": 0.8
  }
}
```

### **Performance Alerts**

```json
{
  "alerts": {
    "high_gpu_usage": {
      "threshold": 95,
      "action": "show_warning",
      "message": "GPU usage very high, consider reducing quality"
    },
    
    "thermal_warning": {
      "threshold": 85,
      "action": "auto_throttle", 
      "message": "High temperatures detected, reducing performance"
    },
    
    "memory_warning": {
      "threshold": 90,
      "action": "clear_cache",
      "message": "GPU memory almost full, clearing caches"
    }
  }
}
```

---

## 🌊 **Streaming Configuration**

### **Remote Streaming Optimization**

```json
{
  "streaming_profiles": {
    "local_network": {
      "max_bitrate": "unlimited",
      "ai_processing": "client_side",
      "quality_priority": "maximum"
    },
    
    "remote_streaming": {
      "max_bitrate": "8000kbps",
      "ai_processing": "server_side", 
      "quality_priority": "balanced",
      "adaptive_bitrate": true
    },
    
    "mobile_connection": {
      "max_bitrate": "3000kbps",
      "ai_processing": "disabled",
      "quality_priority": "performance",
      "data_saver": true
    }
  }
}
```

### **Bandwidth Management**

```json
{
  "bandwidth_management": {
    "auto_detect_connection": true,
    "connection_types": {
      "ethernet": "local_network",
      "wifi_5ghz": "local_network", 
      "wifi_2ghz": "remote_streaming",
      "cellular": "mobile_connection"
    },
    "adaptive_quality": {
      "enabled": true,
      "check_interval": 5000,
      "adjustment_speed": "gradual"
    }
  }
}
```

---

## 🔒 **Security & Privacy Configuration**

### **Data Privacy Settings**

```json
{
  "privacy": {
    "telemetry": {
      "enabled": false,
      "anonymous_usage_stats": false,
      "crash_reporting": false
    },
    
    "local_processing": {
      "prefer_local_ai": true,
      "never_send_frames_to_cloud": true,
      "encrypt_local_cache": true
    },
    
    "user_data": {
      "store_viewing_history": false,
      "store_quality_preferences": true,
      "sync_settings_across_devices": false
    }
  }
}
```

### **Network Security**

```json
{
  "network_security": {
    "allowed_domains": [
      "github.com",
      "jellyfin.org"
    ],
    "block_third_party_requests": true,
    "use_secure_connections_only": true,
    "certificate_validation": "strict"
  }
}
```

---

## 🎛️ **Advanced Developer Configuration**

### **API Configuration**

```json
{
  "api": {
    "enable_rest_api": false,
    "enable_websocket_api": false,
    "api_key_required": true,
    "rate_limiting": {
      "enabled": true,
      "requests_per_minute": 60
    }
  }
}
```

### **Debug Configuration**

```json
{
  "debug": {
    "log_level": "info", // debug, info, warn, error
    "log_to_file": true,
    "log_performance_metrics": false,
    "enable_profiling": false,
    "verbose_gpu_logging": false
  }
}
```

---

## 🔄 **Configuration Backup & Restore**

### **Export Settings**

```javascript
// Export current configuration
function exportSettings() {
    const settings = getAllSettings();
    const blob = new Blob([JSON.stringify(settings, null, 2)], 
                         {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jellyfin-upscaler-settings.json';
    a.click();
}
```

### **Import Settings**

```javascript
// Import configuration from file
function importSettings(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const settings = JSON.parse(e.target.result);
            validateAndApplySettings(settings);
            showNotification('Settings imported successfully', 'success');
        } catch (error) {
            showNotification('Invalid settings file', 'error');
        }
    };
    reader.readAsText(file);
}
```

### **Reset to Defaults**

```javascript
// Reset all settings to factory defaults
function resetToDefaults() {
    if (confirm('Reset all settings to default? This cannot be undone.')) {
        localStorage.removeItem('jellyfin-upscaler-settings');
        location.reload();
    }
}
```

---

## 🎯 **Configuration Best Practices**

### **🏆 Optimal Settings by Use Case**

#### **Home Theater (4K TV + High-End GPU)**
- **AI Method**: Real-ESRGAN or DLSS 3.0
- **Scale Factor**: 3.0-4.0x
- **HDR**: Enabled
- **Frame Interpolation**: Enabled
- **Quality Priority**: Maximum

#### **Gaming Setup (1440p Monitor + Mid-Range GPU)**
- **AI Method**: DLSS 2.4 or FSR 2.1
- **Scale Factor**: 2.0-2.5x
- **HDR**: Disabled
- **Frame Interpolation**: Disabled
- **Quality Priority**: Balanced

#### **Mobile/Laptop (Battery-Powered)**
- **AI Method**: FSR 2.1 or Traditional
- **Scale Factor**: 1.5-2.0x
- **Power Efficiency**: Maximum
- **Thermal Protection**: Enabled
- **Quality Priority**: Performance

### **🎨 Content-Specific Recommendations**

| Content Type | AI Method | Scale Factor | Special Settings |
|--------------|-----------|--------------|------------------|
| **4K Movies** | Real-ESRGAN | 1.5x | HDR boost, detail enhance |
| **1080p Movies** | DLSS 2.4 | 2.5x | Color grading, noise reduction |
| **Anime** | Waifu2x-cunet | 2.0x | Saturation boost, line preserve |
| **TV Shows** | FSR 2.1 | 2.0x | Text clarity, scene detection |
| **Documentaries** | Conservative | 1.5x | Natural colors, text focus |

---

## ✅ **Configuration Complete**

### **Verification Checklist**

- ✅ **Language**: Set to your preference or auto-detect
- ✅ **Hardware**: GPU detected and optimal method selected
- ✅ **Profile**: Content-appropriate profile activated
- ✅ **Performance**: Monitoring enabled and targets set
- ✅ **Quality**: Enhancement settings optimized
- ✅ **Privacy**: Data handling configured to your comfort

### **Next Steps**

1. **[🎯 Learn Usage Techniques](Usage)**
2. **[🏆 Optimize Performance](Performance)**
3. **[🛠️ Troubleshoot Issues](Troubleshooting)**

---

**🎉 Your Jellyfin AI Upscaler Plugin is now perfectly configured for your system and preferences!**