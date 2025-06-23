# Simple GitHub Update Script
Write-Host "GitHub Update for Jellyfin AI Upscaler Plugin v1.3.1" -ForegroundColor Blue

# Check if we're in the right directory
if (-not (Test-Path "Plugin.cs")) {
    Write-Host "Error: Not in plugin directory!" -ForegroundColor Red
    exit 1
}

Write-Host "Adding all files..." -ForegroundColor Green
git add .

Write-Host "Committing changes..." -ForegroundColor Green
git commit -m "Release v1.3.1 - Cross-Platform AI Upscaling

- Full macOS support (Apple Silicon + Intel)
- Enhanced Linux compatibility
- 9 AI models available
- 50+ configuration options
- Cross-platform GPU acceleration"

Write-Host "Creating tag..." -ForegroundColor Green
git tag -d v1.3.1 2>$null
git tag -a v1.3.1 -m "v1.3.1 - Cross-Platform Release"

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push origin main
git push origin v1.3.1

Write-Host ""
Write-Host "SUCCESS! Repository updated." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Go to: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/new"
Write-Host "2. Create release with tag v1.3.1"
Write-Host "3. Upload dist/JellyfinUpscalerPlugin-v1.3.1.zip"
Write-Host "4. Update Wiki pages"