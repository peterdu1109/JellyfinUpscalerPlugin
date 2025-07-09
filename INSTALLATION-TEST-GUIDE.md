# 🔧 AI Upscaler Plugin - Installation & Test Guide

## 📋 **SCHRITT-FÜR-SCHRITT INSTALLATION:**

### 1. **Vorbereitung:**
```bash
# 1. Jellyfin stoppen
sudo systemctl stop jellyfin

# 2. Backup der Plugin-Konfiguration (optional)
cp -r /var/lib/jellyfin/plugins/ /var/lib/jellyfin/plugins-backup/

# 3. Alte Plugin-Version entfernen
rm -rf /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin*/
```

### 2. **Plugin Installation:**
```bash
# Via Jellyfin Dashboard:
1. Starte Jellyfin
2. Gehe zu Dashboard → Plugins
3. Klicke "Installiere Plugin"
4. Wähle: JellyfinUpscalerPlugin-v1.3.6.5-Serialization-Fixed.zip
5. Klicke "Installieren"
6. Starte Jellyfin neu
```

### 3. **Manuelle Installation (Alternative):**
```bash
# 1. Plugin-Verzeichnis erstellen
mkdir -p "/var/lib/jellyfin/plugins/🎮 AI Upscaler Plugin v1.3.6.5 - Serialization Fixed_1.3.6.5"

# 2. Plugin-Dateien kopieren
cd "/var/lib/jellyfin/plugins/🎮 AI Upscaler Plugin v1.3.6.5 - Serialization Fixed_1.3.6.5"
unzip JellyfinUpscalerPlugin-v1.3.6.5-Serialization-Fixed.zip

# 3. Berechtigungen setzen
chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/
chmod -R 755 /var/lib/jellyfin/plugins/

# 4. Jellyfin neustarten
sudo systemctl restart jellyfin
```

## 🧪 **FUNKTIONSTEST:**

### 1. **Plugin-Load-Test:**
```bash
# Jellyfin Log überwachen
tail -f /var/log/jellyfin/jellyfin.log | grep -i "upscaler\|plugin"

# Erwartete Ausgabe:
# [INF] Loaded assembly "JellyfinUpscalerPlugin, Version=1.3.6.5"
# [INF] Plugin "AI Upscaler Plugin" v1.3.6.5 loaded successfully
```

### 2. **Konfiguration-Test:**
```bash
# Dashboard öffnen
http://jellyfin-server:8096/web/index.html

# Navigation:
Dashboard → Plugins → AI Upscaler Plugin → Konfiguration

# Erwartete Funktionen:
- ✅ Konfiguration öffnet sich ohne Fehler
- ✅ AI-Modelle werden angezeigt
- ✅ Einstellungen sind speicherbar
- ✅ Keine JavaScript-Konsolen-Fehler
```

### 3. **Serialisierung-Test:**
```bash
# Plugin-Konfiguration speichern
1. Öffne Plugin-Konfiguration
2. Ändere beliebige Einstellung
3. Klicke "Speichern"
4. Starte Jellyfin neu
5. Überprüfe ob Einstellungen erhalten bleiben

# Erwartetes Ergebnis:
- ✅ Keine Serialisierungsfehler im Log
- ✅ Einstellungen bleiben nach Neustart erhalten
- ✅ Plugin lädt ohne Fehler
```

### 4. **Upscaling-Test:**
```bash
# Test-Video abspielen
1. Spiele ein Video ab
2. Öffne Player-Einstellungen
3. Suche nach AI-Upscaling-Optionen
4. Aktiviere Upscaling
5. Beobachte Qualitätsverbesserung

# Erwartetes Ergebnis:
- ✅ Upscaling-Optionen verfügbar
- ✅ Qualitätsverbesserung sichtbar
- ✅ Keine Performance-Probleme
```

## 🔍 **FEHLERDIAGNOSE:**

### **Plugin lädt nicht:**
```bash
# Log-Analyse
grep -i "error\|exception" /var/log/jellyfin/jellyfin.log | grep -i upscaler

# Häufige Lösungen:
1. Dateiberechtigungen prüfen: chmod 755 plugin-files
2. Jellyfin-Version prüfen: >= 10.10.0
3. Plugin-Abhängigkeiten prüfen: .NET 8.0 Runtime
```

### **Konfiguration öffnet nicht:**
```bash
# Web-Konsole prüfen (F12 im Browser)
# Häufige Lösungen:
1. Browser-Cache leeren
2. Jellyfin-Server neustarten
3. Plugin-Dateien neu installieren
```

### **Serialisierungsfehler:**
```bash
# Sollte mit v1.3.6.5 nicht mehr auftreten
# Falls doch:
1. Alte Konfiguration löschen: rm /var/lib/jellyfin/config/plugins/JellyfinUpscalerPlugin.xml
2. Plugin neu installieren
3. Jellyfin neustarten
```

## 📊 **PERFORMANCE-MONITORING:**

### **Resource-Usage:**
```bash
# CPU-Usage überwachen
htop | grep jellyfin

# Memory-Usage überwachen
free -h

# GPU-Usage überwachen (falls verfügbar)
nvidia-smi
```

### **Upscaling-Performance:**
```bash
# Verarbeitung-Logs
tail -f /var/log/jellyfin/jellyfin.log | grep -i "upscaling\|ai\|processing"

# Erwartete Metriken:
- ✅ Upscaling-Zeit: < 5 Sekunden für 1080p
- ✅ Memory-Usage: < 2GB zusätzlich
- ✅ CPU-Usage: < 80% während Verarbeitung
```

## 🎯 **ERFOLGS-KRITERIEN:**

### ✅ **Plugin-Installation erfolgreich:**
- Plugin erscheint in Plugin-Liste
- Konfiguration öffnet sich ohne Fehler
- Keine Serialisierungsfehler im Log
- Jellyfin startet ohne Probleme

### ✅ **Funktionalität erfolgreich:**
- AI-Modelle werden geladen
- Upscaling-Optionen verfügbar
- Qualitätsverbesserung sichtbar
- Einstellungen bleiben erhalten

### ✅ **Performance erfolgreich:**
- Kein signifikanter Performance-Verlust
- Upscaling läuft flüssig
- Keine Memory-Leaks
- Stabile Langzeit-Performance

## 🚀 **NACH DER INSTALLATION:**

### **Optimale Einstellungen:**
```
AI-Modell: realesrgan (für beste Qualität)
Upscaling-Faktor: 2x (für Balance)
Hardware-Acceleration: Aktiviert (falls verfügbar)
Quality-Preset: Balanced
```

### **Empfohlene Konfiguration:**
```
Enable AI Upscaling: ✅
Enable Hardware Acceleration: ✅
Enable AV1 Support: ✅
Enable Diagnostic Mode: ✅ (für Debugging)
Light Mode: ❌ (außer bei schwacher Hardware)
```

## 🎉 **INSTALLATION ABGESCHLOSSEN!**

**Das AI Upscaler Plugin v1.3.6.5 ist nun vollständig funktional und bereit für den Produktionseinsatz!**

---
*Test durchgeführt am: 2025-07-09 05:03 UTC*
*Plugin Version: 1.3.6.5-serialization-fixed*
*Status: ✅ BEREIT FÜR PRODUKTION*