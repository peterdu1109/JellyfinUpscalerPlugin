# 🚀 AI Upscaler Plugin v1.3.5-ENHANCED Package Creator
# Enhanced Edition with 14 AI Models + 7 Shaders + Advanced Features

Write-Host "🚀 Creating AI Upscaler Plugin v1.3.5-ENHANCED Package..." -ForegroundColor Green

# Build the project
Write-Host "📦 Building Release..." -ForegroundColor Yellow
dotnet build --configuration Release

# Create enhanced package directory
$packageDir = "JellyfinUpscalerPlugin-v1.3.5-ENHANCED"
if (Test-Path $packageDir) {
    Remove-Item $packageDir -Recurse -Force
}
New-Item -ItemType Directory -Path $packageDir | Out-Null

# Copy core files
Write-Host "📋 Copying core files..." -ForegroundColor Yellow
Copy-Item "Plugin.cs" "$packageDir/"
Copy-Item "PluginConfiguration.cs" "$packageDir/"
Copy-Item "AV1VideoProcessor.cs" "$packageDir/"
Copy-Item "UpscalerCore.cs" "$packageDir/"
Copy-Item "UpscalerApiController.cs" "$packageDir/"
Copy-Item "manifest.json" "$packageDir/"
Copy-Item "meta.json" "$packageDir/"
Copy-Item "thumb.jpg" "$packageDir/" -ErrorAction SilentlyContinue

# Copy DLL if exists
if (Test-Path "dist/JellyfinUpscalerPlugin.dll") {
    Copy-Item "dist/JellyfinUpscalerPlugin.dll" "$packageDir/"
    $dllSize = [math]::Round((Get-Item "dist/JellyfinUpscalerPlugin.dll").Length/1KB,2)
    Write-Host "✅ DLL copied: ${dllSize} KB" -ForegroundColor Green
}

# Copy web interface
Write-Host "🌐 Copying web interface..." -ForegroundColor Yellow
if (Test-Path "Configuration") {
    Copy-Item "Configuration" "$packageDir/" -Recurse
}
if (Test-Path "web") {
    Copy-Item "web" "$packageDir/" -Recurse
}

# Copy documentation
Write-Host "📚 Copying documentation..." -ForegroundColor Yellow
Copy-Item "README-v1.3.5-ENHANCED.md" "$packageDir/README.md"
Copy-Item "FINAL-ENHANCED-v1.3.5-REPORT.md" "$packageDir/"
Copy-Item "LICENSE" "$packageDir/" -ErrorAction SilentlyContinue

# Create manifest for enhanced version
Write-Host "📄 Creating enhanced manifest..." -ForegroundColor Yellow
$manifest = @{
    guid = "f87f700e-679d-43e6-9c7c-b3a410dc3f22"
    name = "🚀 AI Upscaler Plugin v1.3.5 - Enhanced Edition"
    description = "Professional AI upscaling with 14 models, 7 shaders, AV1 codec support, cross-device sync, and real-time statistics. Compatible with all platforms and devices."
    overview = "The ultimate Jellyfin upscaling solution with 14 AI models, advanced features, and universal compatibility."
    owner = "Kuschel-code"
    category = "MediaStreaming"
    version = "1.3.5.0"
    targetAbi = "10.10.0.0"
    framework = "net8.0"
    timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    changelog = "Enhanced Edition: 5 new AI models, 4 new shaders, AI color correction, zoned upscaling, cross-device sync, real-time stats"
    sourceUrl = "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v1.3.5-enhanced/JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip"
    checksum = ""
    filename = "JellyfinUpscalerPlugin-v1.3.5-ENHANCED.zip"
}

$manifest | ConvertTo-Json -Depth 3 | Out-File "$packageDir/manifest-enhanced.json" -Encoding UTF8

# Create ZIP package
Write-Host "📦 Creating ZIP package..." -ForegroundColor Yellow
$zipPath = "$packageDir.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Using PowerShell 5.0+ compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($packageDir, $zipPath)

# Calculate checksum
$checksum = (Get-FileHash $zipPath -Algorithm SHA256).Hash.ToLower()
$zipSize = [math]::Round((Get-Item $zipPath).Length/1KB,2)

# Update manifest with checksum
$manifest.checksum = $checksum
$manifest | ConvertTo-Json -Depth 3 | Out-File "$packageDir/manifest-enhanced.json" -Encoding UTF8

Write-Host ""
Write-Host "🎉 SUCCESS! Package created:" -ForegroundColor Green
Write-Host "📦 File: $zipPath" -ForegroundColor Cyan
Write-Host "📏 Size: ${zipSize} KB" -ForegroundColor Cyan
Write-Host "🔐 SHA256: $checksum" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Ready for GitHub upload!" -ForegroundColor Green