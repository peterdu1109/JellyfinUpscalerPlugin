#!/bin/bash
# 🚀 AI Upscaler Plugin v1.3.6 ULTIMATE - Git Installation Script for NAS
# ========================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PLUGIN_NAME="JellyfinUpscalerPlugin"
REPO_URL="https://github.com/Kuschel-code/JellyfinUpscalerPlugin.git"
DEFAULT_PLUGIN_DIR="/var/lib/jellyfin/plugins"

# Banner
echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         🚀 AI UPSCALER PLUGIN v1.3.6 ULTIMATE                ║"
echo "║         Git Installation Script for NAS Devices               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to print status messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to detect NAS system
detect_nas() {
    if [ -f "/etc/synoinfo.conf" ]; then
        echo "synology"
    elif [ -f "/etc/config/qpkg.conf" ]; then
        echo "qnap"
    elif [ -f "/boot/config/plugins/unRAIDServer.plg" ]; then
        echo "unraid"
    elif [ -f "/etc/truenas-version" ]; then
        echo "truenas"
    elif [ -f "/etc/openmediavault/config.xml" ]; then
        echo "openmediavault"
    elif [ -n "$JELLYFIN_CONFIG_DIR" ]; then
        echo "docker"
    else
        echo "generic"
    fi
}

# Function to find Jellyfin plugin directory
find_plugin_dir() {
    local nas_type=$(detect_nas)
    
    case $nas_type in
        "synology")
            JELLYFIN_PLUGIN_DIR="/volume1/@appstore/jellyfin/plugins"
            ;;
        "qnap")
            JELLYFIN_PLUGIN_DIR="/share/CACHEDEV1_DATA/.qpkg/jellyfin/plugins"
            ;;
        "unraid")
            JELLYFIN_PLUGIN_DIR="/mnt/user/appdata/jellyfin/plugins"
            ;;
        "truenas")
            JELLYFIN_PLUGIN_DIR="/mnt/tank/jellyfin/config/plugins"
            ;;
        "openmediavault")
            JELLYFIN_PLUGIN_DIR="/srv/dev-disk-by-uuid-*/jellyfin/plugins"
            ;;
        "docker")
            JELLYFIN_PLUGIN_DIR="${JELLYFIN_CONFIG_DIR:-/config}/plugins"
            ;;
        *)
            JELLYFIN_PLUGIN_DIR="$DEFAULT_PLUGIN_DIR"
            ;;
    esac
    
    # Ask user if default is not found
    if [ ! -d "$JELLYFIN_PLUGIN_DIR" ]; then
        print_warning "Default plugin directory not found: $JELLYFIN_PLUGIN_DIR"
        echo -e "${YELLOW}Please enter your Jellyfin plugins directory:${NC}"
        read -p "Plugin directory: " JELLYFIN_PLUGIN_DIR
    fi
    
    print_status "Using plugin directory: $JELLYFIN_PLUGIN_DIR"
}

# Function to check dependencies
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed!"
        print_status "Please install git first:"
        echo "  - Synology: Install Git Server package"
        echo "  - QNAP: Install Git from App Center"
        echo "  - Unraid: Install Git from Community Applications"
        echo "  - Docker: Use image with git pre-installed"
        exit 1
    fi
    
    print_success "Git found: $(git --version)"
}

# Function to stop Jellyfin
stop_jellyfin() {
    print_status "Stopping Jellyfin service..."
    
    local nas_type=$(detect_nas)
    case $nas_type in
        "synology")
            sudo synopkg stop jellyfin 2>/dev/null || true
            ;;
        "qnap")
            /etc/init.d/jellyfin.sh stop 2>/dev/null || true
            ;;
        "unraid")
            /etc/rc.d/rc.jellyfin stop 2>/dev/null || true
            ;;
        "docker")
            docker stop jellyfin 2>/dev/null || true
            ;;
        *)
            systemctl stop jellyfin 2>/dev/null || true
            ;;
    esac
    
    print_success "Jellyfin stopped"
    sleep 2
}

# Function to start Jellyfin
start_jellyfin() {
    print_status "Starting Jellyfin service..."
    
    local nas_type=$(detect_nas)
    case $nas_type in
        "synology")
            sudo synopkg start jellyfin
            ;;
        "qnap")
            /etc/init.d/jellyfin.sh start
            ;;
        "unraid")
            /etc/rc.d/rc.jellyfin start
            ;;
        "docker")
            docker start jellyfin
            ;;
        *)
            systemctl start jellyfin
            ;;
    esac
    
    print_success "Jellyfin started"
}

# Function to install plugin
install_plugin() {
    print_status "Installing AI Upscaler Plugin..."
    
    cd "$JELLYFIN_PLUGIN_DIR"
    
    # Remove existing installation if present
    if [ -d "$PLUGIN_NAME" ]; then
        print_warning "Existing installation found, backing up..."
        mv "$PLUGIN_NAME" "${PLUGIN_NAME}_backup_$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Clone repository
    print_status "Cloning repository..."
    git clone "$REPO_URL" "$PLUGIN_NAME"
    cd "$PLUGIN_NAME"
    
    # Copy DLL if available
    if [ -f "bin/Release/net8.0/JellyfinUpscalerPlugin.dll" ]; then
        print_status "Using pre-built DLL..."
        cp "bin/Release/net8.0/JellyfinUpscalerPlugin.dll" ./
    else
        print_warning "No pre-built DLL found, you may need to build manually"
    fi
    
    # Set proper permissions
    print_status "Setting permissions..."
    chown -R jellyfin:jellyfin . 2>/dev/null || true
    chmod +x *.dll 2>/dev/null || true
    
    print_success "Plugin installed successfully!"
}

# Function to create update script
create_update_script() {
    print_status "Creating update script..."
    
    cat > "$JELLYFIN_PLUGIN_DIR/update-upscaler.sh" << 'EOF'
#!/bin/bash
# Auto-generated update script for AI Upscaler Plugin

PLUGIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/JellyfinUpscalerPlugin"

echo "🔄 Updating AI Upscaler Plugin..."

# Stop Jellyfin (detect system)
if [ -f "/etc/synoinfo.conf" ]; then
    sudo synopkg stop jellyfin
elif [ -f "/etc/config/qpkg.conf" ]; then
    /etc/init.d/jellyfin.sh stop
elif [ -n "$JELLYFIN_CONFIG_DIR" ]; then
    docker stop jellyfin
else
    systemctl stop jellyfin
fi

# Update plugin
cd "$PLUGIN_DIR"
git pull origin main

# Copy new DLL if available
if [ -f "bin/Release/net8.0/JellyfinUpscalerPlugin.dll" ]; then
    cp "bin/Release/net8.0/JellyfinUpscalerPlugin.dll" ./
    echo "✅ Updated DLL"
fi

# Fix permissions
chown -R jellyfin:jellyfin . 2>/dev/null || true
chmod +x *.dll 2>/dev/null || true

# Start Jellyfin
if [ -f "/etc/synoinfo.conf" ]; then
    sudo synopkg start jellyfin
elif [ -f "/etc/config/qpkg.conf" ]; then
    /etc/init.d/jellyfin.sh start
elif [ -n "$JELLYFIN_CONFIG_DIR" ]; then
    docker start jellyfin
else
    systemctl start jellyfin
fi

echo "🎉 Update completed!"
EOF

    chmod +x "$JELLYFIN_PLUGIN_DIR/update-upscaler.sh"
    print_success "Update script created: $JELLYFIN_PLUGIN_DIR/update-upscaler.sh"
}

# Function to display final instructions
show_final_instructions() {
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                   🎉 INSTALLATION COMPLETE!                   ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    print_success "AI Upscaler Plugin v1.3.6 ULTIMATE installed successfully!"
    echo
    print_status "📍 Installation Location: $JELLYFIN_PLUGIN_DIR/$PLUGIN_NAME"
    print_status "🔄 Update Command: $JELLYFIN_PLUGIN_DIR/update-upscaler.sh"
    echo
    print_status "Next Steps:"
    echo "  1. 🌐 Open Jellyfin Dashboard"
    echo "  2. ⚙️  Go to Plugins → AI Upscaler Configuration"
    echo "  3. 🎛️  Configure your settings"
    echo "  4. 🎬 Enjoy enhanced video quality!"
    echo
    print_status "For support visit: https://github.com/Kuschel-code/JellyfinUpscalerPlugin"
}

# Main installation process
main() {
    print_status "Detected NAS type: $(detect_nas)"
    
    # Check if running as root for system operations
    if [ "$EUID" -ne 0 ]; then
        print_warning "Not running as root. Some operations may require sudo."
    fi
    
    check_dependencies
    find_plugin_dir
    
    # Confirm installation
    echo -e "${YELLOW}Ready to install AI Upscaler Plugin to: $JELLYFIN_PLUGIN_DIR${NC}"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Installation cancelled."
        exit 0
    fi
    
    stop_jellyfin
    install_plugin
    create_update_script
    start_jellyfin
    show_final_instructions
}

# Run main function
main "$@"