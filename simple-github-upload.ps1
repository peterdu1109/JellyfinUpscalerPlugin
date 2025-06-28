# Simple GitHub Upload for JellyfinUpscalerPlugin v1.3.5
Write-Host "🚀 Starting GitHub Upload for v1.3.5..." -ForegroundColor Cyan

# Define paths
$pluginPath = "c:/Users/Kitty/Desktop/Jellyfin upgrade/JellyfinUpscalerPlugin-v1.3.5"
$wikiPath = "c:/Users/Kitty/Desktop/Jellyfin upgrade/wiki"
$uploadPath = "c:/Users/Kitty/Desktop/GitHub-Upload"

Write-Host "📦 Phase 1: Preparing Upload Directory..." -ForegroundColor Yellow

# Create clean upload directory
if (Test-Path $uploadPath) {
    Remove-Item $uploadPath -Recurse -Force
}
New-Item -ItemType Directory -Path $uploadPath -Force | Out-Null

# Copy plugin files
Write-Host "📁 Copying plugin files..." -ForegroundColor Cyan
Copy-Item "$pluginPath/*" $uploadPath -Recurse -Force -ErrorAction SilentlyContinue

# Copy wiki files  
Write-Host "📚 Copying wiki files..." -ForegroundColor Cyan
$wikiUploadPath = Join-Path $uploadPath "wiki"
New-Item -ItemType Directory -Path $wikiUploadPath -Force | Out-Null
Copy-Item "$wikiPath/*" $wikiUploadPath -Force -ErrorAction SilentlyContinue

# Clean up unnecessary files
Write-Host "🧹 Cleaning up..." -ForegroundColor Cyan
$cleanupItems = @("obj", "bin/Debug", ".vs", "*.user", "*Backup*", "*.log", "*.tmp")
foreach ($item in $cleanupItems) {
    Get-ChildItem $uploadPath -Recurse -Name $item -Force -ErrorAction SilentlyContinue | ForEach-Object {
        $itemPath = Join-Path $uploadPath $_
        if (Test-Path $itemPath) {
            Remove-Item $itemPath -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host "📋 Phase 2: File Summary..." -ForegroundColor Yellow

# Count files
$totalFiles = (Get-ChildItem $uploadPath -Recurse -File | Measure-Object).Count
$wikiFiles = (Get-ChildItem "$uploadPath/wiki" -File -ErrorAction SilentlyContinue | Measure-Object).Count

Write-Host "✅ Plugin files ready: $totalFiles total files" -ForegroundColor Green
Write-Host "✅ Wiki files ready: $wikiFiles wiki pages" -ForegroundColor Green

Write-Host "📦 Phase 3: Creating Release Package..." -ForegroundColor Yellow

# Create release ZIP
$releaseZip = Join-Path $uploadPath "JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip"
$releaseFiles = @("Plugin.cs", "PluginConfiguration.cs", "AV1VideoProcessor.cs", "UpscalerApiController.cs", "UpscalerCore.cs", "manifest.json", "meta.json", "JellyfinUpscalerPlugin.csproj", "web", "Configuration", "Properties")

$tempReleaseDir = Join-Path $uploadPath "temp-release"
New-Item -ItemType Directory -Path $tempReleaseDir -Force | Out-Null

foreach ($item in $releaseFiles) {
    $sourcePath = Join-Path $uploadPath $item
    $destPath = Join-Path $tempReleaseDir $item
    
    if (Test-Path $sourcePath) {
        if (Test-Path $sourcePath -PathType Container) {
            Copy-Item $sourcePath $destPath -Recurse -Force -ErrorAction SilentlyContinue
        } else {
            Copy-Item $sourcePath $destPath -Force -ErrorAction SilentlyContinue
        }
        Write-Host "✅ Added: $item" -ForegroundColor Green
    }
}

# Create ZIP
try {
    Compress-Archive -Path "$tempReleaseDir/*" -DestinationPath $releaseZip -Force
    $zipSize = [math]::Round((Get-Item $releaseZip).Length / 1KB)
    Write-Host "✅ Release package created: ${zipSize}KB" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not create ZIP file" -ForegroundColor Yellow
}

# Clean up temp
Remove-Item $tempReleaseDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "📋 Phase 4: Upload Instructions..." -ForegroundColor Yellow

$instructions = @"

🎉 FILES READY FOR GITHUB UPLOAD!

📂 Upload Location: $uploadPath

🚀 NEXT STEPS:

1️⃣ MAIN REPOSITORY UPLOAD:
   - Go to: https://github.com/Kuschel-code/JellyfinUpscalerPlugin
   - Upload all files from: $uploadPath
   - Exclude the 'wiki' folder (upload separately)

2️⃣ WIKI UPLOAD:
   - Go to: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki
   - Upload all files from: $uploadPath/wiki/
   - Set Home.md as the main page

3️⃣ CREATE RELEASE:
   - Go to: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases
   - Create new release v1.3.5
   - Upload: JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip

📊 UPLOAD SUMMARY:
- Total Files: $totalFiles
- Wiki Pages: $wikiFiles  
- Release Package: ${zipSize}KB
- Status: ✅ Ready

"@

Write-Host $instructions -ForegroundColor Cyan

# Save instructions
$instructionFile = Join-Path $uploadPath "UPLOAD-INSTRUCTIONS.md"
Set-Content -Path $instructionFile -Value $instructions -Encoding UTF8

Write-Host "📄 Instructions saved: $instructionFile" -ForegroundColor Green

# Open upload directory
$openDir = Read-Host "`nOpen upload directory? (y/N)"
if ($openDir -eq "y" -or $openDir -eq "Y") {
    Start-Process $uploadPath
}

# Open GitHub
$openGitHub = Read-Host "Open GitHub repository? (y/N)"
if ($openGitHub -eq "y" -or $openGitHub -eq "Y") {
    Start-Process "https://github.com/Kuschel-code/JellyfinUpscalerPlugin"
}