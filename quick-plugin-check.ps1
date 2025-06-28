# Quick Plugin Check v1.3.5
Write-Host "🔍 Quick Plugin Check for v1.3.5..." -ForegroundColor Cyan

$pluginPath = "c:/Users/Kitty/Desktop/Jellyfin upgrade/JellyfinUpscalerPlugin-v1.3.5"

# Critical files check
$files = @("Plugin.cs", "PluginConfiguration.cs", "AV1VideoProcessor.cs", "manifest.json", "web/configurationpage.html")
$allGood = $true

foreach ($file in $files) {
    if (Test-Path (Join-Path $pluginPath $file)) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file" -ForegroundColor Red
        $allGood = $false
    }
}

# Check manifest version
try {
    $manifest = Get-Content (Join-Path $pluginPath "manifest.json") -Raw | ConvertFrom-Json
    if ($manifest[0].versions[0].version -eq "1.3.5") {
        Write-Host "✅ Manifest version 1.3.5" -ForegroundColor Green
    } else {
        Write-Host "❌ Wrong version in manifest" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "❌ Manifest parsing error" -ForegroundColor Red
    $allGood = $false
}

if ($allGood) {
    Write-Host "`n🎉 Plugin looks good! Ready for upload." -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Issues found. Review before upload." -ForegroundColor Yellow
}