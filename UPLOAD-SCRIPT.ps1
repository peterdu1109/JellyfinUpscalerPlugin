# 🚀 GitHub Upload Script - AI Upscaler Plugin v1.3.5
# Dieses Script bereitet die wichtigsten Dateien für GitHub vor

param(
    [string]$GitHubUsername = "Kuschel-code",
    [string]$RepositoryName = "JellyfinUpscalerPlugin"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 GitHub Upload Vorbereitung - AI Upscaler Plugin v1.3.5" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Yellow

# Basis-Verzeichnis
$sourceDir = "c:\Users\Kitty\Desktop\Jellyfin upgrade\JellyfinUpscalerPlugin-v1.3.5"
$uploadDir = "c:\Users\Kitty\Desktop\GitHub-Upload"

# Upload-Verzeichnis erstellen
Write-Host "📁 Erstelle Upload-Verzeichnis..." -ForegroundColor Cyan
if (Test-Path $uploadDir) {
    Remove-Item $uploadDir -Recurse -Force
}
New-Item -ItemType Directory -Path $uploadDir -Force | Out-Null

# Wichtige Dateien definieren
$importantFiles = @(
    # Root-Dateien
    "README.md",
    "manifest.json", 
    "repository.json",
    "LICENSE",
    "_config.yml",
    "JellyfinUpscalerPlugin.csproj",
    "JellyfinUpscalerPlugin.sln",
    
    # Source Code
    "Plugin.cs",
    "PluginConfiguration.cs",
    "UpscalerCore.cs", 
    "AV1VideoProcessor.cs",
    "UpscalerApiController.cs"
)

# Wichtige Verzeichnisse
$importantDirs = @(
    "web",
    "docs", 
    "Configuration",
    ".github"
)

Write-Host "📋 Kopiere wichtige Dateien..." -ForegroundColor Cyan

# Root-Dateien kopieren
foreach ($file in $importantFiles) {
    $sourcePath = Join-Path $sourceDir $file
    $targetPath = Join-Path $uploadDir $file
    
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath $targetPath -Force
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $file nicht gefunden" -ForegroundColor Yellow
    }
}

# Verzeichnisse kopieren
foreach ($dir in $importantDirs) {
    $sourcePath = Join-Path $sourceDir $dir
    $targetPath = Join-Path $uploadDir $dir
    
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath $targetPath -Recurse -Force
        $fileCount = (Get-ChildItem $targetPath -Recurse -File).Count
        Write-Host "✅ $dir ($fileCount Dateien)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $dir nicht gefunden" -ForegroundColor Yellow
    }
}

# ZIP-Package kopieren
$zipSource = Join-Path $sourceDir "dist\JellyfinUpscalerPlugin-v1.3.5-RealFeatures-FINAL.zip"
$zipTarget = Join-Path $uploadDir "JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip"

if (Test-Path $zipSource) {
    Copy-Item $zipSource $zipTarget -Force
    Write-Host "✅ Release ZIP kopiert" -ForegroundColor Green
} else {
    Write-Host "⚠️  Release ZIP nicht gefunden" -ForegroundColor Yellow
}

# Manifest.json für Repository-URL prüfen
$manifestPath = Join-Path $uploadDir "manifest.json"
if (Test-Path $manifestPath) {
    $manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
    $sourceUrl = $manifest[0].versions[0].sourceUrl
    $expectedUrl = "https://github.com/$GitHubUsername/$RepositoryName/releases/download/v1.3.5/JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip"
    
    if ($sourceUrl -ne $expectedUrl) {
        Write-Host "🔧 Aktualisiere manifest.json URL..." -ForegroundColor Cyan
        $manifest[0].versions[0].sourceUrl = $expectedUrl
        $manifest | ConvertTo-Json -Depth 10 | Out-File $manifestPath -Encoding UTF8
        Write-Host "✅ Manifest URL korrigiert" -ForegroundColor Green
    }
}

# Repository README erstellen
$readmePath = Join-Path $uploadDir "GITHUB-UPLOAD-INFO.md"
$readmeContent = @"
# GitHub Upload Vorbereitet

## Diese Dateien sind bereit für GitHub:

### Root-Dateien:
- README.md (Haupt-Dokumentation)
- manifest.json (Plugin-Manifest)
- repository.json (Repository-Config)
- LICENSE (MIT-Lizenz)
- _config.yml (Jekyll GitHub Pages)

### Source Code:
- Plugin.cs, PluginConfiguration.cs
- UpscalerCore.cs, AV1VideoProcessor.cs
- UpscalerApiController.cs

### Verzeichnisse:
- web/ (JavaScript Frontend)
- docs/ (Wiki-Dokumentation)
- Configuration/ (Admin UI)
- .github/ (CI/CD Workflows)

## NÄCHSTE SCHRITTE:

### 1. GitHub Repository erstellen:
- Repository Name: $RepositoryName
- Description: Professional AI upscaling with AV1 hardware acceleration for Jellyfin
- Public, MIT License

### 2. Dateien hochladen:
- Alle Dateien aus diesem Verzeichnis nach GitHub
- GitHub Release mit ZIP-Package erstellen

### 3. Repository URL für Jellyfin:
https://raw.githubusercontent.com/$GitHubUsername/$RepositoryName/main/manifest.json

### 4. GitHub Pages aktivieren:
- Settings → Pages → Deploy from branch: main

## Release ZIP:
- JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip (197.6 KB)
- MD5: 2fce13b7e378f392375b74097a126453

Alles bereit für GitHub Upload!
"@

$readmeContent | Out-File $readmePath -Encoding UTF8

# Zusammenfassung
$totalFiles = (Get-ChildItem $uploadDir -Recurse -File).Count
$totalSize = [math]::Round((Get-ChildItem $uploadDir -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB, 2)

Write-Host "=================================================" -ForegroundColor Yellow
Write-Host "✅ UPLOAD VORBEREITUNG ABGESCHLOSSEN!" -ForegroundColor Green
Write-Host "📁 Upload-Verzeichnis: $uploadDir" -ForegroundColor Cyan
Write-Host "📊 Dateien gesamt: $totalFiles" -ForegroundColor Cyan
Write-Host "📦 Gesamtgröße: $totalSize MB" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Yellow

Write-Host ""
Write-Host "🔗 REPOSITORY URL für Jellyfin:" -ForegroundColor Green
Write-Host "https://raw.githubusercontent.com/$GitHubUsername/$RepositoryName/main/manifest.json" -ForegroundColor Yellow

Write-Host ""
Write-Host "📋 NÄCHSTE SCHRITTE:" -ForegroundColor Green
Write-Host "1. GitHub Repository '$RepositoryName' erstellen" -ForegroundColor White
Write-Host "2. Alle Dateien aus '$uploadDir' hochladen" -ForegroundColor White
Write-Host "3. GitHub Release v1.3.5 mit ZIP erstellen" -ForegroundColor White
Write-Host "4. GitHub Pages aktivieren" -ForegroundColor White
Write-Host "5. Repository URL in Jellyfin testen" -ForegroundColor White

# Upload-Verzeichnis öffnen
Write-Host ""
Write-Host "📂 Öffne Upload-Verzeichnis..." -ForegroundColor Cyan
Start-Process "explorer.exe" -ArgumentList $uploadDir

Write-Host ""
Write-Host "🎉 BEREIT FÜR GITHUB UPLOAD!" -ForegroundColor Green