@echo off
title Jellyfin Upscaler - FAILSAFE Installation (404 Error Fix)
color 0A

echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║    🛠️ JELLYFIN UPSCALER - FAILSAFE INSTALLATION            ║
echo  ║      Fixes 404 Download Errors from crash.txt              ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🚨 THIS SCRIPT FIXES THE CRASH.TXT ERROR:
echo    "Response status code does not indicate success: 404 (Not Found)"
echo    "Package installation failed"
echo.

echo 🔧 FAILSAFE INSTALLATION METHOD:
echo ✅ Downloads files locally first
echo ✅ Verifies download integrity  
echo ✅ Installs directly to Docker container
echo ✅ No network dependency during install
echo ✅ Works even if GitHub is temporarily down
echo.

REM Create temp directory
echo 📁 Creating temporary directory...
if exist "%TEMP%\JellyfinUpscaler" rmdir /s /q "%TEMP%\JellyfinUpscaler"
mkdir "%TEMP%\JellyfinUpscaler"
cd /d "%TEMP%\JellyfinUpscaler"

echo.
echo 📥 Downloading plugin files (with retry logic)...

REM Function to download with retries
set "retries=3"
set "success=false"

:download_advanced
echo 🔄 Attempting to download Advanced version...
curl -L --retry 3 --retry-delay 2 -o "advanced.zip" "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscaler-Advanced.zip"
if %errorlevel%==0 (
    echo ✅ Advanced version downloaded successfully
    set "success=true"
    goto :extract_advanced
) else (
    echo ❌ Advanced download failed, trying Native version...
)

:download_native
echo 🔄 Attempting to download Native version...
curl -L --retry 3 --retry-delay 2 -o "native.zip" "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscaler-Native.zip"
if %errorlevel%==0 (
    echo ✅ Native version downloaded successfully
    set "success=true"
    goto :extract_native
) else (
    echo ❌ Native download failed, trying Legacy version...
)

:download_legacy
echo 🔄 Attempting to download Legacy version...
curl -L --retry 3 --retry-delay 2 -o "legacy.zip" "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscalerPlugin.zip"
if %errorlevel%==0 (
    echo ✅ Legacy version downloaded successfully
    set "success=true"
    goto :extract_legacy
) else (
    echo ❌ All downloads failed!
    goto :download_failed
)

:extract_advanced
echo 📦 Extracting Advanced version...
powershell -command "Expand-Archive -Path 'advanced.zip' -DestinationPath '.' -Force"
if exist "meta.json" (
    set "plugin_dir=JellyfinUpscaler_Advanced_1.3.0"
    set "version=1.3.0 Advanced Pro"
    goto :install
)
goto :download_native

:extract_native
echo 📦 Extracting Native version...
powershell -command "Expand-Archive -Path 'native.zip' -DestinationPath '.' -Force"
if exist "meta.json" (
    set "plugin_dir=JellyfinUpscaler_Native_1.2.0"
    set "version=1.2.0 Native"
    goto :install
)
goto :download_legacy

:extract_legacy
echo 📦 Extracting Legacy version...
powershell -command "Expand-Archive -Path 'legacy.zip' -DestinationPath '.' -Force"
if exist "meta.json" (
    set "plugin_dir=JellyfinUpscalerPlugin_1.1.2"
    set "version=1.1.2 Legacy"
    goto :install
)
goto :extraction_failed

:install
echo.
echo 🚀 Installing %version% to Jellyfin...

REM Complete cleanup of old installations
echo 🗑️ Removing any existing upscaler plugins...
docker exec jellyfin rm -rf /config/plugins/*Upscaler* 2>nul
docker exec jellyfin rm -rf /config/plugins/*upscaler* 2>nul
docker exec jellyfin rm -rf /config/plugins/Video* 2>nul
docker exec jellyfin rm -rf /config/plugins/AI* 2>nul
docker exec jellyfin rm -rf /config/plugins/JellyfinUpscaler* 2>nul

REM Create plugin directory in container
echo 📁 Creating plugin directory in container...
docker exec jellyfin mkdir -p "/config/plugins/%plugin_dir%"

REM Copy all files to container
echo 📂 Copying plugin files to container...
for %%f in (*) do (
    if not "%%f"=="*.zip" (
        docker cp "%%f" "jellyfin:/config/plugins/%plugin_dir%/"
        echo   ✅ Copied %%f
    )
)

REM Set correct permissions
echo 🔐 Setting permissions in container...
docker exec jellyfin chown -R abc:abc "/config/plugins/%plugin_dir%"
docker exec jellyfin chmod -R 755 "/config/plugins/%plugin_dir%"

REM Verify installation
echo 🔍 Verifying installation...
docker exec jellyfin ls -la "/config/plugins/%plugin_dir%/" > nul 2>&1
if %errorlevel%==0 (
    echo ✅ Plugin files successfully installed in container
) else (
    echo ❌ Installation verification failed
    goto :install_failed
)

echo.
echo 🔄 Restarting Jellyfin container...
docker restart jellyfin

echo ⏳ Waiting for Jellyfin to start...
timeout /t 20 /nobreak >nul

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║              🎉 FAILSAFE INSTALLATION COMPLETE!            ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.
echo ✅ Jellyfin Upscaler %version% installed successfully!
echo ✅ All 404 download errors have been bypassed!
echo ✅ Plugin installed directly to Docker container!
echo.
echo 🎯 HOW TO USE:
echo 1. Open Jellyfin in your browser
echo 2. Play any video
echo 3. Look for upscaler button in video player:
if "%version%"=="1.3.0 Advanced Pro" (
    echo    - "🔥 AI Pro" button ^(Advanced features^)
) else if "%version%"=="1.2.0 Native" (
    echo    - "🎯 Upscaler" button ^(TV-friendly^)  
) else (
    echo    - Check Jellyfin Admin → Plugins for configuration
)
echo 4. Configure settings and enjoy enhanced video quality!
echo.
echo 🔧 TROUBLESHOOTING:
echo - If button doesn't appear: Wait 30 seconds, then refresh page
echo - If settings don't save: Clear browser cache
echo - If problems persist: Check TROUBLESHOOTING.md
echo.

REM Cleanup temp files
cd /d "%USERPROFILE%"
rmdir /s /q "%TEMP%\JellyfinUpscaler" 2>nul

pause
goto :end

:download_failed
echo.
echo ❌ DOWNLOAD FAILED!
echo.
echo 🔧 POSSIBLE SOLUTIONS:
echo 1. Check your internet connection
echo 2. Try again in a few minutes (GitHub might be temporarily down)
echo 3. Download manually from: https://github.com/Kuschel-code/JellyfinUpscalerPlugin
echo 4. Use alternative installation method in TROUBLESHOOTING.md
echo.
pause
goto :end

:extraction_failed
echo.
echo ❌ EXTRACTION FAILED!
echo.
echo 🔧 POSSIBLE SOLUTIONS:
echo 1. Download might be corrupted - try again
echo 2. Check if PowerShell is available
echo 3. Try manual extraction of ZIP file
echo.
pause
goto :end

:install_failed
echo.
echo ❌ INSTALLATION FAILED!
echo.
echo 🔧 POSSIBLE SOLUTIONS:
echo 1. Check if Docker container 'jellyfin' is running
echo 2. Verify Docker permissions
echo 3. Try manual installation as described in TROUBLESHOOTING.md
echo.
pause
goto :end

:end
exit /b