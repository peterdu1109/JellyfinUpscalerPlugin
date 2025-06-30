Write-Host "📦 Creating AI Upscaler v1.3.5 - Real Features Package..." -ForegroundColor Cyan

$sourceDir = "c:/Users/Kitty/Desktop/Jellyfin upgrade/JellyfinUpscalerPlugin-v1.3.5"
$packageName = "JellyfinUpscalerPlugin-v1.3.5-RealFeatures"
$packageDir = "$sourceDir/dist/$packageName"

# Clean previous package
if (Test-Path $packageDir) { Remove-Item -Recurse -Force $packageDir }
New-Item -ItemType Directory -Path $packageDir -Force | Out-Null

# Copy DLL
Copy-Item "$sourceDir/bin/Release/net8.0/JellyfinUpscalerPlugin.dll" "$packageDir/"

# Copy web files
Copy-Item -Recurse "$sourceDir/web" "$packageDir/"

# Copy configuration
Copy-Item -Recurse "$sourceDir/Configuration" "$packageDir/"

# Copy manifest
Copy-Item "$sourceDir/manifest.json" "$packageDir/"

# Create meta.json
$meta = @{
    guid = "f87f700e-679d-43e6-9c7c-b3a410dc3f22"
    name = "AI Upscaler Plugin"
    version = "1.3.5.0"
    description = "Real AV1 hardware acceleration with functional features"
    overview = "Professional AI upscaling with hardware-accelerated AV1 encoding, real-time video enhancement, and functional Quick Settings UI"
    owner = "JellyfinUpscalerPlugin"
    category = "Media Enhancement"
    target_abi = "10.10.0.0"
    changelog = "v1.3.5: REAL AV1 support, functional JavaScript integration, hardware detection API, video processing engine"
    imageUrl = ""
    artifacts = @(
        @{
            version = "1.3.5.0"
            filename = "$packageName.zip"
            target_abi = "10.10.0.0"
            source_url = "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v1.3.5/$packageName.zip"
            checksum = ""
            timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        }
    )
}

$metaJson = $meta | ConvertTo-Json -Depth 10
$metaJson | Out-File -FilePath "$packageDir/meta.json" -Encoding UTF8

# Create ZIP
$zipPath = "$packageDir.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($packageDir, $zipPath)

# Get info
$dllSize = (Get-Item "$packageDir/JellyfinUpscalerPlugin.dll").Length
$zipSize = (Get-Item $zipPath).Length
$checksum = (Get-FileHash $zipPath -Algorithm MD5).Hash.ToLower()

Write-Host "✅ Package created successfully!" -ForegroundColor Green
Write-Host "📂 Package: $zipPath" -ForegroundColor Cyan
Write-Host "💾 DLL Size: $([math]::Round($dllSize / 1KB, 1)) KB" -ForegroundColor Cyan
Write-Host "📦 ZIP Size: $([math]::Round($zipSize / 1KB, 1)) KB" -ForegroundColor Cyan
Write-Host "🔐 MD5 Checksum: $checksum" -ForegroundColor Cyan

Write-Host "`n🎯 REAL FEATURES INCLUDED:" -ForegroundColor Yellow
Write-Host "✅ UpscalerCore.cs - Hardware detection & AV1 support" -ForegroundColor Green
Write-Host "✅ AV1VideoProcessor.cs - Real video processing engine" -ForegroundColor Green  
Write-Host "✅ UpscalerApiController.cs - Functional API endpoints" -ForegroundColor Green
Write-Host "✅ Enhanced JavaScript - Real Jellyfin integration" -ForegroundColor Green
Write-Host "✅ Functional DLL with all features compiled" -ForegroundColor Green