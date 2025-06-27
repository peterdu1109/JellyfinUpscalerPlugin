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

# Linux (Ubuntu/Debian/CentOS)
curl -O https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerPlugin/main/install-linux.sh
chmod +x install-linux.sh && ./install-linux.sh

# macOS
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/install-macos.sh
chmod +x install-macos.sh && ./install-macos.sh
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

## 🐧 **Linux Installation Guide**

### **🚀 Automated Linux Installation**

Our Linux installer supports major distributions and automatically detects your GPU for optimal configuration.

#### **Supported Distributions:**
- ✅ **Ubuntu 20.04/22.04/24.04 LTS** (Recommended)
- ✅ **Debian 11/12** (Tested)
- ✅ **CentOS 8/9** (Enterprise)
- ✅ **RHEL 8/9** (Enterprise)
- ⚠️ **Fedora 38/39/40** (Community)
- ⚠️ **Arch Linux** (Community)

#### **One-Command Installation:**
```bash
# Download and run installer
curl -fsSL https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerPlugin/main/install-linux.sh | bash

# Or download first for inspection
curl -O https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerPlugin/main/install-linux.sh
chmod +x install-linux.sh
./install-linux.sh
```

#### **What the installer does:**
1. **🔍 System Detection** - OS, GPU, Jellyfin installation
2. **📦 Dependencies** - Installs required packages
3. **🎮 GPU Drivers** - NVIDIA/AMD/Intel driver setup
4. **⬇️ Plugin Download** - Latest version from GitHub
5. **⚙️ Configuration** - Linux-optimized settings
6. **🔄 Service Restart** - Jellyfin service management
7. **🔥 Firewall Setup** - Configure port access

### **🛠️ Manual Linux Installation**

#### **Ubuntu/Debian Manual Steps:**

##### **Step 1: Install Dependencies**
```bash
# Update package repository
sudo apt update

# Install Jellyfin (if not already installed)
sudo apt install jellyfin -y

# Install build dependencies
sudo apt install curl wget unzip build-essential cmake pkg-config -y

# Install GPU drivers (choose one)
# NVIDIA:
sudo apt install nvidia-driver-535 nvidia-utils-535 -y

# AMD:
sudo apt install rocm-dkms rocm-utils -y
sudo usermod -a -G render $USER

# Intel:
sudo apt install intel-media-va-driver vainfo -y
```

##### **Step 2: Download Plugin**
```bash
# Create temporary directory
mkdir -p /tmp/jellyfin-upscaler
cd /tmp/jellyfin-upscaler

# Download plugin
wget https://github.com/Kuschel-code/JellyfinUpscalerPlugin/archive/main.zip -O plugin.zip

# Extract plugin
unzip plugin.zip
cd JellyfinUpscalerPlugin-main
```

##### **Step 3: Install Plugin**
```bash
# Find Jellyfin plugin directory
PLUGIN_DIRS=(
    "/var/lib/jellyfin/plugins"
    "/usr/share/jellyfin/plugins"
    "/etc/jellyfin/plugins"
    "/opt/jellyfin/plugins"
)

for dir in "${PLUGIN_DIRS[@]}"; do
    if [[ -d "$dir" ]]; then
        JELLYFIN_PLUGIN_DIR="$dir"
        echo "Found Jellyfin plugin directory: $JELLYFIN_PLUGIN_DIR"
        break
    fi
done

# Create plugin directory
PLUGIN_INSTALL_DIR="$JELLYFIN_PLUGIN_DIR/JellyfinUpscalerPlugin_1.3.0"
sudo mkdir -p "$PLUGIN_INSTALL_DIR"

# Copy files
sudo cp -r . "$PLUGIN_INSTALL_DIR/"

# Set permissions
sudo chown -R jellyfin:jellyfin "$PLUGIN_INSTALL_DIR"
sudo chmod -R 755 "$PLUGIN_INSTALL_DIR"
```

##### **Step 4: Configure for Linux**
```bash
# Create Linux-optimized configuration
sudo tee "$PLUGIN_INSTALL_DIR/linux-config.json" > /dev/null <<EOF
{
  "LinuxOptimization": true,
  "GPUAcceleration": "auto",
  "VRAMLimit": 4.0,
  "EnableRealESRGAN": true,
  "SystemPaths": {
    "models": "/var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.3.0/shaders",
    "cache": "/tmp/jellyfin-upscaler-cache",
    "logs": "/var/log/jellyfin"
  }
}
EOF

# Set correct permissions
sudo chown jellyfin:jellyfin "$PLUGIN_INSTALL_DIR/linux-config.json"
sudo chmod 644 "$PLUGIN_INSTALL_DIR/linux-config.json"
```

##### **Step 5: Restart Jellyfin**
```bash
# Check if Jellyfin is running as systemd service
if systemctl is-active --quiet jellyfin; then
    echo "Restarting Jellyfin service..."
    sudo systemctl restart jellyfin
    
    # Wait for service to start
    sleep 5
    
    # Check status
    sudo systemctl status jellyfin
else
    echo "Jellyfin service not found. Manual restart may be required."
fi
```

#### **CentOS/RHEL Manual Steps:**

##### **Step 1: Install Dependencies**
```bash
# Enable EPEL repository
sudo yum install epel-release -y

# Install Jellyfin
sudo yum-config-manager --add-repo https://repo.jellyfin.org/jellyfin-server.repo
sudo yum install jellyfin-server -y

# Install dependencies
sudo yum install curl wget unzip gcc gcc-c++ cmake -y

# Install GPU drivers (NVIDIA example)
sudo yum install nvidia-driver nvidia-utils -y
```

##### **Step 2-5: Same as Ubuntu/Debian**
Follow the same steps 2-5 as above, but use `yum` instead of `apt` where applicable.

### **🐳 Docker Installation**

#### **Docker Compose with GPU Support**

##### **NVIDIA GPU Setup:**
```yaml
# docker-compose.yml
version: '3.8'

services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin-upscaler
    
    # NVIDIA GPU support
    runtime: nvidia
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=compute,video,utility
      - JELLYFIN_UPSCALER_ENABLED=true
      - JELLYFIN_UPSCALER_GPU=nvidia
    
    volumes:
      - ./config:/config
      - ./cache:/cache
      - ./media:/media
      - ./plugins:/config/plugins
    
    ports:
      - "8096:8096"
      - "8920:8920"
      - "7359:7359/udp"
      - "1900:1900/udp"
    
    devices:
      - /dev/nvidia0:/dev/nvidia0
      - /dev/nvidiactl:/dev/nvidiactl
      - /dev/nvidia-modeset:/dev/nvidia-modeset
    
    restart: unless-stopped

# Install plugin
  upscaler-init:
    image: alpine:latest
    volumes:
      - ./plugins:/plugins
    command: >
      sh -c "
        apk add --no-cache curl unzip &&
        cd /plugins &&
        curl -L https://github.com/Kuschel-code/JellyfinUpscalerPlugin/archive/main.zip -o plugin.zip &&
        unzip -o plugin.zip &&
        mv JellyfinUpscalerPlugin-main JellyfinUpscalerPlugin_1.3.0 &&
        rm plugin.zip
      "
```

##### **AMD GPU Setup:**
```yaml
# docker-compose.yml for AMD
version: '3.8'

services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin-upscaler-amd
    
    # AMD GPU support
    devices:
      - /dev/dri:/dev/dri
      - /dev/kfd:/dev/kfd
    
    group_add:
      - video
      - render
    
    environment:
      - JELLYFIN_UPSCALER_ENABLED=true
      - JELLYFIN_UPSCALER_GPU=amd
      - HSA_OVERRIDE_GFX_VERSION=10.3.0
    
    volumes:
      - ./config:/config
      - ./cache:/cache
      - ./media:/media
      - ./plugins:/config/plugins
    
    ports:
      - "8096:8096"
    
    restart: unless-stopped
```

#### **Run Docker Container:**
```bash
# Start services
docker-compose up -d

# Check logs
docker-compose logs -f jellyfin

# Access Jellyfin
# Open browser to http://localhost:8096
```

### **🔧 Linux Troubleshooting**

#### **Common Issues & Solutions:**

##### **Permission Denied Errors:**
```bash
# Fix Jellyfin plugin permissions
sudo chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/
sudo chmod -R 755 /var/lib/jellyfin/plugins/

# Check Jellyfin user
id jellyfin

# Add current user to jellyfin group (if needed)
sudo usermod -a -G jellyfin $USER
```

##### **GPU Not Detected:**
```bash
# Check NVIDIA GPU
nvidia-smi
lspci | grep -i nvidia

# Check AMD GPU
rocm-smi
lspci | grep -i amd

# Check Intel GPU
intel_gpu_top
lspci | grep -i intel
```

##### **Service Issues:**
```bash
# Check Jellyfin service status
sudo systemctl status jellyfin

# View logs
sudo journalctl -u jellyfin -f

# Restart service
sudo systemctl restart jellyfin

# Enable auto-start
sudo systemctl enable jellyfin
```

##### **Firewall Configuration:**
```bash
# UFW (Ubuntu)
sudo ufw allow 8096/tcp
sudo ufw reload

# firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=8096/tcp
sudo firewall-cmd --reload

# iptables (manual)
sudo iptables -A INPUT -p tcp --dport 8096 -j ACCEPT
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