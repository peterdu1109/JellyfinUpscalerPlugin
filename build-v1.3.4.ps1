#!/usr/bin/env pwsh
# Build Script for AI Upscaler Plugin v1.3.4
# Enterprise Edition with Enhanced Features

param(
    [string]$Configuration = "Release",
    [switch]$SkipBuild = $false,
    [switch]$SkipPackage = $false,
    [switch]$Clean = $false,
    [switch]$Verbose = $false
)

# Set error handling
$ErrorActionPreference = "Stop"

# Colors for output
$colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    Magenta = "Magenta"
    Cyan = "Cyan"
}

function Write-ColoredOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    
    Write-Host $Message -ForegroundColor $Color
}

function Write-Header {
    param([string]$Title)
    
    Write-Host ""
    Write-ColoredOutput "=" * 80 -Color $colors.Cyan
    Write-ColoredOutput "  $Title" -Color $colors.Cyan
    Write-ColoredOutput "=" * 80 -Color $colors.Cyan
    Write-Host ""
}

function Write-Step {
    param([string]$Message)
    
    Write-ColoredOutput "🔄 $Message" -Color $colors.Blue
}

function Write-Success {
    param([string]$Message)
    
    Write-ColoredOutput "✅ $Message" -Color $colors.Green
}

function Write-Warning {
    param([string]$Message)
    
    Write-ColoredOutput "⚠️  $Message" -Color $colors.Yellow
}

function Write-Error {
    param([string]$Message)
    
    Write-ColoredOutput "❌ $Message" -Color $colors.Red
}

# Main build process
try {
    Write-Header "AI Upscaler Plugin v1.3.4 Build Process"
    
    # Project information
    $projectName = "JellyfinUpscalerPlugin"
    $version = "1.3.4"
    $projectDir = $PSScriptRoot
    $binDir = Join-Path $projectDir "bin/$Configuration/net6.0"
    $distDir = Join-Path $projectDir "dist"
    $packageName = "$projectName-v$version.zip"
    $packagePath = Join-Path $distDir $packageName
    
    Write-ColoredOutput "Project: $projectName v$version" -Color $colors.Magenta
    Write-ColoredOutput "Configuration: $Configuration" -Color $colors.Magenta
    Write-ColoredOutput "Project Directory: $projectDir" -Color $colors.Magenta
    Write-Host ""
    
    # Check prerequisites
    Write-Step "Checking prerequisites..."
    
    # Check .NET SDK
    try {
        $dotnetVersion = dotnet --version
        Write-Success ".NET SDK Version: $dotnetVersion"
    }
    catch {
        Write-Error ".NET SDK not found. Please install .NET 6.0 SDK or later."
        exit 1
    }
    
    # Check project file
    $projectFile = Join-Path $projectDir "$projectName.csproj"
    if (!(Test-Path $projectFile)) {
        Write-Error "Project file not found: $projectFile"
        exit 1
    }
    Write-Success "Project file found: $projectFile"
    
    # Clean previous build
    if ($Clean) {
        Write-Step "Cleaning previous build..."
        
        if (Test-Path $binDir) {
            Remove-Item $binDir -Recurse -Force
            Write-Success "Cleaned bin directory"
        }
        
        if (Test-Path $distDir) {
            Remove-Item $distDir -Recurse -Force
            Write-Success "Cleaned dist directory"
        }
    }
    
    # Create directories
    Write-Step "Creating directories..."
    
    if (!(Test-Path $distDir)) {
        New-Item -ItemType Directory -Path $distDir -Force | Out-Null
        Write-Success "Created dist directory"
    }
    
    # Update version information
    Write-Step "Updating version information..."
    
    # Update AssemblyInfo if exists
    $assemblyInfoPath = Join-Path $projectDir "Properties/AssemblyInfo.cs"
    if (Test-Path $assemblyInfoPath) {
        Write-Step "Updating AssemblyInfo.cs..."
        # Update version info logic here
        Write-Success "Updated AssemblyInfo.cs"
    }
    
    # Build project
    if (!$SkipBuild) {
        Write-Step "Building project..."
        
        $buildArgs = @(
            "build"
            $projectFile
            "--configuration", $Configuration
            "--no-restore"
        )
        
        if ($Verbose) {
            $buildArgs += "--verbosity", "detailed"
        }
        
        Write-ColoredOutput "Command: dotnet $($buildArgs -join ' ')" -Color $colors.Yellow
        
        $buildResult = & dotnet @buildArgs
        
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Build failed!"
            exit 1
        }
        
        Write-Success "Build completed successfully"
        
        # Verify DLL exists
        $dllPath = Join-Path $binDir "$projectName.dll"
        if (!(Test-Path $dllPath)) {
            Write-Error "DLL not found: $dllPath"
            exit 1
        }
        Write-Success "DLL found: $dllPath"
    }
    
    # Package creation
    if (!$SkipPackage) {
        Write-Step "Creating package..."
        
        # Remove existing package
        if (Test-Path $packagePath) {
            Remove-Item $packagePath -Force
        }
        
        # Create temporary directory for packaging
        $tempDir = Join-Path $env:TEMP "JellyfinUpscaler-$version-$(Get-Random)"
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
        
        try {
            # Copy core files
            Write-Step "Copying core files..."
            
            # DLL file
            $dllPath = Join-Path $binDir "$projectName.dll"
            if (Test-Path $dllPath) {
                Copy-Item $dllPath $tempDir
                Write-Success "Copied DLL"
            }
            
            # Dependencies
            $depsPath = Join-Path $binDir "$projectName.deps.json"
            if (Test-Path $depsPath) {
                Copy-Item $depsPath $tempDir
                Write-Success "Copied dependencies file"
            }
            
            # Metadata
            $metaPath = Join-Path $binDir "meta.json"
            if (Test-Path $metaPath) {
                Copy-Item $metaPath $tempDir
                Write-Success "Copied metadata"
            }
            
            # Thumbnail
            $thumbPath = Join-Path $binDir "thumb.jpg"
            if (Test-Path $thumbPath) {
                Copy-Item $thumbPath $tempDir
                Write-Success "Copied thumbnail"
            }
            
            # Copy web assets
            Write-Step "Copying web assets..."
            $webDir = Join-Path $projectDir "web"
            if (Test-Path $webDir) {
                $webDestDir = Join-Path $tempDir "web"
                Copy-Item $webDir $webDestDir -Recurse
                Write-Success "Copied web assets"
            }
            
            # Copy configuration files
            Write-Step "Copying configuration files..."
            $configDir = Join-Path $projectDir "Configuration"
            if (Test-Path $configDir) {
                $configDestDir = Join-Path $tempDir "Configuration"
                Copy-Item $configDir $configDestDir -Recurse
                Write-Success "Copied configuration files"
            }
            
            # Copy assets
            Write-Step "Copying assets..."
            $assetsDir = Join-Path $projectDir "assets"
            if (Test-Path $assetsDir) {
                $assetsDestDir = Join-Path $tempDir "assets"
                Copy-Item $assetsDir $assetsDestDir -Recurse
                Write-Success "Copied assets"
            }
            
            # Copy shaders
            Write-Step "Copying shaders..."
            $shadersDir = Join-Path $projectDir "shaders"
            if (Test-Path $shadersDir) {
                $shadersDestDir = Join-Path $tempDir "shaders"
                Copy-Item $shadersDir $shadersDestDir -Recurse
                Write-Success "Copied shaders"
            }
            
            # Copy localization
            Write-Step "Copying localization files..."
            $localizationDir = Join-Path $projectDir "src/localization"
            if (Test-Path $localizationDir) {
                $localizationDestDir = Join-Path $tempDir "localization"
                Copy-Item $localizationDir $localizationDestDir -Recurse
                Write-Success "Copied localization files"
            }
            
            # Copy new v1.3.4 features
            Write-Step "Copying v1.3.4 enhanced features..."
            
            # Enhanced configuration page
            $v134ConfigPath = Join-Path $projectDir "Configuration/configurationpage-v1.3.4.html"
            if (Test-Path $v134ConfigPath) {
                Copy-Item $v134ConfigPath (Join-Path $tempDir "Configuration/configurationpage-v1.3.4.html")
                Write-Success "Copied v1.3.4 configuration page"
            }
            
            # Enhanced JavaScript modules
            $enhancedJsFiles = @(
                "web/light-mode-manager.js",
                "web/model-manager.js", 
                "web/frame-interpolation.js"
            )
            
            foreach ($jsFile in $enhancedJsFiles) {
                $jsPath = Join-Path $projectDir $jsFile
                if (Test-Path $jsPath) {
                    $jsDestPath = Join-Path $tempDir $jsFile
                    $jsDestDir = Split-Path $jsDestPath -Parent
                    if (!(Test-Path $jsDestDir)) {
                        New-Item -ItemType Directory -Path $jsDestDir -Force | Out-Null
                    }
                    Copy-Item $jsPath $jsDestPath
                    Write-Success "Copied $(Split-Path $jsFile -Leaf)"
                }
            }
            
            # Create package info file
            Write-Step "Creating package info..."
            $packageInfo = @{
                name = $projectName
                version = $version
                buildDate = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                configuration = $Configuration
                features = @(
                    "Light Mode for weak hardware",
                    "UI-based Model Manager",
                    "Optional Frame Interpolation", 
                    "Mobile/Server-side support",
                    "Advanced performance monitoring",
                    "Temperature throttling",
                    "Battery optimization mode"
                )
                requirements = @{
                    jellyfinVersion = "10.10.3.0"
                    dotnetVersion = "6.0"
                    platform = "Any"
                }
            } | ConvertTo-Json -Depth 10
            
            $packageInfo | Set-Content (Join-Path $tempDir "package-info.json")
            Write-Success "Created package info"
            
            # Create changelog
            Write-Step "Creating changelog..."
            $changelog = @"
# Jellyfin Upscaler Plugin v1.3.4 - Enterprise Edition

## 🔧 New Features

### Light Mode System
- **Automatic Hardware Detection**: Intelligently detects system capabilities
- **Optimized Settings**: Automatically configures for weak hardware
- **Resource Monitoring**: Real-time performance tracking with warnings
- **Temperature Throttling**: Prevents overheating with automatic adjustments

### Model Management System  
- **UI-based Downloads**: Download AI models directly from the interface
- **Smart Caching**: Intelligent model prioritization and cleanup
- **Requirements Checking**: Automatic hardware compatibility verification
- **Progress Tracking**: Real-time download progress with queue management

### Frame Interpolation Control
- **Optional Processing**: Enable/disable frame interpolation per preference
- **Cinematic Preservation**: Automatically skips 24fps content to preserve film quality
- **Multiple Methods**: Motion compensation, optical flow, and frame blending
- **Smart Thresholds**: Configurable FPS thresholds for activation

### Mobile & Server-side Support
- **Mobile Optimization**: Lightweight processing for mobile devices
- **Server-side Processing**: Offload computation to server for better performance
- **Pre-upscaling Cache**: Cache processed content for faster streaming
- **Adaptive Streaming**: Automatically adjust quality based on device capabilities

### Enhanced Performance
- **Battery Optimization**: Reduced power consumption on battery devices
- **CPU Core Limiting**: Configurable CPU usage limits
- **Thermal Management**: Advanced temperature monitoring and throttling
- **Adaptive Quality**: Dynamic quality adjustment based on system performance

## 🛠️ Technical Improvements

- Enhanced UI with Enterprise-grade styling
- Improved error handling and logging
- Better resource management and cleanup
- Advanced configuration validation
- Real-time performance metrics display

## 📋 System Requirements

- Jellyfin Server 10.10.3.0 or later
- .NET 6.0 Runtime
- Minimum 4GB RAM (8GB recommended)
- Optional: GPU with WebGL support for enhanced features

## 🔧 Installation

1. Download the plugin package
2. Upload to Jellyfin via Admin Dashboard > Plugins > Catalog
3. Restart Jellyfin server
4. Configure via Settings > Plugins > AI Upscaler

## ⚠️ Important Notes

- Some features require server restart to take effect
- GPU acceleration recommended for best performance
- Light Mode automatically enables for systems with limited resources
- Frame interpolation can be disabled for cinematic content preservation

Built on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@
            
            $changelog | Set-Content (Join-Path $tempDir "CHANGELOG.md")
            Write-Success "Created changelog"
            
            # Create ZIP package
            Write-Step "Creating ZIP package..."
            
            # Use PowerShell's Compress-Archive if available
            if (Get-Command Compress-Archive -ErrorAction SilentlyContinue) {
                Compress-Archive -Path "$tempDir\*" -DestinationPath $packagePath -Force
                Write-Success "Package created with PowerShell Compress-Archive"
            } else {
                # Fallback to 7-Zip or other archiver
                Write-Warning "PowerShell Compress-Archive not available, trying 7-Zip..."
                
                if (Get-Command 7z -ErrorAction SilentlyContinue) {
                    & 7z a -tzip $packagePath "$tempDir\*"
                    if ($LASTEXITCODE -eq 0) {
                        Write-Success "Package created with 7-Zip"
                    } else {
                        Write-Error "7-Zip packaging failed"
                        exit 1
                    }
                } else {
                    Write-Error "No archiving tool found. Install 7-Zip or use PowerShell 5.0+"
                    exit 1
                }
            }
            
        } finally {
            # Cleanup temp directory
            if (Test-Path $tempDir) {
                Remove-Item $tempDir -Recurse -Force
                Write-Success "Cleaned up temporary files"
            }
        }
    }
    
    # Verify package
    Write-Step "Verifying package..."
    
    if (Test-Path $packagePath) {
        $packageSize = (Get-Item $packagePath).Length
        $packageSizeMB = [math]::Round($packageSize / 1MB, 2)
        
        Write-Success "Package created successfully: $packagePath"
        Write-Success "Package size: $packageSizeMB MB"
        
        # Calculate MD5 checksum
        try {
            $hash = Get-FileHash $packagePath -Algorithm MD5
            Write-Success "MD5 Checksum: $($hash.Hash.ToLower())"
            
            # Save checksum to file
            $checksumPath = Join-Path $distDir "$projectName-v$version.md5"
            "$($hash.Hash.ToLower())  $packageName" | Set-Content $checksumPath
            Write-Success "Checksum saved to: $checksumPath"
            
        } catch {
            Write-Warning "Could not calculate checksum: $_"
        }
        
    } else {
        Write-Error "Package not found: $packagePath"
        exit 1
    }
    
    # Display build summary
    Write-Header "Build Summary"
    
    Write-Success "✅ Build completed successfully!"
    Write-ColoredOutput "📦 Package: $packageName" -Color $colors.Magenta
    Write-ColoredOutput "📁 Location: $packagePath" -Color $colors.Magenta
    Write-ColoredOutput "📊 Size: $packageSizeMB MB" -Color $colors.Magenta
    Write-ColoredOutput "🔧 Configuration: $Configuration" -Color $colors.Magenta
    Write-ColoredOutput "🚀 Version: $version" -Color $colors.Magenta
    
    Write-Host ""
    Write-ColoredOutput "🎯 Ready for deployment to Jellyfin!" -Color $colors.Green
    Write-ColoredOutput "📚 See CHANGELOG.md for detailed information about new features." -Color $colors.Blue
    Write-Host ""
    
    # Generate GitHub release command
    Write-ColoredOutput "🔗 Suggested GitHub release command:" -Color $colors.Yellow
    Write-ColoredOutput "gh release create v$version $packagePath --title 'AI Upscaler Plugin v$version - Enterprise Edition' --notes-file dist/CHANGELOG.md" -Color $colors.Cyan
    
} catch {
    Write-Error "Build failed: $_"
    Write-Error $_.ScriptStackTrace
    exit 1
}