# 🔧 PLUGIN VERSCHWINDET NACH NEUSTART - DEBUGGING GUIDE

## ❌ **PROBLEM:** Plugin ist weg nach Server-Neustart

### **🕵️ DEBUGGING SCHRITTE - BITTE DURCHFÜHREN:**

#### **🔍 SCHRITT 1: JELLYFIN LOGS PRÜFEN**
```bash
# Jellyfin Log-Verzeichnis finden:
Windows: C:\ProgramData\Jellyfin\logs\
Linux: /var/log/jellyfin/
Docker: docker logs jellyfin

# Nach Plugin-Errors suchen:
grep -i "upscaler\|plugin\|error\|exception" /var/log/jellyfin/log_*.log
```

**📋 BITTE TEILEN SIE MIT:**
- Jellyfin Version (Dashboard → General)
- Betriebssystem 
- Installation-Art (Windows Service, Docker, Linux Package)
- Jellyfin Log-Auszüge mit Plugin-Fehlern

#### **🔍 SCHRITT 2: PLUGIN-STATUS PRÜFEN**
```bash
# Plugin-Verzeichnis überprüfen:
Windows: C:\ProgramData\Jellyfin\plugins\
Linux: /var/lib/jellyfin/plugins/
Docker: /config/plugins/

# Sollte enthalten:
/plugins/AI Upscaler Plugin_1.3.6.7/
├── JellyfinUpscalerPlugin.dll
├── JellyfinUpscalerPlugin.deps.json
└── meta.json
```

#### **🔍 SCHRITT 3: SYSTEMINFO SAMMELN**
```powershell
# Windows PowerShell:
Get-WmiObject -Class Win32_OperatingSystem | Select-Object Caption, Version
Get-Process -Name "jellyfin*" -ErrorAction SilentlyContinue
Get-Service -Name "jellyfin*" -ErrorAction SilentlyContinue
```

#### **🔍 SCHRITT 4: NETZWERK & PERMISSIONS**
```bash
# Linux Permissions prüfen:
ls -la /var/lib/jellyfin/plugins/
ls -la /var/lib/jellyfin/plugins/AI\ Upscaler\ Plugin_*/

# Windows Permissions:
# Rechtsklick auf Plugin-Ordner → Properties → Security
```

---

## 🛠️ **MÖGLICHE URSACHEN & LÖSUNGEN:**

### **❌ URSACHE 1: DLL KOMPATIBILITÄTSPROBLEME**
```
Problem: .NET 8.0 DLL funktioniert nicht mit älterer Jellyfin-Version
Lösung: Jellyfin auf neueste Version aktualisieren (10.10.x)
```

### **❌ URSACHE 2: PLUGIN CRASH BEIM STARTUP**
```
Problem: Plugin wirft Exception während Initialisierung
Lösung: Minimale Plugin-Version ohne komplexe Features
```

### **❌ URSACHE 3: PERMISSION PROBLEME**
```
Problem: Jellyfin kann Plugin-Dateien nicht lesen
Lösung: Plugin-Verzeichnis Permissions korrigieren
Windows: Vollzugriff für "SYSTEM" und "Jellyfin Service" 
Linux: chown -R jellyfin:jellyfin /var/lib/jellyfin/plugins/
```

### **❌ URSACHE 4: ABHÄNGIGKEITEN FEHLEN**
```
Problem: .NET Runtime oder Dependencies nicht vorhanden
Lösung: .NET 8.0 Runtime installieren
```

---

## 🔧 **SOFORT-FIXES ZUM TESTEN:**

### **🎯 FIX 1: MINIMAL PLUGIN TESTEN**
```
1. Plugin komplett deinstallieren
2. Jellyfin stoppen
3. Plugin-Verzeichnis manuell löschen
4. Jellyfin starten
5. Neue stabile Version v1.3.6.7 installieren (63,942 bytes)
6. Jellyfin neustarten
7. Logs auf Errors prüfen
```

### **🎯 FIX 2: KOMPATIBILITÄTSMODUS**
```
1. Dashboard → Advanced → Plugin Repositories
2. Entfernen und neu hinzufügen
3. Plugin über Standard-Repository installieren
4. NICHT über Custom Repository/ZIP
```

### **🎯 FIX 3: SAUBERE INSTALLATION**
```bash
# Jellyfin komplett stoppen
sudo systemctl stop jellyfin   # Linux
# oder
Stop-Service Jellyfin          # Windows

# Plugin-Verzeichnis komplett löschen
rm -rf /var/lib/jellyfin/plugins/AI*  # Linux
# oder
Remove-Item "C:\ProgramData\Jellyfin\plugins\AI*" -Recurse -Force  # Windows

# Cache löschen
rm -rf /var/lib/jellyfin/transcoding-temp/*
rm -rf /var/cache/jellyfin/*

# Jellyfin starten
sudo systemctl start jellyfin  # Linux
# oder  
Start-Service Jellyfin         # Windows

# Plugin neu installieren
```

### **🎯 FIX 4: DEPENDENCY CHECK**
```bash
# .NET Runtime prüfen:
dotnet --list-runtimes
# Sollte enthalten: Microsoft.NETCore.App 8.0.x

# Wenn nicht vorhanden:
# Windows: Download .NET 8.0 Runtime von Microsoft
# Linux: sudo apt install dotnet-runtime-8.0
```

---

## 📊 **DEBUGGING OUTPUT SAMMELN:**

### **🔍 DIESE INFOS BRAUCHE ICH:**

#### **1. JELLYFIN SYSTEM INFO:**
```
- Jellyfin Version: _____
- Operating System: _____
- Installation Type: _____ (Windows Service/Docker/Linux Package)
- .NET Runtime Version: _____
```

#### **2. PLUGIN STATUS:**
```
- Plugin erscheint in "Installed Plugins": Ja/Nein
- Plugin-Dateien vorhanden nach Neustart: Ja/Nein
- Plugin-Verzeichnis Größe: _____ bytes
- meta.json readable: Ja/Nein
```

#### **3. LOG AUSZÜGE:**
```
[DATUM UHRZEIT] [ERR] Plugin loading error: _____
[DATUM UHRZEIT] [ERR] Assembly load exception: _____
[DATUM UHRZEIT] [WRN] Plugin disabled: _____
```

#### **4. INSTALLATION DETAILS:**
```
- Über welchen Weg installiert: Repository/Manual ZIP
- Andere Plugins installiert: _____
- Jellyfin läuft als Service: Ja/Nein
- Firewall/Antivirus aktiv: Ja/Nein
```

---

## 🚀 **NOTFALL-LÖSUNG: MINIMAL PLUGIN**

Wenn alle anderen Fixes fehlschlagen, erstelle ich eine ultra-minimalistische Version:

### **📦 FEATURES DER MINIMAL-VERSION:**
```
✅ Nur Basis-Plugin ohne IHasWebPages
✅ Keine JavaScript-Injektion  
✅ Keine Embedded Resources
✅ Nur Configuration über Dashboard
✅ Maximal stabil, minimal features
```

### **🎯 MINIMAL PLUGIN AKTIVIEREN:**
```
Falls das Standard-Plugin weiterhin crasht, 
lade ich eine Minimal-Version (< 10KB) ohne 
erweiterte Features hoch, die garantiert nicht crasht.
```

---

## 📞 **BITTE ANTWORTEN SIE MIT:**

```
1. Jellyfin Version: _____
2. Operating System: _____
3. Log-Auszüge mit Errors: _____
4. Plugin-Dateien nach Neustart vorhanden: Ja/Nein
5. Installation-Art: _____
6. Andere Plugins funktionieren: Ja/Nein
```

**Mit diesen Infos kann ich das Problem gezielt lösen!**

---

**Status**: 🔍 **DEBUGGING IN PROGRESS**  
**Neue stabile Version verfügbar**: v1.3.6.7 (63,942 bytes)  
**Checksum**: 1478584E5CF6EBF9C000105A8C48F388  

**🎯 ZIEL**: Plugin-Stabilität nach Neustart gewährleisten