# Changelog

All notable changes to the Jellyfin Upscaler Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-02

### 🚀 Added
- **Enhanced Shader Implementations**
  - Proper Bicubic interpolation with cubic kernel
  - Improved Bilinear interpolation with anti-aliasing
  - Advanced Lanczos filter with configurable radius
  - All shaders now support texture size uniforms

- **Adaptive Performance System**
  - Dynamic quality adjustment based on system performance
  - Real-time performance monitoring and optimization
  - Automatic fallback to traditional shaders when needed
  - Smart resource management with VRAM monitoring

- **Comprehensive Class-Based Architecture**
  - Main `JellyfinUpscaler` class for better code organization
  - `AdaptivePerformanceManager` for dynamic quality control
  - `PerformanceMonitor` for real-time metrics display
  - Modular design for easier maintenance and extensions

- **Advanced Configuration Options**
  - Content-type detection for automatic profile selection
  - FPS-based processing rules
  - Resolution-specific shader selection
  - Hardware-specific optimization profiles

- **Professional Documentation**
  - Detailed installation guide (`INSTALLATION.md`)
  - Performance optimization manual (`PERFORMANCE.md`)
  - Complete changelog documentation
  - Hardware compatibility matrices

### 🛠 Fixed
- **Critical Bug Fixes**
  - Fixed JSON syntax errors in `manifest.json` (missing commas)
  - Corrected model path references in JavaScript (`./shaders/` instead of `./models/`)
  - Proper error handling for model loading failures
  - Memory leak prevention with tensor disposal

- **Performance Improvements**
  - Optimized shader compilation and caching
  - Reduced memory allocation in processing loops
  - Better GPU memory management
  - Improved CPU utilization patterns

### 🔧 Changed
- **Enhanced Benchmark System**
  - More accurate performance testing with multiple sample images
  - Better hardware capability detection
  - Improved thresholds for AI upscaling suitability
  - Real-time performance feedback

- **Updated Installation Process**
  - Platform-specific installation paths
  - Proper permission setting instructions
  - Docker container support
  - Service restart commands for all platforms

- **Improved User Experience**
  - Better error messages and logging
  - Real-time performance metrics display
  - Adaptive quality notifications
  - Hardware-specific recommendations

### 📚 Documentation
- **New Guides**
  - `INSTALLATION.md`: Complete installation and configuration guide
  - `PERFORMANCE.md`: Hardware-specific optimization strategies
  - `CHANGELOG.md`: Detailed version history and changes
  - Enhanced README with better organization

- **Hardware Compatibility**
  - Detailed GPU requirements for each profile
  - CPU optimization recommendations
  - Memory usage guidelines
  - Network performance considerations

### 🎯 Performance Optimizations
- **GPU-Specific Optimizations**
  - NVIDIA RTX series profiles
  - AMD Radeon RX series profiles  
  - Intel Arc series support
  - Hardware-specific shader selection

- **Memory Management**
  - Automatic VRAM cleanup when usage exceeds 6GB
  - Tensor lifecycle management
  - Garbage collection optimization
  - Memory usage monitoring and alerts

- **Network Optimizations**
  - Local vs remote playback detection
  - Bandwidth-aware quality adjustment
  - Streaming-optimized profiles
  - Client-specific optimizations

### 🔒 Security
- **Input Validation**
  - Proper validation of configuration parameters
  - Safe tensor operations
  - Protected file system access
  - Sanitized user inputs

### 🧪 Testing
- **Performance Testing Suite**
  - Automated benchmark testing
  - Hardware compatibility verification
  - Memory usage profiling
  - Frame processing time measurement

---

## [1.0.0] - 2024-12-31

### 🎉 Initial Release
- **Core Features**
  - AI upscaling with ESRGAN and Waifu2x models
  - Traditional shader fallbacks (Bicubic, Bilinear, Lanczos)
  - Profile-based configuration system
  - Automatic library type detection
  - Basic benchmark testing

- **Supported Profiles**
  - Default: Automatic content detection
  - Anime: Optimized for animation content
  - Movies: High-quality live-action enhancement
  - TV Shows: Balanced performance for series
  - Custom: User-defined settings

- **Configuration Options**
  - FPS limitations (30/60/120 FPS, Unlimited)
  - Resolution boundaries (480p to 8K)
  - Image quality parameters (sharpness, saturation, contrast, denoising)
  - Shader selection for different resolution ranges

- **Hardware Support**
  - NVIDIA GTX 1600 series and higher
  - AMD Radeon RX 500 series and higher
  - Basic Intel integrated graphics support
  - Automatic hardware capability detection

### 🐛 Known Issues in 1.0.0
- JSON syntax errors in manifest file
- Incorrect model path references
- Basic shader implementations without proper filtering
- Limited error handling for edge cases
- Basic performance monitoring

---

## Upgrade Instructions

### From 1.0.0 to 1.1.0

1. **Backup your settings:**
   ```bash
   cp /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/config.json ~/upscaler-backup.json
   ```

2. **Stop Jellyfin service:**
   ```bash
   sudo systemctl stop jellyfin
   ```

3. **Remove old version:**
   ```bash
   rm -rf /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/
   ```

4. **Install new version:**
   ```bash
   # Extract new version to plugin directory
   cp -r JellyfinUpscalerPlugin/* /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.1.0/
   ```

5. **Restore settings (optional):**
   ```bash
   cp ~/upscaler-backup.json /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.1.0/config.json
   ```

6. **Start Jellyfin service:**
   ```bash
   sudo systemctl start jellyfin
   ```

7. **Clear browser cache** to ensure new client-side code is loaded

### Configuration Migration

The plugin will automatically migrate settings from version 1.0.0 to 1.1.0. However, you may want to review and adjust the new performance settings:

- **Adaptive Performance**: Enabled by default
- **Performance Monitoring**: Available in advanced settings
- **Hardware-Specific Profiles**: Check recommended settings for your GPU

---

## Support

For issues, questions, or contributions:

- **GitHub Issues**: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/issues
- **Jellyfin Forum**: https://forum.jellyfin.org/
- **Discord**: Jellyfin Community Discord

---

*This changelog follows the principles of [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).*