# Jellyfin Upscaler Plugin - Installation & Configuration Guide

## System Requirements

### Minimum Requirements
- **Jellyfin Server**: 10.10.3 or higher
- **Operating System**: Windows 10/11, Linux (Ubuntu 20.04+), macOS 11+
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 500MB for plugin files

### Hardware Requirements by Profile

| Profile | GPU | CPU | RAM | Notes |
|---------|-----|-----|-----|--------|
| **Default** | GTX 1650 / RX 580 | i5-6th gen / Ryzen 5 | 8GB | Auto-detection |
| **Anime** | RTX 3070+ | i7 / Ryzen 7 | 16GB | Waifu2x intensive |
| **Movies** | RTX 3070+ / RX 6800 XT+ | i7/i9 / Ryzen 7/9 | 16GB+ | ESRGAN for 4K+ |
| **TV Shows** | GTX 1650+ | i5 / Ryzen 5 | 8GB | Traditional shaders |
| **Custom** | Varies | Varies | 8GB+ | Depends on settings |

## Installation Methods

### Method 1: Manual Installation (Recommended)

1. **Download the Plugin**
   ```bash
   # Clone the repository
   git clone https://github.com/Kuschel-code/JellyfinUpscalerPlugin.git
   
   # Or download as ZIP and extract
   ```

2. **Locate Jellyfin Plugin Directory**
   - **Windows**: `C:\ProgramData\Jellyfin\Server\plugins\`
   - **Linux**: `/var/lib/jellyfin/plugins/`
   - **macOS**: `/var/lib/jellyfin/plugins/`
   - **Docker**: `/config/plugins/` (inside container)

3. **Copy Plugin Files**
   ```bash
   # Create plugin directory
   mkdir -p /path/to/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/
   
   # Copy all files
   cp -r JellyfinUpscalerPlugin/* /path/to/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/
   ```

4. **Set Permissions (Linux/macOS)**
   ```bash
   sudo chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/
   sudo chmod -R 755 /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/
   ```

5. **Restart Jellyfin Server**
   ```bash
   # Windows (as Administrator)
   net stop JellyfinService
   net start JellyfinService
   
   # Linux systemd
   sudo systemctl restart jellyfin
   
   # Docker
   docker restart jellyfin
   ```

### Method 2: Plugin Repository (Future)

*This method will be available when the plugin is added to official repositories.*

1. Go to Jellyfin Admin Dashboard
2. Navigate to "Plugins" > "Repositories"
3. Add repository URL: `https://github.com/Kuschel-code/JellyfinUpscalerPlugin/manifest.json`
4. Install "Jellyfin Upscaler" from the catalog

## Configuration

### Initial Setup

1. **Access Plugin Settings**
   - Open Jellyfin Admin Dashboard
   - Go to "Plugins" > "My Plugins"
   - Click on "Jellyfin Upscaler" > "Settings"

2. **Run Benchmark Test**
   - Enable "Run Benchmark Test" (recommended for first setup)
   - This will test your hardware capabilities
   - Results determine if AI upscaling is suitable for your system

### Profile Configuration

#### Default Profile
- **Best for**: Mixed content libraries
- **Settings**: Automatically detects content type and applies appropriate model
- **Performance**: Moderate resource usage

#### Anime Profile
- **Best for**: Animation content
- **Model**: Waifu2x optimized for anime/cartoon content
- **Settings**: 
  - Higher saturation for vibrant colors
  - Noise reduction optimized for animation artifacts
- **Performance**: High GPU usage

#### Movies Profile  
- **Best for**: Live-action movies, especially 4K content
- **Model**: ESRGAN for photorealistic enhancement
- **Settings**:
  - Maximum quality upscaling
  - Optimized for cinema content
- **Performance**: Very high resource usage

#### TV Shows Profile
- **Best for**: Series, documentaries, lower-resolution content
- **Model**: Traditional shaders (Bicubic/Lanczos)
- **Settings**: 
  - Balanced quality/performance
  - Optimized for streaming
- **Performance**: Low to moderate usage

#### Custom Profile
- **Best for**: Fine-tuned control
- **Configuration Options**:

```json
{
  "enableFPSRule": true,
  "maxFPSForAI": "60 FPS",
  "minResolutionForAI": "720p",
  "maxResolutionForAI": "2160p",
  "defaultShaderBelowMinResolution": "Bicubic",
  "defaultShaderAboveMaxResolution": "Lanczos",
  "sharpness": 2,
  "saturation": 1.2,
  "contrast": 1.1,
  "denoising": 1
}
```

### Advanced Settings

#### FPS Rules
- **Unlimited**: No FPS restriction (high performance impact)
- **30 FPS**: Good for lower-end hardware
- **60 FPS**: Balance of quality/performance
- **120 FPS**: High-end systems only

#### Resolution Settings
- **Min Resolution**: Below this, traditional shaders are used
- **Max Resolution**: Above this, fallback shaders prevent overload
- **Recommended**: 720p min, 2160p max for most systems

#### Image Quality Parameters
- **Sharpness** (0-5): Increases edge definition
  - 0: No sharpening
  - 2: Recommended default
  - 5: Maximum (may cause artifacts)

- **Saturation** (-1 to 3): Color intensity
  - -1: Desaturated/grayscale effect
  - 1: Natural colors
  - 3: Vivid, oversaturated

- **Contrast** (0.5-2.0): Light/dark balance
  - 0.5: Low contrast, flat image
  - 1.0: Natural contrast
  - 2.0: High contrast, dramatic

- **Denoising** (0-3): Noise reduction strength
  - 0: No noise reduction
  - 1: Light reduction (recommended)
  - 3: Aggressive (may blur details)

## Performance Optimization

### GPU Optimization
```bash
# NVIDIA users: Enable CUDA acceleration
export CUDA_VISIBLE_DEVICES=0

# AMD users: Enable ROCm (Linux)
export HSA_OVERRIDE_GFX_VERSION=10.3.0
```

### Memory Management
- **Monitor RAM usage**: AI models require 2-8GB VRAM
- **Adjust batch sizes**: Lower if experiencing memory issues
- **Close unnecessary applications**: During high-resolution playback

### Network Optimization
- **Local playback**: Best performance for AI upscaling
- **Remote streaming**: Consider disabling AI for mobile clients
- **Bandwidth**: Ensure sufficient upload for enhanced streams

## Troubleshooting

### Common Issues

1. **Plugin not appearing**
   - Check Jellyfin logs: `/var/log/jellyfin/`
   - Verify file permissions
   - Restart Jellyfin service

2. **AI models not loading**
   - Check internet connection (models download on first use)
   - Verify storage space (models are 100-500MB each)
   - Check browser console for JavaScript errors

3. **Poor performance**
   - Run benchmark test to verify hardware compatibility
   - Lower resolution settings
   - Switch to traditional shaders
   - Reduce image quality parameters

4. **Artifacts or glitches**
   - Reduce sharpness setting
   - Lower denoising level  
   - Try different shader (Bicubic → Lanczos)
   - Check GPU drivers are updated

### Log Analysis

**Enable debug logging:**
```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Debug"
    }
  }
}
```

**Common log messages:**
- `Jellyfin Upscaler initialized successfully`: Plugin loaded correctly
- `Could not load AI models`: Hardware incompatible or files missing
- `Applied [model] enhancement`: Upscaling active on video

## Backup and Restore

### Backup Settings
```bash
# Backup plugin configuration
cp /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/config.json ~/upscaler-backup.json

# Backup complete plugin
tar -czf upscaler-backup.tar.gz /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/
```

### Restore Settings
```bash
# Restore configuration
cp ~/upscaler-backup.json /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/config.json

# Restore complete plugin
tar -xzf upscaler-backup.tar.gz -C /
```

## Uninstallation

1. **Stop Jellyfin service**
2. **Remove plugin directory**
   ```bash
   rm -rf /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/
   ```
3. **Clear browser cache** (to remove client-side files)
4. **Restart Jellyfin service**

## Support

- **GitHub Issues**: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/issues
- **Jellyfin Community**: https://forum.jellyfin.org/
- **Discord**: Jellyfin official Discord server

## Updates

The plugin supports automatic update checking. To manually update:

1. Download latest version
2. Stop Jellyfin
3. Replace plugin files
4. Restart Jellyfin
5. Clear browser cache

---

*For advanced configuration and development information, see DEVELOPMENT.md*