# Korrigierter Upload für v1.3.5 mit allen UI-Features

Write-Host "🔧 AI Upscaler Plugin v1.3.5 - Korrigierter GitHub Upload" -ForegroundColor Cyan

# Check connection
Write-Host "Checking GitHub connection..." -ForegroundColor Yellow
git remote -v

# Pull latest from GitHub
Write-Host "Syncing with GitHub..." -ForegroundColor Yellow
git pull origin main --allow-unrelated-histories

# Add all v1.3.5 files
Write-Host "Adding all v1.3.5 files..." -ForegroundColor Yellow
git add .

# Create comprehensive commit
$commitMessage = @"
🚀 AI Upscaler Plugin v1.3.5 - AV1 Edition - Complete Feature Update

✨ NEUE v1.3.5 FEATURES:
🔥 Full AV1 Codec Support - Hardware-beschleunigt für RTX/Arc/RX
⚙️ Enhanced Quick Settings UI - Player-Button mit Touch-Optimierung
📱 Mobile Support Enhancement - Touch-freundliche UI-Elemente
🎬 HDR10 & Dolby Vision Support - Hardware-Tone-Mapping
📺 Advanced Subtitle Handling - PGS-zu-SRT Konvertierung
🌐 Remote Streaming Optimization - Dynamische Bitrate-Anpassung
🔧 Integrated Diagnostics - Hardware-Kompatibilitätsprüfung

🎯 UI-VERBESSERUNGEN:
- Quick Settings Button (⚙️) im Video Player
- 4 Intelligente Presets (Gaming, Apple TV, Mobile, Server)
- Touch-optimierte Steuerung für alle Geräte
- Echtzeit-Codec-Indikatoren
- Responsive Design für verschiedene Bildschirmgrößen
- Tabbed Configuration Interface mit 6 Hauptkategorien

📦 PACKAGE INFO:
- ZIP Größe: 172.46 KB (vollständig optimiert)
- DLL Größe: 441 KB (vollständige Plugin-Logik)
- MD5 Checksum: 624a0be47acaa357159d00b4fb810169
- 50+ neue Konfigurationsoptionen
- Cross-Platform Support (Windows/Linux/macOS/Mobile)

🔧 TECHNISCHE DETAILS:
- Enhanced quick-settings-av1.js (29.571 Bytes)
- Configuration Page v1.3.5 (50.715 Bytes)
- Player Button Integration (15.546 Bytes)
- AV1-Hardware-Detection und Optimierung
- Vollständige .NET 8.0 DLL mit allen Features

USER IMPACT: Das fortschrittlichste AI-Upscaling-Plugin für Jellyfin!
"@

git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing v1.3.5 to GitHub..." -ForegroundColor Yellow
git push origin main

# Force update tag
Write-Host "Creating/updating v1.3.5 tag..." -ForegroundColor Yellow
git tag -d v1.3.5 2>$null
git tag -a v1.3.5 -m "v1.3.5 - AV1 Edition with complete UI and DLL"
git push origin v1.3.5 --force

# Verify upload
Write-Host "✅ Upload completed!" -ForegroundColor Green
Write-Host "Repository: https://github.com/Kuschel-code/JellyfinUpscalerPlugin" -ForegroundColor Cyan
Write-Host "Create Release: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/new" -ForegroundColor Yellow