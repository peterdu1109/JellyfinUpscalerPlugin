# Simple Build Script for AI Upscaler Plugin v1.3.6 ULTIMATE

param(
    [string]$Version = "1.3.6"
)

Write-Host "Building AI Upscaler Plugin v$Version ULTIMATE..." -ForegroundColor Cyan

# Clean previous builds
if (Test-Path "bin") { Remove-Item "bin" -Recurse -Force }
if (Test-Path "obj") { Remove-Item "obj" -Recurse -Force }
if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force }

# Create dist directory
New-Item -ItemType Directory -Path "dist" -Force | Out-Null

# Build the plugin
Write-Host "Restoring packages..." -ForegroundColor Yellow
dotnet restore

Write-Host "Building plugin..." -ForegroundColor Yellow
dotnet build --configuration Release

# Check if DLL was created
$DllPath = "bin\Release\net8.0\JellyfinUpscalerPlugin.dll"
if (!(Test-Path $DllPath)) {
    Write-Host "ERROR: Plugin DLL not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Plugin DLL built successfully!" -ForegroundColor Green

# Create package directory
$PackageDir = "dist\JellyfinUpscalerPlugin_v$Version"
New-Item -ItemType Directory -Path $PackageDir -Force | Out-Null

# Copy essential files
$FilesToCopy = @(
    "Plugin.cs",
    "PluginConfiguration.cs", 
    "manifest.json",
    "meta.json",
    $DllPath,
    "README.md",
    "LICENSE"
)

# Copy Manager Classes
$ManagerFiles = @(
    "MultiGPUManager.cs",
    "AIArtifactReducer.cs",
    "DynamicModelSwitcher.cs",
    "SmartCacheManager.cs",
    "ClientAdaptiveUpscaler.cs",
    "InteractivePreviewManager.cs",
    "MetadataBasedRecommendations.cs",
    "BandwidthAdaptiveUpscaler.cs",
    "EcoModeManager.cs",
    "AV1ProfileManager.cs",
    "AV1VideoProcessor.cs"
)

Write-Host "Copying files to package..." -ForegroundColor Yellow

foreach ($file in $FilesToCopy) {
    if (Test-Path $file) {
        $fileName = Split-Path $file -Leaf
        Copy-Item $file "$PackageDir\$fileName" -Force
        Write-Host "Copied: $file" -ForegroundColor Gray
    }
}

foreach ($file in $ManagerFiles) {
    if (Test-Path $file) {
        Copy-Item $file "$PackageDir\$file" -Force
        Write-Host "Copied: $file" -ForegroundColor Gray
    }
}

# Copy web directory if exists
if (Test-Path "web") {
    Copy-Item "web" "$PackageDir\web" -Recurse -Force
    Write-Host "Copied: web directory" -ForegroundColor Gray
}

# Copy Configuration directory if exists
if (Test-Path "Configuration") {
    Copy-Item "Configuration" "$PackageDir\Configuration" -Recurse -Force
    Write-Host "Copied: Configuration directory" -ForegroundColor Gray
}

# Create ZIP file
$ZipName = "JellyfinUpscalerPlugin-v$Version-Ultimate.zip"
$ZipPath = "dist\$ZipName"

Write-Host "Creating ZIP package..." -ForegroundColor Yellow

# Remove existing ZIP
if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
}

# Create ZIP
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($PackageDir, $ZipPath)

$ZipSize = (Get-Item $ZipPath).Length
Write-Host "SUCCESS: ZIP created - $ZipName ($([math]::Round($ZipSize/1KB, 2)) KB)" -ForegroundColor Green

# Calculate checksum
$Hash = Get-FileHash -Path $ZipPath -Algorithm SHA256
Write-Host "SHA256: $($Hash.Hash)" -ForegroundColor Cyan

# Save checksum
"$($Hash.Hash)  $ZipName" | Out-File "dist\SHA256SUMS.txt" -Encoding UTF8

Write-Host ""
Write-Host "BUILD COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "Package: $ZipPath" -ForegroundColor Cyan
Write-Host "Ready for GitHub Release!" -ForegroundColor Green