# 🔧 Complete Installation Guide

> **Professional installation methods for all platforms and use cases**

---

## 🚀 **Quick Installation (Recommended)**

### **🔥 Method 1: Advanced Pro Installation**
**Best for: High-end systems, full AI features**

```bash
# Windows
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/INSTALL-ADVANCED.cmd
INSTALL-ADVANCED.cmd

# Linux/macOS
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/install-advanced.sh
chmod +x install-advanced.sh && ./install-advanced.sh
```

**Features:**
- ✅ DLSS 3.0, FSR 3.0, XeSS, Real-ESRGAN
- ✅ Hardware auto-detection
- ✅ Multi-language support (8 languages)
- ✅ Performance monitoring
- ✅ Advanced settings panel

---

### **🎯 Method 2: Native TV Installation**
**Best for: TV setups, remote control use**

```bash
# Windows
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/INSTALL-NATIVE.cmd
INSTALL-NATIVE.cmd

# Linux/macOS  
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/install-native.sh
chmod +x install-native.sh && ./install-native.sh
```

**Features:**
- ✅ TV-friendly large UI
- ✅ Remote control optimized
- ✅ DLSS/FSR support
- ✅ Simplified settings
- ✅ 32x32 optimized icons

---

### **🛠️ Method 3: Failsafe Installation**
**Best for: Network issues, installation problems**

```bash
# Windows
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/INSTALL-FAILSAFE.cmd
INSTALL-FAILSAFE.cmd
```

**Features:**
- ✅ Automatic retry on failure
- ✅ Network error handling
- ✅ Fallback download mirrors
- ✅ Diagnostic information
- ✅ Clean installation process

---

## 🐳 **Docker Installation**

### **Docker Compose (Recommended)**

```yaml
# docker-compose.yml
version: '3.8'
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    user: uid:gid
    network_mode: 'host'
    volumes:
      - ./jellyfin/config:/config
      - ./jellyfin/cache:/cache
      - ./media:/media
      - ./jellyfin/plugins:/config/plugins  # Plugin directory
    environment:
      - JELLYFIN_PublishedServerUrl=http://localhost:8096
      - NVIDIA_VISIBLE_DEVICES=all  # For NVIDIA GPU support
    restart: 'unless-stopped'
    # For NVIDIA GPU support
    runtime: nvidia
    environment:
      - NVIDIA_DRIVER_CAPABILITIES=all
```

### **Installation Commands**

```bash
# 1. Create directories
mkdir -p jellyfin/{config,cache,plugins}

# 2. Download plugin
cd jellyfin/plugins
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscaler-Advanced.zip
unzip JellyfinUpscaler-Advanced.zip -d JellyfinUpscaler_Advanced_1.3.0/

# 3. Set permissions
chown -R 1000:1000 jellyfin/
chmod -R 755 jellyfin/plugins/

# 4. Start container
docker-compose up -d

# 5. Check logs
docker-compose logs -f jellyfin
```

### **NVIDIA GPU Support in Docker**

```bash
# Install NVIDIA Container Toolkit
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt-get update
sudo apt-get install -y nvidia-docker2
sudo systemctl restart docker

# Test NVIDIA support
docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

---

## 🖥️ **Manual Installation**

### **Windows**

#### **Step 1: Locate Jellyfin Plugin Directory**
```bash
# Default locations:
C:\ProgramData\Jellyfin\Server\plugins\
# or
C:\Users\%USERNAME%\AppData\Local\jellyfin\plugins\
```

#### **Step 2: Download and Extract**
```powershell
# PowerShell method
$url = "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscaler-Advanced.zip"
$output = "$env:TEMP\JellyfinUpscaler-Advanced.zip"
Invoke-WebRequest -Uri $url -OutFile $output

# Extract to plugins directory
$pluginDir = "C:\ProgramData\Jellyfin\Server\plugins\JellyfinUpscaler_Advanced_1.3.0"
Expand-Archive -Path $output -DestinationPath $pluginDir -Force
```

#### **Step 3: Restart Jellyfin Service**
```bash
# Method 1: Services.msc
services.msc → Find "Jellyfin" → Restart

# Method 2: Command line (Run as Administrator)
net stop JellyfinService
net start JellyfinService

# Method 3: PowerShell (Run as Administrator)
Restart-Service -Name "JellyfinService"
```

---

### **Linux (Ubuntu/Debian)**

#### **Step 1: Download Plugin**
```bash
# Create plugin directory
sudo mkdir -p /var/lib/jellyfin/plugins/JellyfinUpscaler_Advanced_1.3.0

# Download and extract
cd /tmp
wget https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscaler-Advanced.zip
unzip JellyfinUpscaler-Advanced.zip
sudo mv * /var/lib/jellyfin/plugins/JellyfinUpscaler_Advanced_1.3.0/
```

#### **Step 2: Set Permissions**
```bash
# Set correct ownership and permissions
sudo chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/JellyfinUpscaler_Advanced_1.3.0/
sudo chmod -R 755 /var/lib/jellyfin/plugins/JellyfinUpscaler_Advanced_1.3.0/
```

#### **Step 3: Restart Jellyfin**
```bash
# SystemD
sudo systemctl restart jellyfin

# Check status
sudo systemctl status jellyfin

# View logs
sudo journalctl -u jellyfin -f
```

---

### **macOS**

#### **Step 1: Locate Plugin Directory**
```bash
# Default Jellyfin plugin directory
/Users/Shared/jellyfin/plugins/
# or if using Homebrew
/opt/homebrew/var/lib/jellyfin/plugins/
```

#### **Step 2: Install Plugin**
```bash
# Download and extract
cd /tmp
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscaler-Advanced.zip
unzip JellyfinUpscaler-Advanced.zip

# Move to plugins directory
sudo mkdir -p /Users/Shared/jellyfin/plugins/JellyfinUpscaler_Advanced_1.3.0
sudo mv * /Users/Shared/jellyfin/plugins/JellyfinUpscaler_Advanced_1.3.0/
```

#### **Step 3: Set Permissions and Restart**
```bash
# Set permissions
sudo chown -R jellyfin:jellyfin /Users/Shared/jellyfin/plugins/JellyfinUpscaler_Advanced_1.3.0/

# Restart Jellyfin (if using Homebrew)
brew services restart jellyfin

# Or restart manually if using binary
sudo launchctl unload /Library/LaunchDaemons/jellyfin.plist
sudo launchctl load /Library/LaunchDaemons/jellyfin.plist
```

---

## 🎮 **Gaming Platforms**

### **Steam Deck**

```bash
# Switch to Desktop Mode
# Open Konsole terminal

# Download installer
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/install-steamdeck.sh
chmod +x install-steamdeck.sh

# Run installer with Steam Deck optimizations
./install-steamdeck.sh

# Features enabled:
# - FSR 2.1 optimization
# - Battery-efficient settings
# - 1280x800 native resolution support
# - Gaming mode compatibility
```

### **ROG Ally / Other Handhelds**

```bash
# Windows handheld devices
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/INSTALL-HANDHELD.cmd
INSTALL-HANDHELD.cmd

# Optimizations:
# - Touch-friendly UI
# - Battery usage optimization
# - Performance/quality balance
# - Small screen adaptations
```

---

## 🌐 **Network Installation**

### **Remote Installation via SSH**

```bash
# Connect to Jellyfin server
ssh user@jellyfin-server

# Run installation script
curl -s https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/remote-install.sh | bash

# Monitor installation
tail -f /var/log/jellyfin/jellyfin.log
```

### **Ansible Playbook**

```yaml
# jellyfin-upscaler.yml
- hosts: jellyfin_servers
  become: yes
  tasks:
  - name: Create plugin directory
    file:
      path: /var/lib/jellyfin/plugins/JellyfinUpscaler_Advanced_1.3.0
      state: directory
      owner: jellyfin
      group: jellyfin

  - name: Download plugin
    get_url:
      url: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscaler-Advanced.zip
      dest: /tmp/jellyfin-upscaler.zip

  - name: Extract plugin
    unarchive:
      src: /tmp/jellyfin-upscaler.zip
      dest: /var/lib/jellyfin/plugins/JellyfinUpscaler_Advanced_1.3.0
      remote_src: yes
      owner: jellyfin
      group: jellyfin

  - name: Restart Jellyfin
    systemd:
      name: jellyfin
      state: restarted
```

---

## 🔍 **Installation Verification**

### **Check Plugin Installation**

```bash
# Linux
ls -la /var/lib/jellyfin/plugins/
cat /var/lib/jellyfin/plugins/JellyfinUpscaler_Advanced_1.3.0/meta.json

# Windows
dir "C:\ProgramData\Jellyfin\Server\plugins\"
type "C:\ProgramData\Jellyfin\Server\plugins\JellyfinUpscaler_Advanced_1.3.0\meta.json"

# Docker
docker exec jellyfin ls -la /config/plugins/
docker exec jellyfin cat /config/plugins/JellyfinUpscaler_Advanced_1.3.0/meta.json
```

### **Check Jellyfin Logs**

```bash
# Linux - Check for successful plugin load
sudo journalctl -u jellyfin | grep -i upscaler

# Windows - Check Jellyfin logs
Get-Content "C:\ProgramData\Jellyfin\Server\logs\jellyfin.log" | Select-String "upscaler"

# Docker
docker logs jellyfin | grep -i upscaler
```

### **Web Interface Verification**

1. **Admin Dashboard**:
   - Go to `http://your-jellyfin:8096/web/index.html`
   - Navigate to `Administration` → `Dashboard` → `Plugins`
   - Look for **"Jellyfin Upscaler"** in the installed plugins list

2. **Plugin Settings**:
   - Click on **"Jellyfin Upscaler"** plugin
   - Configure language and basic settings
   - Save settings

3. **Video Player Test**:
   - Play any video
   - Look for **"🔥 AI Pro"** button in video controls
   - Click to open settings panel

---

## 🚨 **Troubleshooting Installation**

### **Common Issues**

#### **Plugin Not Appearing**

```bash
# Check plugin directory permissions
ls -la /var/lib/jellyfin/plugins/JellyfinUpscaler_Advanced_1.3.0/

# Should show:
# -rw-r--r-- jellyfin jellyfin meta.json
# -rw-r--r-- jellyfin jellyfin upscaler-advanced.js
# -rw-r--r-- jellyfin jellyfin icon.png

# Fix permissions if needed
sudo chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/
sudo chmod -R 755 /var/lib/jellyfin/plugins/
```

#### **GUID Mismatch Error**

```bash
# Check for old plugin versions
find /var/lib/jellyfin/plugins/ -name "*upscaler*" -o -name "*Upscaler*"

# Remove old versions
sudo rm -rf /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_*
sudo rm -rf /var/lib/jellyfin/plugins/*upscaler*

# Reinstall latest version
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/INSTALL-ADVANCED.cmd
```

#### **Network Download Issues**

```bash
# Use failsafe installer
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/INSTALL-FAILSAFE.cmd
INSTALL-FAILSAFE.cmd

# Or manual download with different mirror
wget --no-check-certificate https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscaler-Advanced.zip
```

#### **Docker Permission Issues**

```bash
# Check container user
docker exec jellyfin id

# Fix volume permissions
sudo chown -R 1000:1000 ./jellyfin/plugins/
sudo chmod -R 755 ./jellyfin/plugins/

# Restart container
docker-compose restart jellyfin
```

---

## 🔄 **Updating the Plugin**

### **Automatic Update**

```bash
# Run update script
curl -s https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/update.sh | bash

# Or Windows
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/UPDATE.cmd
UPDATE.cmd
```

### **Manual Update**

```bash
# 1. Backup current settings
cp /var/lib/jellyfin/plugins/JellyfinUpscaler_*/settings.json /tmp/

# 2. Remove old version
rm -rf /var/lib/jellyfin/plugins/JellyfinUpscaler_*

# 3. Install new version
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/INSTALL-ADVANCED.cmd
./INSTALL-ADVANCED.cmd

# 4. Restore settings
cp /tmp/settings.json /var/lib/jellyfin/plugins/JellyfinUpscaler_Advanced_1.3.0/
```

---

## 📊 **Post-Installation Optimization**

### **Performance Tuning**

```bash
# Check GPU availability
nvidia-smi  # NVIDIA
rocm-smi    # AMD
intel_gpu_top  # Intel

# Optimize Jellyfin for GPU acceleration
# Edit: /etc/jellyfin/jellyfin.conf
JELLYFIN_FFMPEG_OPT="-hwaccel auto -hwaccel_output_format auto"
```

### **Language Configuration**

1. **Auto-Detection**: Plugin automatically detects Jellyfin language
2. **Manual Setting**: Go to Plugin Settings → Language → Select preferred language
3. **Restart Required**: Language changes require Jellyfin restart

### **Hardware-Specific Settings**

#### **NVIDIA RTX 40-Series**
- Enable DLSS 3.0 with Frame Generation
- Use 4x scale factor for maximum quality
- Enable RTX HDR for HDR content

#### **AMD RX 7000-Series**  
- Enable FSR 3.0 with Fluid Motion
- Use 3x scale factor for balanced performance
- Enable motion compensation

#### **Intel Arc GPUs**
- Enable XeSS for best quality
- Use 2.5x scale factor
- Enable Intel Deep Link features

---

## ✅ **Installation Complete!**

### **Next Steps:**
1. **[📖 Read the Configuration Guide](Configuration)**
2. **[🎯 Learn Usage Tips](Usage)**
3. **[🏆 Optimize Performance](Performance)**
4. **[🛠️ Troubleshoot Issues](Troubleshooting)**

### **Need Help?**
- **🐛 Report Issues**: [GitHub Issues](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/issues)
- **💬 Ask Questions**: [GitHub Discussions](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/discussions)
- **📧 Contact Support**: support@jellyfin-upscaler.com

---

**🎉 Congratulations! Your Jellyfin AI Upscaler Plugin is now installed and ready to enhance your viewing experience!**