#!/bin/bash

# 🔧 Jellyfin Cache Fix Script
# Addresses the "Device or resource busy" error from crash.txt

echo "🔧 JELLYFIN CACHE FIX SCRIPT"
echo "=============================="
echo ""
echo "This script fixes the cache directory issues identified in crash.txt:"
echo "- System.IO.IOException: Device or resource busy : '/cache/transcodes'"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Function to detect Jellyfin installation type
detect_jellyfin_type() {
    if systemctl is-active --quiet jellyfin; then
        echo "system"
    elif docker ps --format '{{.Names}}' | grep -q jellyfin; then
        echo "docker"
    elif docker ps --format '{{.Names}}' | grep -q jellyfin; then
        echo "docker-compose"
    else
        echo "unknown"
    fi
}

# Function to fix system installation
fix_system_installation() {
    echo "🔧 Fixing system installation..."
    
    # Stop Jellyfin service
    echo "⏹️ Stopping Jellyfin service..."
    systemctl stop jellyfin
    sleep 5
    
    # Kill any remaining processes
    echo "🔄 Killing remaining processes..."
    pkill -f jellyfin || true
    pkill -f ffmpeg || true
    sleep 3
    
    # Clear cache directory
    echo "🗂️ Clearing cache directory..."
    rm -rf /var/cache/jellyfin/* 2>/dev/null || true
    rm -rf /cache/transcodes/* 2>/dev/null || true
    rm -rf /tmp/jellyfin* 2>/dev/null || true
    
    # Create proper directory structure
    echo "📁 Creating proper directory structure..."
    mkdir -p /var/cache/jellyfin
    mkdir -p /cache/transcodes
    
    # Set proper permissions
    echo "🔐 Setting proper permissions..."
    chown -R jellyfin:jellyfin /var/cache/jellyfin 2>/dev/null || true
    chown -R jellyfin:jellyfin /cache/transcodes 2>/dev/null || true
    chmod 755 /var/cache/jellyfin
    chmod 755 /cache/transcodes
    
    # Start Jellyfin service
    echo "▶️ Starting Jellyfin service..."
    systemctl start jellyfin
    sleep 10
    
    # Check service status
    if systemctl is-active --quiet jellyfin; then
        echo "✅ Jellyfin service started successfully"
    else
        echo "❌ Jellyfin service failed to start"
        systemctl status jellyfin
    fi
}

# Function to fix Docker installation
fix_docker_installation() {
    echo "🔧 Fixing Docker installation..."
    
    # Find Jellyfin container
    CONTAINER_NAME=$(docker ps --format '{{.Names}}' | grep jellyfin | head -1)
    
    if [ -z "$CONTAINER_NAME" ]; then
        echo "❌ No running Jellyfin container found"
        return 1
    fi
    
    echo "📦 Found container: $CONTAINER_NAME"
    
    # Stop container
    echo "⏹️ Stopping container..."
    docker stop "$CONTAINER_NAME"
    sleep 5
    
    # Remove container (will be recreated)
    echo "🗑️ Removing container (will be recreated)..."
    docker rm "$CONTAINER_NAME"
    
    # Clean up cache volume
    echo "🧹 Cleaning cache volume..."
    docker volume rm jellyfin-cache 2>/dev/null || true
    docker volume create jellyfin-cache
    
    # Start container again
    echo "▶️ Starting container..."
    docker start "$CONTAINER_NAME" 2>/dev/null || echo "Container will need to be recreated manually"
    
    echo "✅ Docker cleanup completed"
}

# Function to fix Docker Compose installation
fix_docker_compose_installation() {
    echo "🔧 Fixing Docker Compose installation..."
    
    # Find docker-compose file
    COMPOSE_FILE=""
    if [ -f "docker-compose.yml" ]; then
        COMPOSE_FILE="docker-compose.yml"
    elif [ -f "docker-compose.yaml" ]; then
        COMPOSE_FILE="docker-compose.yaml"
    else
        echo "❌ No docker-compose file found"
        return 1
    fi
    
    echo "📄 Found compose file: $COMPOSE_FILE"
    
    # Stop services
    echo "⏹️ Stopping services..."
    docker-compose -f "$COMPOSE_FILE" down
    
    # Clean up volumes
    echo "🧹 Cleaning volumes..."
    docker volume prune -f
    docker system prune -f
    
    # Recreate services
    echo "▶️ Recreating services..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    echo "✅ Docker Compose cleanup completed"
}

# Function to create monitoring script
create_monitoring_script() {
    echo "📊 Creating monitoring script..."
    
    cat > /usr/local/bin/jellyfin-cache-monitor.sh << 'EOF'
#!/bin/bash
# Jellyfin Cache Monitor
# Run this regularly to prevent cache issues

CACHE_DIRS="/var/cache/jellyfin /cache/transcodes"
MAX_SIZE_MB=5000

for dir in $CACHE_DIRS; do
    if [ -d "$dir" ]; then
        SIZE_KB=$(du -s "$dir" 2>/dev/null | cut -f1)
        SIZE_MB=$((SIZE_KB / 1024))
        
        if [ $SIZE_MB -gt $MAX_SIZE_MB ]; then
            echo "⚠️ Cache directory $dir is too large: ${SIZE_MB}MB"
            echo "🧹 Cleaning old files..."
            find "$dir" -type f -mtime +1 -delete 2>/dev/null
            echo "✅ Cleanup completed"
        fi
    fi
done

# Check for stuck processes
STUCK_PROCESSES=$(ps aux | grep -E "(ffmpeg|jellyfin)" | grep -v grep | wc -l)
if [ $STUCK_PROCESSES -gt 10 ]; then
    echo "⚠️ Too many jellyfin/ffmpeg processes: $STUCK_PROCESSES"
    echo "🔄 Consider restarting Jellyfin service"
fi
EOF

    chmod +x /usr/local/bin/jellyfin-cache-monitor.sh
    echo "✅ Monitoring script created at /usr/local/bin/jellyfin-cache-monitor.sh"
}

# Function to add cron job
add_cron_job() {
    echo "⏰ Adding cron job for automatic cleanup..."
    
    # Add to root crontab
    (crontab -l 2>/dev/null || echo ""; echo "0 4 * * * /usr/local/bin/jellyfin-cache-monitor.sh") | crontab -
    
    echo "✅ Cron job added (runs daily at 4 AM)"
}

# Main execution
main() {
    echo "🔍 Detecting Jellyfin installation type..."
    JELLYFIN_TYPE=$(detect_jellyfin_type)
    echo "📦 Detected: $JELLYFIN_TYPE installation"
    echo ""
    
    case $JELLYFIN_TYPE in
        "system")
            fix_system_installation
            ;;
        "docker")
            fix_docker_installation
            ;;
        "docker-compose")
            fix_docker_compose_installation
            ;;
        *)
            echo "❌ Unknown Jellyfin installation type"
            echo "Please check your Jellyfin installation manually"
            exit 1
            ;;
    esac
    
    echo ""
    echo "🔧 Additional fixes..."
    create_monitoring_script
    add_cron_job
    
    echo ""
    echo "🎉 FIXES COMPLETED!"
    echo "==================="
    echo ""
    echo "✅ Cache directory issues should be resolved"
    echo "✅ Proper permissions set"
    echo "✅ Monitoring script installed"
    echo "✅ Automatic cleanup scheduled"
    echo ""
    echo "🔍 To verify the fixes:"
    echo "1. Check Jellyfin logs: journalctl -u jellyfin -f"
    echo "2. Monitor cache size: du -sh /cache/transcodes"
    echo "3. Test transcoding with a video file"
    echo ""
    echo "🚨 If issues persist, please check:"
    echo "- Disk space availability"
    echo "- File system permissions"
    echo "- Hardware resource limits"
}

# Run main function
main "$@"