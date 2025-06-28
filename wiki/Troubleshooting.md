# 🔍 Troubleshooting

Common issues and solutions for JellyfinUpscalerPlugin.

---

## ❌ **Common Issues**

### 🚫 **Plugin Not Working**
**Symptoms:** No enhancement, button missing
**Solutions:**
1. Restart Jellyfin server
2. Check plugin is enabled in Dashboard
3. Verify hardware compatibility
4. Update graphics drivers

### 🐌 **Poor Performance**
**Symptoms:** Lag, stuttering, high CPU usage
**Solutions:**
1. Lower quality preset (High → Medium)
2. Enable Light Mode for weak hardware
3. Check thermal throttling
4. Close unnecessary applications

### 🎨 **Visual Artifacts**
**Symptoms:** Blurring, oversharping, color issues
**Solutions:**
1. Reduce enhancement strength
2. Disable aggressive sharpening
3. Check AI model integrity
4. Update plugin to latest version

---

## 🛠️ **Advanced Troubleshooting**

### 📊 **Performance Diagnostics**
```powershell
# Check system resources
Get-Process | Where-Object {$_.Name -like "*jellyfin*"}
Get-WmiObject -Class Win32_VideoController | Select-Object Name, DriverVersion
```

### 🔧 **Reset Configuration**
1. Stop Jellyfin service
2. Delete plugin config file
3. Restart Jellyfin
4. Reconfigure settings

---

*For installation help, see [Installation Guide](Installation)*