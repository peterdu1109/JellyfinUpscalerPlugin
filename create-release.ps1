# Automatisches GitHub Release erstellen
# Benötigt GitHub CLI (gh): https://cli.github.com/

$Version = "1.3.6-ultimate"
$Title = "🚀 AI Upscaler Plugin v1.3.6 ULTIMATE - 12 Revolutionary Manager Classes"
$ZipFile = "dist\JellyfinUpscalerPlugin-v1.3.6-Ultimate.zip"
$NotesFile = "GITHUB-RELEASE-DESCRIPTION.txt"

Write-Host "Creating GitHub Release v$Version..." -ForegroundColor Cyan

# Check if GitHub CLI is installed
try {
    gh --version | Out-Null
} catch {
    Write-Host "ERROR: GitHub CLI not installed!" -ForegroundColor Red
    Write-Host "Please install from: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host "Or create the release manually on GitHub." -ForegroundColor Yellow
    exit 1
}

# Check if logged in
try {
    gh auth status | Out-Null
} catch {
    Write-Host "Please login to GitHub first:" -ForegroundColor Yellow
    Write-Host "gh auth login" -ForegroundColor Cyan
    exit 1
}

# Create release
Write-Host "Creating release..." -ForegroundColor Yellow

gh release create "v$Version" `
    --title "$Title" `
    --notes-file "$NotesFile" `
    --latest `
    "$ZipFile" `
    "dist\SHA256SUMS.txt" `
    "dist\RELEASE-NOTES-v1.3.6.md"

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS! Release created!" -ForegroundColor Green
    Write-Host "Visit: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases" -ForegroundColor Cyan
} else {
    Write-Host "ERROR: Release creation failed!" -ForegroundColor Red
    Write-Host "Please create manually on GitHub." -ForegroundColor Yellow
}