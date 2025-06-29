# 🚨 CRITICAL FIXES NEEDED - v1.3.4

## ❌ **IDENTIFIED CRITICAL ISSUES:**

### **1. Plugin ID Synchronization (CRITICAL)**
```csharp
// Plugin.cs - Line 17
public override Guid Id => new Guid("f87f700e-679d-43e6-9c7c-b3a410dc3f22");

// Configuration/configPage.html - Line 161
var pluginId = "f87f700e-679d-43e6-9c7c-b3a410dc3f22"; // FIXED ✅
```

### **2. Configuration File Path (CRITICAL)**
```csharp
// Plugin.cs - Line 35
EmbeddedResourcePath = GetType().Namespace + ".Configuration.configurationpage.html"

// Required: Rename configPage.html → configurationpage.html
```

### **3. Configuration Properties Mapping (HIGH)**
```javascript
// Current JavaScript (WRONG):
EnablePlugin: document.querySelector('#EnablePlugin').checked,
DefaultProfile: document.querySelector('#DefaultProfile').value,
ScaleFactor: document.querySelector('#ScaleFactor').value,

// Should be (CORRECT):
Enabled: document.querySelector('#EnablePlugin').checked,
Model: document.querySelector('#DefaultProfile').value,
Scale: parseInt(document.querySelector('#ScaleFactor').value),
```

### **4. Missing v1.3.4 Enterprise Properties**
```csharp
// Add to PluginConfiguration.cs:
public bool EnablePlugin { get; set; } = false;  // Missing
public string DefaultProfile { get; set; } = "auto";  // Missing
public string ScaleFactor { get; set; } = "2.0";  // Missing
```

## 🔧 **IMMEDIATE ACTION REQUIRED:**

### **Step 1: Fix Plugin ID**
- Ensure all files use: `f87f700e-679d-43e6-9c7c-b3a410dc3f22`

### **Step 2: Fix Configuration File Name**
- Rename: `configPage.html` → `configurationpage.html`

### **Step 3: Synchronize Configuration Properties**
- Update PluginConfiguration.cs with missing properties
- OR update JavaScript to use existing properties

### **Step 4: Test Configuration Loading**
- Verify plugin loads without errors
- Test configuration save/load functionality

## 📊 **ERROR IMPACT ASSESSMENT:**

| Issue | Severity | Impact | Fix Priority |
|-------|----------|---------|-------------|
| Plugin ID Mismatch | CRITICAL | Config doesn't work | 🔴 IMMEDIATE |
| File Path Wrong | CRITICAL | Page doesn't load | 🔴 IMMEDIATE |
| Property Mismatch | HIGH | Settings not saved | 🟡 HIGH |
| Missing Properties | MEDIUM | New features broken | 🟡 HIGH |

## 🎯 **RECOMMENDED FIX ORDER:**

1. **🔴 Fix Plugin ID** - Make all files use same GUID
2. **🔴 Fix File Path** - Rename configuration file
3. **🟡 Fix Properties** - Add missing configuration properties
4. **🟡 Test & Validate** - Ensure everything works

## ✅ **POST-FIX VALIDATION:**

### **Test Checklist:**
- [ ] Plugin loads without errors in Jellyfin logs
- [ ] Configuration page opens successfully
- [ ] Settings can be saved and persist after restart
- [ ] All v1.3.4 Enterprise features configurable
- [ ] No JavaScript console errors

### **Files to Verify:**
- [ ] Plugin.cs - Correct GUID and file path
- [ ] PluginConfiguration.cs - All properties present
- [ ] Configuration/configurationpage.html - Correct GUID and properties
- [ ] JellyfinUpscalerPlugin.csproj - EmbeddedResource includes

---

**🚨 These fixes are CRITICAL for plugin functionality! 🚨**