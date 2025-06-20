#!/bin/bash
# Jellyfin Upscaler Plugin Build Script
# Creates a distributable ZIP package for the plugin

set -e

VERSION="1.1.0"
OUTPUT_DIR="./dist"
CLEAN=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -v|--version)
            VERSION="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  -v, --version VERSION  Set version (default: 1.1.0)"
            echo "  -o, --output DIR       Set output directory (default: ./dist)"
            echo "  -c, --clean            Clean output directory before build"
            echo "  -h, --help             Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "🚀 Building Jellyfin Upscaler Plugin v$VERSION"

# Clean output directory if requested
if [ "$CLEAN" = true ] && [ -d "$OUTPUT_DIR" ]; then
    echo "🧹 Cleaning output directory..."
    rm -rf "$OUTPUT_DIR"
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Define files to include in the package
FILES_TO_INCLUDE=(
    "manifest.json"
    "schema.json" 
    "upscale.js"
    "LICENSE"
    "README.md"
    "CHANGELOG.md"
    "INSTALLATION.md"
    "PERFORMANCE.md"
    "assets"
    "shaders"
)

echo "📦 Creating package structure..."

# Create temporary build directory
TEMP_DIR="$OUTPUT_DIR/temp"
PACKAGE_DIR="$TEMP_DIR/JellyfinUpscalerPlugin"

if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi
mkdir -p "$PACKAGE_DIR"

# Copy files to package directory
for item in "${FILES_TO_INCLUDE[@]}"; do
    if [ -e "$item" ]; then
        if [ -d "$item" ]; then
            echo "📁 Copying directory: $item"
            cp -r "$item" "$PACKAGE_DIR/"
        else
            echo "📄 Copying file: $item"
            cp "$item" "$PACKAGE_DIR/"
        fi
    else
        echo "⚠️  Warning: $item not found, skipping..."
    fi
done

# Verify manifest.json
MANIFEST_PATH="$PACKAGE_DIR/manifest.json"
if [ -f "$MANIFEST_PATH" ]; then
    # Check if jq is available for JSON validation
    if command -v jq &> /dev/null; then
        MANIFEST_VERSION=$(jq -r '.[0].versions[0].version' "$MANIFEST_PATH")
        echo "✅ Manifest version: $MANIFEST_VERSION"
        
        if [ "$MANIFEST_VERSION" != "$VERSION" ]; then
            echo "⚠️  Warning: Version mismatch: Script=$VERSION, Manifest=$MANIFEST_VERSION"
        fi
    else
        echo "ℹ️  jq not available, skipping manifest validation"
    fi
else
    echo "❌ manifest.json not found!"
    exit 1
fi

# Create ZIP package
ZIP_PATH="$OUTPUT_DIR/JellyfinUpscalerPlugin-v$VERSION.zip"
echo "🗜️ Creating ZIP package: $ZIP_PATH"

if [ -f "$ZIP_PATH" ]; then
    rm "$ZIP_PATH"
fi

# Use zip command
cd "$PACKAGE_DIR"
zip -r "../../$(basename "$ZIP_PATH")" .
cd - > /dev/null

# Calculate checksum
if command -v md5sum &> /dev/null; then
    HASH=$(md5sum "$ZIP_PATH" | cut -d' ' -f1)
elif command -v md5 &> /dev/null; then
    HASH=$(md5 -q "$ZIP_PATH")
else
    echo "⚠️  Warning: Neither md5sum nor md5 available, cannot calculate checksum"
    HASH="unknown"
fi

echo "🔐 Package checksum (MD5): $HASH"

# Get package size
SIZE=$(stat -c%s "$ZIP_PATH" 2>/dev/null || stat -f%z "$ZIP_PATH" 2>/dev/null || echo "0")
SIZE_MB=$(echo "scale=2; $SIZE / 1024 / 1024" | bc 2>/dev/null || echo "unknown")
echo "📏 Package size: ${SIZE_MB} MB"

# Cleanup temp directory
rm -rf "$TEMP_DIR"

# Create manifest for repository
REPO_MANIFEST_PATH="$OUTPUT_DIR/repository-manifest.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat > "$REPO_MANIFEST_PATH" << EOF
{
    "guid": "f87f700e-679d-43e6-9c7c-b3a410dc3f12",
    "name": "Jellyfin Upscaler",
    "description": "Enhance video quality with real-time upscaling for supported devices.",
    "owner": "Kuschel-code",
    "category": "Video Processing",
    "versions": [
        {
            "version": "$VERSION",
            "targetAbi": "10.10.3.0",
            "sourceUrl": "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v$VERSION/JellyfinUpscalerPlugin-v$VERSION.zip",
            "checksum": "$HASH",
            "timestamp": "$TIMESTAMP",
            "changelog": "Enhanced shaders, performance optimization, adaptive quality system, comprehensive documentation"
        }
    ]
}
EOF

echo "📋 Repository manifest created: $REPO_MANIFEST_PATH"

# Summary
echo ""
echo "✨ Build completed successfully!"
echo "📦 Package: $ZIP_PATH"
echo "🔐 Checksum: $HASH"
echo "📏 Size: ${SIZE_MB} MB"
echo "📋 Repository manifest: $REPO_MANIFEST_PATH"

# Instructions
echo ""
echo "📝 Next steps:"
echo "1. Upload $ZIP_PATH to GitHub Releases"
echo "2. Update repository manifest with the new checksum"
echo "3. Tag the release: git tag v$VERSION && git push origin v$VERSION"
echo "4. Create GitHub release with changelog"

# Make sure the script is executable
chmod +x "$0"