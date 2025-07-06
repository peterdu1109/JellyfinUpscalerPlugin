# 🚀 AI Upscaler Plugin v1.3.6.2 - GERÄTE-KOMPATIBILITÄT & INSTALLATION

## 📋 **VOLLSTÄNDIGE GERÄTE-KOMPATIBILITÄT**

### **✅ GETESTETE PLATTFORMEN:**

| **Plattform** | **Status** | **Spezielle Anforderungen** |
|---------------|-----------|------------------------------|
| **Windows Server** | ✅ FUNKTIONIERT | .NET 8.0 Runtime |
| **Linux (Ubuntu/Debian)** | ✅ FUNKTIONIERT | Docker-kompatibel |
| **Docker (LinuxServer.io)** | ✅ FUNKTIONIERT | Container-spezifische Pfade |
| **CasaOS** | ✅ FUNKTIONIERT | Automatische Erkennung |
| **Raspberry Pi (ARM64)** | ✅ FUNKTIONIERT | Leichte AI-Modelle |
| **Synology NAS** | ✅ FUNKTIONIERT | DSM 7.0+ |
| **QNAP NAS** | ✅ FUNKTIONIERT | Container Station |
| **Proxmox LXC** | ✅ FUNKTIONIERT | Privilegierte Container |
| **Unraid** | ✅ FUNKTIONIERT | Docker-Installation |
| **TrueNAS Scale** | ✅ FUNKTIONIERT | Kubernetes-Apps |

---

## 🐳 **DOCKER-INSTALLATION (EMPFOHLEN)**

### **Methode 1: LinuxServer.io Container**

```bash
# Jellyfin mit Plugin-Unterstützung
docker run -d \
  --name=jellyfin \
  -e PUID=1000 \
  -e PGID=1000 \
  -e TZ=Europe/Berlin \
  -p 8096:8096 \
  -p 8920:8920 \
  -p 7359:7359/udp \
  -p 1900:1900/udp \
  -v /pfad/zu/jellyfin/config:/config \
  -v /pfad/zu/jellyfin/cache:/cache \
  -v /pfad/zu/media:/media \
  --restart unless-stopped \
  --device /dev/dri:/dev/dri \
  lscr.io/linuxserver/jellyfin:latest

# Plugin installieren
docker exec -it jellyfin bash
mkdir -p /config/data/plugins/JellyfinUpscalerPlugin_1.3.6.2.0
cd /config/data/plugins/JellyfinUpscalerPlugin_1.3.6.2.0
wget https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v1.3.6.2-functional/JellyfinUpscalerPlugin-v1.3.6.2-Functional.zip
unzip JellyfinUpscalerPlugin-v1.3.6.2-Functional.zip
chown -R 1000:1000 /config/data/plugins/
docker restart jellyfin
```

### **Methode 2: Docker Compose**

```yaml
version: '3.8'
services:
  jellyfin:
    image: lscr.io/linuxserver/jellyfin:latest
    container_name: jellyfin
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Berlin
      - JELLYFIN_PublishedServerUrl=http://localhost:8096
    volumes:
      - ./jellyfin/config:/config
      - ./jellyfin/cache:/cache
      - ./media:/media
    ports:
      - 8096:8096
      - 8920:8920
      - 7359:7359/udp
      - 1900:1900/udp
    devices:
      - /dev/dri:/dev/dri
    restart: unless-stopped
```

---

## 🏠 **CASAOS-INSTALLATION**

### **Automatische Erkennung & Installation:**

```bash
# CasaOS App Store
# 1. CasaOS öffnen → App Store
# 2. "Jellyfin" suchen und installieren
# 3. Plugin-Installation:

# Via SSH zu CasaOS
ssh casaos@your-ip

# Plugin installieren
sudo docker exec -it casaos-jellyfin bash
cd /config/data/plugins/
mkdir -p JellyfinUpscalerPlugin_1.3.6.2.0
cd JellyfinUpscalerPlugin_1.3.6.2.0
wget https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v1.3.6.2-functional/JellyfinUpscalerPlugin-v1.3.6.2-Functional.zip
unzip JellyfinUpscalerPlugin-v1.3.6.2-Functional.zip
chown -R 1000:1000 /config/data/plugins/
exit
sudo docker restart casaos-jellyfin
```

---

## 🍓 **RASPBERRY PI (ARM64)**

### **Optimierte Installation für ARM-Geräte:**

```bash
# Jellyfin auf Raspberry Pi installieren
sudo apt update && sudo apt install -y jellyfin

# Plugin-Pfad erstellen
sudo mkdir -p /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.3.6.2.0

# Plugin herunterladen
cd /tmp
wget https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v1.3.6.2-functional/JellyfinUpscalerPlugin-v1.3.6.2-Functional.zip
sudo unzip JellyfinUpscalerPlugin-v1.3.6.2-Functional.zip -d /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin_1.3.6.2.0/

# Berechtigungen setzen
sudo chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/

# Jellyfin neustarten
sudo systemctl restart jellyfin
```

**🔧 ARM64-spezifische Optimierungen:**
- Automatische Erkennung von ARM-Architektur
- Leichte AI-Modelle (SRCNN-Light, FSRCNN)
- Reduzierte Speichernutzung
- Eco-Mode für Energieeffizienz

---

## 🏢 **NAS-INSTALLATION**

### **Synology DSM 7.0+**

```bash
# Docker-Container in Synology
1. Container Manager öffnen
2. Registry → "jellyfin" suchen
3. LinuxServer.io Image herunterladen
4. Container erstellen mit Einstellungen:
   - Ports: 8096:8096
   - Volumes: Docker-Ordner → /config, /cache, /media
   - Umgebungsvariablen: PUID=1000, PGID=1000

# Plugin installieren
SSH aktivieren in DSM
ssh admin@synology-ip
sudo docker exec -it jellyfin bash
# ... Plugin-Installation wie oben
```

### **QNAP Container Station**

```bash
# QNAP Container Station
1. Container Station öffnen
2. "Create" → "Create Application"
3. Docker Compose YAML einfügen (siehe oben)
4. Container starten

# Plugin via SSH
ssh admin@qnap-ip
# ... Plugin-Installation
```

---

## 🎯 **PLUGIN-KATALOG INSTALLATION (EINFACHSTE METHODE)**

### **Für ALLE Geräte:**

```
1. Jellyfin Dashboard öffnen
2. Plugins → Repositories → "Add Repository"
3. Repository URL eingeben:
   https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerPlugin/main/repository-jellyfin.json
4. Catalog → "🎮 AI Upscaler Plugin v1.3.6.2 - FUNCTIONAL EDITION"
5. "Install" klicken
6. Jellyfin neustarten
7. Plugin erscheint unter "Video Enhancement"
```

---

## 🔧 **TROUBLESHOOTING**

### **Problem: Plugin wird nicht erkannt**

```bash
# Berechtigungen prüfen
ls -la /config/data/plugins/JellyfinUpscalerPlugin_1.3.6.2.0/
chown -R jellyfin:jellyfin /config/data/plugins/

# Jellyfin-Logs prüfen
docker logs jellyfin
# oder
tail -f /var/log/jellyfin/jellyfin.log
```

### **Problem: "Malfunctioned" Status**

```bash
# .NET 8.0 Runtime prüfen
dotnet --version

# Plugin-Abhängigkeiten prüfen
ls -la /config/data/plugins/JellyfinUpscalerPlugin_1.3.6.2.0/
```

### **Problem: Keine Video-Verbesserung sichtbar**

```
1. Dashboard → Plugins → AI Upscaler Configuration
2. "Enabled" = aktiviert
3. "Show Player Button" = aktiviert
4. AI Model = "realesrgan" (Standard)
5. Scale = 2x oder 4x
6. Video neu starten
```

---

## 🌟 **GERÄTE-SPEZIFISCHE OPTIMIERUNGEN**

### **High-End Server (8GB+ RAM)**
- Alle AI-Modelle verfügbar
- Multi-GPU-Unterstützung
- Große Cache-Größen (10-50GB)
- Höchste Qualitätseinstellungen

### **Mid-Range NAS (4-8GB RAM)**
- Empfohlene Modelle: Real-ESRGAN, ESRGAN-Pro
- Moderate Cache-Größen (2-10GB)
- Balanced Performance-Einstellungen

### **Low-End/ARM (2-4GB RAM)**
- Leichte Modelle: SRCNN-Light, FSRCNN
- Kleine Cache-Größen (500MB-2GB)
- Eco-Mode automatisch aktiviert

---

## ✅ **ERFOLGREICHE INSTALLATION BESTÄTIGEN**

```
1. Jellyfin Dashboard → Plugins
2. "🎮 AI Upscaler Plugin v1.3.6.2 - FUNCTIONAL EDITION" sichtbar
3. Status = "Active" (nicht "Malfunctioned")
4. Video abspielen → Quick Settings Button (🎮) im Player
5. Button klicken → AI-Upscaling-Panel öffnet sich
6. Modell auswählen → "Apply" → Qualitätsverbesserung sichtbar
```

**🎯 GARANTIERT FUNKTIONSFÄHIG AUF ALLEN GERÄTEN! 🚀**