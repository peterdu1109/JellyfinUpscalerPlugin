# 🚀 AI Upscaler Plugin v1.3.5 - Build Script
# Build-Script für die neue AV1-Edition

param(
    [string]$Configuration = "Release",
    [switch]$Clean = $false,
    [switch]$Pack = $true,
    [switch]$Deploy = $false
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Konstanten
$PLUGIN_NAME = "JellyfinUpscalerPlugin"
$PLUGIN_VERSION = "1.3.5"
$TARGET_FRAMEWORK = "net8.0"
$JELLYFIN_VERSION = "10.10.3"

# Pfade
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PROJECT_FILE = Join-Path $SCRIPT_DIR "$PLUGIN_NAME.csproj"
$BUILD_DIR = Join-Path $SCRIPT_DIR "bin\$Configuration"
$PUBLISH_DIR = Join-Path $SCRIPT_DIR "bin\Publish"
$DIST_DIR = Join-Path $SCRIPT_DIR "dist"
$ZIP_NAME = "$PLUGIN_NAME-v$PLUGIN_VERSION.zip"

# Farben für Output
function Write-ColorOutput {
    param(
        [string]$Message,
        [ConsoleColor]$Color = [ConsoleColor]::White
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Success { param([string]$Message) Write-ColorOutput "[SUCCESS] $Message" Green }
function Write-Info { param([string]$Message) Write-ColorOutput "[INFO] $Message" Cyan }
function Write-Warning { param([string]$Message) Write-ColorOutput "[WARNING] $Message" Yellow }
function Write-Error { param([string]$Message) Write-ColorOutput "[ERROR] $Message" Red }

# Header
Write-ColorOutput @"

============================================================
   AI Upscaler Plugin v$PLUGIN_VERSION - AV1 Edition
   Build Script for Jellyfin $JELLYFIN_VERSION
============================================================

"@ Magenta

Write-Info "Build Configuration: $Configuration"
Write-Info "Target Framework: $TARGET_FRAMEWORK"
Write-Info "Jellyfin Version: $JELLYFIN_VERSION"
Write-Info "Script Directory: $SCRIPT_DIR"

# Voraussetzungen prüfen
Write-Info "Checking prerequisites..."

if (-not (Test-Path $PROJECT_FILE)) {
    Write-Error "Projekt-Datei nicht gefunden: $PROJECT_FILE"
    exit 1
}

# .NET SDK Version prüfen
try {
    $dotnetVersion = dotnet --version
    Write-Info ".NET SDK Version: $dotnetVersion"
} catch {
    Write-Error ".NET SDK nicht gefunden! Bitte installieren Sie .NET 8.0 SDK."
    exit 1
}

# Clean Build
if ($Clean) {
    Write-Info "Bereinige Build-Verzeichnisse..."
    
    if (Test-Path $BUILD_DIR) {
        Remove-Item $BUILD_DIR -Recurse -Force
        Write-Success "Build-Verzeichnis bereinigt"
    }
    
    if (Test-Path $PUBLISH_DIR) {
        Remove-Item $PUBLISH_DIR -Recurse -Force
        Write-Success "Publish-Verzeichnis bereinigt"
    }
    
    if (Test-Path $DIST_DIR) {
        Remove-Item $DIST_DIR -Recurse -Force
        Write-Success "Dist-Verzeichnis bereinigt"
    }
    
    # dotnet clean
    Write-Info "Führe 'dotnet clean' aus..."
    dotnet clean $PROJECT_FILE --configuration $Configuration --verbosity quiet
    Write-Success "Projekt bereinigt"
}

# Erstelle Verzeichnisse
Write-Info "Erstelle Build-Verzeichnisse..."
$null = New-Item -ItemType Directory -Path $PUBLISH_DIR -Force
$null = New-Item -ItemType Directory -Path $DIST_DIR -Force

# NuGet Packages wiederherstellen
Write-Info "Stelle NuGet-Pakete wieder her..."
try {
    dotnet restore $PROJECT_FILE --verbosity quiet
    Write-Success "NuGet-Pakete wiederhergestellt"
} catch {
    Write-Error "Fehler beim Wiederherstellen der NuGet-Pakete: $_"
    exit 1
}

# Build Plugin
Write-Info "Kompiliere Plugin..."
try {
    dotnet build $PROJECT_FILE `
        --configuration $Configuration `
        --framework $TARGET_FRAMEWORK `
        --verbosity quiet `
        --no-restore
    
    Write-Success "Plugin erfolgreich kompiliert"
} catch {
    Write-Error "Fehler beim Kompilieren: $_"
    exit 1
}

# Publish Plugin
Write-Info "Veröffentliche Plugin..."
try {
    dotnet publish $PROJECT_FILE `
        --configuration $Configuration `
        --framework $TARGET_FRAMEWORK `
        --output $PUBLISH_DIR `
        --verbosity quiet `
        --no-restore

    Write-Success "Plugin erfolgreich veröffentlicht"
} catch {
    Write-Error "Fehler beim Veröffentlichen: $_"
    exit 1
}

# Plugin-Dateien zusammenstellen
Write-Info "Stelle Plugin-Dateien zusammen..."

$PLUGIN_FILES = @(
    "$PLUGIN_NAME.dll",
    "$PLUGIN_NAME.pdb",
    "meta.json",
    "manifest.json"
)

$PLUGIN_DIRS = @(
    "web",
    "Configuration",
    "shaders",
    "wiki"
)

# Hauptverzeichnis für ZIP erstellen
$ZIP_CONTENT_DIR = Join-Path $DIST_DIR "content"
$null = New-Item -ItemType Directory -Path $ZIP_CONTENT_DIR -Force

# DLL und PDB kopieren
foreach ($file in $PLUGIN_FILES) {
    $sourcePath = Join-Path $PUBLISH_DIR $file
    $destPath = Join-Path $ZIP_CONTENT_DIR $file
    
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath $destPath -Force
        Write-Success "Kopiert: $file"
    } elseif ($file -eq "meta.json" -or $file -eq "manifest.json") {
        # Diese Dateien sind im Hauptverzeichnis
        $sourcePath = Join-Path $SCRIPT_DIR $file
        if (Test-Path $sourcePath) {
            Copy-Item $sourcePath $destPath -Force
            Write-Success "Kopiert: $file"
        }
    } else {
        Write-Warning "Datei nicht gefunden: $file"
    }
}

# Verzeichnisse kopieren
foreach ($dir in $PLUGIN_DIRS) {
    $sourcePath = Join-Path $SCRIPT_DIR $dir
    $destPath = Join-Path $ZIP_CONTENT_DIR $dir
    
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath $destPath -Recurse -Force
        Write-Success "Kopiert: $dir/"
    } else {
        Write-Warning "Verzeichnis nicht gefunden: $dir"
    }
}

# Meta.json erstellen/aktualisieren
Write-Info "Erstelle meta.json..."
$metaJson = @{
    guid = "f87f700e-679d-43e6-9c7c-b3a410dc3f22"
    name = "🚀 AI Upscaler Plugin v$PLUGIN_VERSION"
    description = "Professional AI upscaling with AV1 codec support, multilingual support, 9 AI models, cross-platform GPU acceleration, and advanced player integration."
    overview = "Enhanced AI-powered video upscaling with modern AV1 codec support for Jellyfin Media Server"
    owner = "Kuschel-code"
    category = "Video Processing"
    version = $PLUGIN_VERSION
    changelog = "🆕 AV1 CODEC SUPPORT: Full AV1 encoding/decoding with hardware acceleration, Enhanced Quick Settings with AV1 options, Improved subtitle handling (SRT/ASS/PGS), Better remote streaming optimization, Enhanced mobile support with battery optimization, Improved error handling and diagnostics"
    targetAbi = $JELLYFIN_VERSION + ".0"
    framework = $TARGET_FRAMEWORK
    timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
}

$metaJsonPath = Join-Path $ZIP_CONTENT_DIR "meta.json"
$metaJson | ConvertTo-Json -Depth 10 | Set-Content $metaJsonPath -Encoding UTF8
Write-Success "meta.json erstellt"

# ZIP-Archiv erstellen
if ($Pack) {
    Write-Info "Erstelle ZIP-Archiv..."
    
    $zipPath = Join-Path $DIST_DIR $ZIP_NAME
    
    # Altes ZIP löschen falls vorhanden
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
    
    try {
        # PowerShell 5.0+ Compress-Archive verwenden
        Compress-Archive -Path "$ZIP_CONTENT_DIR\*" -DestinationPath $zipPath -CompressionLevel Optimal
        
        $zipSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
        Write-Success "ZIP-Archiv erstellt: $ZIP_NAME ($zipSize MB)"
        
        # Prüfsumme berechnen
        $checksum = Get-FileHash $zipPath -Algorithm MD5
        Write-Info "MD5 Checksumme: $($checksum.Hash.ToLower())"
        
        # Checksumme in Datei speichern
        $checksumFile = Join-Path $DIST_DIR "$PLUGIN_NAME-v$PLUGIN_VERSION.md5"
        "$($checksum.Hash.ToLower())  $ZIP_NAME" | Set-Content $checksumFile -Encoding ASCII
        Write-Success "Checksumme gespeichert: $($checksumFile | Split-Path -Leaf)"
        
    } catch {
        Write-Error "Fehler beim Erstellen des ZIP-Archivs: $_"
        exit 1
    }
}

# Deployment (optional)
if ($Deploy) {
    Write-Info "Deployment wird vorbereitet..."
    
    # GitHub Release Informationen
    $releaseNotes = Join-Path $SCRIPT_DIR "v$PLUGIN_VERSION-RELEASE-NOTES.md"
    if (Test-Path $releaseNotes) {
        Write-Info "Release Notes gefunden: $($releaseNotes | Split-Path -Leaf)"
    }
    
    # Upload-Informationen anzeigen
    Write-ColorOutput @"

🚀 DEPLOYMENT READY:
   📦 ZIP-Datei: $zipPath
   📋 Release Notes: $releaseNotes
   🔗 GitHub: https://github.com/Kuschel-code/JellyfinUpscalerPlugin
   
   Nächste Schritte:
   1. ZIP-Datei zu GitHub Releases hochladen
   2. Release Notes hinzufügen
   3. Plugin-Catalog aktualisieren
   4. Community benachrichtigen

"@ Green
}

# Build-Zusammenfassung
Write-ColorOutput @"

🎉 ===================================================
   BUILD ERFOLGREICH ABGESCHLOSSEN!
🎉 ===================================================

📊 Build-Statistiken:
   • Plugin Version: $PLUGIN_VERSION
   • Target Framework: $TARGET_FRAMEWORK
   • Build Configuration: $Configuration
   • Build-Zeit: $(Get-Date)

📦 Erstellte Dateien:
   • $ZIP_NAME
   • $PLUGIN_NAME-v$PLUGIN_VERSION.md5
   • Publish-Ordner: $PUBLISH_DIR

🚀 Das Plugin ist bereit für die Veröffentlichung!

"@ Green

Write-Info "Build-Script abgeschlossen."