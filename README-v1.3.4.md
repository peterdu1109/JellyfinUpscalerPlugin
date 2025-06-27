# 🚀 AI Upscaler Plugin v1.3.4 - Enterprise Edition

**Professional AI upscaling for Jellyfin with intelligent hardware detection, advanced model management, and enterprise-grade performance optimization.**

![Version](https://img.shields.io/badge/version-1.3.4-blue.svg)
![Platform](https://img.shields.io/badge/platform-Jellyfin-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

---

## 🌟 What's New in v1.3.4

### 🔋 **Light Mode System**
- **Automatic Hardware Detection**: Intelligently detects your system capabilities
- **Smart Optimization**: Automatically configures settings for weak hardware
- **Real-time Monitoring**: Performance tracking with temperature warnings
- **Battery Optimization**: Reduced power consumption on mobile devices

### 🤖 **Advanced Model Manager**
- **UI-based Downloads**: Download AI models directly from the plugin interface
- **Smart Caching**: Intelligent model prioritization and automatic cleanup
- **Hardware Compatibility**: Automatic requirements checking before download
- **Progress Tracking**: Real-time download progress with queue management

### 🎬 **Frame Interpolation Control**
- **Optional Processing**: Enable/disable frame interpolation per your preference
- **Cinematic Preservation**: Automatically skips 24fps content to preserve film quality
- **Multiple Methods**: Motion compensation, optical flow, and frame blending
- **Smart Thresholds**: Configurable FPS thresholds for activation

### 📱 **Mobile & Server-side Support**
- **Mobile Optimization**: Lightweight processing for mobile devices
- **Server-side Processing**: Offload computation to server for better performance
- **Pre-upscaling Cache**: Cache processed content for faster streaming
- **Adaptive Streaming**: Automatically adjust quality based on device capabilities

### ⚡ **Enhanced Performance**
- **Temperature Throttling**: Prevents overheating with automatic adjustments
- **CPU Core Limiting**: Configurable CPU usage limits
- **Adaptive Quality**: Dynamic quality adjustment based on system performance
- **Resource Monitoring**: Real-time performance metrics display

---

## 📋 System Requirements

### Minimum Requirements
- **Jellyfin Server**: 10.10.3.0 or later
- **Runtime**: .NET 6.0
- **RAM**: 4GB (Light Mode optimized)
- **Storage**: 500MB for plugin + models

### Recommended Requirements
- **RAM**: 8GB or more
- **GPU**: Dedicated graphics card with WebGL support
- **Storage**: 2GB for optimal model caching
- **CPU**: Multi-core processor (4+ cores)

### Enterprise Features
- **Advanced Hardware**: 16GB+ RAM, modern GPU for premium models
- **High-Performance**: Multi-GPU setups supported
- **Server-grade**: Linux/Windows Server environments

---

## 🚀 Installation

### Method 1: Jellyfin Plugin Catalog (Recommended)
1. Open Jellyfin Admin Dashboard
2. Go to **Plugins** → **Catalog**
3. Search for "AI Upscaler"
4. Click **Install**
5. Restart Jellyfin server

### Method 2: Manual Installation
1. Download `JellyfinUpscalerPlugin-v1.3.4.zip`
2. Upload via **Admin Dashboard** → **Plugins** → **Install plugin**
3. Restart Jellyfin server

### Method 3: Direct File Installation
1. Extract zip to Jellyfin plugins directory:
   - **Windows**: `%ProgramData%\Jellyfin\Server\plugins\AI-Upscaler`
   - **Linux**: `/var/lib/jellyfin/plugins/AI-Upscaler`
   - **Docker**: `/config/plugins/AI-Upscaler`
2. Restart Jellyfin

---

## ⚙️ Configuration Guide

### 🔋 Light Mode Setup
1. Navigate to **Settings** → **Plugins** → **AI Upscaler**
2. Enable **"Auto-Detect Hardware"** for automatic optimization
3. Configure **Light Mode Max Resolution** (720p, 1080p, 1440p)
4. Select appropriate **Light Mode AI Model**

### 🤖 Model Management
1. Enable **"Model Manager"** in configuration
2. Use the **Available AI Models** section to:
   - Download recommended models
   - Manage cache size
   - Delete unused models
3. Configure **Auto-Download** for seamless experience

### 🎬 Frame Interpolation
1. Enable **"Frame Interpolation"** if desired
2. Configure **"Skip 24fps Content"** to preserve cinematic quality
3. Select interpolation method:
   - **Motion Compensation**: Best quality (GPU required)
   - **Optical Flow**: Fast processing
   - **Frame Blending**: Smooth results

### 📱 Mobile Support
1. Enable **"Mobile Support"** for mobile optimization
2. Configure **"Server-side Upscaling"** for better mobile performance
3. Set **Mobile Cache Size** based on storage availability

---

## 🎯 AI Models Overview

### Available Models

| Model | Size | Quality | Speed | Use Case | Requirements |
|-------|------|---------|-------|----------|-------------|
| **Real-ESRGAN v3.0** | 47MB | High | Medium | General content | 4GB RAM |
| **ESRGAN Pro v4.0** | 157MB | Ultra | Slow | Photos/High-quality | 8GB RAM, GPU |
| **SwinIR Ultra** | 89MB | Ultra | Slow | Animation/Anime | 6GB RAM, GPU |
| **SRCNN Light** | 12MB | Medium | Fast | Weak hardware | 2GB RAM |
| **Waifu2x Anime** | 35MB | High | Medium | Anime/Cartoon | 4GB RAM |
| **HAT Next-Gen** | 204MB | Premium | Slow | Latest AI model | 16GB RAM, GPU |

### Model Recommendations

- **Weak Hardware**: SRCNN Light, Bicubic
- **Balanced Performance**: Real-ESRGAN v3.0
- **Maximum Quality**: ESRGAN Pro v4.0, HAT Next-Gen
- **Anime Content**: Waifu2x Anime, SwinIR Ultra
- **Mobile Devices**: SRCNN Light (server-side processing recommended)

---

## 🔧 Advanced Configuration

### Performance Optimization
```json
{
  "EnableLightMode": true,
  "AdaptiveQualityEnabled": true,
  "BatteryOptimizationMode": true,
  "TemperatureThrottling": true,
  "MaxTemperature": 85,
  "CPUCoreLimit": 0
}
```

### Hardware-Specific Settings
```json
{
  "AutoDetectHardware": true,
  "LightModeMaxResolution": 1080,
  "LightModeModel": "srcnn",
  "EnableModelManager": true,
  "MaxModelCacheSize": 10240
}
```

### Frame Interpolation Settings
```json
{
  "EnableFrameInterpolation": false,
  "SkipInterpolationFor24fps": true,
  "FrameInterpolationMethod": "motion_compensation",
  "FrameInterpolationThreshold": 30.0
}
```

---

## 📊 Performance Monitoring

### Real-time Metrics
- **CPU Usage**: Live monitoring with color-coded warnings
- **Memory Usage**: RAM consumption tracking
- **GPU Usage**: Graphics card utilization (if available)
- **Temperature**: Thermal monitoring with automatic throttling

### Automatic Adjustments
- **Quality Reduction**: When resources are limited
- **Thermal Throttling**: When temperature exceeds thresholds
- **Battery Mode**: Reduced performance on battery power
- **Light Mode**: Automatic activation for weak hardware

---

## 🐛 Troubleshooting

### Common Issues

#### Plugin Not Loading
1. Check Jellyfin version compatibility (10.10.3.0+)
2. Verify .NET 6.0 runtime is installed
3. Check plugin directory permissions
4. Restart Jellyfin service

#### Poor Performance
1. Enable **Light Mode** for automatic optimization
2. Reduce **Max Concurrent Jobs** to 1
3. Lower **Processing Quality** to "Fast"
4. Enable **Battery Optimization Mode**

#### Model Download Failures
1. Check internet connection
2. Verify sufficient storage space
3. Check **Model Cache Size** settings
4. Try downloading models individually

#### Frame Interpolation Issues
1. Ensure GPU support is available
2. Check **FPS Threshold** settings
3. Verify video format compatibility
4. Try different interpolation methods

### Debug Mode
Enable verbose logging by setting `LogLevel` to "debug" in configuration.

---

## 🔒 Security & Privacy

### Data Processing
- **Local Processing**: All AI upscaling performed locally
- **No Data Collection**: No user data sent to external servers
- **Model Downloads**: Only from trusted sources with checksum verification

### Network Usage
- **Model Downloads**: Only when explicitly requested
- **Minimal Bandwidth**: Efficient caching reduces repeated downloads
- **Offline Operation**: Full functionality without internet (after initial setup)

---

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Install .NET 6.0 SDK
3. Run `dotnet build` to build the project
4. Use `./build-v1.3.4.ps1` for packaging

### Testing
1. Deploy to test Jellyfin instance
2. Test with various video formats
3. Verify performance on different hardware
4. Report issues on GitHub

---

## 📝 Changelog

### v1.3.4 - Enterprise Edition (2025-01-03)
#### 🆕 New Features
- **Light Mode System**: Automatic hardware detection and optimization
- **Model Manager**: UI-based model downloads and management
- **Frame Interpolation**: Optional processing with cinematic preservation
- **Mobile Support**: Server-side processing and optimization
- **Performance Monitoring**: Real-time metrics and automatic adjustments

#### 🛠️ Technical Improvements
- Enhanced UI with enterprise-grade styling
- Improved error handling and logging
- Better resource management and cleanup
- Advanced configuration validation
- Real-time performance metrics display

#### 🔧 Configuration Changes
- Added 25+ new configuration options
- Improved hardware detection algorithms
- Enhanced model compatibility checking
- Better thermal management controls

---

## 📞 Support

### Documentation
- **Wiki**: [GitHub Wiki](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki)
- **FAQ**: [Frequently Asked Questions](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki/FAQ)
- **Troubleshooting**: [Common Issues](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki/Troubleshooting)

### Community
- **GitHub Issues**: [Report bugs or request features](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/issues)
- **Discussions**: [Community discussions](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/discussions)
- **Jellyfin Forum**: [Plugin discussion thread](https://forum.jellyfin.org/)

### Professional Support
For enterprise deployments or commercial use, contact for professional support options.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Jellyfin Team**: For the amazing media server platform
- **AI Research Community**: For the open-source AI models
- **Contributors**: All community members who helped improve this plugin
- **Beta Testers**: Users who provided valuable feedback

---

**🎯 Ready to enhance your Jellyfin experience with professional AI upscaling!**

*Built with ❤️ for the Jellyfin community*