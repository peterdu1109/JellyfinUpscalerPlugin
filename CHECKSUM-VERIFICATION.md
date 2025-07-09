# 🔐 CHECKSUM VERIFICATION - SHA256 vs MD5

## 📋 **WARUM SHA256 UND NICHT MD5?**

### **🚨 SICHERHEITSVERGLEICH:**

| Hash-Algorithmus | Bit-Länge | Kollisionsresistenz | Sicherheitsstatus | Empfehlung |
|------------------|-----------|-------------------|------------------|------------|
| **MD5** | 128 Bit | ❌ **GEBROCHEN** | ❌ Unsicher | ⚠️ **NICHT VERWENDEN** |
| **SHA1** | 160 Bit | ❌ **GEBROCHEN** | ❌ Unsicher | ⚠️ **NICHT VERWENDEN** |
| **SHA256** | 256 Bit | ✅ **SICHER** | ✅ Standard | ✅ **EMPFOHLEN** |

### **🔍 TECHNISCHE REALITÄT:**

#### **✅ WARUM MD5 IN JELLYFIN PLUGINS:**
- **Kompatibilität**: Alle offiziellen Jellyfin-Plugins verwenden MD5
- **Ältere Geräte**: NAS-Systeme und embedded devices unterstützen MD5 besser
- **Jellyfin Standard**: Das offizielle Plugin-Repository verwendet MD5
- **Performance**: Schnell auf schwächeren Geräten (Pi, NAS)

#### **⚠️ SHA256 PROBLEME:**
- **Kompatibilität**: Nicht alle Jellyfin-Versionen unterstützen SHA256
- **Ältere Geräte**: Schwierigkeiten auf NAS-Systemen und embedded devices
- **Plugin-System**: Jellyfin Plugin-Katalog erwartet MD5
- **Performance**: Langsamer auf schwächeren Geräten

### **📊 JELLYFIN PLUGIN STANDARDS:**

Jellyfin verwendet **MD5** als Standard für alle Plugin-Checksums:

```json
{
  "checksum": "CE3522E10DDC05EF558BE94FF79B6EDA",
  "algorithm": "MD5"
}
```

## 🔐 **AKTUELLE CHECKSUMS VERIFIZIERT:**

### **📦 JellyfinUpscalerPlugin-v1.3.6.5-Serialization-Fixed.zip**

```
✅ MD5:    CE3522E10DDC05EF558BE94FF79B6EDA (Jellyfin Plugin Standard)
ℹ️  SHA256: 895166C9DB927D3D0E347900548016F06757C04ABDE08EAAFB051B7BCD487D4F (zur Sicherheit)
📦 Size:   324,562 bytes
```

### **🔍 VERIFIKATION:**

#### **Windows PowerShell (MD5):**
```powershell
Get-FileHash 'JellyfinUpscalerPlugin-v1.3.6.5-Serialization-Fixed.zip' -Algorithm MD5
```

#### **Linux/macOS (MD5):**
```bash
md5sum JellyfinUpscalerPlugin-v1.3.6.5-Serialization-Fixed.zip
```

#### **Erwartetes Ergebnis:**
```
CE3522E10DDC05EF558BE94FF79B6EDA
```

## 🎯 **MANIFEST-DATEIEN ÜBERPRÜFT:**

### **✅ manifest.json:**
```json
{
  "checksum": "CE3522E10DDC05EF558BE94FF79B6EDA",
  "size": 324562,
  "algorithm": "MD5"
}
```

### **✅ repository-jellyfin.json:**
```json
{
  "checksum": "CE3522E10DDC05EF558BE94FF79B6EDA",
  "size": 324562,
  "algorithm": "MD5"
}
```

## 🌍 **INTERNATIONALE STANDARDS:**

### **📋 NIST EMPFEHLUNG:**
- **SHA256**: Empfohlen für kryptographische Anwendungen
- **MD5**: Deprecated seit 2008
- **SHA1**: Deprecated seit 2017

### **🏢 INDUSTRIE-STANDARDS:**
- **GitHub**: SHA256 für Release-Checksums
- **Docker**: SHA256 für Container-Images
- **Jellyfin**: MD5 für Plugin-Verifikation (Kompatibilität)
- **Microsoft**: SHA256 für Software-Signaturen

## 🔧 **WARUM MD5 FÜR JELLYFIN PLUGINS?**

### **✅ KOMPATIBILITÄTSGRÜNDE:**
1. **Jellyfin Standard**: Alle offiziellen Plugins verwenden MD5
2. **Ältere Geräte**: NAS-Systeme haben bessere MD5-Unterstützung
3. **Embedded Systems**: Raspberry Pi, ARM-Geräte bevorzugen MD5
4. **Plugin-Katalog**: Jellyfin Repository erwartet MD5-Checksums

### **📊 PERFORMANCE-VERGLEICH:**
| Algorithmus | Geschwindigkeit | Sicherheit | Jellyfin-Kompatibilität | Empfehlung |
|-------------|----------------|------------|------------------------|------------|
| **MD5** | Sehr schnell | ⚠️ Ausreichend für Plugins | ✅ Vollständig | ✅ Jellyfin Standard |
| **SHA256** | Schnell | ✅ Sehr sicher | ❌ Problematisch | ❌ Nicht für Plugins |

## 🎯 **FAZIT:**

**MD5 ist die richtige Wahl für Jellyfin Plugins:**
- ✅ **Kompatibilität**: Funktioniert auf allen Jellyfin-Installationen
- ✅ **NAS-Geräte**: Bessere Unterstützung auf embedded systems
- ✅ **Plugin-Standard**: Alle offiziellen Plugins verwenden MD5
- ✅ **Performance**: Schnell auf schwächeren Geräten

**SHA256 sollte vermieden werden für Plugins wegen:**
- ❌ **Kompatibilität**: Nicht auf allen Jellyfin-Versionen unterstützt
- ❌ **Ältere Geräte**: Probleme mit NAS-Systemen und embedded devices
- ❌ **Plugin-System**: Jellyfin Plugin-Katalog erwartet MD5
- ❌ **Performance**: Langsamer auf schwächeren Geräten

---

## 🔍 **AKTUELLE VERIFIKATION:**

**Alle Checksums sind korrekt und verwenden den Jellyfin-kompatiblen MD5-Algorithmus!**

✅ **ZIP-Datei**: JellyfinUpscalerPlugin-v1.3.6.5-Serialization-Fixed.zip  
✅ **MD5**: CE3522E10DDC05EF558BE94FF79B6EDA  
✅ **Größe**: 324,562 bytes  
✅ **Manifest**: Alle Dateien aktualisiert  
✅ **Kompatibilität**: Verwendet Jellyfin-Standard MD5-Algorithmus