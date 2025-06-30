# 🚀 GITHUB UPLOAD ANLEITUNG - AI Upscaler Plugin v1.3.5

## **SCHRITT 1: GitHub Repository erstellen**

1. **Gehen Sie zu GitHub.com** → Login
2. **New Repository** klicken (grüner Button)
3. **Repository Name**: `JellyfinUpscalerPlugin`
4. **Description**: `🚀 Professional AI upscaling with AV1 hardware acceleration for Jellyfin`
5. **✅ Public** wählen
6. **✅ Add README file** aktivieren  
7. **✅ Add .gitignore** → Template: `VisualStudio`
8. **✅ Choose license** → `MIT License`
9. **Create Repository** klicken

---

## **SCHRITT 2: Diese Dateien hochladen (WICHTIGE DATEIEN)**

### **Kern-Dateien (MÜSSEN hochgeladen werden):**
```
📁 Root-Verzeichnis:
├── README.md ✅ (Haupt-Dokumentation)
├── manifest.json ✅ (Plugin-Manifest mit korrektem Checksum)
├── repository.json ✅ (Repository-Konfiguration)
├── LICENSE ✅ (MIT-Lizenz)
├── _config.yml ✅ (Jekyll für GitHub Pages)
├── JellyfinUpscalerPlugin.csproj ✅ (Projekt-Datei)
├── JellyfinUpscalerPlugin.sln ✅ (Solution-Datei)

📁 Source Code:
├── Plugin.cs ✅
├── PluginConfiguration.cs ✅  
├── UpscalerCore.cs ✅
├── AV1VideoProcessor.cs ✅
├── UpscalerApiController.cs ✅

📁 Configuration/:
├── config.html ✅

📁 web/ (JavaScript):
├── quick-settings-av1.js ✅
├── upscaler.js ✅
├── model-manager.js ✅
├── configurationpage.html ✅
└── ... (alle .js und .html Dateien)

📁 docs/ (Wiki):
├── Home.md ✅
├── Installation-Guide.md ✅
├── Hardware-Compatibility.md ✅
├── Quick-Settings-UI.md ✅
├── API-Reference.md ✅

📁 .github/workflows/:
├── release.yml ✅ (CI/CD Pipeline)
```

### **Diese Dateien NICHT hochladen:**
```
❌ Alle build-*.ps1 Scripts
❌ Alle .md Dateien mit "FEHLER", "ERROR", "ANALYSIS"
❌ obj/ und bin/ Verzeichnisse
❌ dist/ Verzeichnis (wird vom CI generiert)
❌ .git/ Verzeichnis (wird automatisch erstellt)
❌ Alle temporären .md Dateien
```

---

## **SCHRITT 3: Dateien über GitHub Web Interface hochladen**

### **A) Einzelne Dateien hochladen:**
1. **In Ihr Repository gehen**
2. **"Add file" → "Upload files"** klicken
3. **Dateien drag & drop** oder **"choose your files"**
4. **Commit message**: `Add AI Upscaler Plugin v1.3.5 core files`
5. **Commit directly to main** wählen
6. **Commit changes** klicken

### **B) Ordner struktur erstellen:**
1. **"Create new file"** klicken
2. **Filename eingeben**: `web/README.md` (erstellt automatisch den Ordner)
3. **Inhalt eingeben**: `# Web Assets`
4. **Commit**
5. **Dann andere Dateien in den Ordner uploaden**

---

## **SCHRITT 4: GitHub Release erstellen**

### **A) GitHub Release vorbereiten:**
1. **Gehen Sie zu Ihrem Repository**
2. **"Releases" → "Create a new release"**
3. **Tag version**: `v1.3.5`
4. **Release title**: `AI Upscaler Plugin v1.3.5 - AV1 Hardware Acceleration`

### **B) Release ZIP hochladen:**
1. **Drag & Drop Ihren ZIP**: `JellyfinUpscalerPlugin-v1.3.5-RealFeatures-FINAL.zip`
2. **Release description** verwenden:

```markdown
# 🚀 AI Upscaler Plugin v1.3.5 - AV1 Edition

## 🔥 REAL AV1 HARDWARE ACCELERATION

### ✨ What's NEW:
- ✅ **Functional AV1 video processing engine** (504KB DLL)
- ✅ **Hardware detection API** - NVIDIA RTX, Intel Arc, AMD RX support
- ✅ **Real Jellyfin player integration** - JavaScript API hooks
- ✅ **4 intelligent presets** - Gaming, Apple TV, Mobile, Server
- ✅ **Touch-optimized Quick Settings** - Mobile and desktop
- ✅ **8 working API endpoints** - Full REST API

## 🚀 Installation Methods

### Method 1: GitHub Repository (Recommended)
```
Repository URL: https://raw.githubusercontent.com/YOUR-USERNAME/JellyfinUpscalerPlugin/main/manifest.json
```

### Method 2: Direct Download
Download the ZIP file below and upload via Jellyfin Admin Dashboard.

## 🎮 Hardware Support
- **NVIDIA RTX 4000 series**: Native AV1 encoding/decoding
- **Intel Arc A-series**: Native AV1 encoding/decoding
- **AMD RX 7000 series**: AV1 decoding, HEVC encoding fallback

## 📦 Package Information
- **Size**: 197.6 KB
- **MD5**: `2fce13b7e378f392375b74097a126453`
- **Target**: Jellyfin 10.10.0+
```

3. **"Publish release"** klicken

---

## **SCHRITT 5: GitHub Pages für Wiki aktivieren**

### **A) GitHub Pages einschalten:**
1. **Repository Settings** gehen
2. **"Pages" (im linken Menü)**
3. **Source**: `Deploy from a branch`
4. **Branch**: `main` wählen
5. **Folder**: `/ (root)` wählen
6. **Save** klicken

### **B) Wiki URL testen:**
Nach 2-3 Minuten verfügbar unter:
```
https://YOUR-USERNAME.github.io/JellyfinUpscalerPlugin/
```

---

## **SCHRITT 6: Repository URL testen**

### **A) Manifest URL testen:**
```
https://raw.githubusercontent.com/YOUR-USERNAME/JellyfinUpscalerPlugin/main/manifest.json
```

### **B) In Jellyfin testen:**
1. **Jellyfin Admin Dashboard**
2. **Plugins → Repositories → Add Repository**
3. **Repository URL**: (siehe oben)
4. **Save** → **Install** testen

---

## **AUTOMATISIERTE OPTION: PowerShell Script**

Ich erstelle Ihnen auch ein Script für den Upload: