# Jellyfin AI Upscaler Plugin - Windows Build Script
# Version: 1.3.1

param(
    [string]$Version = "1.3.1",
    [string]$OutputDir = "./dist",
    [switch]$Clean
)

Write-Host "Building Jellyfin AI Upscaler Plugin v$Version" -ForegroundColor Blue

# Clean output directory if requested
if ($Clean -and (Test-Path $OutputDir)) {
    Write-Host "Cleaning output directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $OutputDir
}

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

# Define files to include
$FilesToInclude = @(
    "Plugin.cs",
    "PluginConfiguration.cs", 
    "manifest.json",
    "LICENSE",
    "README.md",
    "CHANGELOG.md",
    "install-linux.sh",
    "install-macos.sh",
    "RELEASE-NOTES-1.3.1.md"
)

Write-Host "Creating package structure..." -ForegroundColor Blue

# Create temp directory
$TempDir = Join-Path $OutputDir "temp"
$PackageDir = Join-Path $TempDir "JellyfinUpscalerPlugin"

if (Test-Path $TempDir) {
    Remove-Item -Recurse -Force $TempDir
}
New-Item -ItemType Directory -Path $PackageDir -Force | Out-Null

# Copy files
foreach ($item in $FilesToInclude) {
    if (Test-Path $item) {
        Write-Host "Copying: $item" -ForegroundColor Green
        if ((Get-Item $item).PSIsContainer) {
            Copy-Item -Recurse $item $PackageDir -Force
        } else {
            Copy-Item $item $PackageDir -Force
        }
    } else {
        Write-Host "Warning: $item not found" -ForegroundColor Yellow
    }
}

# Copy directories
$DirsToInclude = @("assets", "shaders", "web", "Configuration", "wiki")
foreach ($dir in $DirsToInclude) {
    if (Test-Path $dir) {
        Write-Host "Copying directory: $dir" -ForegroundColor Green
        Copy-Item -Recurse $dir $PackageDir -Force
    }
}

# Create ZIP
$ZipPath = Join-Path $OutputDir "JellyfinUpscalerPlugin-v$Version.zip"
Write-Host "Creating ZIP: $ZipPath" -ForegroundColor Blue

if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
}

Compress-Archive -Path "$PackageDir\*" -DestinationPath $ZipPath -CompressionLevel Optimal -Force

# Get size
$ZipInfo = Get-Item $ZipPath
$SizeMB = [math]::Round($ZipInfo.Length / 1MB, 2)

# Get checksums
$MD5Hash = (Get-FileHash -Path $ZipPath -Algorithm MD5).Hash.ToLower()
$SHA256Hash = (Get-FileHash -Path $ZipPath -Algorithm SHA256).Hash.ToLower()

# Create checksums file
$ChecksumsPath = Join-Path $OutputDir "checksums.txt"
@"
JellyfinUpscalerPlugin-v$Version.zip
Size: $SizeMB MB
MD5: $MD5Hash
SHA256: $SHA256Hash
"@ | Set-Content $ChecksumsPath

# Cleanup
Remove-Item -Recurse -Force $TempDir

Write-Host ""
Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "Package: $ZipPath" -ForegroundColor Cyan
Write-Host "Size: $SizeMB MB" -ForegroundColor Cyan
Write-Host "MD5: $MD5Hash" -ForegroundColor Cyan

Write-Host ""
Write-Host "Ready for GitHub release v$Version!" -ForegroundColor Green