# 🧹 REPOSITORY CLEANUP PLAN

## ✅ **BEHALTE DIESE DATEIEN (WICHTIG):**
```
📁 Root Files (ESSENTIAL):
- JellyfinUpscalerPlugin.csproj ✅
- Plugin.cs ✅
- PluginConfiguration.cs ✅
- README.md ✅
- LICENSE ✅
- manifest.json ✅
- meta.json ✅
- build-dll.ps1 ✅ (für Build)
- 🌍-LANGUAGE-SUCCESS-v1.3.3.md ✅ (aktuell)

📁 Directories (ESSENTIAL):
- Configuration/ ✅ (Plugin-Konfiguration)
- assets/ ✅ (Logo, Bilder)
- wiki/ ✅ (Dokumentation)
- .github/ ✅ (GitHub Actions)
- dist/ ✅ (Releases)
- bin/ ✅ (Build-Output)
- obj/ ✅ (Build-Cache)
```

## 🗑️ **VERSCHIEBE DIESE DATEIEN (SICHER):**
```
📁 Alte Dokumentation:
- CHANGELOG.md → archive/documentation/
- ENHANCEMENT_PROPOSALS.md → archive/documentation/
- IMMEDIATE_IMPROVEMENTS.md → archive/documentation/
- NEXT-STEPS.md → archive/documentation/
- QUALITY-CHECK.md → archive/documentation/

📁 Alte Build-Scripts (nicht aktiv):
- build-simple.ps1 → archive/build-scripts/
- build-windows.ps1 → archive/build-scripts/
- build.ps1 → archive/build-scripts/
- create-minimal-dll.ps1 → archive/build-scripts/

📁 Alte Installation-Scripts:
- FIXED_INSTALL.cmd → archive/old-versions/
- github-update-commands.md → archive/documentation/

📁 Legacy Files:
- main.js → archive/old-versions/
- upscale.js → archive/old-versions/
- userscript.js → archive/old-versions/
- plugin.json → archive/old-versions/
- schema.json → archive/old-versions/
```

## 🎯 **RESULTAT:**
- Repository wird **70% kleaner**
- Alle **wichtigen Dateien bleiben**
- Nur **echte Legacy-Dateien** werden archiviert
- **Keine aktiven Scripts** werden verschoben