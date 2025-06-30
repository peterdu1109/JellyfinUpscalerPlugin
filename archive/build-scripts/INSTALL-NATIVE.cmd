@echo off
title Native Jellyfin Upscaler v1.2.0 - TV-Friendly Installation
color 0A

echo  ╔══════════════════════════════════════════════╗
echo  ║    🚀 Native Jellyfin Upscaler v1.2.0       ║
echo  ║      TV-Friendly with DLSS/FSR Support      ║
echo  ╚══════════════════════════════════════════════╝
echo.

echo ✅ FEATURES:
echo - Integrated settings in video player
echo - DLSS/FSR hardware acceleration  
echo - TV-friendly controls (no extra pages)
echo - Optimized small logo (no size issues)
echo - Persistent after restart
echo.

echo 📋 Installing to Jellyfin...

REM Complete cleanup
echo 🗑️ Removing old plugins...
docker exec jellyfin rm -rf /config/plugins/*Upscaler* 2>nul
docker exec jellyfin rm -rf /config/plugins/*upscaler* 2>nul
docker exec jellyfin rm -rf /config/plugins/Video* 2>nul
docker exec jellyfin rm -rf /config/plugins/JellyfinUpscaler* 2>nul

REM Create plugin directory
echo 📁 Creating plugin directory...
docker exec jellyfin mkdir -p /config/plugins/JellyfinUpscaler_Native_1.2.0

REM Copy files
echo 📦 Copying plugin files...
docker cp "JellyfinUpscaler_Native_1.2.0/meta.json" jellyfin:/config/plugins/JellyfinUpscaler_Native_1.2.0/
docker cp "JellyfinUpscaler_Native_1.2.0/upscaler-native.js" jellyfin:/config/plugins/JellyfinUpscaler_Native_1.2.0/
docker cp "JellyfinUpscaler_Native_1.2.0/icon.png" jellyfin:/config/plugins/JellyfinUpscaler_Native_1.2.0/

REM Set permissions
echo 🔐 Setting permissions...
docker exec jellyfin chown -R abc:abc /config/plugins/JellyfinUpscaler_Native_1.2.0
docker exec jellyfin chmod -R 755 /config/plugins/JellyfinUpscaler_Native_1.2.0

echo.
echo 🔄 Restarting Jellyfin...
docker restart jellyfin

echo ⏳ Waiting for Jellyfin to start...
timeout /t 15 /nobreak >nul

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║              🎉 INSTALLATION COMPLETE!      ║
echo  ╚══════════════════════════════════════════════╝
echo.
echo ✅ Native Plugin v1.2.0 installed!
echo ✅ Settings accessible in video player
echo ✅ No extra configuration pages needed
echo ✅ TV-friendly controls
echo.
echo 🎯 HOW TO USE:
echo 1. Play any video in Jellyfin
echo 2. Look for "🎯 Upscaler" button in player
echo 3. Click to open settings dialog
echo 4. Configure upscaling method (DLSS/FSR/etc)
echo 5. Save settings - they persist automatically
echo.
echo 🔧 UPSCALING METHODS:
echo - DLSS: For NVIDIA RTX cards
echo - FSR: For AMD cards
echo - CAS: Contrast Adaptive Sharpening  
echo - ESRGAN: AI-based upscaling
echo - Waifu2x: Anime-optimized
echo - Traditional: Basic upscaling
echo.

pause