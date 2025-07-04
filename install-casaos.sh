#!/bin/bash

# CasaOS-specific installation script for Jellyfin AI Upscaler Plugin v1.3.6.1
# Supports ARM64, Raspberry Pi, and Zimaboard

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏠 CasaOS Jellyfin AI Upscaler Plugin v1.3.6.1 Installation${NC}"
echo -e "${BLUE}=================================================================${NC}"

# Detect CasaOS
detect_casaos() {
    if [ -d "/etc/casaos" ] || [ -f "/usr/local/bin/casaos" ] || [ -d "/var/lib/casaos" ]; then
        echo -e "${GREEN}✅ CasaOS detected${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  CasaOS not detected - continuing anyway${NC}"
        return 1
    fi
}

# Detect architecture
detect_architecture() {
    ARCH=$(uname -m)
    case $ARCH in
        aarch64|arm64)
            echo -e "${GREEN}✅ ARM64 architecture detected${NC}"
            IS_ARM64=true
            ;;
        armv7l|armv6l)
            echo -e "${GREEN}✅ ARM32 architecture detected${NC}"
            IS_ARM64=false
            ;;
        x86_64)
            echo -e "${GREEN}✅ x86_64 architecture detected${NC}"
            IS_ARM64=false
            ;;
        *)
            echo -e "${YELLOW}⚠️  Unknown architecture: $ARCH${NC}"
            IS_ARM64=false
            ;;
    esac
}

# Detect Raspberry Pi
detect_raspberry_pi() {
    if [ -f "/proc/device-tree/model" ]; then
        MODEL=$(cat /proc/device-tree/model 2>/dev/null || echo "")
        if [[ "$MODEL" == *"Raspberry Pi"* ]]; then
            echo -e "${GREEN}✅ Raspberry Pi detected: $MODEL${NC}"
            IS_RPI=true
            return 0
        fi
    fi
    
    if [ -f "/sys/firmware/devicetree/base/model" ]; then
        MODEL=$(cat /sys/firmware/devicetree/base/model 2>/dev/null || echo "")
        if [[ "$MODEL" == *"Raspberry Pi"* ]]; then
            echo -e "${GREEN}✅ Raspberry Pi detected: $MODEL${NC}"
            IS_RPI=true
            return 0
        fi
    fi
    
    IS_RPI=false
    return 1
}

# Detect Zimaboard
detect_zimaboard() {
    if [ -f "/sys/class/dmi/id/product_name" ]; then
        PRODUCT=$(cat /sys/class/dmi/id/product_name 2>/dev/null || echo "")
        if [[ "$PRODUCT" == *"Zimaboard"* ]] || [[ "$PRODUCT" == *"ZimaBoard"* ]]; then
            echo -e "${GREEN}✅ Zimaboard detected: $PRODUCT${NC}"
            IS_ZIMABOARD=true
            return 0
        fi
    fi
    
    IS_ZIMABOARD=false
    return 1
}

# Set CasaOS-specific paths
set_casaos_paths() {
    # CasaOS standard paths
    CASAOS_DATA_PATH="/DATA/AppData"
    JELLYFIN_CONFIG_PATH="$CASAOS_DATA_PATH/jellyfin/config"
    JELLYFIN_CACHE_PATH="$CASAOS_DATA_PATH/jellyfin/cache"
    PLUGIN_PATH="$JELLYFIN_CONFIG_PATH/data/plugins"
    PLUGIN_INSTALL_PATH="$PLUGIN_PATH/JellyfinUpscalerPlugin_v1.3.6.1"
    
    # Alternative paths if CasaOS standard doesn't exist
    if [ ! -d "$CASAOS_DATA_PATH" ]; then
        echo -e "${YELLOW}⚠️  CasaOS DATA path not found, using alternative paths${NC}"
        JELLYFIN_CONFIG_PATH="$HOME/jellyfin/config"
        JELLYFIN_CACHE_PATH="$HOME/jellyfin/cache"
        PLUGIN_PATH="$JELLYFIN_CONFIG_PATH/data/plugins"
        PLUGIN_INSTALL_PATH="$PLUGIN_PATH/JellyfinUpscalerPlugin_v1.3.6.1"
    fi
    
    echo -e "${BLUE}📁 Using paths:${NC}"
    echo -e "   Config: $JELLYFIN_CONFIG_PATH"
    echo -e "   Plugins: $PLUGIN_PATH"
    echo -e "   Install: $PLUGIN_INSTALL_PATH"
}

# Create directories
create_directories() {
    echo -e "${BLUE}📁 Creating directories...${NC}"
    
    mkdir -p "$JELLYFIN_CONFIG_PATH"
    mkdir -p "$JELLYFIN_CACHE_PATH"
    mkdir -p "$PLUGIN_PATH"
    mkdir -p "$PLUGIN_INSTALL_PATH"
    
    echo -e "${GREEN}✅ Directories created${NC}"
}

# Download plugin
download_plugin() {
    echo -e "${BLUE}📥 Downloading plugin...${NC}"
    
    PLUGIN_URL="https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v1.3.6.1/JellyfinUpscalerPlugin-v1.3.6.1-Ultimate.zip"
    PLUGIN_ZIP="/tmp/JellyfinUpscalerPlugin-v1.3.6.1-Ultimate.zip"
    
    if command -v wget >/dev/null 2>&1; then
        wget -O "$PLUGIN_ZIP" "$PLUGIN_URL"
    elif command -v curl >/dev/null 2>&1; then
        curl -L -o "$PLUGIN_ZIP" "$PLUGIN_URL"
    else
        echo -e "${RED}❌ Neither wget nor curl found. Please install one of them.${NC}"
        exit 1
    fi
    
    if [ -f "$PLUGIN_ZIP" ]; then
        echo -e "${GREEN}✅ Plugin downloaded successfully${NC}"
    else
        echo -e "${RED}❌ Plugin download failed${NC}"
        exit 1
    fi
}

# Extract plugin
extract_plugin() {
    echo -e "${BLUE}📦 Extracting plugin...${NC}"
    
    if command -v unzip >/dev/null 2>&1; then
        unzip -o "$PLUGIN_ZIP" -d "$PLUGIN_INSTALL_PATH"
    else
        echo -e "${RED}❌ unzip not found. Please install unzip.${NC}"
        exit 1
    fi
    
    # Verify extraction
    if [ -f "$PLUGIN_INSTALL_PATH/JellyfinUpscalerPlugin.dll" ]; then
        echo -e "${GREEN}✅ Plugin extracted successfully${NC}"
    else
        echo -e "${RED}❌ Plugin extraction failed${NC}"
        exit 1
    fi
    
    # Clean up
    rm -f "$PLUGIN_ZIP"
}

# Set permissions (CasaOS/ARM64 specific)
set_permissions() {
    echo -e "${BLUE}🔐 Setting permissions...${NC}"
    
    # CasaOS typically uses 1000:1000
    chown -R 1000:1000 "$PLUGIN_PATH" 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Could not set owner to 1000:1000, trying current user${NC}"
        chown -R $(id -u):$(id -g) "$PLUGIN_PATH" 2>/dev/null || {
            echo -e "${YELLOW}⚠️  Could not change ownership, permissions may need manual adjustment${NC}"
        }
    }
    
    chmod -R 755 "$PLUGIN_PATH" 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Could not set permissions, may need manual adjustment${NC}"
    }
    
    echo -e "${GREEN}✅ Permissions set${NC}"
}

# Configure for platform
configure_platform() {
    echo -e "${BLUE}⚙️  Configuring for platform...${NC}"
    
    # Create platform-specific config
    CONFIG_FILE="$JELLYFIN_CONFIG_PATH/upscaler-platform.json"
    
    cat > "$CONFIG_FILE" << EOF
{
    "platform": {
        "isCasaOS": true,
        "isARM64": $IS_ARM64,
        "isRaspberryPi": $IS_RPI,
        "isZimaboard": $IS_ZIMABOARD,
        "recommendedSettings": {
            "cacheSize": $([ "$IS_RPI" = true ] && echo 256 || echo 512),
            "concurrentStreams": 1,
            "model": "$([ "$IS_ARM64" = true ] && echo "fsrcnn" || echo "realesrgan")",
            "enableHardwareAcceleration": $([ "$IS_ARM64" = true ] && echo false || echo true),
            "enableEcoMode": $([ "$IS_ARM64" = true ] && echo true || echo false)
        }
    }
}
EOF
    
    echo -e "${GREEN}✅ Platform configuration created${NC}"
}

# Check Docker
check_docker() {
    if command -v docker >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker found${NC}"
        
        # Check if Jellyfin container is running
        if docker ps | grep -q jellyfin; then
            echo -e "${YELLOW}⚠️  Jellyfin container is running. Please stop it before continuing.${NC}"
            echo -e "${BLUE}Run: docker stop jellyfin${NC}"
            read -p "Press Enter after stopping the container..."
        fi
    else
        echo -e "${YELLOW}⚠️  Docker not found. Plugin installed for manual Jellyfin setup.${NC}"
    fi
}

# Main installation
main() {
    echo -e "${BLUE}🚀 Starting installation...${NC}"
    
    # Root check
    if [ "$EUID" -ne 0 ]; then
        echo -e "${YELLOW}⚠️  Running as non-root user. Some operations may require sudo.${NC}"
    fi
    
    # Detection
    detect_casaos
    detect_architecture
    detect_raspberry_pi
    detect_zimaboard
    
    # Installation
    set_casaos_paths
    create_directories
    download_plugin
    extract_plugin
    set_permissions
    configure_platform
    check_docker
    
    echo -e "${GREEN}🎉 Installation completed successfully!${NC}"
    echo -e "${BLUE}=================================================================${NC}"
    echo -e "${YELLOW}📋 Next steps:${NC}"
    echo -e "1. Start your Jellyfin container: ${BLUE}docker start jellyfin${NC}"
    echo -e "2. Go to Jellyfin Admin → Plugins → My Plugins"
    echo -e "3. Plugin should show as 'Active' (not 'Malfunctioned')"
    echo -e "4. If using CasaOS, the plugin is optimized for your platform"
    echo -e ""
    echo -e "${GREEN}✅ CasaOS-specific optimizations applied:${NC}"
    echo -e "   • ARM64 compatibility"
    echo -e "   • Raspberry Pi support"
    echo -e "   • Zimaboard compatibility"
    echo -e "   • Conservative resource usage"
    echo -e "   • Proper permissions for CasaOS"
    echo -e ""
    echo -e "${BLUE}🔧 For troubleshooting, check: $JELLYFIN_CONFIG_PATH/logs${NC}"
}

# Run main function
main "$@"