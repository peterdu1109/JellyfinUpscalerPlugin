#!/bin/bash

# Jellyfin Upscaler Plugin - Linux Installation Script
# Compatible with Ubuntu 20.04 LTS, 22.04 LTS, 24.04 LTS
# Author: Kuschel-Code
# Version: 1.3.1

set -e

echo "🔥 Jellyfin AI Upscaler Plugin v1.3.1 - Linux Installation"
echo "==========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        echo -e "${RED}⚠️  This script should not be run as root directly.${NC}"
        echo -e "${YELLOW}💡 Run without sudo. The script will ask for privileges when needed.${NC}"
        exit 1
    fi
}

# Detect Linux distribution
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
        CODENAME=$VERSION_CODENAME
    else
        echo -e "${RED}❌ Cannot detect Linux distribution${NC}"
        exit 1
    fi

    echo -e "${BLUE}🔍 Detected: $OS $VER ($CODENAME)${NC}"
}

# Check Ubuntu version compatibility
check_ubuntu_compatibility() {
    if [[ "$OS" == *"Ubuntu"* ]]; then
        case $VER in
            "20.04"|"22.04"|"24.04")
                echo -e "${GREEN}✅ Ubuntu version $VER is supported${NC}"
                ;;
            *)
                echo -e "${YELLOW}⚠️  Ubuntu version $VER may not be fully supported${NC}"
                echo -e "${YELLOW}📋 Recommended: Ubuntu 20.04 LTS, 22.04 LTS, or 24.04 LTS${NC}"
                read -p "Do you want to continue anyway? (y/N): " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    exit 1
                fi
                ;;
        esac
    fi
}

# Check if Jellyfin is installed
check_jellyfin() {
    echo -e "${BLUE}🔍 Checking Jellyfin installation...${NC}"
    
    if ! command -v jellyfin &> /dev/null; then
        if ! systemctl is-active --quiet jellyfin; then
            echo -e "${RED}❌ Jellyfin is not installed or not running${NC}"
            echo -e "${YELLOW}📋 Please install Jellyfin first:${NC}"
            echo "sudo apt update"
            echo "sudo apt install jellyfin -y"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}✅ Jellyfin is installed${NC}"
}

# Detect GPU and install appropriate drivers
detect_gpu() {
    echo -e "${BLUE}🔍 Detecting GPU for AI acceleration...${NC}"
    
    GPU_INFO=$(lspci | grep -E "(VGA|3D)" || true)
    
    if echo "$GPU_INFO" | grep -i "nvidia" &> /dev/null; then
        echo -e "${GREEN}🎮 NVIDIA GPU detected${NC}"
        GPU_TYPE="nvidia"
        install_nvidia_support
    elif echo "$GPU_INFO" | grep -i "amd" &> /dev/null; then
        echo -e "${GREEN}🎮 AMD GPU detected${NC}"
        GPU_TYPE="amd"
        install_amd_support
    elif echo "$GPU_INFO" | grep -i "intel" &> /dev/null; then
        echo -e "${GREEN}🎮 Intel GPU detected${NC}"
        GPU_TYPE="intel"
        install_intel_support
    else
        echo -e "${YELLOW}⚠️  No dedicated GPU detected. Using CPU acceleration.${NC}"
        GPU_TYPE="cpu"
    fi
}

# Install NVIDIA support
install_nvidia_support() {
    echo -e "${BLUE}🔧 Installing NVIDIA support...${NC}"
    
    if ! command -v nvidia-smi &> /dev/null; then
        echo -e "${YELLOW}📦 Installing NVIDIA drivers...${NC}"
        sudo apt update
        sudo apt install -y nvidia-driver-535 nvidia-utils-535
        
        echo -e "${YELLOW}⚠️  NVIDIA drivers installed. A reboot is recommended.${NC}"
        NEEDS_REBOOT=true
    else
        echo -e "${GREEN}✅ NVIDIA drivers already installed${NC}"
        nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits
    fi
}

# Install AMD support
install_amd_support() {
    echo -e "${BLUE}🔧 Installing AMD support...${NC}"
    
    if ! command -v rocm-smi &> /dev/null; then
        echo -e "${YELLOW}📦 Installing ROCm for AMD GPU support...${NC}"
        sudo apt update
        sudo apt install -y rocm-dkms rocm-utils
        
        # Add user to render group
        sudo usermod -a -G render $USER
        
        echo -e "${YELLOW}⚠️  AMD ROCm installed. Please log out and back in or reboot.${NC}"
        NEEDS_REBOOT=true
    else
        echo -e "${GREEN}✅ AMD ROCm already installed${NC}"
    fi
}

# Install Intel support
install_intel_support() {
    echo -e "${BLUE}🔧 Installing Intel GPU support...${NC}"
    
    sudo apt update
    sudo apt install -y intel-media-va-driver vainfo
    
    echo -e "${GREEN}✅ Intel GPU support installed${NC}"
}

# Install dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    
    sudo apt update
    sudo apt install -y \
        curl \
        wget \
        unzip \
        jq \
        python3 \
        python3-pip \
        nodejs \
        npm \
        build-essential \
        cmake \
        pkg-config \
        libavcodec-dev \
        libavformat-dev \
        libswscale-dev \
        libopencv-dev \
        libtensorflow-dev
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Find Jellyfin plugin directory
find_jellyfin_plugin_dir() {
    echo -e "${BLUE}🔍 Finding Jellyfin plugin directory...${NC}"
    
    # Common paths for Jellyfin plugins
    POSSIBLE_PATHS=(
        "/var/lib/jellyfin/plugins"
        "/usr/share/jellyfin/plugins"
        "/etc/jellyfin/plugins"
        "/opt/jellyfin/plugins"
        "$HOME/.local/share/jellyfin/plugins"
    )
    
    for path in "${POSSIBLE_PATHS[@]}"; do
        if [[ -d "$path" ]]; then
            JELLYFIN_PLUGIN_DIR="$path"
            echo -e "${GREEN}✅ Found Jellyfin plugin directory: $JELLYFIN_PLUGIN_DIR${NC}"
            return 0
        fi
    done
    
    # If not found, create default location
    JELLYFIN_PLUGIN_DIR="/var/lib/jellyfin/plugins"
    echo -e "${YELLOW}⚠️  Plugin directory not found. Creating: $JELLYFIN_PLUGIN_DIR${NC}"
    sudo mkdir -p "$JELLYFIN_PLUGIN_DIR"
}

# Download and install plugin
install_plugin() {
    echo -e "${BLUE}📥 Downloading Jellyfin Upscaler Plugin...${NC}"
    
    PLUGIN_URL="https://github.com/Kuschel-code/JellyfinUpscalerPlugin/archive/main.zip"
    TEMP_DIR="/tmp/jellyfin-upscaler-plugin"
    PLUGIN_DIR="$JELLYFIN_PLUGIN_DIR/JellyfinUpscalerPlugin_1.3.0"
    
    # Create temporary directory
    rm -rf "$TEMP_DIR"
    mkdir -p "$TEMP_DIR"
    cd "$TEMP_DIR"
    
    # Download plugin
    if ! wget -q "$PLUGIN_URL" -O plugin.zip; then
        echo -e "${RED}❌ Failed to download plugin${NC}"
        exit 1
    fi
    
    # Extract plugin
    unzip -q plugin.zip
    cd JellyfinUpscalerPlugin-main
    
    # Create plugin directory
    sudo mkdir -p "$PLUGIN_DIR"
    
    # Copy plugin files
    sudo cp -r . "$PLUGIN_DIR/"
    
    # Set permissions
    sudo chown -R jellyfin:jellyfin "$PLUGIN_DIR"
    sudo chmod -R 755 "$PLUGIN_DIR"
    
    # Set Linux optimization flag
    if [[ -f "$PLUGIN_DIR/meta.json" ]]; then
        sudo sed -i 's/"LinuxOptimization": false/"LinuxOptimization": true/g' "$PLUGIN_DIR/meta.json"
    fi
    
    echo -e "${GREEN}✅ Plugin installed to: $PLUGIN_DIR${NC}"
}

# Configure plugin for Linux
configure_plugin() {
    echo -e "${BLUE}🔧 Configuring plugin for Linux...${NC}"
    
    CONFIG_FILE="$PLUGIN_DIR/Configuration/config.js"
    
    if [[ -f "$CONFIG_FILE" ]]; then
        # Update configuration for Linux
        sudo tee "$CONFIG_FILE" > /dev/null <<EOF
{
    "SelectedProfile": "Default",
    "MaxFPSForAI": "60 FPS",
    "MinResolutionForAI": "720p",
    "MaxResolutionForAI": "2160p",
    "Sharpness": 2,
    "Saturation": 1.0,
    "Contrast": 1.0,
    "Denoising": 1,
    "EnableBenchmarkTest": true,
    "AdaptiveQuality": true,
    "PerformanceMonitoring": true,
    "AIModel": "Real-ESRGAN",
    "ScaleFactor": 2.0,
    "EnableRealESRGAN": true,
    "EnableSwinIR": false,
    "EnableEDSR": false,
    "EnableHAT": false,
    "GPUAcceleration": "$GPU_TYPE",
    "LinuxOptimization": true,
    "VRAMLimit": 4.0
}
EOF
        
        sudo chown jellyfin:jellyfin "$CONFIG_FILE"
        sudo chmod 644 "$CONFIG_FILE"
        
        echo -e "${GREEN}✅ Plugin configured for $GPU_TYPE acceleration${NC}"
    fi
}

# Build plugin if needed
build_plugin() {
    echo -e "${BLUE}🔨 Building plugin...${NC}"
    
    if [[ -f "$PLUGIN_DIR/build.sh" ]]; then
        cd "$PLUGIN_DIR"
        sudo chmod +x build.sh
        sudo -u jellyfin ./build.sh
        echo -e "${GREEN}✅ Plugin built successfully${NC}"
    fi
}

# Restart Jellyfin service
restart_jellyfin() {
    echo -e "${BLUE}🔄 Restarting Jellyfin service...${NC}"
    
    if systemctl is-active --quiet jellyfin; then
        sudo systemctl restart jellyfin
        sleep 5
        
        if systemctl is-active --quiet jellyfin; then
            echo -e "${GREEN}✅ Jellyfin restarted successfully${NC}"
        else
            echo -e "${RED}❌ Failed to restart Jellyfin${NC}"
            echo -e "${YELLOW}💡 Check logs: sudo journalctl -u jellyfin -f${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Jellyfin service is not running${NC}"
    fi
}

# Setup firewall
setup_firewall() {
    echo -e "${BLUE}🔥 Configuring firewall...${NC}"
    
    if command -v ufw &> /dev/null; then
        sudo ufw allow 8096/tcp comment "Jellyfin"
        echo -e "${GREEN}✅ Firewall configured for Jellyfin${NC}"
    fi
}

# Main installation function
main() {
    echo -e "${BLUE}🚀 Starting Jellyfin Upscaler Plugin installation...${NC}"
    
    check_root
    detect_distro
    check_ubuntu_compatibility
    check_jellyfin
    detect_gpu
    install_dependencies
    find_jellyfin_plugin_dir
    install_plugin
    configure_plugin
    build_plugin
    setup_firewall
    restart_jellyfin
    
    echo -e "${GREEN}🎉 Installation completed successfully!${NC}"
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo "1. Open Jellyfin web interface: http://localhost:8096"
    echo "2. Go to Dashboard → Plugins"
    echo "3. Find 'Jellyfin Upscaler Plugin' and configure settings"
    echo "4. Start playing a video to see the upscaler in action"
    echo ""
    echo -e "${YELLOW}💡 Supported AI Models:${NC}"
    echo "   • Real-ESRGAN (recommended for photos/videos)"
    echo "   • ESRGAN (classic super resolution)"
    echo "   • Waifu2x (optimized for anime)"
    echo "   • SwinIR (high quality, requires more VRAM)"
    echo "   • EDSR (fast, good quality)"
    echo "   • HAT (state-of-the-art quality)"
    echo ""
    
    if [[ "$NEEDS_REBOOT" == "true" ]]; then
        echo -e "${YELLOW}⚠️  A system reboot is recommended to fully enable GPU acceleration.${NC}"
        read -p "Do you want to reboot now? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo reboot
        fi
    fi
}

# Run main function
main "$@"