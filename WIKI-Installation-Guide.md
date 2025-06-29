# 📦 Installation Guide - AI Upscaler Plugin v1.3.5 Enhanced

## 🎯 Quick Install (Recommended)

### Method 1: Direct Download & Install
```bash
# 1. Download the latest enhanced release
wget https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/latest/download/JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip

# 2. Extract to Jellyfin plugins directory
unzip JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip -d /path/to/jellyfin/plugins/

# 3. Restart Jellyfin
systemctl restart jellyfin
```

---

## 🛠️ Platform-Specific Installation

### 🪟 **Windows**

#### Option A: Manual Installation
1. **Download** the latest release:
   - Go to [Releases](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases)
   - Download `JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip`

2. **Locate Jellyfin Plugins Directory**:
   ```
   %ProgramData%\Jellyfin\Server\plugins\
   ```
   Or typically:
   ```
   C:\ProgramData\Jellyfin\Server\plugins\
   ```

3. **Extract Plugin**:
   - Create a new folder: `AIUpscalerPlugin`
   - Extract all contents into this folder

4. **Restart Jellyfin Service**:
   ```powershell
   # Option 1: Service Manager
   Get-Service JellyfinServer | Restart-Service
   
   # Option 2: Manual restart
   # Stop and start the Jellyfin service from Services.msc
   ```

#### Option B: PowerShell Installation
```powershell
# Run as Administrator
$pluginPath = "$env:ProgramData\Jellyfin\Server\plugins\AIUpscalerPlugin"
New-Item -ItemType Directory -Path $pluginPath -Force
Invoke-WebRequest -Uri "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/latest/download/JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip" -OutFile "$env:TEMP\plugin.zip"
Expand-Archive -Path "$env:TEMP\plugin.zip" -DestinationPath $pluginPath -Force
Restart-Service JellyfinServer
```

### 🐧 **Linux**

#### Ubuntu/Debian
```bash
# 1. Stop Jellyfin service
sudo systemctl stop jellyfin

# 2. Create plugin directory
sudo mkdir -p /var/lib/jellyfin/plugins/AIUpscalerPlugin

# 3. Download and extract
cd /tmp
wget https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/latest/download/JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip
sudo unzip JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip -d /var/lib/jellyfin/plugins/AIUpscalerPlugin/

# 4. Set permissions
sudo chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/AIUpscalerPlugin

# 5. Start Jellyfin service
sudo systemctl start jellyfin
```

#### CentOS/RHEL/Fedora
```bash
# 1. Stop Jellyfin service
sudo systemctl stop jellyfin

# 2. Create plugin directory
sudo mkdir -p /var/lib/jellyfin/plugins/AIUpscalerPlugin

# 3. Download and extract
cd /tmp
wget https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/latest/download/JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip
sudo unzip JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip -d /var/lib/jellyfin/plugins/AIUpscalerPlugin/

# 4. Set SELinux context (if enabled)
sudo setsebool -P httpd_can_network_connect 1
sudo restorecon -R /var/lib/jellyfin/plugins/

# 5. Set permissions and start
sudo chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/AIUpscalerPlugin
sudo systemctl start jellyfin
```

### 🍎 **macOS**

#### Manual Installation
```bash
# 1. Stop Jellyfin
launchctl unload ~/Library/LaunchAgents/jellyfin.plist

# 2. Create plugin directory
mkdir -p ~/.local/share/jellyfin/plugins/AIUpscalerPlugin

# 3. Download and extract
cd /tmp
curl -L -o plugin.zip https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/latest/download/JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip
unzip plugin.zip -d ~/.local/share/jellyfin/plugins/AIUpscalerPlugin/

# 4. Start Jellyfin
launchctl load ~/Library/LaunchAgents/jellyfin.plist
```

#### Homebrew Installation
```bash
# If using Homebrew Jellyfin
brew services stop jellyfin
mkdir -p /usr/local/var/lib/jellyfin/plugins/AIUpscalerPlugin
cd /tmp
curl -L -o plugin.zip https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/latest/download/JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip
unzip plugin.zip -d /usr/local/var/lib/jellyfin/plugins/AIUpscalerPlugin/
brew services start jellyfin
```

---

## 🐳 **Docker Installation**

### Docker Compose Method
```yaml
# Add to your docker-compose.yml
version: '3.8'
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    volumes:
      - ./config:/config
      - ./cache:/cache
      - ./media:/media
      - ./plugins:/usr/local/lib/jellyfin/plugins  # Add this line
    ports:
      - "8096:8096"
    
# Then run:
# 1. Download plugin
# mkdir -p ./plugins/AIUpscalerPlugin
# wget -O /tmp/plugin.zip https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/latest/download/JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip
# unzip /tmp/plugin.zip -d ./plugins/AIUpscalerPlugin/
# 
# 2. Restart container
# docker-compose restart jellyfin
```

### Docker CLI Method
```bash
# 1. Create plugin directory on host
mkdir -p /path/to/jellyfin/plugins/AIUpscalerPlugin

# 2. Download and extract plugin
wget -O /tmp/plugin.zip https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/latest/download/JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip
unzip /tmp/plugin.zip -d /path/to/jellyfin/plugins/AIUpscalerPlugin/

# 3. Run Docker with plugin volume
docker run -d \
  --name jellyfin \
  -p 8096:8096 \
  -v /path/to/jellyfin/config:/config \
  -v /path/to/jellyfin/plugins:/usr/local/lib/jellyfin/plugins \
  -v /path/to/media:/media \
  jellyfin/jellyfin:latest
```

---

## ✅ **Verification Steps**

### 1. Check Plugin Installation
1. Open Jellyfin web interface: `http://your-server:8096`
2. Go to **Dashboard** → **Plugins**
3. Look for **"🚀 AI Upscaler Plugin v1.3.5 - Enhanced Edition"**
4. Status should show **"Active"**

### 2. Verify Features
```yaml
✅ Plugin appears in installed plugins list
✅ Configuration page accessible
✅ AI models list populated (14 models)
✅ Shaders list populated (7 shaders)
✅ Hardware detection working
✅ No error messages in logs
```

### 3. Test Basic Functionality
1. Go to **Dashboard** → **Plugins** → **AI Upscaler Plugin**
2. Check **AI Models** tab - should show 14 models
3. Check **Shaders** tab - should show 7 shaders
4. Check **Statistics** tab - should show hardware info

---

## 🔧 **Post-Installation Configuration**

### Essential Settings
```yaml
1. AI Model Selection:
   - Auto-detect: Recommended for beginners
   - Manual: Choose specific model (Real-ESRGAN for general use)

2. Hardware Acceleration:
   - Enable if you have compatible GPU
   - Auto-detect recommended

3. Device Optimization:
   - Select your primary playback device
   - Enable cross-device sync if using multiple devices
```

### Advanced Configuration
```yaml
1. Content-Aware Processing:
   - Enable AI color correction
   - Set content type detection
   - Configure zoned upscaling

2. Performance Tuning:
   - Set VRAM limits based on your GPU
   - Configure thermal protection
   - Enable real-time statistics

3. Quality Settings:
   - Upscaling factor (1.5x to 4x)
   - Target resolution
   - Quality vs performance balance
```

---

## 🚨 **Troubleshooting**

### Common Issues

#### Plugin Not Appearing
```bash
# Check Jellyfin logs
journalctl -u jellyfin -f

# Verify plugin files exist
ls -la /var/lib/jellyfin/plugins/AIUpscalerPlugin/

# Check permissions
sudo chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/
```

#### Configuration Page Not Loading
1. Clear browser cache
2. Restart Jellyfin service
3. Check browser console for JavaScript errors

#### Performance Issues
1. **Reduce AI model complexity**: Switch to FSRCNN or SRCNN-Light
2. **Lower upscaling factor**: Try 1.5x instead of 4x
3. **Enable hardware acceleration**: If available
4. **Check VRAM usage**: Reduce if exceeding limits

### Log Analysis
```bash
# View recent Jellyfin logs
tail -f /var/log/jellyfin/jellyfin.log

# Filter for plugin-specific logs
grep -i "upscaler\|ai.*model" /var/log/jellyfin/jellyfin.log
```

---

## 🎯 **Next Steps**

1. **[Quick Start Guide](Quick-Start)** - Configure your first upscaling job
2. **[AI Models Guide](AI-Models-Guide)** - Learn about all 14 models
3. **[Device Optimization](Device-Optimization)** - Optimize for your devices
4. **[Performance Tuning](Performance-Optimization)** - Maximize performance

---

## 🤝 **Need Help?**

- **Issues**: [GitHub Issues](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/issues)
- **Discussions**: [Community Forum](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/discussions)
- **Documentation**: [Full Wiki](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki)

---

<div align="center">

**🎉 Installation Complete! Ready to experience 400% better video quality! 🎉**

**[➡️ Next: Quick Start Guide](Quick-Start)**

</div>