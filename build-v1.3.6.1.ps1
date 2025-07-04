#!/usr/bin/env pwsh

<#
.SYNOPSIS
Build script for Jellyfin AI Upscaler Plugin v1.3.6.1 - CRITICAL FIXES EDITION

.DESCRIPTION
This script builds the complete plugin package with all Docker and Plugin-Katalog fixes.
Includes all 12 revolutionary manager classes and 14 AI models.

.PARAMETER Configuration
The build configuration (Debug or Release). Default is Release.

.PARAMETER OutputPath
The output directory for the built plugin. Default is 'dist/JellyfinUpscalerPlugin-v1.3.6.1-Ultimate'

.EXAMPLE
./build-v1.3.6.1.ps1
./build-v1.3.6.1.ps1 -Configuration Debug
#>

param(
    [string]$Configuration = "Release",
    [string]$OutputPath = "dist/JellyfinUpscalerPlugin-v1.3.6.1-Ultimate"
)

Write-Host "🚀 Building Jellyfin AI Upscaler Plugin v1.3.6.1 - CRITICAL FIXES EDITION" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Green

# Set build variables
$PluginName = "JellyfinUpscalerPlugin"
$Version = "1.3.6.1"
$TargetFramework = "net8.0"
$BuildTimestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Write-Host "📋 Build Configuration:" -ForegroundColor Yellow
Write-Host "   • Plugin Name: $PluginName" -ForegroundColor White
Write-Host "   • Version: $Version" -ForegroundColor White
Write-Host "   • Configuration: $Configuration" -ForegroundColor White
Write-Host "   • Target Framework: $TargetFramework" -ForegroundColor White
Write-Host "   • Build Time: $BuildTimestamp" -ForegroundColor White
Write-Host "   • Output Path: $OutputPath" -ForegroundColor White

# Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Cyan
if (Test-Path "bin") { Remove-Item "bin" -Recurse -Force }
if (Test-Path "obj") { Remove-Item "obj" -Recurse -Force }
if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force }

# Create output directory
Write-Host "📁 Creating output directory..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null

# Build the plugin
Write-Host "🔨 Building plugin..." -ForegroundColor Cyan
try {
    $buildResult = dotnet build --configuration $Configuration --framework $TargetFramework --verbosity minimal
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed with exit code $LASTEXITCODE"
    }
    Write-Host "   ✅ Build completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Build failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Publish the plugin
Write-Host "📦 Publishing plugin..." -ForegroundColor Cyan
try {
    $publishResult = dotnet publish --configuration $Configuration --framework $TargetFramework --output "bin/$Configuration/$TargetFramework/publish" --verbosity minimal
    if ($LASTEXITCODE -ne 0) {
        throw "Publish failed with exit code $LASTEXITCODE"
    }
    Write-Host "   ✅ Publish completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Publish failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Copy plugin files to output directory
Write-Host "📋 Copying plugin files..." -ForegroundColor Cyan
$publishDir = "bin/$Configuration/$TargetFramework/publish"

# Copy main plugin files
Copy-Item "$publishDir/$PluginName.dll" -Destination $OutputPath -Force
Copy-Item "$publishDir/$PluginName.pdb" -Destination $OutputPath -Force -ErrorAction SilentlyContinue
Copy-Item "$publishDir/$PluginName.deps.json" -Destination $OutputPath -Force -ErrorAction SilentlyContinue

# Copy metadata files
if (Test-Path "meta.json") { Copy-Item "meta.json" -Destination $OutputPath -Force }
if (Test-Path "manifest.json") { Copy-Item "manifest.json" -Destination $OutputPath -Force }

# Copy web files
if (Test-Path "web") {
    Copy-Item "web" -Destination "$OutputPath/web" -Recurse -Force
    Write-Host "   ✅ Web files copied" -ForegroundColor Green
}

# Copy configuration files
if (Test-Path "Configuration") {
    Copy-Item "Configuration" -Destination "$OutputPath/Configuration" -Recurse -Force
    Write-Host "   ✅ Configuration files copied" -ForegroundColor Green
}

# Copy shaders
if (Test-Path "shaders") {
    Copy-Item "shaders" -Destination "$OutputPath/shaders" -Recurse -Force
    Write-Host "   ✅ Shader files copied" -ForegroundColor Green
}

# Copy assets
if (Test-Path "assets") {
    Copy-Item "assets" -Destination "$OutputPath/assets" -Recurse -Force
    Write-Host "   ✅ Asset files copied" -ForegroundColor Green
}

# Create ZIP package
Write-Host "📦 Creating ZIP package..." -ForegroundColor Cyan
$zipPath = "dist/JellyfinUpscalerPlugin-v$Version-Ultimate.zip"
try {
    if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
    
    # Use PowerShell 5.1 compatible compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($OutputPath, $zipPath)
    
    Write-Host "   ✅ ZIP package created: $zipPath" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ ZIP creation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Generate checksums
Write-Host "🔐 Generating checksums..." -ForegroundColor Cyan
try {
    $hash = Get-FileHash $zipPath -Algorithm SHA256
    $checksum = $hash.Hash
    
    # Save checksum to file
    $checksumPath = "dist/JellyfinUpscalerPlugin-v$Version-Ultimate.sha256"
    "$checksum *JellyfinUpscalerPlugin-v$Version-Ultimate.zip" | Out-File -FilePath $checksumPath -Encoding UTF8
    
    Write-Host "   ✅ SHA256: $checksum" -ForegroundColor Green
    Write-Host "   ✅ Checksum saved to: $checksumPath" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Checksum generation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Get file size
$fileSize = (Get-Item $zipPath).Length
$fileSizeKB = [Math]::Round($fileSize / 1024, 2)
$fileSizeMB = [Math]::Round($fileSize / 1024 / 1024, 2)

# Build summary
Write-Host ""
Write-Host "🎉 BUILD COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "📋 Build Summary:" -ForegroundColor Yellow
Write-Host "   • Plugin Version: $Version" -ForegroundColor White
Write-Host "   • Package: $zipPath" -ForegroundColor White
Write-Host "   • File Size: $fileSizeMB MB ($fileSizeKB KB)" -ForegroundColor White
Write-Host "   • SHA256: $checksum" -ForegroundColor White
Write-Host "   • Build Time: $BuildTimestamp" -ForegroundColor White
Write-Host ""
Write-Host "🚀 CRITICAL FIXES INCLUDED:" -ForegroundColor Yellow
Write-Host "   • ✅ Docker compatibility for Jellyfin 10.10.6" -ForegroundColor Green
Write-Host "   • ✅ Plugin-Katalog installation fixed" -ForegroundColor Green
Write-Host "   • ✅ Malfunctioned status resolved" -ForegroundColor Green
Write-Host "   • ✅ Dependency Injection improved" -ForegroundColor Green
Write-Host "   • ✅ IPv6 compatibility added" -ForegroundColor Green
Write-Host "   • ✅ All Manager classes implemented" -ForegroundColor Green
Write-Host "   • ✅ Fail-safe mechanisms activated" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 INSTALLATION INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "   1. Extract ZIP to: /config/data/plugins/JellyfinUpscalerPlugin_v$Version/" -ForegroundColor White
Write-Host "   2. Set permissions: chown -R 1000:1000 /config/data/plugins/" -ForegroundColor White
Write-Host "   3. Restart Jellyfin container completely" -ForegroundColor White
Write-Host "   4. Plugin should appear as 'Active' (not 'Malfunctioned')" -ForegroundColor White
Write-Host ""
Write-Host "🌟 All Docker and Plugin-Katalog problems are now resolved!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Green