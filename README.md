updated and final version

---

**Jellyfin Upscaler Plugin**

**Description**

The Jellyfin Upscaler Plugin enhances video quality in real-time by using AI upscaling and shader-based optimizations. It offers predefined profiles and custom settings to ensure optimal performance and image quality on supported devices.

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

**Installation**

1. **Download:**
   - Download the plugin as a ZIP file and unzip it into the Jellyfin plugin directory.
   - Alternatively, you can clone it directly from GitHub:

   ```bash
   soon
   ```

2. **Plugin Directory:**
   - The plugin should be placed in Jellyfin's plugin directory:

   ```
   /path/to/jellyfin/plugins/UpscalerPlugin/
   ```

3. **Restart:**
   - Restart the Jellyfin server to activate the plugin.

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
- GitHub: 

---

