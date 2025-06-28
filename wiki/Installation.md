# 📖 Installation Guide

Complete step-by-step installation guide for JellyfinUpscalerPlugin.

---

## 🚀 **Quick Installation**

### 1️⃣ **Add Plugin Repository**
1. Open your **Jellyfin Admin Dashboard**
2. Navigate to **Plugins** → **Repositories**
3. Click **"+"** to add a new repository
4. Enter this URL:
   ```
   https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerPlugin/main/manifest.json
   ```
5. Click **"Save"**

### 2️⃣ **Install Plugin**
1. Go to **Plugins** → **Catalog**
2. Find **"Jellyfin Upscaler"**
3. Click **"Install"**
4. Wait for download to complete

### 3️⃣ **Restart Jellyfin**
1. **Restart your Jellyfin server**
2. Wait for complete startup
3. Plugin is now active!

---

## 🔧 **Manual Installation**

### 📥 **Download Method**
If repository installation fails, use manual installation:

1. **Download Latest Release:**
   - Go to [GitHub Releases](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases)
   - Download `JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip`

2. **Extract to Plugins Folder:**
   ```
   Windows: C:\ProgramData\Jellyfin\Server\plugins\
   Linux: /var/lib/jellyfin/plugins/
   macOS: /var/lib/jellyfin/plugins/
   ```

3. **Restart Jellyfin Server**

---

## 🖥️ **Platform-Specific Installation**

### 🪟 **Windows**
```powershell
# Using PowerShell (Run as Administrator)
$pluginPath = "C:\ProgramData\Jellyfin\Server\plugins\"
$downloadUrl = "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v1.3.5/JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip"

# Create plugins directory if it doesn't exist
if (!(Test-Path $pluginPath)) {
    New-Item -ItemType Directory -Path $pluginPath -Force
}

# Download and extract
Invoke-WebRequest -Uri $downloadUrl -OutFile "$env:TEMP\upscaler.zip"
Expand-Archive -Path "$env:TEMP\upscaler.zip" -DestinationPath $pluginPath -Force

# Restart Jellyfin service
Restart-Service -Name "Jellyfin"
```

### 🐧 **Linux (Ubuntu/Debian)**
```bash
#!/bin/bash
# Installation script for Linux

# Set variables
PLUGIN_DIR="/var/lib/jellyfin/plugins"
DOWNLOAD_URL="https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v1.3.5/JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip"

# Create plugin directory
sudo mkdir -p "$PLUGIN_DIR"

# Download and extract
cd /tmp
wget "$DOWNLOAD_URL" -O upscaler.zip
sudo unzip -o upscaler.zip -d "$PLUGIN_DIR"

# Set permissions
sudo chown -R jellyfin:jellyfin "$PLUGIN_DIR"
sudo chmod -R 755 "$PLUGIN_DIR"

# Restart Jellyfin
sudo systemctl restart jellyfin
```

### 🍎 **macOS**
```bash
#!/bin/bash
# macOS Installation

PLUGIN_DIR="/var/lib/jellyfin/plugins"
DOWNLOAD_URL="https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v1.3.5/JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip"

# Create directory and download
sudo mkdir -p "$PLUGIN_DIR"
curl -L "$DOWNLOAD_URL" -o /tmp/upscaler.zip
sudo unzip -o /tmp/upscaler.zip -d "$PLUGIN_DIR"

# Restart Jellyfin
brew services restart jellyfin
```

---

## 🐳 **Docker Installation**

### 📦 **Docker Compose**
Add volume mount to your `docker-compose.yml`:

```yaml
version: '3.8'
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    volumes:
      - ./config:/config
      - ./cache:/cache
      - ./media:/media
      - ./plugins:/config/plugins  # Plugin directory
    environment:
      - JELLYFIN_PublishedServerUrl=http://localhost:8096
    ports:
      - "8096:8096"
    restart: unless-stopped
```

Then install plugin:
```bash
# Download plugin to plugins directory
wget https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v1.3.5/JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip
unzip JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip -d ./plugins/

# Restart container
docker-compose restart jellyfin
```

---

## ✅ **Verification**

### 🔍 **Check Installation**
1. **Open Jellyfin Admin Dashboard**
2. Go to **Plugins** → **My Plugins**
3. **"Jellyfin Upscaler"** should be listed
4. Status should show **"Active"**

### ⚙️ **Access Settings**
1. Click on **"Jellyfin Upscaler"** in plugin list
2. Configuration page should open
3. Test basic settings

### 🎬 **Test Functionality**
1. Play any video in Jellyfin
2. Look for **upscaler button** in player controls
3. Toggle enhancement on/off
4. Verify quality improvement

---

## 🔧 **Configuration**

### 🎛️ **First-Time Setup**
After installation, configure these basic settings:

1. **Hardware Detection:**
   - Go to Plugin Settings
   - Click **"Auto-Detect Hardware"**
   - Verify GPU is recognized

2. **Quality Preset:**
   - Choose from: Gaming, Apple TV, Mobile, Server
   - Start with **"Auto"** for best results

3. **Enhancement Level:**
   - Begin with **"Medium"** setting
   - Adjust based on performance

### 📊 **Performance Tuning**
- **High-End Systems:** Use "Ultra" quality
- **Mid-Range Systems:** Use "High" quality  
- **Low-End Systems:** Enable "Light Mode"
- **Mobile Devices:** Use "Mobile" preset

---

## 🐛 **Troubleshooting Installation**

### ❌ **Common Issues**

#### Plugin Not Appearing
```bash
# Check plugin directory permissions
ls -la /var/lib/jellyfin/plugins/
sudo chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/
```

#### Repository URL Error
- Verify URL is exactly: `https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerPlugin/main/manifest.json`
- Check internet connection
- Try manual installation instead

#### Permission Denied
```bash
# Linux/macOS: Fix permissions
sudo chown -R jellyfin:jellyfin /var/lib/jellyfin/
sudo chmod -R 755 /var/lib/jellyfin/plugins/
```

#### Jellyfin Won't Start
- Check Jellyfin logs: `/var/log/jellyfin/`
- Remove plugin temporarily
- Contact support if issue persists

---

## 🔄 **Upgrading**

### 🆙 **Automatic Updates**
- Plugin auto-updates through Jellyfin
- Check **Plugins** → **Updates** regularly
- Restart required after updates

### 🔄 **Manual Update**
1. Download newest version
2. Stop Jellyfin service
3. Replace plugin files
4. Start Jellyfin service
5. Settings are preserved

---

## 📚 **Next Steps**

After successful installation:

- 📖 **[Configuration Guide](Configuration)** - Optimize settings
- 🎯 **[Hardware Compatibility](Hardware-Compatibility)** - Check your hardware
- 🎮 **[Usage Guide](Usage)** - Learn to use features
- 🔍 **[Troubleshooting](Troubleshooting)** - Solve common problems

---

## 💬 **Support**

### 🆘 **Need Help?**
- 🐛 **[GitHub Issues](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/issues)** - Bug reports
- 💬 **[Discussions](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/discussions)** - Questions
- 📧 **Email:** [support@jellyfinupscaler.com](mailto:support@jellyfinupscaler.com)

### 📋 **Before Asking for Help:**
1. Check [Troubleshooting](Troubleshooting) guide
2. Verify system requirements
3. Check Jellyfin logs
4. Include system information in report

---

*Installation complete! Enjoy enhanced video quality! 🎉*