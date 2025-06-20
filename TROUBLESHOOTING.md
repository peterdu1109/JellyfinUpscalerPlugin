# 🛠️ Jellyfin Upscaler Plugin - Troubleshooting Guide

## 🚨 **CRASH.TXT PROBLEMS SOLVED**

### **❌ Common Error from crash.txt:**
```
[ERR] Package installation failed
System.Net.Http.HttpRequestException: Response status code does not indicate success: 404 (Not Found).
URL "POST" "/Packages/Installed/Jellyfin%20Upscaler"
```

### **✅ ROOT CAUSE:**
- **404 Error** occurs when Jellyfin tries to download plugin from GitHub
- **Network issues** or temporary GitHub unavailability
- **Wrong repository URL** in Jellyfin plugin catalog

---

## 🔧 **COMPLETE SOLUTION:**

### **🎯 Method 1: Local Installation (RECOMMENDED)**
**This completely bypasses the 404 download error!**

1. **Download installation script:**
   ```bash
   # For Advanced Pro version:
   https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/INSTALL-ADVANCED.cmd
   
   # For TV-Friendly Native version:
   https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/INSTALL-NATIVE.cmd
   ```

2. **Run the script:**
   - Double-click the downloaded `.cmd` file
   - Plugin installs directly to Docker container
   - **No 404 errors possible!**

### **🔧 Method 2: Manual Docker Installation**
If scripts don't work, install manually:

```bash
# 1. Download ZIP file to your computer
wget https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscaler-Advanced.zip

# 2. Extract to temporary folder
unzip JellyfinUpscaler-Advanced.zip

# 3. Copy to Jellyfin plugins directory
docker cp JellyfinUpscaler_Advanced_1.3.0 jellyfin:/config/plugins/

# 4. Set permissions
docker exec jellyfin chown -R abc:abc /config/plugins/JellyfinUpscaler_Advanced_1.3.0
docker exec jellyfin chmod -R 755 /config/plugins/JellyfinUpscaler_Advanced_1.3.0

# 5. Restart Jellyfin
docker restart jellyfin
```

### **📦 Method 3: Alternative Download Sources**
If GitHub is unavailable, try these mirrors:

1. **Direct ZIP Downloads:**
   - Advanced Pro: [Mirror 1](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/latest/download/JellyfinUpscaler-Advanced.zip)
   - Native: [Mirror 2](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/latest/download/JellyfinUpscaler-Native.zip)

2. **Clone entire repository:**
   ```bash
   git clone https://github.com/Kuschel-code/JellyfinUpscalerPlugin.git
   cd JellyfinUpscalerPlugin/dist
   ```

---

## 🆔 **GUID CONFLICTS RESOLVED**

### **❌ Old Problem:**
```
manifest ID 00000000-0000-0000-0000-000000000000 did not match package info
```

### **✅ New Solution:**
- **v1.3.0 Advanced:** `f87f700e-679d-43e6-9c7c-b3a410dc3f22`
- **v1.2.0 Native:** `f87f700e-679d-43e6-9c7c-b3a410dc3f21`
- **v1.1.2 Legacy:** `f87f700e-679d-43e6-9c7c-b3a410dc3f12`

**All GUIDs are unique and will never conflict!**

---

## 🔍 **INSTALLATION VERIFICATION**

### **✅ How to verify successful installation:**

1. **Check plugin directory:**
   ```bash
   docker exec jellyfin ls -la /config/plugins/
   ```
   Should show: `JellyfinUpscaler_Advanced_1.3.0` or `JellyfinUpscaler_Native_1.2.0`

2. **Check Jellyfin logs:**
   ```bash
   docker logs jellyfin | grep -i upscaler
   ```
   Should show: `Loaded plugin: "AI Video Upscaler Pro" "1.3.0"`

3. **Test in browser:**
   - Play any video in Jellyfin
   - Look for "🔥 AI Pro" or "🎯 Upscaler" button
   - If button appears → ✅ **Installation successful!**

---

## 🚨 **TROUBLESHOOTING SPECIFIC ERRORS**

### **Error: "Plugin not found after restart"**
**Solution:**
```bash
# Ensure correct permissions:
docker exec jellyfin chown -R abc:abc /config/plugins/
docker exec jellyfin chmod -R 755 /config/plugins/

# Force restart:
docker stop jellyfin && docker start jellyfin
```

### **Error: "Settings not saving"**
**Solution:**
- Clear browser cache
- Disable ad blockers for Jellyfin domain
- Try different browser (Chrome/Firefox/Edge)

### **Error: "Button not appearing in video player"**
**Solution:**
1. **Wait 30 seconds** after video starts
2. **Refresh page** (F5)
3. **Check browser console** for JavaScript errors
4. **Try different video** format

### **Error: "DLSS/FSR not working"**
**Solution:**
- Hardware auto-detection only shows compatible methods
- If you have RTX GPU but don't see DLSS → driver update needed
- AMD GPU but no FSR → ensure RX 6000+ series
- Intel GPU but no XeSS → ensure Arc series

---

## 📞 **GETTING HELP**

### **🆘 If problems persist:**

1. **Enable debug logging:**
   ```bash
   # Add to Jellyfin Docker run command:
   -e JELLYFIN_LOG_LEVEL=Debug
   ```

2. **Collect information:**
   - Jellyfin version: Admin → Dashboard → About
   - Browser: Check Developer Tools → Console
   - GPU: System specifications
   - Plugin version: Check plugin folder name

3. **Report issue:**
   - [GitHub Issues](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/issues)
   - Include: crash logs, Jellyfin version, GPU model
   - Use template: "Bug Report - Installation Error"

---

## 🎯 **PREVENTION TIPS**

### **✅ Avoid future crashes:**

1. **Use local installation** instead of Jellyfin plugin catalog
2. **Keep plugin updated** (check GitHub releases)
3. **Regular backup** of `/config/plugins/` directory
4. **Monitor Jellyfin logs** for early warning signs
5. **Use Docker health checks** for automatic recovery

### **⚙️ Recommended Docker configuration:**
```yaml
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    volumes:
      - ./config:/config
      - ./cache:/cache
    environment:
      - JELLYFIN_LOG_LEVEL=Info
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8096/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped
```

---

## 🎉 **SUCCESS CONFIRMATION**

### **🔥 When everything works correctly:**

- ✅ Plugin loads without errors in Jellyfin logs
- ✅ "🔥 AI Pro" or "🎯 Upscaler" button appears in video player
- ✅ Settings dialog opens and saves properly
- ✅ Video quality improves with upscaling enabled
- ✅ Performance monitor shows real-time stats (Advanced version)
- ✅ Hardware features auto-detected (DLSS/FSR/XeSS)

**You now have the ultimate Jellyfin upscaling experience! 🚀📺**