# Windows Compatibility Test Script

Write-Host "🪟 Windows Compatibility Test for AI Upscaler Plugin v1.3.6" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan

# Check .NET 8.0
Write-Host "Checking .NET version..." -ForegroundColor Yellow
dotnet --version

# Check if plugin builds
Write-Host "Testing plugin build..." -ForegroundColor Yellow
dotnet build --configuration Release

# Check DLL
$DllPath = "bin\Release\net8.0\JellyfinUpscalerPlugin.dll"
if (Test-Path $DllPath) {
    $Size = (Get-Item $DllPath).Length
    Write-Host "✅ Plugin DLL created successfully" -ForegroundColor Green
    Write-Host "Size: $Size bytes" -ForegroundColor Gray
} else {
    Write-Host "❌ Plugin DLL not found" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Windows compatibility test passed!" -ForegroundColor Green