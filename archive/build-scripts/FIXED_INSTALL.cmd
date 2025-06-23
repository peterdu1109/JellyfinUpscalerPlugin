@echo off
echo 🔧 Jellyfin Upscaler Plugin v1.1.1 - PERSISTENCE FIX
echo =====================================================

echo 📋 PROBLEM BEHOBEN:
echo ✅ GUID-Mismatch Error gefixt
echo ✅ Neue Logos integriert
echo ✅ Plugin-Persistenz verbessert
echo ✅ Korrekte Plugin-Struktur

echo.
echo 🚀 Installiere Plugin in Docker-Container...

REM Container finden
docker ps | findstr jellyfin
if %errorlevel% neq 0 (
    echo ❌ Jellyfin Container nicht gefunden!
    echo 💡 Starte Jellyfin Container zuerst
    pause
    exit /b 1
)

echo.
echo 📦 Kopiere Plugin-Paket...
docker cp "dist\JellyfinUpscalerPlugin.zip" jellyfin:/tmp/

echo.
echo 🗑️ Entferne alte Plugin-Versionen...
docker exec jellyfin rm -rf /config/plugins/*Upscaler*
docker exec jellyfin rm -rf /config/plugins/JellyfinUpscaler*

echo.
echo 📁 Erstelle Plugin-Verzeichnis...
docker exec jellyfin mkdir -p /config/plugins/JellyfinUpscalerPlugin_1.1.1

echo.
echo 📦 Entpacke Plugin...
docker exec jellyfin unzip -o /tmp/JellyfinUpscalerPlugin.zip -d /config/plugins/JellyfinUpscalerPlugin_1.1.1/

echo.
echo 🔐 Setze Berechtigungen...
docker exec jellyfin chown -R abc:abc /config/plugins/JellyfinUpscalerPlugin_1.1.1/
docker exec jellyfin chmod -R 755 /config/plugins/JellyfinUpscalerPlugin_1.1.1/

echo.
echo 🧪 Verifiziere Installation...
docker exec jellyfin ls -la /config/plugins/JellyfinUpscalerPlugin_1.1.1/

echo.
echo 🔄 Starte Jellyfin neu...
docker restart jellyfin

echo.
echo ✅ INSTALLATION ABGESCHLOSSEN!
echo ================================
echo 🎯 Das Plugin sollte jetzt nach dem Neustart bestehen bleiben!
echo 📱 Öffne: http://localhost:8096
echo 🔧 Admin → Plugins → "Jellyfin Upscaler" sollte sichtbar sein

echo.
echo 🆘 Falls das Plugin immer noch verschwindet:
echo 1. Prüfe Jellyfin-Logs: docker logs jellyfin
echo 2. Prüfe Plugin-Verzeichnis: docker exec jellyfin ls -la /config/plugins/
echo 3. Kontaktiere Support mit Logs

pause