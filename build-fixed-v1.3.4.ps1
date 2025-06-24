#!/usr/bin/env pwsh
# Fixed Build Script for AI Upscaler Plugin v1.3.4

param(
    [string]$Configuration = "Release"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Building AI Upscaler Plugin v1.3.4 - Enterprise Edition" -ForegroundColor Magenta

# Project configuration
$projectName = "JellyfinUpscalerPlugin"
$version = "1.3.4"
$projectDir = $PSScriptRoot
$binDir = Join-Path $projectDir "bin/$Configuration/net6.0"
$distDir = Join-Path $projectDir "dist"
$packageName = "$projectName-v$version.zip"
$packagePath = Join-Path $distDir $packageName

Write-Host "ℹ️  Project: $projectName v$version" -ForegroundColor Blue
Write-Host "ℹ️  Directory: $projectDir" -ForegroundColor Blue

# Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path $binDir) { Remove-Item $binDir -Recurse -Force }
if (Test-Path $distDir) { Remove-Item $distDir -Recurse -Force }
if (Test-Path (Join-Path $projectDir "obj")) { Remove-Item (Join-Path $projectDir "obj") -Recurse -Force }

# Build project
Write-Host "🔨 Building project..." -ForegroundColor Yellow
& dotnet build (Join-Path $projectDir "$projectName.csproj") --configuration $Configuration

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Verify DLL
$dllPath = Join-Path $binDir "$projectName.dll"
if (!(Test-Path $dllPath)) {
    Write-Host "❌ DLL not found: $dllPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ DLL built successfully: $dllPath" -ForegroundColor Green

# Create dist directory
New-Item -ItemType Directory -Path $distDir -Force | Out-Null

# Create package
Write-Host "📦 Creating package..." -ForegroundColor Yellow

$tempDir = Join-Path $env:TEMP "JellyfinUpscaler-v$version-$(Get-Random)"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try {
    # Copy core files
    Copy-Item $dllPath $tempDir
    Write-Host "✅ Copied DLL" -ForegroundColor Green
    
    $depsPath = Join-Path $binDir "$projectName.deps.json"
    if (Test-Path $depsPath) {
        Copy-Item $depsPath $tempDir
        Write-Host "✅ Copied dependencies" -ForegroundColor Green
    }
    
    $metaPath = Join-Path $binDir "meta.json"
    if (Test-Path $metaPath) {
        Copy-Item $metaPath $tempDir
        Write-Host "✅ Copied metadata" -ForegroundColor Green
    }
    
    $thumbPath = Join-Path $binDir "thumb.jpg"
    if (Test-Path $thumbPath) {
        Copy-Item $thumbPath $tempDir
        Write-Host "✅ Copied thumbnail" -ForegroundColor Green
    }
    
    # Copy directories
    $directories = @("web", "Configuration", "assets", "shaders")
    foreach ($dir in $directories) {
        $sourceDir = Join-Path $projectDir $dir
        if (Test-Path $sourceDir) {
            Copy-Item $sourceDir (Join-Path $tempDir $dir) -Recurse
            Write-Host "✅ Copied $dir" -ForegroundColor Green
        }
    }
    
    # Copy localization
    $localizationSource = Join-Path $projectDir "src/localization"
    if (Test-Path $localizationSource) {
        Copy-Item $localizationSource (Join-Path $tempDir "localization") -Recurse
        Write-Host "✅ Copied localization" -ForegroundColor Green
    }
    
    # Create package info
    $packageInfo = @{
        name = $projectName
        version = $version
        buildDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        features = @(
            "Light Mode for weak hardware",
            "UI-based Model Manager", 
            "Optional Frame Interpolation",
            "Mobile/Server-side support"
        )
    } | ConvertTo-Json -Depth 10
    
    $packageInfo | Set-Content (Join-Path $tempDir "package-info.json")
    Write-Host "✅ Created package info" -ForegroundColor Green
    
    # Create ZIP
    Compress-Archive -Path "$tempDir\*" -DestinationPath $packagePath -Force
    Write-Host "✅ Package created" -ForegroundColor Green
    
} finally {
    # Cleanup
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
}

# Verify package
if (!(Test-Path $packagePath)) {
    Write-Host "❌ Package not created" -ForegroundColor Red
    exit 1
}

$packageSize = (Get-Item $packagePath).Length
$packageSizeMB = [math]::Round($packageSize / 1MB, 2)

# Calculate checksum
$hash = Get-FileHash $packagePath -Algorithm MD5

Write-Host ""
Write-Host "🎉 BUILD COMPLETED SUCCESSFULLY!" -ForegroundColor Green -BackgroundColor Black
Write-Host "📦 Package: $packageName" -ForegroundColor Cyan
Write-Host "📁 Location: $packagePath" -ForegroundColor Cyan  
Write-Host "📊 Size: $packageSizeMB MB" -ForegroundColor Cyan
Write-Host "🔑 MD5: $($hash.Hash.ToLower())" -ForegroundColor Cyan

# Save checksum
"$($hash.Hash.ToLower())  $packageName" | Set-Content (Join-Path $distDir "$projectName-v$version.md5")

Write-Host ""
Write-Host "🚀 Ready for deployment!" -ForegroundColor Green