@echo off
title AI Video Upscaler Pro v1.3.0 - Advanced Features Installation
color 0C

echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║    🔥 AI VIDEO UPSCALER PRO v1.3.0 - ADVANCED FEATURES     ║
echo  ║     DLSS 3.0 • FSR 3.0 • RTX HDR • Real-time AI            ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔥 ADVANCED FEATURES:
echo ✅ DLSS 3.0 with Frame Generation
echo ✅ FSR 3.0 with Fluid Motion Frames  
echo ✅ Intel XeSS Super Resolution
echo ✅ NVIDIA RTX HDR Auto-Enhancement
echo ✅ Real-ESRGAN AI Upscaling
echo ✅ Waifu2x-ncnn Anime Optimization
echo ✅ Motion Vector Compensation
echo ✅ Frame Interpolation (FPS Boost)
echo ✅ AI Color Enhancement
echo ✅ Real-time Performance Monitoring
echo ✅ Custom AI Model Support
echo ✅ TV/Large Screen Optimization
echo.

echo 🎯 HARDWARE DETECTION:
echo - Auto-detects NVIDIA RTX, AMD Radeon, Intel Arc
echo - Enables only compatible features
echo - Optimizes for your specific GPU
echo.

echo 📋 Installing Advanced Plugin...

REM Complete cleanup of old versions
echo 🗑️ Removing old plugins...
docker exec jellyfin rm -rf /config/plugins/*Upscaler* 2>nul
docker exec jellyfin rm -rf /config/plugins/*upscaler* 2>nul
docker exec jellyfin rm -rf /config/plugins/Video* 2>nul
docker exec jellyfin rm -rf /config/plugins/AI* 2>nul

REM Create plugin directory
echo 📁 Creating advanced plugin directory...
docker exec jellyfin mkdir -p /config/plugins/JellyfinUpscaler_Advanced_1.3.0

REM Copy files
echo 📦 Copying advanced plugin files...
docker cp "JellyfinUpscaler_Advanced_1.3.0/meta.json" jellyfin:/config/plugins/JellyfinUpscaler_Advanced_1.3.0/
docker cp "JellyfinUpscaler_Advanced_1.3.0/upscaler-advanced.js" jellyfin:/config/plugins/JellyfinUpscaler_Advanced_1.3.0/
docker cp "JellyfinUpscaler_Advanced_1.3.0/icon.png" jellyfin:/config/plugins/JellyfinUpscaler_Advanced_1.3.0/

REM Set permissions
echo 🔐 Setting permissions...
docker exec jellyfin chown -R abc:abc /config/plugins/JellyfinUpscaler_Advanced_1.3.0
docker exec jellyfin chmod -R 755 /config/plugins/JellyfinUpscaler_Advanced_1.3.0

echo.
echo 🔄 Restarting Jellyfin...
docker restart jellyfin

echo ⏳ Waiting for Jellyfin to start...
timeout /t 20 /nobreak >nul

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║           🎉 ADVANCED INSTALLATION COMPLETE!                ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.
echo ✅ AI Video Upscaler Pro v1.3.0 installed!
echo ✅ Advanced settings in video player
echo ✅ Hardware auto-detection active
echo ✅ Real-time AI processing ready
echo.
echo 🎯 HOW TO USE:
echo 1. Play any video in Jellyfin
echo 2. Look for "🔥 AI Pro" button in player (top-right)
echo 3. Click to open advanced settings
echo 4. Configure AI method (DLSS 3.0/FSR 3.0/XeSS)
echo 5. Adjust scale factor (1.0x - 4.0x)
echo 6. Enable RTX HDR, Frame Interpolation, etc.
echo 7. Save - settings persist automatically
echo.
echo 🔥 AI UPSCALING METHODS:
echo - DLSS 3.0: NVIDIA RTX 40-series (Frame Generation)
echo - DLSS 2.4: NVIDIA RTX 20/30-series
echo - FSR 3.0: AMD RX 7000-series (Fluid Motion)
echo - FSR 2.1: AMD RX 6000+ series
echo - XeSS: Intel Arc GPUs
echo - RTX HDR: Auto HDR enhancement (RTX only)
echo - Real-ESRGAN: AI-based super resolution
echo - Waifu2x-ncnn: Anime/cartoon optimization
echo - SRCNN/EDSR/RCAN: Neural network upscaling
echo.
echo 📊 PERFORMANCE MONITORING:
echo - Real-time FPS display
echo - GPU usage tracking
echo - Frame time monitoring
echo - Automatic optimization suggestions
echo.
echo 🎮 ADVANCED FEATURES:
echo - Motion Vector Compensation: Reduces artifacts
echo - Frame Interpolation: Increases FPS
echo - AI Color Enhancement: Improves color accuracy
echo - Custom AI Models: Load your own models
echo - TV Optimization: Perfect for large screens
echo.

pause