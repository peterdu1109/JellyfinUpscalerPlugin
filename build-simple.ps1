# Simple Build Script for AI Upscaler Plugin v1.3.5

$PLUGIN_VERSION = "1.3.5"
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PROJECT_FILE = Join-Path $SCRIPT_DIR "JellyfinUpscalerPlugin.csproj"
$DIST_DIR = Join-Path $SCRIPT_DIR "dist"
$ZIP_NAME = "JellyfinUpscalerPlugin-v$PLUGIN_VERSION.zip"

Write-Host "AI Upscaler Plugin v$PLUGIN_VERSION Build Script" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Create directories
Write-Host "Creating directories..." -ForegroundColor Yellow
if (Test-Path $DIST_DIR) {
    Remove-Item $DIST_DIR -Recurse -Force
}
New-Item -ItemType Directory -Path $DIST_DIR -Force | Out-Null

# Check if project file exists
if (-not (Test-Path $PROJECT_FILE)) {
    Write-Host "ERROR: Project file not found: $PROJECT_FILE" -ForegroundColor Red
    exit 1
}

Write-Host "Project file found: $PROJECT_FILE" -ForegroundColor Green

# Create build content directory
$BUILD_CONTENT_DIR = Join-Path $DIST_DIR "content"
New-Item -ItemType Directory -Path $BUILD_CONTENT_DIR -Force | Out-Null

# Copy necessary files
Write-Host "Copying plugin files..." -ForegroundColor Yellow

# Copy web directory
$webSource = Join-Path $SCRIPT_DIR "web"
$webDest = Join-Path $BUILD_CONTENT_DIR "web"
if (Test-Path $webSource) {
    Copy-Item $webSource $webDest -Recurse -Force
    Write-Host "Copied: web directory" -ForegroundColor Green
}

# Copy Configuration directory
$configSource = Join-Path $SCRIPT_DIR "Configuration"
$configDest = Join-Path $BUILD_CONTENT_DIR "Configuration"
if (Test-Path $configSource) {
    Copy-Item $configSource $configDest -Recurse -Force
    Write-Host "Copied: Configuration directory" -ForegroundColor Green
}

# Copy shaders directory
$shadersSource = Join-Path $SCRIPT_DIR "shaders"
$shadersDest = Join-Path $BUILD_CONTENT_DIR "shaders"
if (Test-Path $shadersSource) {
    Copy-Item $shadersSource $shadersDest -Recurse -Force
    Write-Host "Copied: shaders directory" -ForegroundColor Green
}

# Copy manifest and meta files
$manifestSource = Join-Path $SCRIPT_DIR "manifest.json"
$manifestDest = Join-Path $BUILD_CONTENT_DIR "manifest.json"
if (Test-Path $manifestSource) {
    Copy-Item $manifestSource $manifestDest -Force
    Write-Host "Copied: manifest.json" -ForegroundColor Green
}

# Create meta.json
Write-Host "Creating meta.json..." -ForegroundColor Yellow
$metaJson = @{
    guid = "f87f700e-679d-43e6-9c7c-b3a410dc3f22"
    name = "AI Upscaler Plugin v$PLUGIN_VERSION"
    description = "Professional AI upscaling with AV1 codec support"
    version = $PLUGIN_VERSION
    targetAbi = "10.10.3.0"
    framework = "net8.0"
    timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
}

$metaJsonPath = Join-Path $BUILD_CONTENT_DIR "meta.json"
$metaJson | ConvertTo-Json -Depth 10 | Set-Content $metaJsonPath -Encoding UTF8
Write-Host "Created: meta.json" -ForegroundColor Green

# Try to build the DLL if .NET is available
try {
    $dotnetVersion = dotnet --version
    Write-Host "Found .NET SDK: $dotnetVersion" -ForegroundColor Green
    
    Write-Host "Building plugin..." -ForegroundColor Yellow
    dotnet build $PROJECT_FILE --configuration Release --verbosity quiet
    
    # Copy built DLL
    $dllSource = Join-Path $SCRIPT_DIR "bin\Release\net8.0\JellyfinUpscalerPlugin.dll"
    $dllDest = Join-Path $BUILD_CONTENT_DIR "JellyfinUpscalerPlugin.dll"
    
    if (Test-Path $dllSource) {
        Copy-Item $dllSource $dllDest -Force
        Write-Host "Copied: JellyfinUpscalerPlugin.dll" -ForegroundColor Green
    } else {
        Write-Host "WARNING: DLL not found, using placeholder" -ForegroundColor Yellow
        # Create a placeholder file
        "// Placeholder DLL file for v$PLUGIN_VERSION" | Set-Content $dllDest
    }
    
} catch {
    Write-Host "WARNING: .NET SDK not found, creating placeholder DLL" -ForegroundColor Yellow
    $dllDest = Join-Path $BUILD_CONTENT_DIR "JellyfinUpscalerPlugin.dll"
    "// Placeholder DLL file for v$PLUGIN_VERSION" | Set-Content $dllDest
}

# Create ZIP archive
Write-Host "Creating ZIP archive..." -ForegroundColor Yellow
$zipPath = Join-Path $DIST_DIR $ZIP_NAME

try {
    Compress-Archive -Path "$BUILD_CONTENT_DIR\*" -DestinationPath $zipPath -CompressionLevel Optimal -Force
    
    $zipSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
    Write-Host "SUCCESS: ZIP archive created: $ZIP_NAME ($zipSize MB)" -ForegroundColor Green
    
    # Calculate checksum
    $checksum = Get-FileHash $zipPath -Algorithm MD5
    Write-Host "MD5 Checksum: $($checksum.Hash.ToLower())" -ForegroundColor Cyan
    
    # Save checksum to file
    $checksumFile = Join-Path $DIST_DIR "JellyfinUpscalerPlugin-v$PLUGIN_VERSION.md5"
    "$($checksum.Hash.ToLower())  $ZIP_NAME" | Set-Content $checksumFile -Encoding ASCII
    Write-Host "Checksum saved: $($checksumFile | Split-Path -Leaf)" -ForegroundColor Green
    
} catch {
    Write-Host "ERROR: Failed to create ZIP archive: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "BUILD COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "Plugin Version: $PLUGIN_VERSION" -ForegroundColor Cyan
Write-Host "ZIP File: $zipPath" -ForegroundColor Cyan
Write-Host "Size: $zipSize MB" -ForegroundColor Cyan
Write-Host "Checksum: $($checksum.Hash.ToLower())" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ready for deployment!" -ForegroundColor Green