# ⚙️ Configuration Guide

Complete configuration guide for JellyfinUpscalerPlugin to optimize your video enhancement experience.

---

## 🎛️ **Quick Setup**

### 🚀 **Intelligent Presets**
Choose a preset based on your use case:

| Preset | Best For | Features |
|--------|----------|----------|
| **🎮 Gaming** | Gaming content, low latency | Ultra-low latency, high refresh rate |
| **📺 Apple TV** | Movies, TV shows | HDR enhancement, cinema quality |
| **📱 Mobile** | Phones, tablets | Battery optimization, touch controls |
| **🖥️ Server** | Multiple users | Load balancing, 24/7 stability |

### ⚡ **One-Click Configuration**
1. Open **Plugin Settings**
2. Click **"Auto-Detect Hardware"**
3. Select your **Use Case Preset**
4. Click **"Apply Optimal Settings"**
5. **Done!** - Enjoy enhanced video

---

## 🖥️ **Hardware Configuration**

### 🎮 **GPU Settings**

#### NVIDIA RTX Series
```json
{
  "enableDLSS": true,
  "dlssQuality": "Quality",
  "rtxHDR": true,
  "tensorCores": true,
  "nvencSupport": true
}
```

#### AMD RDNA/RX Series  
```json
{
  "enableFSR": true,
  "fsrQuality": "Quality",
  "rdnaOptimization": true,
  "vceSupport": true,
  "smartAccessMemory": true
}
```

#### Intel Arc/UHD Graphics
```json
{
  "enableXeSS": true,
  "xessQuality": "Quality",
  "quickSyncSupport": true,
  "av1HardwareSupport": true,
  "integratedGraphics": false
}
```

#### Apple Silicon (M1/M2/M3)
```json
{
  "enableMetal": true,
  "metalPerformance": true,
  "coreMLSupport": true,
  "videoToolbox": true,
  "universalBinary": true
}
```

---

## 🎨 **Quality Settings**

### 📊 **Enhancement Levels**

#### Ultra Quality (RTX 4070+)
- **Upscaling:** 4x AI enhancement
- **Processing:** Real-time DLSS 3.0
- **Memory:** 8GB+ VRAM required
- **Features:** All enhancements enabled

#### High Quality (RTX 3060+)
- **Upscaling:** 2x-3x enhancement
- **Processing:** DLSS 2.0 or FSR 2.0
- **Memory:** 4GB+ VRAM required
- **Features:** Most enhancements enabled

#### Medium Quality (GTX 1060+)
- **Upscaling:** 2x enhancement
- **Processing:** Software + GPU hybrid
- **Memory:** 2GB+ VRAM required
- **Features:** Balanced enhancement

#### Light Mode (Integrated Graphics)
- **Upscaling:** Minimal enhancement
- **Processing:** CPU-only mode
- **Memory:** System RAM only
- **Features:** Basic improvements

---

## 🎬 **Content-Specific Settings**

### 🎮 **Gaming Mode Configuration**
```json
{
  "mode": "gaming",
  "latency": "ultraLow",
  "refreshRate": 240,
  "variableRefreshRate": true,
  "motionBlurReduction": true,
  "inputLagOptimization": true,
  "frameInterpolation": false
}
```

### 📺 **Cinema Mode Configuration**
```json
{
  "mode": "cinema",
  "hdrEnhancement": true,
  "colorGrading": "cinema",
  "filmGrainPreservation": true,
  "24fpsDetection": true,
  "motionSmoothing": false,
  "cinemaScope": true
}
```

### 📱 **Mobile Mode Configuration**
```json
{
  "mode": "mobile",
  "batteryOptimization": true,
  "touchControls": true,
  "adaptiveBitrate": true,
  "backgroundProcessing": true,
  "powerSavingMode": true,
  "compactUI": true
}
```

---

## 🔋 **Power Management**

### 🔋 **Battery Optimization**
**Automatic Power Profiles:**

| Battery Level | Performance | Features |
|--------------|-------------|----------|
| **>80%** | Maximum | All features enabled |
| **50-80%** | High | Most features enabled |
| **20-50%** | Balanced | Essential features only |
| **<20%** | Power Saver | Minimal processing |

### 🌡️ **Thermal Management**
```json
{
  "temperatureMonitoring": true,
  "throttlingTemperature": 85,
  "emergencyShutdown": 95,
  "fanCurveIntegration": true,
  "thermalHistory": true
}
```

---

## 📊 **Performance Tuning**

### 🎯 **Memory Allocation**
```json
{
  "systemRAM": {
    "maximum": "50%",
    "conservative": "25%",
    "aggressive": "75%"
  },
  "vramAllocation": {
    "maximum": "80%",
    "reserved": "1GB",
    "dynamic": true
  }
}
```

### ⚡ **Processing Options**
```json
{
  "processingMode": "realtime",
  "threadCount": "auto",
  "queueSize": 3,
  "preloadFrames": true,
  "multiGPU": false
}
```

---

## 🎨 **Visual Enhancement**

### 🖼️ **Image Processing**
```json
{
  "sharpening": {
    "enabled": true,
    "strength": 75,
    "edgePreservation": true
  },
  "noiseReduction": {
    "enabled": true,
    "level": "adaptive",
    "preserveDetail": true
  },
  "colorEnhancement": {
    "enabled": true,
    "mode": "natural",
    "saturation": 105,
    "contrast": 110
  }
}
```

---

## 🔧 **Advanced Configuration**

### 🎛️ **Expert Settings**
```json
{
  "advanced": {
    "gpuScheduling": "compute",
    "memoryPrefetch": true,
    "pipelineOptimization": true,
    "debugMode": false,
    "profiling": false,
    "customShaders": false
  }
}
```

### 🤖 **AI Model Configuration**
```json
{
  "aiModels": {
    "primary": "Real-ESRGAN",
    "fallback": "EDSR",
    "autoDownload": true,
    "modelCache": "2GB",
    "updateCheck": "weekly"
  }
}
```

---

## 📋 **Configuration Templates**

### 🏠 **Home Theater Setup**
```json
{
  "name": "Home Theater",
  "preset": "cinema",
  "quality": "ultra",
  "hdr": true,
  "surroundSound": true,
  "largeScreen": true,
  "viewingDistance": "3m"
}
```

### 🎮 **Gaming Rig Setup**
```json
{
  "name": "Gaming Rig",
  "preset": "gaming",
  "latency": "minimum",
  "refreshRate": 144,
  "gsync": true,
  "hdr": true,
  "rayTracing": true
}
```

---

## 📚 **Related Documentation**

- 📖 **[Installation Guide](Installation)** - Setup instructions
- 🎯 **[Hardware Compatibility](Hardware-Compatibility)** - Supported hardware
- 🎮 **[Usage Guide](Usage)** - How to use features
- 🔍 **[Troubleshooting](Troubleshooting)** - Problem solving

---

*Perfect configuration leads to perfect video quality! 🎬✨*