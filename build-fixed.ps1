# Jellyfin AI Upscaler Plugin - FIXED Build Script
# Version: 1.3.6.5 - Serialization Fixed Edition

param(
    [string]$Version = "1.3.6.5",
    [string]$OutputDir = ".\release-build",
    [switch]$Clean = $true,
    [switch]$CreateZip = $true,
    [switch]$UpdateChecksums = $true,
    [switch]$Verbose = $false,
    [switch]$Help
)

if ($Help) {
    Write-Host "🛠️ AI Upscaler Plugin v1.3.6.5 - SERIALIZATION FIXED Build Script" -ForegroundColor Blue
    Write-Host "Usage: .\build-fixed.ps1 [options]"
    Write-Host "Options:"
    Write-Host "  -Version VERSION      Set version (default: 1.3.6.5)"
    Write-Host "  -OutputDir DIR        Set output directory (default: .\release-build)"
    Write-Host "  -Clean                Clean output directory before build"
    Write-Host "  -CreateZip            Create ZIP package"
    Write-Host "  -UpdateChecksums      Update checksums in manifest"
    Write-Host "  -Verbose              Enable verbose logging"
    Write-Host "  -Help                 Show this help message"
    exit 0
}

Write-Host "🛠️ Building Jellyfin AI Upscaler Plugin v$Version (FIXED)" -ForegroundColor Blue

# Clean output directory
if ($Clean -and (Test-Path $OutputDir)) {
    Write-Host "🧹 Cleaning output directory..." -ForegroundColor Yellow
    Remove-Item -Path $OutputDir -Recurse -Force
}

# Create output directory
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

Write-Host "📦 Building plugin package..." -ForegroundColor Cyan

# Build the .NET project
Write-Host "🔨 Building .NET project..." -ForegroundColor Gray
try {
    dotnet publish JellyfinUpscalerPlugin.csproj -c Release -o $OutputDir --no-self-contained
    Write-Host "✅ .NET build successful" -ForegroundColor Green
} catch {
    Write-Host "❌ .NET build failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Copy additional files
Write-Host "📁 Copying additional files..." -ForegroundColor Gray

# Copy fixed configuration files
if (Test-Path "meta-fixed.json") {
    Copy-Item "meta-fixed.json" (Join-Path $OutputDir "meta.json") -Force
    Write-Host "✅ Copied meta.json" -ForegroundColor Green
}

if (Test-Path "manifest-fixed.json") {
    Copy-Item "manifest-fixed.json" (Join-Path $OutputDir "manifest.json") -Force
    Write-Host "✅ Copied manifest.json" -ForegroundColor Green
}

# Copy web files
if (Test-Path "web") {
    Copy-Item "web" (Join-Path $OutputDir "web") -Recurse -Force
    Write-Host "✅ Copied web files" -ForegroundColor Green
}

# Copy configuration files
if (Test-Path "Configuration") {
    Copy-Item "Configuration" (Join-Path $OutputDir "Configuration") -Recurse -Force
    Write-Host "✅ Copied Configuration files" -ForegroundColor Green
}

# Copy shaders
if (Test-Path "shaders") {
    Copy-Item "shaders" (Join-Path $OutputDir "shaders") -Recurse -Force
    Write-Host "✅ Copied shaders" -ForegroundColor Green
}

# Copy other necessary files
$FilesToCopy = @(
    "README.md",
    "LICENSE",
    "CHANGELOG.md"
)

foreach ($File in $FilesToCopy) {
    if (Test-Path $File) {
        Copy-Item $File (Join-Path $OutputDir $File) -Force
        Write-Host "✅ Copied $File" -ForegroundColor Green
    }
}

# Create ZIP package if requested
if ($CreateZip) {
    Write-Host "🗜️ Creating ZIP package..." -ForegroundColor Cyan
    
    $ZipPath = ".\JellyfinUpscalerPlugin-v$Version-Fixed.zip"
    
    if (Test-Path $ZipPath) {
        Remove-Item $ZipPath -Force
    }
    
    try {
        Compress-Archive -Path "$OutputDir\*" -DestinationPath $ZipPath -CompressionLevel Optimal
        Write-Host "✅ ZIP package created: $ZipPath" -ForegroundColor Green
        
        # Calculate and display checksum
        $Hash = Get-FileHash -Path $ZipPath -Algorithm MD5
        Write-Host "🔐 Package checksum (MD5): $($Hash.Hash)" -ForegroundColor Magenta
        
        # Get package size
        $Size = Get-Item $ZipPath | Select-Object -ExpandProperty Length
        $SizeMB = [math]::Round($Size / 1MB, 2)
        Write-Host "📏 Package size: ${SizeMB} MB" -ForegroundColor Blue
        
        # Update checksums in manifest if requested
        if ($UpdateChecksums) {
            Write-Host "🔄 Updating checksums in manifest..." -ForegroundColor Yellow
            
            $ManifestPath = Join-Path $OutputDir "manifest.json"
            if (Test-Path $ManifestPath) {
                try {
                    $ManifestContent = Get-Content $ManifestPath -Raw | ConvertFrom-Json
                    
                    # Update checksum for current version
                    $CurrentVersion = $ManifestContent.versions | Where-Object { $_.version -eq $Version }
                    if ($CurrentVersion) {
                        $CurrentVersion.checksum = $Hash.Hash
                        Write-Host "✅ Updated checksum for version $Version" -ForegroundColor Green
                    }
                    
                    # Save updated manifest
                    $ManifestContent | ConvertTo-Json -Depth 10 | Set-Content $ManifestPath -Encoding UTF8
                    Write-Host "✅ Manifest updated with new checksum" -ForegroundColor Green
                } catch {
                    Write-Host "⚠️ Could not update manifest checksum: $($_.Exception.Message)" -ForegroundColor Yellow
                }
            }
        }
        
    } catch {
        Write-Host "❌ Failed to create ZIP package: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Validate build
Write-Host "🔍 Validating build..." -ForegroundColor Cyan

# Check for required files
$RequiredFiles = @(
    "JellyfinUpscalerPlugin.dll",
    "meta.json"
)

$ValidationPassed = $true
foreach ($File in $RequiredFiles) {
    $FilePath = Join-Path $OutputDir $File
    if (Test-Path $FilePath) {
        Write-Host "✅ Found required file: $File" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing required file: $File" -ForegroundColor Red
        $ValidationPassed = $false
    }
}

# Validate meta.json
$MetaPath = Join-Path $OutputDir "meta.json"
if (Test-Path $MetaPath) {
    try {
        $MetaContent = Get-Content $MetaPath -Raw | ConvertFrom-Json
        Write-Host "✅ meta.json is valid JSON" -ForegroundColor Green
        Write-Host "📋 Plugin Name: $($MetaContent.name)" -ForegroundColor White
        Write-Host "📋 Plugin Version: $($MetaContent.version)" -ForegroundColor White
        Write-Host "📋 Plugin GUID: $($MetaContent.guid)" -ForegroundColor White
    } catch {
        Write-Host "❌ meta.json is invalid: $($_.Exception.Message)" -ForegroundColor Red
        $ValidationPassed = $false
    }
}

if ($ValidationPassed) {
    Write-Host "`n✨ Build completed successfully!" -ForegroundColor Green
    Write-Host "📦 Build output: $OutputDir" -ForegroundColor White
    if ($CreateZip) {
        Write-Host "📦 ZIP package: $ZipPath" -ForegroundColor White
        Write-Host "🔐 MD5 checksum: $($Hash.Hash)" -ForegroundColor White
    }
    
    Write-Host "`n🎯 Next steps for fixing the plugin:" -ForegroundColor Yellow
    Write-Host "1. Test the plugin locally by copying to Jellyfin plugins folder" -ForegroundColor Gray
    Write-Host "2. Upload the ZIP file to GitHub releases" -ForegroundColor Gray
    Write-Host "3. Update the repository manifest with the new checksum" -ForegroundColor Gray
    Write-Host "4. Test installation from plugin catalog" -ForegroundColor Gray
    
    Write-Host "`n🔧 Installation instructions:" -ForegroundColor Yellow
    Write-Host "1. Stop Jellyfin service" -ForegroundColor Gray
    Write-Host "2. Copy files from '$OutputDir' to Jellyfin plugins folder" -ForegroundColor Gray
    Write-Host "3. Start Jellyfin service" -ForegroundColor Gray
    Write-Host "4. Configure plugin in Jellyfin Dashboard > Plugins" -ForegroundColor Gray
    
} else {
    Write-Host "`n❌ Build validation failed! Please check the errors above." -ForegroundColor Red
    exit 1
}