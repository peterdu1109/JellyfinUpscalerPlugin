#!/bin/bash

# Version Update Script for Jellyfin AI Upscaler Plugin
# Updates all version references across the project
# Usage: ./update-version.sh [new-version]

set -e

NEW_VERSION="${1:-1.3.1}"
OLD_VERSION_PATTERN="1\.3\.[0-9]"

echo "🔄 Updating Jellyfin AI Upscaler Plugin to version $NEW_VERSION"
echo "=================================================="

# Function to update version in file
update_file_version() {
    local file="$1"
    local pattern="$2"
    local replacement="$3"
    
    if [[ -f "$file" ]]; then
        if grep -q "$pattern" "$file"; then
            sed -i.bak "s/$pattern/$replacement/g" "$file"
            echo "✅ Updated: $file"
        else
            echo "⚠️  Pattern not found in: $file"
        fi
    else
        echo "❌ File not found: $file"
    fi
}

# Update C# files
echo ""
echo "🔧 Updating C# project files..."

# Plugin.cs - Version property
update_file_version "Plugin.cs" "new Version([0-9], [0-9], [0-9])" "new Version(${NEW_VERSION//./", "})"

# AssemblyInfo.cs (if exists)
if [[ -f "AssemblyInfo.cs" ]]; then
    update_file_version "AssemblyInfo.cs" "AssemblyVersion(\"$OLD_VERSION_PATTERN\")" "AssemblyVersion(\"$NEW_VERSION\")"
    update_file_version "AssemblyInfo.cs" "AssemblyFileVersion(\"$OLD_VERSION_PATTERN\")" "AssemblyFileVersion(\"$NEW_VERSION\")"
fi

# Project file (.csproj)
if [[ -f "JellyfinUpscalerPlugin.csproj" ]]; then
    update_file_version "JellyfinUpscalerPlugin.csproj" "<Version>$OLD_VERSION_PATTERN</Version>" "<Version>$NEW_VERSION</Version>"
    update_file_version "JellyfinUpscalerPlugin.csproj" "<AssemblyVersion>$OLD_VERSION_PATTERN</AssemblyVersion>" "<AssemblyVersion>$NEW_VERSION</AssemblyVersion>"
fi

echo ""
echo "📦 Updating package files..."

# Manifest files
update_file_version "manifest.json" "\"version\": \"$OLD_VERSION_PATTERN\"" "\"version\": \"$NEW_VERSION\""
update_file_version "meta.json" "\"version\": \"$OLD_VERSION_PATTERN\"" "\"version\": \"$NEW_VERSION\""
update_file_version "plugin.json" "\"version\": \"$OLD_VERSION_PATTERN\"" "\"version\": \"$NEW_VERSION\""

echo ""
echo "🏗️ Updating build scripts..."

# Build scripts
update_file_version "build.sh" "VERSION=\"$OLD_VERSION_PATTERN\"" "VERSION=\"$NEW_VERSION\""

echo ""
echo "📚 Updating documentation..."

# README.md
update_file_version "README.md" "v$OLD_VERSION_PATTERN" "v$NEW_VERSION"
update_file_version "README.md" "Plugin v$OLD_VERSION_PATTERN" "Plugin v$NEW_VERSION"

# Installation scripts
update_file_version "install-linux.sh" "PLUGIN_VERSION=\"$OLD_VERSION_PATTERN\"" "PLUGIN_VERSION=\"$NEW_VERSION\""
update_file_version "install-macos.sh" "PLUGIN_VERSION=\"$OLD_VERSION_PATTERN\"" "PLUGIN_VERSION=\"$NEW_VERSION\""

# Plugin paths in installation scripts
update_file_version "install-linux.sh" "JellyfinUpscalerPlugin_$OLD_VERSION_PATTERN" "JellyfinUpscalerPlugin_$NEW_VERSION"
update_file_version "install-macos.sh" "JellyfinUpscalerPlugin_$OLD_VERSION_PATTERN" "JellyfinUpscalerPlugin_$NEW_VERSION"

# Update Plugin.cs model detection path
update_file_version "Plugin.cs" "JellyfinUpscalerPlugin_$OLD_VERSION_PATTERN" "JellyfinUpscalerPlugin_$NEW_VERSION"

echo ""
echo "🤖 Updating GitHub Actions..."

# GitHub Actions
update_file_version ".github/workflows/build-and-release.yml" "PLUGIN_VERSION: \"$OLD_VERSION_PATTERN\"" "PLUGIN_VERSION: \"$NEW_VERSION\""

echo ""
echo "🏷️ Updating release files..."

# Release notes (create if doesn't exist)
RELEASE_NOTES_FILE="RELEASE-NOTES-$NEW_VERSION.md"
if [[ ! -f "$RELEASE_NOTES_FILE" ]]; then
    echo "📝 Creating release notes file: $RELEASE_NOTES_FILE"
    cat > "$RELEASE_NOTES_FILE" << EOF
# 🚀 Jellyfin AI Upscaler Plugin v$NEW_VERSION

## 🔥 What's New

### ✨ New Features
- TODO: Add new features

### 🔧 Improvements  
- TODO: Add improvements

### 🐛 Bug Fixes
- TODO: Add bug fixes

## 📥 Installation

### Windows
\`\`\`cmd
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/INSTALL-ADVANCED.cmd
INSTALL-ADVANCED.cmd
\`\`\`

### Linux
\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerPlugin/main/install-linux.sh | bash
\`\`\`

### macOS
\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerPlugin/main/install-macos.sh | bash
\`\`\`

## 🔧 Configuration

TODO: Add configuration notes

## 📊 Performance

TODO: Add performance notes

## 🐛 Known Issues

TODO: Add known issues

## 📚 Documentation

- [Installation Guide](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki/Installation)
- [AI Models Guide](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki/AI-Models)  
- [Hardware Compatibility](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki/Hardware-Compatibility)
EOF
    echo "✅ Created: $RELEASE_NOTES_FILE"
fi

echo ""
echo "🧹 Cleaning up backup files..."

# Remove backup files
find . -name "*.bak" -delete

echo ""
echo "🔍 Verifying version updates..."

# Verify updates
echo "Checking key files for version $NEW_VERSION:"

FILES_TO_CHECK=(
    "Plugin.cs"
    "build.sh"
    "install-linux.sh"
    "install-macos.sh"
    ".github/workflows/build-and-release.yml"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [[ -f "$file" ]]; then
        if grep -q "$NEW_VERSION" "$file"; then
            echo "✅ $file contains $NEW_VERSION"
        else
            echo "❌ $file does NOT contain $NEW_VERSION"
        fi
    fi
done

echo ""
echo "📋 Summary of files updated:"
echo "================================"

# Count files that were updated
UPDATED_COUNT=0
for file in Plugin.cs build.sh install-linux.sh install-macos.sh README.md .github/workflows/build-and-release.yml; do
    if [[ -f "$file" ]] && grep -q "$NEW_VERSION" "$file"; then
        echo "✅ $file"
        ((UPDATED_COUNT++))
    fi
done

echo ""
echo "📊 Update Statistics:"
echo "• Version: $NEW_VERSION"
echo "• Files updated: $UPDATED_COUNT"
echo "• Release notes: $([[ -f "$RELEASE_NOTES_FILE" ]] && echo "Created" || echo "Missing")"

echo ""
echo "🎯 Next Steps:"
echo "1. Review changes: git diff"
echo "2. Test build: ./build.sh --version $NEW_VERSION"
echo "3. Commit changes: git add . && git commit -m 'chore: bump version to v$NEW_VERSION'"
echo "4. Create tag: git tag v$NEW_VERSION"
echo "5. Push changes: git push origin main --tags"

echo ""
echo "✨ Version update completed successfully!"

# Make the script executable
chmod +x "$0"