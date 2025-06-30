# ===============================================
# 📚 JellyfinUpscalerPlugin Wiki Structure Creator
# ===============================================
# Creates complete wiki structure with all versions
# Author: Kuschel-code
# Date: $(Get-Date -Format "yyyy-MM-dd")

Write-Host "🚀 Creating Complete Wiki Structure for JellyfinUpscalerPlugin..." -ForegroundColor Cyan

# Define base paths
$wikiPath = "c:/Users/Kitty/Desktop/Jellyfin upgrade/wiki"
$githubWikiPath = "c:/Users/Kitty/Desktop/GitHub-Upload/wiki"

# Create wiki directories
Write-Host "📁 Creating wiki directories..." -ForegroundColor Yellow
if (!(Test-Path $wikiPath)) {
    New-Item -ItemType Directory -Path $wikiPath -Force | Out-Null
}
if (!(Test-Path $githubWikiPath)) {
    New-Item -ItemType Directory -Path $githubWikiPath -Force | Out-Null
}

Write-Host "🏠 Creating Wiki Home page..." -ForegroundColor Yellow

# 1. HOME PAGE (Main Wiki Page)
@"
# 🚀 Jellyfin AI Upscaler Plugin

![AI Upscaler Logo](https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerPlugin/main/assets/logo.png)

**Professional AI video upscaling with real-time hardware acceleration for Jellyfin Media Server**

## 🔥 Latest Version: v1.3.5 (June 27, 2025)
### Real AV1 Hardware Acceleration Edition

✨ **NEW FEATURES:**
- 🎬 **Real AV1 Video Processing Engine** (504KB functional DLL) 
- 🔧 **Hardware Detection** for NVIDIA RTX, Intel Arc, AMD RX GPUs
- ⚡ **8 Working REST API Endpoints** with full video processing functionality
- 🎮 **4 Intelligent Presets:** Gaming, Apple TV, Mobile, Server
- 📱 **Touch-Optimized Quick Settings UI** for mobile devices
- 🔋 **Mobile Battery Optimization** with thermal management
- 🤖 **Automatic Content Detection** (anime vs movies)
- 🖥️ **Cross-Platform GPU Support** with fallback mechanisms

---

## 📋 Version History

| Version | Release Date | Key Features | Status |
|---------|-------------|--------------|--------|
| **[v1.3.5](Version-1.3.5)** | 2025-06-27 | **AV1 Hardware Acceleration** | ✅ **CURRENT** |
| [v1.3.4](Version-1.3.4) | 2025-01-24 | Enterprise Edition, Light Mode | ✅ Stable |
| [v1.3.3](Version-1.3.3) | 2024-12-28 | Instant Language Switching | ✅ Stable |
| [v1.3.2](Version-1.3.2) | 2024-12-28 | Advanced UI & Player Integration | ✅ Stable |
| [v1.3.0](Version-1.3.0) | 2025-01-02 | DLSS 3.0, FSR 3.0, XeSS Support | ✅ Stable |
| [v1.2.0](Version-1.2.0) | 2025-01-02 | Native TV-Friendly | ✅ Stable |

---

## 🚀 Quick Start

### Installation (Repository Method)
1. **Add Repository URL** in Jellyfin:
   ```
   https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerPlugin/main/manifest.json
   ```

2. **Install Plugin** from Jellyfin Admin Dashboard → Plugins

3. **Restart Jellyfin** and configure settings

👉 **[Complete Installation Guide](Installation)**

---

## 📚 Documentation

### 📖 User Guides
- 🔧 **[Installation Guide](Installation)** - Complete setup instructions
- ⚙️ **[Configuration Guide](Configuration)** - Advanced settings
- 🎯 **[Usage Guide](Usage)** - How to use all features
- 🌍 **[Multi-Language Support](Multi-Language)** - Language switching

### 💻 Technical Documentation  
- 🖥️ **[Hardware Compatibility](Hardware-Compatibility)** - GPU support matrix
- 🧠 **[AI Models Guide](AI-Models)** - Available upscaling models
- 🔍 **[Troubleshooting](Troubleshooting)** - Common issues & solutions
- ❓ **[FAQ](FAQ)** - Frequently asked questions

---

## 🎮 Hardware Support

### ✅ **Fully Supported (AV1 Native)**
- **NVIDIA RTX 4000 Series** (RTX 4060, 4070, 4080, 4090)
- **Intel Arc A-Series** (A380, A750, A770)
- **AMD RX 7000 Series** (RX 7600, 7800 XT, 7900 XTX)

### ⚡ **Partially Supported (Hardware Fallback)**
- **NVIDIA GTX 1000/2000/3000 Series** → HEVC encoding
- **AMD RX 5000/6000 Series** → H.264 encoding  
- **Intel UHD Graphics** → Software processing

### 📱 **Mobile/Low-Power**
- **Automatic Light Mode** for <8GB RAM systems
- **Battery Optimization** with thermal throttling
- **Touch-Optimized UI** for tablets

---

## 🔗 Repository Information

- **Repository:** https://github.com/Kuschel-code/JellyfinUpscalerPlugin
- **License:** MIT License
- **Author:** Kuschel-code
- **Issues:** [Report bugs here](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/issues)

---

## 🆘 Support

Need help? Check our documentation:

1. 📖 **[Installation Guide](Installation)** - Setup problems
2. 🔧 **[Troubleshooting](Troubleshooting)** - Common issues  
3. ❓ **[FAQ](FAQ)** - Quick answers
4. 🐛 **[GitHub Issues](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/issues)** - Bug reports

---

*Last updated: June 27, 2025 - v1.3.5 AV1 Edition*
"@ | Out-File -FilePath "$wikiPath\Home.md" -Encoding UTF8

Write-Host "✅ Home.md created"