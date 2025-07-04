#!/usr/bin/env pwsh

# Simple build script for Jellyfin AI Upscaler Plugin v1.3.6.1

Write-Host "Building Jellyfin AI Upscaler Plugin v1.3.6.1..."

# Clean previous builds
if (Test-Path "bin") { Remove-Item "bin" -Recurse -Force }
if (Test-Path "obj") { Remove-Item "obj" -Recurse -Force }
if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force }

# Create output directory
$OutputPath = "dist/JellyfinUpscalerPlugin-v1.3.6.1-Ultimate"
New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null

# Build the plugin
Write-Host "Building plugin..."
dotnet build --configuration Release --framework net8.0
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!"
    exit 1
}

# Publish the plugin
Write-Host "Publishing plugin..."
dotnet publish --configuration Release --framework net8.0 --output "bin/Release/net8.0/publish"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Publish failed!"
    exit 1
}

# Copy files to output directory
$publishDir = "bin/Release/net8.0/publish"
Copy-Item "$publishDir/JellyfinUpscalerPlugin.dll" -Destination $OutputPath -Force
Copy-Item "$publishDir/JellyfinUpscalerPlugin.deps.json" -Destination $OutputPath -Force -ErrorAction SilentlyContinue
Copy-Item "meta.json" -Destination $OutputPath -Force -ErrorAction SilentlyContinue

# Copy web files
if (Test-Path "web") {
    Copy-Item "web" -Destination "$OutputPath/web" -Recurse -Force
}

# Copy configuration files
if (Test-Path "Configuration") {
    Copy-Item "Configuration" -Destination "$OutputPath/Configuration" -Recurse -Force
}

# Create ZIP package
$zipPath = "dist/JellyfinUpscalerPlugin-v1.3.6.1-Ultimate.zip"
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($OutputPath, $zipPath)

Write-Host "Build completed successfully!"
Write-Host "Package created: $zipPath"

# Get file size
$fileSize = (Get-Item $zipPath).Length
$fileSizeMB = [Math]::Round($fileSize / 1024 / 1024, 2)
Write-Host "Package size: $fileSizeMB MB"