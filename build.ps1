# Jellyfin AI Upscaler Plugin v1.3.6 ULTIMATE - Windows Build Script
# Creates a distributable ZIP package for the plugin
# Version: 1.3.6 ULTIMATE

param(
    [string]$Version = "1.3.6",
    [string]$OutputDir = ".\dist",
    [switch]$Clean = $false,
    [switch]$Help
)

if ($Help) {
    Write-Host "🚀 AI Upscaler Plugin v1.3.6 ULTIMATE - Build Script"
    Write-Host "Usage: .\build.ps1 [options]"
    Write-Host "Options:"
    Write-Host "  -Version VERSION   Set version (default: 1.3.6)"
    Write-Host "  -OutputDir DIR     Set output directory (default: .\dist)"
    Write-Host "  -Clean             Clean output directory before build"
    Write-Host "  -Help              Show this help message"
    exit 0
}

Write-Host "🚀 Building Jellyfin AI Upscaler Plugin v$Version" -ForegroundColor Blue

# Clean output directory if requested
if ($Clean -and (Test-Path $OutputDir)) {
    Write-Host "🧹 Cleaning output directory..." -ForegroundColor Yellow
    Remove-Item -Path $OutputDir -Recurse -Force
}

# Create output directory
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Define files to include in the package
$FilesToInclude = @(
    "manifest.json",
    "schema.json", 
    "upscale.js",
    "LICENSE",
    "README.md",
    "CHANGELOG.md",
    "INSTALLATION.md",
    "PERFORMANCE.md",
    "assets\*",
    "shaders\*"
)

# Define files to exclude
$FilesToExclude = @(
    "build.ps1",
    "build.sh",
    ".git*",
    "*.zip",
    "dist\*",
    "node_modules\*",
    "*.log",
    "*.tmp"
)

Write-Host "📦 Creating package structure..." -ForegroundColor Cyan

# Create temporary build directory
$TempDir = Join-Path $OutputDir "temp"
$PackageDir = Join-Path $TempDir "JellyfinUpscalerPlugin"

if (Test-Path $TempDir) {
    Remove-Item -Path $TempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $PackageDir -Force | Out-Null

# Copy files to package directory
foreach ($Pattern in $FilesToInclude) {
    $SourceFiles = Get-ChildItem -Path $Pattern -ErrorAction SilentlyContinue
    foreach ($File in $SourceFiles) {
        if ($File.PSIsContainer) {
            # Directory
            $DestDir = Join-Path $PackageDir $File.Name
            Write-Host "📁 Copying directory: $($File.Name)" -ForegroundColor Gray
            Copy-Item -Path $File.FullName -Destination $DestDir -Recurse -Force
        } else {
            # File
            Write-Host "📄 Copying file: $($File.Name)" -ForegroundColor Gray
            Copy-Item -Path $File.FullName -Destination $PackageDir -Force
        }
    }
}

# Verify manifest.json
$ManifestPath = Join-Path $PackageDir "manifest.json"
if (Test-Path $ManifestPath) {
    try {
        $Manifest = Get-Content $ManifestPath | ConvertFrom-Json
        $ManifestVersion = $Manifest[0].versions[0].version
        Write-Host "✅ Manifest version: $ManifestVersion" -ForegroundColor Green
        
        if ($ManifestVersion -ne $Version) {
            Write-Warning "Version mismatch: Script=$Version, Manifest=$ManifestVersion"
        }
    } catch {
        Write-Error "❌ Invalid manifest.json: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Error "❌ manifest.json not found!"
    exit 1
}

# Create ZIP package
$ZipPath = Join-Path $OutputDir "JellyfinUpscalerPlugin-v$Version.zip"
Write-Host "🗜️ Creating ZIP package: $ZipPath" -ForegroundColor Cyan

if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
}

# Use PowerShell compression
Compress-Archive -Path "$PackageDir\*" -DestinationPath $ZipPath -CompressionLevel Optimal

# Calculate checksum
$Hash = Get-FileHash -Path $ZipPath -Algorithm MD5
Write-Host "🔐 Package checksum (MD5): $($Hash.Hash.ToLower())" -ForegroundColor Magenta

# Get package size
$Size = Get-Item $ZipPath | Select-Object -ExpandProperty Length
$SizeMB = [math]::Round($Size / 1MB, 2)
Write-Host "📏 Package size: ${SizeMB} MB" -ForegroundColor Blue

# Cleanup temp directory
Remove-Item -Path $TempDir -Recurse -Force

# Create manifest for repository
$RepoManifest = @{
    guid = "f87f700e-679d-43e6-9c7c-b3a410dc3f12"
    name = "Jellyfin Upscaler"
    description = "Enhance video quality with real-time upscaling for supported devices."
    owner = "Kuschel-code"
    category = "Video Processing"
    versions = @(
        @{
            version = $Version
            targetAbi = "10.10.3.0"
            sourceUrl = "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v$Version/JellyfinUpscalerPlugin-v$Version.zip"
            checksum = $Hash.Hash.ToLower()
            timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
            changelog = "Enhanced shaders, performance optimization, adaptive quality system, comprehensive documentation"
        }
    )
}

$RepoManifestPath = Join-Path $OutputDir "repository-manifest.json"
$RepoManifest | ConvertTo-Json -Depth 10 | Out-File -FilePath $RepoManifestPath -Encoding UTF8
Write-Host "📋 Repository manifest created: $RepoManifestPath" -ForegroundColor Green

# Summary
Write-Host "`n✨ Build completed successfully!" -ForegroundColor Green
Write-Host "📦 Package: $ZipPath" -ForegroundColor White
Write-Host "🔐 Checksum: $($Hash.Hash.ToLower())" -ForegroundColor White
Write-Host "📏 Size: ${SizeMB} MB" -ForegroundColor White
Write-Host "📋 Repository manifest: $RepoManifestPath" -ForegroundColor White

# Instructions
Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Upload $ZipPath to GitHub Releases" -ForegroundColor Gray
Write-Host "2. Update repository manifest with the new checksum" -ForegroundColor Gray
Write-Host "3. Tag the release: git tag v$Version && git push origin v$Version" -ForegroundColor Gray
Write-Host "4. Create GitHub release with changelog" -ForegroundColor Gray