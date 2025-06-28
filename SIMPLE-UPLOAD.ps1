# Simple GitHub Upload Vorbereitung
$sourceDir = "c:\Users\Kitty\Desktop\Jellyfin upgrade\JellyfinUpscalerPlugin-v1.3.5"
$uploadDir = "c:\Users\Kitty\Desktop\GitHub-Upload"

Write-Host "Erstelle Upload-Verzeichnis..." -ForegroundColor Green
if (Test-Path $uploadDir) { Remove-Item $uploadDir -Recurse -Force }
New-Item -ItemType Directory -Path $uploadDir -Force | Out-Null

# Wichtige Dateien kopieren
$files = @(
    "README.md", "manifest.json", "repository.json", "LICENSE", "_config.yml",
    "JellyfinUpscalerPlugin.csproj", "JellyfinUpscalerPlugin.sln",
    "Plugin.cs", "PluginConfiguration.cs", "UpscalerCore.cs", 
    "AV1VideoProcessor.cs", "UpscalerApiController.cs"
)

Write-Host "Kopiere Dateien..." -ForegroundColor Cyan
foreach ($file in $files) {
    $source = Join-Path $sourceDir $file
    $target = Join-Path $uploadDir $file
    if (Test-Path $source) {
        Copy-Item $source $target -Force
        Write-Host "OK: $file" -ForegroundColor Green
    }
}

# Verzeichnisse kopieren
$dirs = @("web", "docs", "Configuration", ".github")
foreach ($dir in $dirs) {
    $source = Join-Path $sourceDir $dir
    $target = Join-Path $uploadDir $dir
    if (Test-Path $source) {
        Copy-Item $source $target -Recurse -Force
        Write-Host "OK: $dir/" -ForegroundColor Green
    }
}

# ZIP kopieren
$zipSource = Join-Path $sourceDir "dist\JellyfinUpscalerPlugin-v1.3.5-RealFeatures-FINAL.zip"
$zipTarget = Join-Path $uploadDir "JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip"
if (Test-Path $zipSource) {
    Copy-Item $zipSource $zipTarget -Force
    Write-Host "OK: Release ZIP" -ForegroundColor Green
}

Write-Host "FERTIG! Upload-Dateien in: $uploadDir" -ForegroundColor Yellow
Write-Host "Repository URL wird sein:" -ForegroundColor Yellow
Write-Host "https://raw.githubusercontent.com/IHR-USERNAME/JellyfinUpscalerPlugin/main/manifest.json" -ForegroundColor Green

Start-Process "explorer.exe" -ArgumentList $uploadDir