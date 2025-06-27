# 🔧 INSTALLATION-FEHLER BEHOBEN

## ❌ **Problem identifiziert:**
```
System.Net.Http.HttpRequestException: Response status code does not indicate success: 404 (Not Found)
URL: POST /Packages/Installed/Jellyfin%20Upscaler
```

**Ursache**: Die sourceUrl in manifest.json zeigt auf ein nicht existierendes GitHub Release.

## ✅ **Lösung:**

### **Option 1: Lokale Installation (Sofort verfügbar)**
```bash
# Download der funktionierenden ZIP-Datei
curl -O https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscalerPlugin-v1.3.1.zip
```

### **Option 2: Direkte Datei-Installation**
1. Verwende die lokale ZIP-Datei: `dist/JellyfinUpscalerPlugin-v1.3.1.zip`
2. Jellyfin Dashboard → Plugins → Katalog → "Datei hochladen"
3. ZIP-Datei auswählen und installieren

### **Option 3: Manifest korrigieren**
```json
{
    "sourceUrl": "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/raw/main/dist/JellyfinUpscalerPlugin-v1.3.1.zip"
}
```

## 🚀 **Sofort-Lösung:**
Das Plugin funktioniert - nur die Download-URL ist falsch!