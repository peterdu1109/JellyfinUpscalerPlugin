# Jellyfin AI Upscaler Plugin - Windows Build Script
# Creates a distributable ZIP package for the plugin
# Version: 1.3.1

param(
    [string]$Version = "1.3.1",
    [string]$OutputDir = "./dist",
    [switch]$Clean,
    [switch]$Help
)

if ($Help) {
    Write-Host "Usage: .\build-windows.ps1 [options]"
    Write-Host "Options:"
    Write-Host "  -Version VERSION   Set version (default: 1.3.1)"
    Write-Host "  -OutputDir DIR     Set output directory (default: ./dist)"
    Write-Host "  -Clean             Clean output directory before build"
    Write-Host "  -Help              Show this help message"
    exit 0
}

Write-Host "🚀 Building Jellyfin AI Upscaler Plugin v$Version" -ForegroundColor Blue

# Clean output directory if requested
if ($Clean -and (Test-Path $OutputDir)) {
    Write-Host "🧹 Cleaning output directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $OutputDir
}

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

# Define files to include in the package
$FilesToInclude = @(
    "Plugin.cs",
    "PluginConfiguration.cs", 
    "AssemblyInfo.cs",
    "JellyfinUpscalerPlugin.csproj",
    "manifest.json",
    "meta.json",
    "plugin.json",
    "schema.json",
    "upscale.js",
    "userscript.js",
    "main.js",
    "LICENSE",
    "README.md",
    "CHANGELOG.md",
    "INSTALLATION.md",
    "PERFORMANCE.md",
    "TROUBLESHOOTING.md",
    "assets",
    "shaders",
    "web",
    "src",
    "Configuration",
    "wiki",
    "install-linux.sh",
    "install-macos.sh",
    "test-linux-compatibility.sh",
    "LINUX-SUPPORT-SUMMARY.md",
    "RELEASE-NOTES-$Version.md"
)

Write-Host "📦 Creating package structure..." -ForegroundColor Blue

# Create temporary build directory
$TempDir = Join-Path $OutputDir "temp"
$PackageDir = Join-Path $TempDir "JellyfinUpscalerPlugin"

if (Test-Path $TempDir) {
    Remove-Item -Recurse -Force $TempDir
}
New-Item -ItemType Directory -Path $PackageDir -Force | Out-Null

# Copy files to package directory
foreach ($item in $FilesToInclude) {
    if (Test-Path $item) {
        if ((Get-Item $item).PSIsContainer) {
            Write-Host "📁 Copying directory: $item" -ForegroundColor Green
            Copy-Item -Recurse $item $PackageDir -Force
        } else {
            Write-Host "📄 Copying file: $item" -ForegroundColor Green
            Copy-Item $item $PackageDir -Force
        }
    } else {
        Write-Host "⚠️  Warning: $item not found, skipping..." -ForegroundColor Yellow
    }
}

# Create ZIP package
$ZipPath = Join-Path $OutputDir "JellyfinUpscalerPlugin-v$Version.zip"
Write-Host "🗜️ Creating ZIP package: $ZipPath" -ForegroundColor Blue

if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
}

# Use PowerShell's Compress-Archive
try {
    $SourceItems = Get-ChildItem -Path $PackageDir
    Compress-Archive -Path $PackageDir\* -DestinationPath $ZipPath -CompressionLevel Optimal -Force
    Write-Host "✅ ZIP package created successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create ZIP package: $_" -ForegroundColor Red
    exit 1
}

# Get package info
try {
    $ZipInfo = Get-Item $ZipPath
    $SizeMB = [math]::Round($ZipInfo.Length / 1MB, 2)
    Write-Host "📏 Package size: $SizeMB MB" -ForegroundColor Cyan
} catch {
    $SizeMB = "unknown"
}

# Calculate checksums
try {
    $MD5Hash = (Get-FileHash -Path $ZipPath -Algorithm MD5).Hash.ToLower()
    $SHA256Hash = (Get-FileHash -Path $ZipPath -Algorithm SHA256).Hash.ToLower()
    Write-Host "🔐 MD5: $MD5Hash" -ForegroundColor Cyan
    Write-Host "🔐 SHA256: $SHA256Hash" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️  Warning: Could not calculate checksums" -ForegroundColor Yellow
    $MD5Hash = "unknown"
    $SHA256Hash = "unknown"
}

# Create checksums file
$ChecksumsPath = Join-Path $OutputDir "checksums.sha256"
$ZipFileName = Split-Path $ZipPath -Leaf
try {
    "$SHA256Hash  $ZipFileName" | Set-Content $ChecksumsPath -Encoding UTF8
    Write-Host "📝 Checksums file created: $ChecksumsPath" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: Could not create checksums file" -ForegroundColor Yellow
}

# Create repository manifest
$RepoManifestPath = Join-Path $OutputDir "repository-manifest.json"
$Timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

$RepoManifest = @{
    guid = "f87f700e-679d-43e6-9c7c-b3a410dc3f12"
    name = "Jellyfin AI Upscaler"
    description = "Professional AI-powered video upscaling with DLSS, FSR, XeSS, Real-ESRGAN, and multiple AI models. Cross-platform support for Windows, Linux, macOS, and Docker."
    owner = "Kuschel-code"
    category = "Video Processing" 
    versions = @(@{
        version = $Version
        targetAbi = "10.10.3.0"
        sourceUrl = "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v$Version/JellyfinUpscalerPlugin-v$Version.zip"
        checksum = $MD5Hash
        timestamp = $Timestamp
        changelog = "v$Version - Cross-platform support: Windows, Linux, macOS, Docker. 9 AI models, 50+ configuration options, enhanced performance, macOS Metal Performance Shaders."
    })
}

try {
    $RepoManifest | ConvertTo-Json -Depth 10 | Set-Content $RepoManifestPath -Encoding UTF8
    Write-Host "📋 Repository manifest created: $RepoManifestPath" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: Could not create repository manifest" -ForegroundColor Yellow
}

# Cleanup temp directory
if (Test-Path $TempDir) {
    Remove-Item -Recurse -Force $TempDir
}

# Final summary
Write-Host ""
Write-Host "✨ Build completed successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "📦 Package: $ZipPath" -ForegroundColor Cyan
Write-Host "📏 Size: $SizeMB MB" -ForegroundColor Cyan
Write-Host "🔐 MD5: $MD5Hash" -ForegroundColor Cyan
Write-Host "🔐 SHA256: $SHA256Hash" -ForegroundColor Cyan
Write-Host "📋 Manifest: $RepoManifestPath" -ForegroundColor Cyan
if (Test-Path $ChecksumsPath) {
    Write-Host "📝 Checksums: $ChecksumsPath" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎯 Next Steps for Release v$Version:" -ForegroundColor Blue
Write-Host "1. 📤 Upload to GitHub: gh release create v$Version $ZipPath"
Write-Host "2. 🏷️ Tag release: git tag v$Version && git push origin v$Version"
Write-Host "3. 📚 Update Wiki documentation"
Write-Host "4. 🔄 Update repository manifest with new URL"
Write-Host "5. 📢 Announce release in discussions"

Write-Host ""
Write-Host "🌟 Ready for cross-platform release!" -ForegroundColor Green