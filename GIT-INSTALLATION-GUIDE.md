# 🔗 Git Installation Guide für NAS-Geräte

## 🚀 **FÜR FORTGESCHRITTENE BENUTZER - DIREKTE GIT INSTALLATION**

### **Vorteile der Git-Installation:**
- ✅ **Automatische Updates** mit `git pull`
- ✅ **Immer neueste Version** direkt vom Repository
- ✅ **Einfaches Rollback** zu vorherigen Versionen
- ✅ **Entwickler-Features** und Beta-Funktionen

---

## 📋 **VORAUSSETZUNGEN:**

### **System Requirements:**
- Git installiert auf dem NAS
- SSH/Terminal-Zugang zum NAS
- Jellyfin 10.10.0+
- Mindestens 500MB freier Speicher

### **Unterstützte NAS-Systeme:**
- ✅ **Synology DSM 7.0+**
- ✅ **QNAP QTS 5.0+**
- ✅ **Unraid 6.10+**
- ✅ **TrueNAS Scale**
- ✅ **OpenMediaVault**
- ✅ **Docker Container**

---

## 🛠️ **INSTALLATION SCHRITT-FÜR-SCHRITT:**

### **Schritt 1: Jellyfin stoppen**
```bash
# Synology DSM
sudo systemctl stop jellyfin

# QNAP
/etc/init.d/jellyfin.sh stop

# Docker
docker stop jellyfin

# Unraid
/etc/rc.d/rc.jellyfin stop
```

### **Schritt 2: Plugin-Verzeichnis lokalisieren**
```bash
# Standard-Pfade
PLUGIN_DIR="/var/lib/jellyfin/plugins"          # Linux
PLUGIN_DIR="/config/plugins"                   # Docker
PLUGIN_DIR="/volume1/@appstore/jellyfin/plugins" # Synology
```

### **Schritt 3: Git Repository klonen**
```bash
cd $PLUGIN_DIR
git clone https://github.com/Kuschel-code/JellyfinUpscalerPlugin.git
cd JellyfinUpscalerPlugin
```

### **Schritt 4: Build-Abhängigkeiten installieren (optional)**
```bash
# .NET 8.0 SDK installieren (falls nicht vorhanden)
# Für vorgefertigte DLL überspringen

# Oder vorgefertigte DLL kopieren
cp bin/Release/net8.0/JellyfinUpscalerPlugin.dll ./
```

### **Schritt 5: Plugin aktivieren**
```bash
# Konfiguration kopieren
cp meta.json ./
cp -r Configuration ./
cp -r web ./
cp -r shaders ./
```

### **Schritt 6: Berechtigungen setzen**
```bash
# Besitzer auf jellyfin setzen
chown -R jellyfin:jellyfin $PLUGIN_DIR/JellyfinUpscalerPlugin

# Ausführungsrechte setzen
chmod +x JellyfinUpscalerPlugin.dll
```

### **Schritt 7: Jellyfin starten**
```bash
# Synology DSM
sudo systemctl start jellyfin

# QNAP
/etc/init.d/jellyfin.sh start

# Docker
docker start jellyfin

# Unraid
/etc/rc.d/rc.jellyfin start
```

---

## 🔄 **UPDATES MIT GIT:**

### **Automatisches Update-Script erstellen:**
```bash
#!/bin/bash
# update-upscaler.sh

echo "🔄 Updating AI Upscaler Plugin..."

cd /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin

# Jellyfin stoppen
systemctl stop jellyfin

# Git pull für Updates
git pull origin main

# Neue DLL falls verfügbar
if [ -f "bin/Release/net8.0/JellyfinUpscalerPlugin.dll" ]; then
    cp bin/Release/net8.0/JellyfinUpscalerPlugin.dll ./
    echo "✅ DLL updated"
fi

# Berechtigungen prüfen
chown -R jellyfin:jellyfin .
chmod +x JellyfinUpscalerPlugin.dll

# Jellyfin starten
systemctl start jellyfin

echo "🎉 Update completed!"
```

### **Script ausführbar machen:**
```bash
chmod +x update-upscaler.sh
./update-upscaler.sh
```

---

## 🚨 **TROUBLESHOOTING:**

### **Problem: Git nicht gefunden**
```bash
# Synology: Entware installieren
# QNAP: Git aus dem App Center installieren
# Unraid: Community Applications -> Git

# Oder manueller Download:
wget https://github.com/Kuschel-code/JellyfinUpscalerPlugin/archive/refs/heads/main.zip
unzip main.zip
```

### **Problem: Keine Build-Umgebung**
```bash
# Vorgefertigte DLL verwenden
curl -L -o JellyfinUpscalerPlugin.dll \
  https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/download/v1.3.6-ultimate/JellyfinUpscalerPlugin.dll
```

### **Problem: Berechtigungsfehler**
```bash
# SELinux deaktivieren (temporär)
setenforce 0

# Oder Plugin-Verzeichnis in Home-Directory
cp -r JellyfinUpscalerPlugin ~/jellyfin-plugins/
```

---

## 🔧 **ERWEITERTE OPTIONEN:**

### **Development Branch verwenden:**
```bash
git checkout develop
git pull origin develop
```

### **Spezifische Version auswählen:**
```bash
git tag -l                    # Verfügbare Versionen anzeigen
git checkout v1.3.6-ultimate # Spezifische Version
```

### **Lokale Änderungen verwalten:**
```bash
git stash                     # Änderungen sichern
git pull                      # Update
git stash pop                 # Änderungen wiederherstellen
```

---

## 📞 **SUPPORT:**

Bei Problemen mit der Git-Installation:

1. **GitHub Issues:** [Melde ein Problem](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/issues)
2. **Wiki:** [Vollständige Dokumentation](https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki)
3. **Jellyfin Forum:** Community-Support

---

**💡 Tipp:** Für Produktionssysteme wird die ZIP-Installation empfohlen. Git-Installation ist ideal für Entwickler und Tester!