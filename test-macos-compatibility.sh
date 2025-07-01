#!/bin/bash
# macOS Compatibility Test Script

echo "🍎 macOS Compatibility Test for AI Upscaler Plugin v1.3.6"
echo "=========================================================="

# Check .NET 8.0
echo "Checking .NET version..."
dotnet --version

# Check if plugin builds
echo "Testing plugin build..."
dotnet build --configuration Release

# Check DLL
if [ -f "bin/Release/net8.0/JellyfinUpscalerPlugin.dll" ]; then
    echo "✅ Plugin DLL created successfully"
    echo "Size: $(stat -f%z bin/Release/net8.0/JellyfinUpscalerPlugin.dll) bytes"
else
    echo "❌ Plugin DLL not found"
    exit 1
fi

echo "🎉 macOS compatibility test passed!"