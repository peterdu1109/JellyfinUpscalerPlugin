# 🔧 JELLYFIN SYSTEM FIXES - Crash.txt Issues Resolved

## 📋 **IDENTIFIED ISSUES FROM CRASH.TXT**

### **1. Critical Cache Directory Issue**
- **Error**: `System.IO.IOException: Device or resource busy : '/cache/transcodes'`
- **Location**: Line 53-54 in crash.txt
- **Impact**: Jellyfin cannot clean transcoding cache, leading to storage issues

### **2. Network Connection Failures**
- **Error**: `System.Net.Http.HttpRequestException: Connection refused (www.anisearch.com:443)`
- **Location**: Multiple occurrences (lines 72-87 and more)
- **Impact**: AniSearch plugin cannot fetch metadata

### **3. Playlist Directory Warnings**
- **Warning**: `Library folder "/config/data/playlists" is inaccessible or empty, skipping`
- **Location**: Lines 67-68
- **Impact**: Playlists may not function correctly

## 🔧 **COMPREHENSIVE FIXES**

### **Fix 1: Cache Directory Resolution**

**Problem**: Transcoding cache directory is locked by active processes.

**Solution**:
```bash
# Stop Jellyfin service
sudo systemctl stop jellyfin

# Clear transcoding cache manually
sudo rm -rf /cache/transcodes/*
sudo mkdir -p /cache/transcodes
sudo chown jellyfin:jellyfin /cache/transcodes
sudo chmod 755 /cache/transcodes

# Restart Jellyfin
sudo systemctl start jellyfin
```

**For Docker**:
```bash
# Stop container
docker stop jellyfin

# Clear cache volume
docker volume rm jellyfin-cache 2>/dev/null || true
docker volume create jellyfin-cache

# Restart container
docker start jellyfin
```

### **Fix 2: Network Connection Issues**

**Problem**: AniSearch plugin cannot connect to external API.

**Solution**:
```bash
# Test network connectivity
ping -c 4 www.anisearch.com
nslookup www.anisearch.com

# Check firewall rules
sudo ufw status
sudo iptables -L | grep DROP

# If blocked, allow HTTPS traffic
sudo ufw allow out 443/tcp
sudo ufw allow out 80/tcp
```

**Alternative**: Disable AniSearch plugin if not needed:
1. Go to Jellyfin Dashboard → Plugins
2. Find "AniSearch" plugin
3. Click "Disable" or "Uninstall"

### **Fix 3: Playlist Directory Creation**

**Problem**: Playlist directory is missing or inaccessible.

**Solution**:
```bash
# Create playlist directory
sudo mkdir -p /config/data/playlists
sudo chown jellyfin:jellyfin /config/data/playlists
sudo chmod 755 /config/data/playlists

# Restart Jellyfin to recognize the directory
sudo systemctl restart jellyfin
```

**For Docker**:
```bash
# Enter container
docker exec -it jellyfin bash

# Create directory inside container
mkdir -p /config/data/playlists
chown jellyfin:jellyfin /config/data/playlists
chmod 755 /config/data/playlists

# Exit and restart
exit
docker restart jellyfin
```

## 🚀 **AUTOMATED FIX SCRIPT**

Create this script to automatically fix all issues:

```bash
#!/bin/bash
# Jellyfin System Fixes Script

echo "🔧 Starting Jellyfin System Fixes..."

# Stop Jellyfin service
echo "⏹️ Stopping Jellyfin service..."
sudo systemctl stop jellyfin 2>/dev/null || echo "Service not running"

# Fix cache directory
echo "🗂️ Fixing cache directory..."
sudo rm -rf /cache/transcodes/* 2>/dev/null || true
sudo mkdir -p /cache/transcodes
sudo chown jellyfin:jellyfin /cache/transcodes 2>/dev/null || true
sudo chmod 755 /cache/transcodes

# Fix playlist directory
echo "📋 Fixing playlist directory..."
sudo mkdir -p /config/data/playlists
sudo chown jellyfin:jellyfin /config/data/playlists 2>/dev/null || true
sudo chmod 755 /config/data/playlists

# Test network connectivity
echo "🌐 Testing network connectivity..."
ping -c 2 www.anisearch.com > /dev/null 2>&1 && echo "✅ Network OK" || echo "❌ Network issues detected"

# Restart Jellyfin
echo "🔄 Restarting Jellyfin service..."
sudo systemctl start jellyfin

echo "✅ Jellyfin system fixes completed!"
echo "🔍 Check logs in 30 seconds to verify fixes"
```

## 🐳 **DOCKER-SPECIFIC FIXES**

### **Docker Compose Configuration**
```yaml
version: '3.8'
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    restart: unless-stopped
    volumes:
      - jellyfin-config:/config
      - jellyfin-cache:/cache
      - /path/to/media:/media
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Berlin
    ports:
      - "8096:8096"
    # Add health check
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8096/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    # Add resource limits
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 2G

volumes:
  jellyfin-config:
  jellyfin-cache:
```

### **Docker Fix Commands**
```bash
# Clean Docker setup
docker-compose down
docker volume prune -f
docker system prune -f

# Recreate with fixed configuration
docker-compose up -d

# Check logs
docker-compose logs -f jellyfin
```

## 📊 **MONITORING AND VERIFICATION**

### **Check System Health**
```bash
# Monitor Jellyfin logs
sudo journalctl -u jellyfin -f

# Check disk space
df -h /cache /config

# Monitor network connections
sudo netstat -tulpn | grep jellyfin

# Check plugin status
curl -s http://localhost:8096/System/Plugins
```

### **Verification Commands**
```bash
# Test cache directory
ls -la /cache/transcodes/
sudo -u jellyfin touch /cache/transcodes/test && rm /cache/transcodes/test && echo "✅ Cache writable"

# Test playlist directory
ls -la /config/data/playlists/
sudo -u jellyfin touch /config/data/playlists/test && rm /config/data/playlists/test && echo "✅ Playlists writable"

# Test network connectivity
curl -s -I https://www.anisearch.com/ | head -1
```

## 🎯 **EXPECTED RESULTS**

After applying these fixes:

### **Cache Issues**
- ✅ **No more cache errors** - Transcoding cache clears properly
- ✅ **Better performance** - No storage bottlenecks
- ✅ **Automatic cleanup** - Scheduled tasks work correctly

### **Network Issues**
- ✅ **Stable connections** - External API calls work
- ✅ **Metadata updates** - Anime metadata fetches successfully
- ✅ **Reduced errors** - Fewer connection timeout logs

### **Playlist Issues**
- ✅ **Playlists work** - Directory is accessible
- ✅ **No warnings** - Clean startup logs
- ✅ **User experience** - Playlist functionality restored

## 🔧 **PREVENTION MEASURES**

### **Regular Maintenance**
```bash
# Add to crontab (weekly cleanup)
0 2 * * 0 /usr/bin/docker system prune -f
0 3 * * 0 /bin/rm -rf /cache/transcodes/temp_*
```

### **Monitoring Script**
```bash
#!/bin/bash
# Monitor Jellyfin health
CACHE_SIZE=$(du -s /cache/transcodes 2>/dev/null | cut -f1)
if [ $CACHE_SIZE -gt 5000000 ]; then
    echo "⚠️ Cache size too large: ${CACHE_SIZE}KB"
    # Clean old files
    find /cache/transcodes -type f -mtime +7 -delete
fi
```

---

**All identified issues from crash.txt have been analyzed and comprehensive fixes provided!**