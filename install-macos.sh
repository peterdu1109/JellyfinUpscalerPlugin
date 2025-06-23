#!/bin/bash

# Jellyfin AI Upscaler Plugin - macOS Installer
# Automated installation script for macOS systems
# Version: 1.3.1

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Plugin information
PLUGIN_NAME="Jellyfin AI Upscaler Plugin"
PLUGIN_VERSION="1.3.1"
PLUGIN_REPO="https://github.com/Kuschel-code/JellyfinUpscalerPlugin"
PLUGIN_ARCHIVE_URL="$PLUGIN_REPO/archive/main.zip"

echo -e "${BLUE}🍎 $PLUGIN_NAME v$PLUGIN_VERSION - macOS Installer${NC}"
echo "================================================================="

# Check if running on macOS
if [[ "$(uname)" != "Darwin" ]]; then
    echo -e "${RED}❌ This installer is for macOS only!${NC}"
    echo "For other platforms, use:"
    echo "• Linux: install-linux.sh"
    echo "• Windows: INSTALL-ADVANCED.cmd"
    exit 1
fi

echo -e "${CYAN}🔍 Detecting macOS system...${NC}"

# Detect macOS version
MACOS_VERSION=$(sw_vers -productVersion)
MACOS_BUILD=$(sw_vers -buildVersion)
ARCHITECTURE=$(uname -m)

echo "macOS Version: $MACOS_VERSION ($MACOS_BUILD)"
echo "Architecture: $ARCHITECTURE"

# Detect hardware type
if [[ "$ARCHITECTURE" == "arm64" ]]; then
    echo -e "${GREEN}🍎 Apple Silicon Mac detected (M1/M2/M3)${NC}"
    MAC_TYPE="apple_silicon"
    GPU_TYPE="Apple"
elif [[ "$ARCHITECTURE" == "x86_64" ]]; then
    echo -e "${BLUE}🍎 Intel Mac detected${NC}"
    MAC_TYPE="intel"
    GPU_TYPE="Intel"
else
    echo -e "${YELLOW}⚠️ Unknown Mac architecture: $ARCHITECTURE${NC}"
    MAC_TYPE="unknown"
    GPU_TYPE="Auto"
fi

echo ""

# Check for dependencies
echo -e "${BLUE}📦 Checking dependencies...${NC}"

# Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}⚠️ Homebrew not found. Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon
    if [[ "$ARCHITECTURE" == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
else
    echo -e "${GREEN}✅ Homebrew found${NC}"
fi

# Install required tools
REQUIRED_TOOLS=("curl" "wget" "unzip" "jq")
for tool in "${REQUIRED_TOOLS[@]}"; do
    if ! command -v "$tool" &> /dev/null; then
        echo -e "${YELLOW}Installing $tool...${NC}"
        brew install "$tool"
    else
        echo -e "${GREEN}✅ $tool is available${NC}"
    fi
done

echo ""

# Check for Jellyfin
echo -e "${BLUE}🔍 Detecting Jellyfin installation...${NC}"

JELLYFIN_PATHS=(
    "/Applications/Jellyfin Media Server.app"
    "/usr/local/var/lib/jellyfin"
    "/usr/local/etc/jellyfin"
    "$HOME/.config/jellyfin"
    "$HOME/Library/Application Support/jellyfin"
)

JELLYFIN_FOUND=false
JELLYFIN_PATH=""

for path in "${JELLYFIN_PATHS[@]}"; do
    if [[ -d "$path" ]]; then
        JELLYFIN_FOUND=true
        JELLYFIN_PATH="$path"
        echo -e "${GREEN}✅ Jellyfin found at: $path${NC}"
        break
    fi
done

if [[ "$JELLYFIN_FOUND" != true ]]; then
    echo -e "${YELLOW}⚠️ Jellyfin not found. Installing Jellyfin...${NC}"
    
    # Install Jellyfin via Homebrew
    if brew list jellyfin-media-server &> /dev/null; then
        echo -e "${GREEN}✅ Jellyfin already installed via Homebrew${NC}"
    else
        echo -e "${BLUE}📦 Installing Jellyfin Media Server...${NC}"
        brew install --cask jellyfin-media-server
    fi
    
    # Set default Jellyfin path
    JELLYFIN_PATH="/usr/local/var/lib/jellyfin"
    
    # Create directory if it doesn't exist
    if [[ ! -d "$JELLYFIN_PATH" ]]; then
        mkdir -p "$JELLYFIN_PATH/plugins"
    fi
fi

# Find plugin directory
PLUGIN_DIRS=(
    "$JELLYFIN_PATH/plugins"
    "/usr/local/var/lib/jellyfin/plugins"
    "$HOME/.config/jellyfin/plugins"
    "$HOME/Library/Application Support/jellyfin/plugins"
)

PLUGIN_DIR=""
for dir in "${PLUGIN_DIRS[@]}"; do
    if [[ -d "$dir" ]] || mkdir -p "$dir" 2>/dev/null; then
        PLUGIN_DIR="$dir"
        echo -e "${GREEN}✅ Plugin directory: $dir${NC}"
        break
    fi
done

if [[ -z "$PLUGIN_DIR" ]]; then
    echo -e "${RED}❌ Could not find or create plugin directory${NC}"
    exit 1
fi

echo ""

# Download and install plugin
echo -e "${BLUE}⬇️ Downloading $PLUGIN_NAME...${NC}"

TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

echo "Downloading from: $PLUGIN_ARCHIVE_URL"
curl -L "$PLUGIN_ARCHIVE_URL" -o plugin.zip

echo -e "${BLUE}📦 Extracting plugin...${NC}"
unzip -q plugin.zip

# Install plugin
PLUGIN_INSTALL_DIR="$PLUGIN_DIR/JellyfinUpscalerPlugin_$PLUGIN_VERSION"
echo -e "${BLUE}📥 Installing to: $PLUGIN_INSTALL_DIR${NC}"

if [[ -d "$PLUGIN_INSTALL_DIR" ]]; then
    echo -e "${YELLOW}⚠️ Existing installation found. Backing up...${NC}"
    mv "$PLUGIN_INSTALL_DIR" "${PLUGIN_INSTALL_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
fi

mkdir -p "$PLUGIN_INSTALL_DIR"
cp -r JellyfinUpscalerPlugin-main/* "$PLUGIN_INSTALL_DIR/"

# Set proper permissions
chmod -R 755 "$PLUGIN_INSTALL_DIR"

echo ""

# Create macOS-specific configuration
echo -e "${BLUE}⚙️ Configuring for macOS...${NC}"

CONFIG_FILE="$PLUGIN_INSTALL_DIR/macos-config.json"
cat > "$CONFIG_FILE" << EOF
{
  "MacOSOptimization": true,
  "CrossPlatformMode": true,
  "GPUAcceleration": "$([[ "$MAC_TYPE" == "apple_silicon" ]] && echo "Metal" || echo "OpenGL")",
  "GPUVendorOverride": "$GPU_TYPE",
  "VRAMLimit": $([[ "$MAC_TYPE" == "apple_silicon" ]] && echo "8.0" || echo "4.0"),
  "EnableRealESRGAN": true,
  "AIModel": "Real-ESRGAN",
  "ScaleFactor": 3.0,
  "PerformanceMonitoring": true,
  "DynamicQualityAdjustment": true,
  "ThermalThrottleTemp": 75,
  "TargetPerformanceImpact": 10,
  "MemoryOptimization": true,
  "HDRPassthrough": true,
  "AutoColorSpaceConversion": true,
  "LogLevel": "Information",
  "DebugMode": false,
  "SystemPaths": {
    "models": "$PLUGIN_INSTALL_DIR/shaders",
    "cache": "/tmp/jellyfin-upscaler-cache",
    "logs": "/usr/local/var/log/jellyfin"
  },
  "MacOSSpecific": {
    "UseMetalPerformanceShaders": $([[ "$MAC_TYPE" == "apple_silicon" ]] && echo "true" || echo "false"),
    "CoreMLAcceleration": $([[ "$MAC_TYPE" == "apple_silicon" ]] && echo "true" || echo "false"),
    "UnifiedMemoryOptimization": $([[ "$MAC_TYPE" == "apple_silicon" ]] && echo "true" || echo "false")
  }
}
EOF

echo -e "${GREEN}✅ macOS configuration created${NC}"

echo ""

# Create launch script for easy management
echo -e "${BLUE}📝 Creating management scripts...${NC}"

LAUNCH_SCRIPT="$PLUGIN_INSTALL_DIR/manage-jellyfin-macos.sh"
cat > "$LAUNCH_SCRIPT" << 'EOF'
#!/bin/bash

# Jellyfin Management Script for macOS
# Version: 1.3.1

case "$1" in
    start)
        echo "🚀 Starting Jellyfin..."
        if brew services list | grep -q jellyfin-media-server; then
            brew services start jellyfin-media-server
        else
            echo "Please start Jellyfin manually from Applications"
        fi
        ;;
    stop)
        echo "🛑 Stopping Jellyfin..."
        if brew services list | grep -q jellyfin-media-server; then
            brew services stop jellyfin-media-server
        else
            echo "Please stop Jellyfin manually"
        fi
        ;;
    restart)
        echo "🔄 Restarting Jellyfin..."
        if brew services list | grep -q jellyfin-media-server; then
            brew services restart jellyfin-media-server
        else
            echo "Please restart Jellyfin manually"
        fi
        ;;
    status)
        echo "📊 Jellyfin Status:"
        if brew services list | grep -q jellyfin-media-server; then
            brew services list | grep jellyfin-media-server
        else
            echo "Jellyfin service not found via Homebrew"
        fi
        ;;
    logs)
        echo "📋 Jellyfin Logs:"
        if [[ -f "/usr/local/var/log/jellyfin/jellyfin.log" ]]; then
            tail -f "/usr/local/var/log/jellyfin/jellyfin.log"
        else
            echo "Log file not found at default location"
        fi
        ;;
    update)
        echo "🔄 Updating plugin..."
        curl -fsSL https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerPlugin/main/install-macos.sh | bash
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|update}"
        echo ""
        echo "Commands:"
        echo "  start   - Start Jellyfin service"
        echo "  stop    - Stop Jellyfin service"
        echo "  restart - Restart Jellyfin service"
        echo "  status  - Show Jellyfin service status"
        echo "  logs    - Show Jellyfin logs"
        echo "  update  - Update plugin to latest version"
        ;;
esac
EOF

chmod +x "$LAUNCH_SCRIPT"

echo ""

# Cleanup
cd - > /dev/null
rm -rf "$TEMP_DIR"

# Final configuration
echo -e "${BLUE}🔧 Final system optimization...${NC}"

# Create cache directory
CACHE_DIR="/tmp/jellyfin-upscaler-cache"
mkdir -p "$CACHE_DIR"
chmod 755 "$CACHE_DIR"

# Create logs directory if needed
LOG_DIR="/usr/local/var/log/jellyfin"
mkdir -p "$LOG_DIR" 2>/dev/null || true

echo ""
echo "================================================================="
echo -e "${GREEN}🎉 Installation completed successfully!${NC}"
echo "================================================================="

echo ""
echo -e "${BLUE}📋 Installation Summary:${NC}"
echo "• Plugin Version: $PLUGIN_VERSION"
echo "• Installation Path: $PLUGIN_INSTALL_DIR"
echo "• Configuration: $CONFIG_FILE"
echo "• Management Script: $LAUNCH_SCRIPT"
echo "• Mac Type: $MAC_TYPE"
echo "• GPU Type: $GPU_TYPE"

echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Start Jellyfin:"
if brew services list | grep -q jellyfin-media-server; then
    echo "   $LAUNCH_SCRIPT start"
else
    echo "   Open 'Jellyfin Media Server' from Applications"
fi

echo "2. Open Jellyfin in your browser:"
echo "   http://localhost:8096"

echo "3. Go to Dashboard → Plugins → AI Upscaler Plugin"

echo "4. Configure your preferred AI models and settings"

echo ""
echo -e "${BLUE}🛠️ Management Commands:${NC}"
echo "• Start:   $LAUNCH_SCRIPT start"
echo "• Stop:    $LAUNCH_SCRIPT stop"
echo "• Restart: $LAUNCH_SCRIPT restart"
echo "• Status:  $LAUNCH_SCRIPT status"
echo "• Logs:    $LAUNCH_SCRIPT logs"
echo "• Update:  $LAUNCH_SCRIPT update"

echo ""
echo -e "${BLUE}🎮 Optimized for your Mac:${NC}"
if [[ "$MAC_TYPE" == "apple_silicon" ]]; then
    echo "• Metal Performance Shaders: Enabled"
    echo "• Core ML Acceleration: Enabled"
    echo "• Unified Memory Optimization: Enabled"
    echo "• Recommended AI Model: Real-ESRGAN"
    echo "• VRAM Limit: 8GB (Unified Memory)"
else
    echo "• OpenGL Acceleration: Enabled"
    echo "• Recommended AI Model: EDSR"
    echo "• VRAM Limit: 4GB"
fi

echo ""
echo -e "${PURPLE}📚 Documentation:${NC}"
echo "• GitHub: $PLUGIN_REPO"
echo "• Wiki: $PLUGIN_REPO/wiki"
echo "• Issues: $PLUGIN_REPO/issues"

echo ""
echo -e "${GREEN}✨ Enjoy AI-powered video upscaling on your Mac!${NC}"