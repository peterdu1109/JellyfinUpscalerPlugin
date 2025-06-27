# Simple GitHub Upload für v1.3.5

Write-Host "AI Upscaler Plugin v1.3.5 - GitHub Upload" -ForegroundColor Cyan

# Check if we have ZIP file
$zipPath = ".\dist\JellyfinUpscalerPlugin-v1.3.5.zip"
if (-not (Test-Path $zipPath)) {
    Write-Host "ERROR: ZIP file not found. Running build first..." -ForegroundColor Red
    .\build-simple.ps1
}

if (-not (Test-Path $zipPath)) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}

# Get file info
$zipInfo = Get-Item $zipPath
$zipSize = [math]::Round($zipInfo.Length / 1KB, 2)
$checksum = (Get-FileHash $zipPath -Algorithm MD5).Hash.ToLower()

Write-Host "ZIP File: $zipSize KB" -ForegroundColor Green
Write-Host "Checksum: $checksum" -ForegroundColor Green

# Git operations
Write-Host "Starting Git upload..." -ForegroundColor Yellow

# Add all files
git add .

# Commit
$commitMsg = "Update to v1.3.5 - AV1 Edition with complete DLL ($zipSize KB)"
git commit -m $commitMsg

# Push
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

# Create tag
git tag -a v1.3.5 -m "v1.3.5 - AV1 Edition Release"
git push origin v1.3.5

Write-Host "SUCCESS: Upload completed!" -ForegroundColor Green
Write-Host "ZIP Size: $zipSize KB" -ForegroundColor Cyan
Write-Host "Checksum: $checksum" -ForegroundColor Cyan
Write-Host "Next: Create GitHub Release at:" -ForegroundColor Yellow
Write-Host "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases" -ForegroundColor White