# 🚀 AI Upscaler Plugin v1.3.6 ULTIMATE - Release Package Creator

Write-Host "🚀 Creating AI Upscaler Plugin v1.3.6 ULTIMATE Release Package..." -ForegroundColor Green

# Create release directory
$releaseDir = "JellyfinUpscalerPlugin-v1.3.6-Ultimate"
if (Test-Path $releaseDir) {
    Remove-Item $releaseDir -Recurse -Force
}
New-Item -ItemType Directory -Path $releaseDir

# Copy main DLL
Copy-Item "bin/Release/net8.0/JellyfinUpscalerPlugin.dll" "$releaseDir/"

# Copy configuration files
Copy-Item "meta.json" "$releaseDir/"
Copy-Item "manifest.json" "$releaseDir/"

# Copy web resources
$webDir = "$releaseDir/web"
New-Item -ItemType Directory -Path $webDir -Force
Copy-Item "web/*" "$webDir/" -Recurse

# Copy configuration pages
$configDir = "$releaseDir/Configuration"
New-Item -ItemType Directory -Path $configDir -Force
Copy-Item "Configuration/*" "$configDir/" -Recurse

# Copy shaders
$shaderDir = "$releaseDir/shaders"
New-Item -ItemType Directory -Path $shaderDir -Force
Copy-Item "shaders/*" "$shaderDir/" -Recurse

# Create ZIP package
$zipFile = "JellyfinUpscalerPlugin-v1.3.6-Ultimate.zip"
if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}

# Use PowerShell compression
Compress-Archive -Path "$releaseDir/*" -DestinationPath $zipFile -CompressionLevel Optimal

# Calculate file size and hash
$zipSize = (Get-Item $zipFile).Length
$zipHash = (Get-FileHash $zipFile -Algorithm SHA256).Hash.Substring(0, 40)

Write-Host "✅ Release Package Created Successfully!" -ForegroundColor Green
Write-Host "📦 Package: $zipFile" -ForegroundColor Cyan
Write-Host "📊 Size: $zipSize bytes" -ForegroundColor Cyan
Write-Host "🔐 SHA256: $zipHash" -ForegroundColor Cyan

# Show contents
Write-Host "📋 Package Contents:" -ForegroundColor Yellow
Get-ChildItem $releaseDir -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Item $releaseDir).FullName, "")
    Write-Host "   $relativePath" -ForegroundColor White
}

Write-Host "🎉 Ready for GitHub Release!" -ForegroundColor Green