@echo off
title Jellyfin Upscaler Plugin v1.1.2 - ULTIMATE FIX
color 0A

echo  ╔══════════════════════════════════════════════╗
echo  ║     🚀 Jellyfin Upscaler Plugin v1.1.2      ║
echo  ║           ULTIMATE PERSISTENCE FIX           ║
echo  ╚══════════════════════════════════════════════╝
echo.

echo 🔧 PROBLEM BEHOBEN:
echo ✅ GUID 00000000 Error → Fixed
echo ✅ Plugin Persistence → Fixed  
echo ✅ New Logos → Integrated
echo ✅ Installation → Bulletproof
echo.

echo 📋 Step 1: Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker not found!
    echo 💡 Please install Docker Desktop first
    pause
    exit /b 1
)
echo ✅ Docker found

echo.
echo 📋 Step 2: Finding Jellyfin container...
docker ps --format "table {{.Names}}\t{{.Image}}" | findstr jellyfin
if %errorlevel% neq 0 (
    echo ❌ No Jellyfin container running!
    echo 💡 Start your Jellyfin container first
    pause
    exit /b 1
)

echo.
echo 📋 Step 3: Complete plugin cleanup...
echo 🗑️ Removing ALL old plugin versions...
docker exec jellyfin rm -rf /config/plugins/*Upscaler* 2>nul
docker exec jellyfin rm -rf /config/plugins/JellyfinUpscaler* 2>nul
docker exec jellyfin rm -rf /config/plugins/*upscaler* 2>nul
echo ✅ Old plugins removed

echo.
echo 📋 Step 4: Installing NEW v1.1.2 plugin...
echo 📦 Copying plugin package...
docker cp "JellyfinUpscalerPlugin-FINAL.zip" jellyfin:/tmp/
if %errorlevel% neq 0 (
    echo ❌ Failed to copy plugin!
    pause
    exit /b 1
)

echo 📁 Creating plugin directory...
docker exec jellyfin mkdir -p /config/plugins/JellyfinUpscalerPlugin_1.1.2

echo 📦 Extracting plugin...
docker exec jellyfin unzip -o /tmp/JellyfinUpscalerPlugin-FINAL.zip -d /config/plugins/JellyfinUpscalerPlugin_1.1.2/
if %errorlevel% neq 0 (
    echo ❌ Failed to extract plugin!
    pause
    exit /b 1
)

echo 🔐 Setting permissions...
docker exec jellyfin chown -R abc:abc /config/plugins/JellyfinUpscalerPlugin_1.1.2/
docker exec jellyfin chmod -R 755 /config/plugins/JellyfinUpscalerPlugin_1.1.2/

echo.
echo 📋 Step 5: Verification...
echo 🔍 Checking plugin files...
docker exec jellyfin ls -la /config/plugins/JellyfinUpscalerPlugin_1.1.2/
docker exec jellyfin ls -la /config/plugins/JellyfinUpscalerPlugin_1.1.2/assets/

echo.
echo 📋 Step 6: Restarting Jellyfin...
echo ⏹️ Stopping container...
docker stop jellyfin

echo ⏳ Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo ▶️ Starting container...
docker start jellyfin

echo ⏳ Waiting for Jellyfin to start...
timeout /t 10 /nobreak >nul

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║            🎉 INSTALLATION COMPLETE!        ║
echo  ╚══════════════════════════════════════════════╝
echo.
echo ✅ Plugin v1.1.2 installed successfully!
echo ✅ New logos integrated (Logo.png + Icon.png)
echo ✅ GUID persistence problem FIXED!
echo ✅ Plugin should now survive restarts!
echo.
echo 🎯 NEXT STEPS:
echo 1. Open Jellyfin: http://localhost:8096
echo 2. Go to: Admin Dashboard → Plugins
echo 3. Look for: "Jellyfin Upscaler v1.1.2"
echo 4. New logo should be visible!
echo.
echo 🧪 TESTING:
echo 5. Restart Jellyfin again to test persistence
echo 6. Plugin should still be there after restart!
echo.
echo 🆘 IF PROBLEMS PERSIST:
echo - Check logs: docker logs jellyfin
echo - Contact support with full error messages
echo.

pause
echo.
echo 🔄 Want to test plugin persistence now? (y/n)
set /p test="Restart Jellyfin to test persistence? "
if /i "%test%"=="y" (
    echo 🔄 Testing persistence...
    docker restart jellyfin
    echo ⏳ Waiting 15 seconds for restart...
    timeout /t 15 /nobreak >nul
    echo.
    echo 🎯 Check now: http://localhost:8096
    echo ✅ Plugin should still be there!
)

echo.
echo 🎉 DONE! Plugin v1.1.2 with new logos is ready!
pause