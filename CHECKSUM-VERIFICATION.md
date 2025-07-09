# 🔐 CHECKSUM VERIFICATION - SHA256 vs MD5

## 📋 **WARUM SHA256 UND NICHT MD5?**

### **🚨 SICHERHEITSVERGLEICH:**

| Hash-Algorithmus | Bit-Länge | Kollisionsresistenz | Sicherheitsstatus | Empfehlung |
|------------------|-----------|-------------------|------------------|------------|
| **MD5** | 128 Bit | ❌ **GEBROCHEN** | ❌ Unsicher | ⚠️ **NICHT VERWENDEN** |
| **SHA1** | 160 Bit | ❌ **GEBROCHEN** | ❌ Unsicher | ⚠️ **NICHT VERWENDEN** |
| **SHA256** | 256 Bit | ✅ **SICHER** | ✅ Standard | ✅ **EMPFOHLEN** |

### **🔍 TECHNISCHE GRÜNDE:**

#### **❌ MD5 PROBLEME:**
- **Kollisionen**: MD5 ist anfällig für Hash-Kollisionen
- **Sicherheit**: Kann leicht manipuliert werden
- **Standard**: Seit 2008 als unsicher eingestuft
- **Performance**: Zwar schnell, aber nicht mehr sicher

#### **✅ SHA256 VORTEILE:**
- **Sicherheit**: Kollisionsresistent und kryptographisch sicher
- **Standard**: Industrie-Standard für Dateiintegrität
- **Jellyfin**: Offizielle Jellyfin-Plugins verwenden SHA256
- **GitHub**: GitHub verwendet SHA256 für Release-Checksums

### **📊 JELLYFIN PLUGIN STANDARDS:**

Jellyfin verwendet **SHA256** als Standard für alle Plugin-Checksums:

```json
{
  "checksum": "895166C9DB927D3D0E347900548016F06757C04ABDE08EAAFB051B7BCD487D4F",
  "algorithm": "SHA256"
}
```

## 🔐 **AKTUELLE CHECKSUMS VERIFIZIERT:**

### **📦 JellyfinUpscalerPlugin-v1.3.6.5-Serialization-Fixed.zip**

```
✅ SHA256: 895166C9DB927D3D0E347900548016F06757C04ABDE08EAAFB051B7BCD487D4F
ℹ️  MD5:    CE3522E10DDC05EF558BE94FF79B6EDA
📦 Size:   324,562 bytes
```

### **🔍 VERIFIKATION:**

#### **Windows PowerShell:**
```powershell
Get-FileHash 'JellyfinUpscalerPlugin-v1.3.6.5-Serialization-Fixed.zip' -Algorithm SHA256
```

#### **Linux/macOS:**
```bash
sha256sum JellyfinUpscalerPlugin-v1.3.6.5-Serialization-Fixed.zip
```

#### **Erwartetes Ergebnis:**
```
895166C9DB927D3D0E347900548016F06757C04ABDE08EAAFB051B7BCD487D4F
```

## 🎯 **MANIFEST-DATEIEN ÜBERPRÜFT:**

### **✅ manifest.json:**
```json
{
  "checksum": "895166C9DB927D3D0E347900548016F06757C04ABDE08EAAFB051B7BCD487D4F",
  "size": 324562,
  "algorithm": "SHA256"
}
```

### **✅ repository-jellyfin.json:**
```json
{
  "checksum": "895166C9DB927D3D0E347900548016F06757C04ABDE08EAAFB051B7BCD487D4F",
  "size": 324562,
  "algorithm": "SHA256"
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
- **Jellyfin**: SHA256 für Plugin-Verifikation
- **Microsoft**: SHA256 für Software-Signaturen

## 🔧 **WARUM NICHT MD5?**

### **🚨 SICHERHEITSRISIKEN:**
1. **Hash-Kollisionen**: Verschiedene Dateien können denselben MD5-Hash haben
2. **Manipulation**: Angreifer können Dateien mit identischen MD5-Hashes erstellen
3. **Veraltete Technologie**: MD5 ist seit 2008 als unsicher eingestuft
4. **Compliance**: Moderne Sicherheitsstandards verbieten MD5

### **📊 PERFORMANCE-VERGLEICH:**
| Algorithmus | Geschwindigkeit | Sicherheit | Dateigröße | Empfehlung |
|-------------|----------------|------------|------------|------------|
| **MD5** | Sehr schnell | ❌ Unsicher | 128 Bit | ❌ Nicht verwenden |
| **SHA256** | Schnell | ✅ Sicher | 256 Bit | ✅ Standard |

## 🎯 **FAZIT:**

**SHA256 ist die richtige Wahl für:**
- ✅ **Sicherheit**: Kollisionsresistent und kryptographisch sicher
- ✅ **Standards**: Industrie-Standard für Dateiintegrität
- ✅ **Jellyfin**: Kompatibilität mit Jellyfin Plugin-System
- ✅ **Zukunftssicherheit**: Langfristig unterstützt

**MD5 sollte vermieden werden wegen:**
- ❌ **Sicherheitslücken**: Kollisionsanfällig
- ❌ **Deprecated**: Seit 2008 als unsicher eingestuft
- ❌ **Compliance**: Verstößt gegen moderne Sicherheitsstandards
- ❌ **Jellyfin**: Nicht mit Jellyfin Plugin-System kompatibel

---

## 🔍 **AKTUELLE VERIFIKATION:**

**Alle Checksums sind korrekt und verwenden den sicheren SHA256-Algorithmus!**

✅ **ZIP-Datei**: JellyfinUpscalerPlugin-v1.3.6.5-Serialization-Fixed.zip  
✅ **SHA256**: 895166C9DB927D3D0E347900548016F06757C04ABDE08EAAFB051B7BCD487D4F  
✅ **Größe**: 324,562 bytes  
✅ **Manifest**: Alle Dateien aktualisiert  
✅ **Sicherheit**: Verwendet sicheren SHA256-Algorithmus