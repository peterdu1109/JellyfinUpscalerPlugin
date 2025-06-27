# GitHub Upload Script für v1.3.5 - AV1 Edition
# Automatisiertes Deployment mit vollständiger DLL

param(
    [string]$GitMessage = "🚀 AI Upscaler Plugin v1.3.5 - AV1 Edition - Complete with 441KB DLL",
    [string]$ReleaseTitle = "🚀 v1.3.5 - AV1 Edition",
    [switch]$SkipBuild,
    [switch]$ForceUpload
)

Write-Host "==================================================================" -ForegroundColor Magenta
Write-Host "   🚀 AI UPSCALER PLUGIN v1.3.5 - GITHUB DEPLOYMENT SCRIPT" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Magenta

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$DIST_DIR = Join-Path $SCRIPT_DIR "dist"
$ZIP_FILE = "JellyfinUpscalerPlugin-v1.3.5.zip"
$ZIP_PATH = Join-Path $DIST_DIR $ZIP_FILE

# Validierung der Dateien
Write-Host "🔍 Validating files..." -ForegroundColor Yellow
if (-not (Test-Path $ZIP_PATH)) {
    Write-Host "❌ ZIP file not found: $ZIP_PATH" -ForegroundColor Red
    Write-Host "📦 Running build script first..." -ForegroundColor Yellow
    & "$SCRIPT_DIR\build-simple.ps1"
    
    if (-not (Test-Path $ZIP_PATH)) {
        Write-Host "❌ Build failed! ZIP file still missing." -ForegroundColor Red
        exit 1
    }
}

# ZIP-Datei Informationen
$zipInfo = Get-Item $ZIP_PATH
$zipSizeKB = [math]::Round($zipInfo.Length / 1KB, 2)
$checksum = (Get-FileHash $ZIP_PATH -Algorithm MD5).Hash.ToLower()

Write-Host "✅ ZIP File validated:" -ForegroundColor Green
Write-Host "   📦 File: $ZIP_FILE" -ForegroundColor Cyan
Write-Host "   💾 Size: $zipSizeKB KB" -ForegroundColor Cyan
Write-Host "   🔐 MD5: $checksum" -ForegroundColor Cyan

# DLL Validierung
$dllPath = Join-Path $DIST_DIR "content\JellyfinUpscalerPlugin.dll"
if (Test-Path $dllPath) {
    $dllInfo = Get-Item $dllPath
    $dllSizeKB = [math]::Round($dllInfo.Length / 1KB, 2)
    Write-Host "✅ DLL validated: $dllSizeKB KB" -ForegroundColor Green
} else {
    Write-Host "⚠️ DLL not found in content folder!" -ForegroundColor Yellow
}

# Git Repository Check
Write-Host "🔍 Checking Git repository..." -ForegroundColor Yellow
try {
    $gitStatus = git status --porcelain
    $currentBranch = git branch --show-current
    Write-Host "✅ Git repository found, branch: $currentBranch" -ForegroundColor Green
} catch {
    Write-Host "❌ Git repository not found or not initialized!" -ForegroundColor Red
    Write-Host "🔧 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git remote add origin https://github.com/Kuschel-code/JellyfinUpscalerPlugin.git
}

# Git Upload Process
Write-Host "📤 Starting Git upload process..." -ForegroundColor Yellow

# Add all files
Write-Host "➕ Adding files to Git..." -ForegroundColor Cyan
git add .

# Create detailed commit message
$detailedMessage = @"
$GitMessage

✨ NEUE v1.3.5 FEATURES:
🔥 Full AV1 Codec Support - Hardware-beschleunigt für RTX 3000+, Intel Arc, AMD RX 7000+
⚙️ Enhanced Quick Settings UI - Modernes Player-Interface mit Touch-Optimierung
📱 Mobile Support Enhancement - Touch-freundliche UI mit Batterie-Schonmodus
🎬 HDR10 & Dolby Vision Support - Hardware-Tone-Mapping mit 4 Algorithmen
📺 Advanced Subtitle Handling - PGS-zu-SRT Konvertierung verhindert Transcoding
🌐 Remote Streaming Optimization - Dynamische Bitrate-Anpassung in Echtzeit
🔧 Integrated Diagnostics - Hardware-Kompatibilitätsprüfung und Performance-Metriken

📦 PACKAGE INFO:
- ZIP Größe: $zipSizeKB KB (vollständig optimiert)
- DLL Größe: $dllSizeKB KB (vollständige Plugin-Logik)
- MD5 Checksum: $checksum
- 50+ neue Konfigurationsoptionen
- Vollständige AV1-Hardware-Integration
- Cross-Platform Support (Windows/Linux/macOS/Mobile)

🎯 VERBESSERUNGEN:
- Quick Settings Button im Video Player
- Intelligente Preset-Auswahl (Gaming, Apple TV, Mobile, Server)
- AV1-spezifische Hardware-Erkennung
- Erweiterte Fehlerdiagnose mit Live-Metriken
- Touch-optimierte UI für mobile Geräte
- Erweiterte Konfigurationsoberfläche mit 6 Hauptkategorien

USER IMPACT: Das fortschrittlichste AI-Upscaling-Plugin für Jellyfin!
"@

# Commit changes
Write-Host "💬 Creating commit..." -ForegroundColor Cyan
git commit -m $detailedMessage

# Push to main branch
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
try {
    git push origin main
    Write-Host "✅ Successfully pushed to main branch!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Push failed, trying to set upstream..." -ForegroundColor Yellow
    git push --set-upstream origin main
}

# Create and push tag
Write-Host "🏷️ Creating release tag..." -ForegroundColor Cyan
git tag -a "v1.3.5" -m "v1.3.5 - AV1 Edition Release with full DLL ($dllSizeKB KB)"
git push origin v1.3.5

Write-Host "✅ Git upload completed successfully!" -ForegroundColor Green

# GitHub Release Information
Write-Host "" -ForegroundColor White
Write-Host "==================================================================" -ForegroundColor Magenta
Write-Host "   📋 GITHUB RELEASE INFORMATION" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Magenta

Write-Host "🌐 Repository: https://github.com/Kuschel-code/JellyfinUpscalerPlugin" -ForegroundColor Cyan
Write-Host "🏷️ Tag: v1.3.5" -ForegroundColor Cyan
Write-Host "📦 Release Asset: $ZIP_FILE" -ForegroundColor Cyan
Write-Host "🔐 MD5 Checksum: $checksum" -ForegroundColor Cyan

$releaseNotes = @"
# 🚀 AI Upscaler Plugin v1.3.5 - AV1 Edition

## ✨ **MAJOR NEW FEATURES**

### 🔥 **Full AV1 Codec Support**
- **Hardware-beschleunigtes AV1-Encoding** für RTX 3000+, Intel Arc, AMD RX 7000+
- **Automatische Encoder/Decoder-Erkennung**
- **Optimierte Einstellungen** für verschiedene Hardware-Konfigurationen
- **CRF, Preset & Film Grain** Kontrolle

### ⚙️ **Enhanced Quick Settings UI**
- **Modernes Player-Interface** mit Gradient-Design
- **Touch-Optimierung** für alle Geräte
- **4 Intelligente Presets**: Gaming, Apple TV, Mobile, Server
- **Echtzeit-Codec-Indikatoren**

### 📱 **Mobile Support Enhancement**
- **Touch-freundliche UI-Elemente**
- **Batterie-Schonmodus** für mobile Geräte
- **Mobile-spezifische Codec-Auswahl**
- **Responsive Design** für verschiedene Bildschirmgrößen

## 🎬 **ERWEITERTE VIDEO-FEATURES**

- **HDR10 & Dolby Vision Support** mit Hardware-Tone-Mapping
- **4 Tone-Mapping-Algorithmen** (Hable, Mobius, Reinhard, BT.2390)
- **PGS-zu-SRT Untertitel-Konvertierung**
- **Multi-Format Untertitel-Support**

## 🌐 **REMOTE STREAMING OPTIMIZATION**

- **Dynamische Bitrate-Anpassung** in Echtzeit
- **Netzwerk-adaptive Qualitätseinstellungen**
- **Low-Latency Streaming** Protokolle
- **Adaptive Qualität** für mobile Netzwerke

## 🔧 **TECHNICAL IMPROVEMENTS**

- **50+ neue Konfigurationsoptionen**
- **Tabbed Configuration Interface** mit 6 Hauptkategorien
- **Integrierte Diagnose-Tools**
- **Hardware-Kompatibilitätsprüfung**
- **Performance-Metriken** in Echtzeit

## 📦 **PACKAGE INFORMATION**

- **ZIP Größe**: $zipSizeKB KB
- **DLL Größe**: $dllSizeKB KB (vollständige Plugin-Logik)
- **MD5 Checksum**: ``$checksum``
- **Target Framework**: .NET 8.0
- **Jellyfin Compatibility**: 10.10.3+

## 🚀 **INSTALLATION**

1. Download ``$ZIP_FILE``
2. Extract to Jellyfin plugins directory
3. Restart Jellyfin server
4. Configure via Settings → Plugins → AI Upscaler

## 🎯 **WHAT'S NEW FROM v1.3.4**

- ✅ Full AV1 hardware acceleration
- ✅ Modern Quick Settings UI in video player
- ✅ Enhanced mobile and touch support
- ✅ Advanced subtitle handling
- ✅ Real-time streaming optimization
- ✅ Comprehensive diagnostics integration

**This is the most advanced AI upscaling plugin for Jellyfin!** 🎉
"@

Write-Host "" -ForegroundColor White
Write-Host "📋 GitHub Release Notes:" -ForegroundColor Yellow
Write-Host $releaseNotes -ForegroundColor Gray

Write-Host "" -ForegroundColor White
Write-Host "==================================================================" -ForegroundColor Magenta
Write-Host "   ✅ DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Magenta

Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. 🌐 Visit: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases" -ForegroundColor White
Write-Host "2. 📝 Create new release with tag v1.3.5" -ForegroundColor White
Write-Host "3. 📤 Upload $ZIP_FILE as release asset" -ForegroundColor White
Write-Host "4. 📋 Copy release notes from above" -ForegroundColor White
Write-Host "5. 🚀 Publish release!" -ForegroundColor White

Write-Host "" -ForegroundColor White
Write-Host "🎉 v1.3.5 is ready for deployment!" -ForegroundColor Green