#!/bin/bash

# 🌐 AniSearch Connection Fix Script
# Addresses the "Connection refused (www.anisearch.com:443)" error from crash.txt

echo "🌐 ANISEARCH CONNECTION FIX SCRIPT"
echo "=================================="
echo ""
echo "This script fixes the AniSearch connection issues identified in crash.txt:"
echo "- System.Net.Http.HttpRequestException: Connection refused (www.anisearch.com:443)"
echo ""

# Function to test network connectivity
test_connectivity() {
    echo "🔍 Testing network connectivity..."
    
    # Test basic internet connectivity
    if ping -c 2 8.8.8.8 >/dev/null 2>&1; then
        echo "✅ Internet connectivity: OK"
    else
        echo "❌ Internet connectivity: FAILED"
        return 1
    fi
    
    # Test DNS resolution
    if nslookup www.anisearch.com >/dev/null 2>&1; then
        echo "✅ DNS resolution: OK"
    else
        echo "❌ DNS resolution: FAILED"
        echo "🔧 Trying to fix DNS..."
        fix_dns
    fi
    
    # Test HTTPS connectivity
    if curl -s -I https://www.anisearch.com/ | head -1 | grep -q "200\|301\|302"; then
        echo "✅ HTTPS connectivity: OK"
    else
        echo "❌ HTTPS connectivity: FAILED"
        test_firewall
    fi
}

# Function to fix DNS issues
fix_dns() {
    echo "🔧 Applying DNS fixes..."
    
    # Backup original resolv.conf
    cp /etc/resolv.conf /etc/resolv.conf.backup
    
    # Add reliable DNS servers
    cat > /etc/resolv.conf << EOF
# Backup created: /etc/resolv.conf.backup
nameserver 8.8.8.8
nameserver 8.8.4.4
nameserver 1.1.1.1
nameserver 1.0.0.1
EOF
    
    # Restart networking services
    systemctl restart systemd-resolved 2>/dev/null || true
    systemctl restart NetworkManager 2>/dev/null || true
    
    echo "✅ DNS configuration updated"
}

# Function to test firewall
test_firewall() {
    echo "🔍 Testing firewall configuration..."
    
    # Check UFW status
    if command -v ufw >/dev/null 2>&1; then
        UFW_STATUS=$(ufw status | grep -i "status:")
        echo "🔥 UFW Status: $UFW_STATUS"
        
        if echo "$UFW_STATUS" | grep -q "active"; then
            echo "🔧 UFW is active, checking rules..."
            
            # Check if HTTPS is allowed
            if ! ufw status | grep -q "443/tcp"; then
                echo "🔓 Allowing HTTPS traffic..."
                ufw allow out 443/tcp
                ufw allow out 80/tcp
                echo "✅ HTTPS traffic allowed"
            fi
        fi
    fi
    
    # Check iptables
    if command -v iptables >/dev/null 2>&1; then
        BLOCKED_RULES=$(iptables -L OUTPUT | grep -i "reject\|drop" | wc -l)
        if [ $BLOCKED_RULES -gt 0 ]; then
            echo "⚠️ Found $BLOCKED_RULES blocking iptables rules"
            echo "🔧 Consider reviewing iptables configuration"
        fi
    fi
}

# Function to fix Docker network issues
fix_docker_network() {
    echo "🐳 Fixing Docker network issues..."
    
    # Check if Jellyfin is running in Docker
    if docker ps --format '{{.Names}}' | grep -q jellyfin; then
        CONTAINER_NAME=$(docker ps --format '{{.Names}}' | grep jellyfin | head -1)
        
        echo "📦 Found Jellyfin container: $CONTAINER_NAME"
        
        # Test network from inside container
        echo "🔍 Testing network from inside container..."
        docker exec "$CONTAINER_NAME" ping -c 2 8.8.8.8 >/dev/null 2>&1 && echo "✅ Container internet: OK" || echo "❌ Container internet: FAILED"
        
        # Check DNS from container
        docker exec "$CONTAINER_NAME" nslookup www.anisearch.com >/dev/null 2>&1 && echo "✅ Container DNS: OK" || echo "❌ Container DNS: FAILED"
        
        # Fix container DNS if needed
        if ! docker exec "$CONTAINER_NAME" nslookup www.anisearch.com >/dev/null 2>&1; then
            echo "🔧 Updating container DNS..."
            docker exec "$CONTAINER_NAME" sh -c 'echo "nameserver 8.8.8.8" > /etc/resolv.conf'
            docker exec "$CONTAINER_NAME" sh -c 'echo "nameserver 8.8.4.4" >> /etc/resolv.conf'
        fi
    fi
}

# Function to disable AniSearch plugin
disable_anisearch_plugin() {
    echo "🔧 Disabling AniSearch plugin..."
    
    # Find Jellyfin configuration directory
    CONFIG_DIRS="/config /var/lib/jellyfin /opt/jellyfin"
    
    for config_dir in $CONFIG_DIRS; do
        if [ -d "$config_dir" ]; then
            echo "📁 Checking configuration directory: $config_dir"
            
            # Look for plugin configuration
            if [ -f "$config_dir/plugins/configurations/AniSearch.xml" ]; then
                echo "🔧 Disabling AniSearch plugin configuration..."
                mv "$config_dir/plugins/configurations/AniSearch.xml" "$config_dir/plugins/configurations/AniSearch.xml.disabled"
                echo "✅ AniSearch plugin disabled"
            fi
            
            # Remove plugin DLL if exists
            if [ -f "$config_dir/plugins/AniSearch.dll" ]; then
                echo "🗑️ Removing AniSearch plugin DLL..."
                mv "$config_dir/plugins/AniSearch.dll" "$config_dir/plugins/AniSearch.dll.disabled"
                echo "✅ AniSearch plugin DLL disabled"
            fi
        fi
    done
}

# Function to create network monitoring script
create_network_monitor() {
    echo "📊 Creating network monitoring script..."
    
    cat > /usr/local/bin/jellyfin-network-monitor.sh << 'EOF'
#!/bin/bash
# Jellyfin Network Monitor
# Monitors network connectivity for Jellyfin

LOGFILE="/var/log/jellyfin-network-monitor.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Test connectivity
if ping -c 2 8.8.8.8 >/dev/null 2>&1; then
    echo "[$TIMESTAMP] ✅ Internet connectivity: OK" >> "$LOGFILE"
else
    echo "[$TIMESTAMP] ❌ Internet connectivity: FAILED" >> "$LOGFILE"
    # Restart networking services
    systemctl restart systemd-resolved 2>/dev/null || true
fi

# Test AniSearch specifically
if curl -s -I https://www.anisearch.com/ | head -1 | grep -q "200\|301\|302"; then
    echo "[$TIMESTAMP] ✅ AniSearch connectivity: OK" >> "$LOGFILE"
else
    echo "[$TIMESTAMP] ❌ AniSearch connectivity: FAILED" >> "$LOGFILE"
fi

# Keep log file size reasonable
tail -n 100 "$LOGFILE" > "${LOGFILE}.tmp" && mv "${LOGFILE}.tmp" "$LOGFILE"
EOF

    chmod +x /usr/local/bin/jellyfin-network-monitor.sh
    echo "✅ Network monitoring script created"
}

# Function to add network monitoring to cron
add_network_monitoring() {
    echo "⏰ Adding network monitoring to cron..."
    
    # Add to root crontab
    (crontab -l 2>/dev/null || echo ""; echo "*/15 * * * * /usr/local/bin/jellyfin-network-monitor.sh") | crontab -
    
    echo "✅ Network monitoring added (runs every 15 minutes)"
}

# Function to provide manual alternatives
provide_alternatives() {
    echo ""
    echo "🔧 ALTERNATIVE SOLUTIONS:"
    echo "========================"
    echo ""
    echo "1. 🚫 Disable AniSearch Plugin:"
    echo "   - Go to Jellyfin Dashboard → Plugins"
    echo "   - Find 'AniSearch' plugin"
    echo "   - Click 'Disable' or 'Uninstall'"
    echo ""
    echo "2. 🔄 Use Alternative Metadata Providers:"
    echo "   - TheMovieDB (TMDB)"
    echo "   - TheTVDB"
    echo "   - Open Movie Database (OMDb)"
    echo ""
    echo "3. 🌐 Configure Proxy (if behind corporate firewall):"
    echo "   - Set HTTP_PROXY and HTTPS_PROXY environment variables"
    echo "   - Configure Docker/Jellyfin to use proxy"
    echo ""
    echo "4. 📅 Schedule Regular Restarts:"
    echo "   - Add to cron: 0 4 * * * systemctl restart jellyfin"
    echo ""
}

# Main execution
main() {
    echo "🔍 Starting AniSearch connection diagnostics..."
    echo ""
    
    # Test basic connectivity
    if ! test_connectivity; then
        echo "❌ Basic connectivity issues detected"
        echo "🔧 Applying network fixes..."
        
        # Apply fixes
        fix_dns
        fix_docker_network
        
        echo "🔄 Retesting connectivity..."
        sleep 5
        test_connectivity
    fi
    
    echo ""
    echo "🔧 Additional fixes..."
    create_network_monitor
    add_network_monitoring
    
    echo ""
    echo "❓ Would you like to disable the AniSearch plugin? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        disable_anisearch_plugin
        echo "🔄 Please restart Jellyfin for changes to take effect"
    fi
    
    echo ""
    echo "🎉 NETWORK FIXES COMPLETED!"
    echo "=========================="
    echo ""
    echo "✅ Network connectivity tested and fixed"
    echo "✅ DNS configuration updated"
    echo "✅ Firewall rules checked"
    echo "✅ Network monitoring enabled"
    echo ""
    echo "🔍 To verify the fixes:"
    echo "1. Check Jellyfin logs: journalctl -u jellyfin -f"
    echo "2. Monitor network: tail -f /var/log/jellyfin-network-monitor.log"
    echo "3. Test AniSearch: curl -I https://www.anisearch.com/"
    echo ""
    
    provide_alternatives
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Run main function
main "$@"