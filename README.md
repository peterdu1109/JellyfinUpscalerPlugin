# 🚀 Jellyfin Upscaler Plugin v1.2.0 NATIVE

## 🎉 **ALL CRASH.TXT PROBLEMS FIXED! TV-FRIENDLY NATIVE VERSION!**

---

**Jellyfin Upscaler Plugin**

**Description**

The Jellyfin Upscaler Plugin enhances video quality in real-time by using AI upscaling and shader-based optimizations. 

### 🔥 **v1.2.0 NATIVE - ALL PROBLEMS FROM CRASH.TXT SOLVED:**
- ✅ **NEW GUID: f87f700e-679d-43e6-9c7c-b3a410dc3f21** - No more 00000000 errors!
- ✅ **MINI LOGO: 32x32 (1.5KB)** - No more "Content-Length mismatch" errors!
- ✅ **TV-FRIENDLY SETTINGS** - Direct in video player, no extra pages!
- ✅ **LOCAL INSTALLATION** - No more 404 download errors!
- ✅ **DLSS/FSR SUPPORT** - Hardware-accelerated upscaling!
- ✅ **PERSISTENT SETTINGS** - Survives all restarts via localStorage!

It offers predefined profiles and custom settings to ensure optimal performance and image quality on supported devices.

---

**Features**

1. **AI Upscaling:**
   - Utilizes models like ESRGAN and Waifu2x to improve video quality.
   
2. **Automatic Library Recognition:**
   - Adjusts settings based on library types such as Anime, Movies, or TV Shows.

3. **Custom Profiles:**
   - Create your own profiles with settings for FPS, resolution, sharpness, saturation, contrast, and noise reduction.

4. **Benchmark Test:**
   - Automatically or manually checks if your device supports AI upscaling.

5. **Traditional Shaders:**
   - Uses shaders like Bicubic, Bilinear, or Lanczos for devices with limited performance.

---

## 🚀 **ULTRA-EASY INSTALLATION (v1.2.0 NATIVE)**

### **🎯 One-Click Native Installation (TV-Friendly)**
1. **Download:** [INSTALL-NATIVE.cmd](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/INSTALL-NATIVE.cmd)
2. **Double-click** `INSTALL-NATIVE.cmd`  
3. **Done!** TV-friendly plugin with in-player settings installed!

### **📦 Manual Download**
1. **Native Version:** [JellyfinUpscaler-Native.zip](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscaler-Native.zip)
2. **Legacy Version:** [JellyfinUpscalerPlugin.zip](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscalerPlugin.zip)

### **🎮 HOW TO USE (TV-FRIENDLY):**
1. **Play any video** in Jellyfin
2. **Look for "🎯 Upscaler" button** in video player (top-right)
3. **Click** → Settings dialog opens
4. **Configure:** DLSS/FSR/CAS/ESRGAN/Waifu2x
5. **Save** → Settings persist automatically!
   - Alternatively, you can clone it directly from GitHub:

   ```bash
   git clone https://github.com/Kuschel-code/JellyfinUpscalerPlugin.git
   ```

2. **Plugin Directory:**
   - The plugin should be placed in Jellyfin's plugin directory:

   ```
   # Windows
   C:\ProgramData\Jellyfin\Server\plugins\JellyfinUpscalerPlugin_1.0.0\

   # Linux
   /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/

   # macOS  
   /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/

   # Docker
   /config/plugins/JellyfinUpscalerPlugin_1.0.0/
   ```

3. **Set Permissions (Linux/macOS):**

   ```bash
   sudo chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/
   sudo chmod -R 755 /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.0.0/
   ```

4. **Restart:**
   - Restart the Jellyfin server to activate the plugin.

   ```bash
   # Windows (as Administrator)
   net stop JellyfinService && net start JellyfinService

   # Linux systemd
   sudo systemctl restart jellyfin

   # Docker
   docker restart jellyfin
   ```

📖 **For detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md)**  
⚡ **For performance optimization, see [PERFORMANCE.md](PERFORMANCE.md)**

---

**Usage**

1. Go to the settings in Jellyfin and open the Upscaler Plugin section.
2. Select one of the following profiles:
   - **Default:** Automatic detection based on library type.
   - **Anime:** Waifu2x for animations.
   - **Movies:** ESRGAN for high-quality movie enhancement.
   - **TV Shows:** Traditional shaders for TV series.
   - **Custom:** Custom settings.
   
3. **Benchmark Test:**
   - Run an automatic or manual test to check your device's AI upscaling capabilities.

4. **Custom Profile:**
   - Fine-tune your settings:
     - **FPS:** Unlimited, 30 FPS, 60 FPS, 120 FPS.
     - **Resolution:** 480p to 8K.
     - **Image Quality:** Sharpness, saturation, contrast, noise reduction.

---

**Settings**

- **Profile Selection:**
  - Default, Anime, Movies, TV Shows, Custom.

- **Custom Profile Settings:**

  1. **FPS Settings:**
     - Max FPS: Unlimited, 30, 60, 120.
   
  2. **Resolution Settings:**
     - Min. Resolution: 480p to 8K.
     - Max. Resolution: 480p to 8K.
     - Shaders for lower/higher resolutions: Bilinear, Bicubic, Lanczos.
   
  3. **Image Quality:**
     - Sharpness (0–5).
     - Saturation (-1 to 3).
     - Contrast (0.5–2.0).
     - Noise Reduction (0–3).

---

**License**

This project is licensed under the MIT License. See LICENSE for more details.

---

**Contact**

- Developed by: Kuschel-Code  

---

| **Profile**     | **Recommended GPU**                                          | **Recommended CPU**                                          | **Notes**                                                           |
|-----------------|--------------------------------------------------------------|--------------------------------------------------------------|---------------------------------------------------------------------|
| **Default**     | NVIDIA GTX 1650 / RTX 2060 or better (or AMD Radeon RX 580 / RX 5700) | Intel i5 (6th or 7th Gen) or AMD Ryzen 5                    | Automatic detection based on library type, moderate requirements.  |
| **Anime**       | NVIDIA RTX 3070 or better (Waifu2x requires more GPU power)  | Intel i7 or AMD Ryzen 7 or better                            | Waifu2x algorithm needs more power, especially for 1080p+ anime.    |
| **Movies**      | NVIDIA RTX 3070 / RTX 4080 or AMD Radeon RX 6800 XT or better | Intel i7/i9 or AMD Ryzen 7/9                                 | ESRGAN for high-quality movie enhancement needs more GPU power, especially for 4K/8K. |
| **TV Shows**    | NVIDIA GTX 1650 or better (no heavy GPU required)            | Intel i5 or AMD Ryzen 5                                      | Traditional shaders are less GPU-intensive, fine for TV series.     |
| **Custom**      | Depends on settings, especially high resolution and FPS      | Depends on settings. A balanced GPU and CPU are recommended. | Fine-tuning requires more resources depending on selected settings. |

### Additional Notes:
- **FPS**: Higher frame rates (e.g., 120 FPS) demand significantly more GPU and CPU power, especially at 4K or higher resolution.
- **Resolution**: For 4K or higher resolutions, a powerful GPU (RTX 3070 or better) is recommended to avoid lag or stuttering.
- **Image Quality**: Higher image quality settings (sharpness, saturation, contrast) can require more GPU power, especially at higher resolutions.

The choice of GPU and CPU depends largely on the selected upscaling profile and content requirements. It's important to balance both GPU and CPU performance to ensure smooth playback and upscaling, especially for higher resolutions and more complex algorithms like Waifu2x and ESRGAN.


