# 🔧 Quick Installation Fix for Jellyfin Upscaler Plugin

## ❌ Problem Identified
The installation was failing with **404 (Not Found)** errors because:
- GitHub Releases didn't exist for the download URLs
- Plugin structure wasn't compatible with Jellyfin's plugin system
- Missing required metadata files

## ✅ Fixes Applied

### 1. **Corrected Plugin Structure**
```
JellyfinUpscalerPlugin/
├── meta.json              # Plugin metadata
├── web/
│   ├── configurationpage.html   # Settings UI
│   └── upscaler.js              # Client-side enhancement
├── assets/                      # Plugin assets
├── shaders/                     # Enhancement shaders
└── README.md
```

### 2. **Fixed Download URLs**
- **Before**: `releases/download/v1.1.0/` (non-existent)
- **After**: `raw/main/dist/` (direct file access)

### 3. **Updated Checksums**
- **New MD5**: `518958731a6d64fcc41865f3da048ca8`
- **Verified**: Package integrity confirmed

## 🚀 Installation Methods

### **Method 1: Direct Installation (Recommended)**

#### **Step 1: Download the Plugin**
```bash
# Download the corrected package
wget https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscalerPlugin.zip

# Or with curl
curl -L -o JellyfinUpscalerPlugin.zip https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscalerPlugin.zip
```

#### **Step 2: Install to Jellyfin**
```bash
# For Docker installations
docker cp JellyfinUpscalerPlugin.zip jellyfin:/config/plugins/
docker exec jellyfin unzip /config/plugins/JellyfinUpscalerPlugin.zip -d /config/plugins/JellyfinUpscalerPlugin_1.1.0/

# For direct installations
sudo unzip JellyfinUpscalerPlugin.zip -d /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.1.0/
sudo chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.1.0/
```

#### **Step 3: Restart Jellyfin**
```bash
# Docker
docker restart jellyfin

# Systemd
sudo systemctl restart jellyfin
```

### **Method 2: Plugin Repository**

#### **Step 1: Add Repository**
1. Go to **Jellyfin Admin Dashboard**
2. Navigate to **Plugins** → **Repositories**
3. Click **Add Repository**
4. **Repository Name**: `Jellyfin Upscaler`
5. **Repository URL**: `https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/manifest.json`

#### **Step 2: Install Plugin**
1. Go to **Plugins** → **Catalog**
2. Find **"Jellyfin Upscaler"**
3. Click **Install**
4. **Restart Jellyfin** when prompted

## 🛠️ Troubleshooting

### **If Installation Still Fails:**

#### **Check 1: Plugin Directory Structure**
```bash
# Verify the plugin is extracted correctly
ls -la /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.1.0/
# Should show: meta.json, web/, assets/, shaders/
```

#### **Check 2: File Permissions**
```bash
# Fix permissions (Linux)
sudo chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/
sudo chmod -R 755 /var/lib/jellyfin/plugins/
```

#### **Check 3: Jellyfin Logs**
```bash
# Check for plugin loading errors
sudo journalctl -u jellyfin -f

# Or check log files directly
tail -f /var/log/jellyfin/jellyfin*.log
```

#### **Check 4: Clean Installation**
```bash
# Remove old plugin versions
sudo rm -rf /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin*
sudo rm -rf /var/lib/jellyfin/plugins/*Upscaler*

# Clear browser cache
# Press F12 → Application → Storage → Clear Storage
```

## ⚙️ Configuration

### **Access Plugin Settings:**
1. **Admin Dashboard** → **Plugins** → **My Plugins**
2. Click **"Jellyfin Upscaler"** → **Settings**
3. Configure enhancement profiles

### **Recommended Settings:**

#### **For Low-End Systems:**
- **Profile**: TV Shows
- **Max FPS**: 30 FPS
- **Min Resolution**: 720p
- **Enhancement**: Traditional Shaders

#### **For High-End Systems:**
- **Profile**: Movies or Anime
- **Max FPS**: 60 FPS
- **Min Resolution**: 480p
- **Enhancement**: AI Upscaling

## 🧪 Testing

### **Verify Installation:**
```javascript
// Open browser console (F12) and run:
console.log(window.JellyfinUpscaler ? '✅ Plugin loaded' : '❌ Plugin not found');
```

### **Check Enhancement:**
1. Play any video
2. Right-click → **Inspect Element**
3. Look for upscaler overlay canvas elements
4. Check console for enhancement logs

## 🔄 Update Process

### **To Update to Future Versions:**
```bash
# Method 1: Replace files
sudo rm -rf /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.1.0/
# Download and install new version

# Method 2: Use Jellyfin UI
# Admin Dashboard → Plugins → Available Updates
```

## 📋 Verification Checklist

- [ ] Plugin appears in **Admin Dashboard** → **Plugins** → **My Plugins**
- [ ] Settings page opens without errors
- [ ] Video playback works normally
- [ ] Browser console shows plugin initialization
- [ ] Enhancement overlays are created on videos
- [ ] No 404 errors in network tab

## 🆘 Support

If you still encounter issues:

1. **GitHub Issues**: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/issues
2. **Include**: 
   - Jellyfin version
   - Operating system
   - Installation method used
   - Complete error logs
   - Browser console output

---

**The plugin should now install correctly without 404 errors!** 🎉