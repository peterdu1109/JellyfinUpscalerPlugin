# ===============================================
# 🔍 PLUGIN ERROR ANALYSIS v1.3.5
# ===============================================
# Comprehensive error checking for JellyfinUpscalerPlugin v1.3.5
# Author: Kuschel-code
# Date: $(Get-Date -Format "yyyy-MM-dd")

Write-Host "🔍 Starting Plugin Error Analysis for v1.3.5..." -ForegroundColor Cyan

$pluginPath = "c:/Users/Kitty/Desktop/Jellyfin upgrade/JellyfinUpscalerPlugin-v1.3.5"
$errorLog = @()
$warningLog = @()
$successLog = @()

function Add-Error($message) {
    $global:errorLog += "❌ ERROR: $message"
    Write-Host "❌ $message" -ForegroundColor Red
}

function Add-Warning($message) {
    $global:warningLog += "⚠️ WARNING: $message"
    Write-Host "⚠️ $message" -ForegroundColor Yellow
}

function Add-Success($message) {
    $global:successLog += "✅ SUCCESS: $message"
    Write-Host "✅ $message" -ForegroundColor Green
}

Write-Host "`n📋 Phase 1: File Structure Validation..." -ForegroundColor Yellow

# Check critical plugin files
$criticalFiles = @{
    "Plugin.cs" = "Main plugin class"
    "PluginConfiguration.cs" = "Configuration class"
    "AV1VideoProcessor.cs" = "AV1 processing engine"
    "UpscalerApiController.cs" = "API controller"
    "UpscalerCore.cs" = "Core processing logic"
    "manifest.json" = "Plugin manifest"
    "meta.json" = "Metadata file"
    "JellyfinUpscalerPlugin.csproj" = "Project file"
}

foreach ($file in $criticalFiles.Keys) {
    $filePath = Join-Path $pluginPath $file
    if (Test-Path $filePath) {
        Add-Success "$file found - $($criticalFiles[$file])"
    } else {
        Add-Error "$file missing - $($criticalFiles[$file])"
    }
}

# Check web interface files
Write-Host "`n📱 Web Interface Validation..." -ForegroundColor Yellow
$webFiles = @{
    "web/configurationpage.html" = "Main configuration page"
    "web/upscaler.js" = "Main JavaScript logic"
    "web/playerButton.js" = "Player button integration"
    "web/quick-settings-av1.js" = "AV1 quick settings"
    "web/light-mode-manager.js" = "Light mode manager"
    "web/model-manager.js" = "AI model manager"
}

foreach ($webFile in $webFiles.Keys) {
    $webPath = Join-Path $pluginPath $webFile
    if (Test-Path $webPath) {
        Add-Success "$webFile found - $($webFiles[$webFile])"
    } else {
        Add-Warning "$webFile missing - $($webFiles[$webFile])"
    }
}

Write-Host "`n🔧 Phase 2: Configuration Validation..." -ForegroundColor Yellow

# Validate manifest.json
try {
    $manifestPath = Join-Path $pluginPath "manifest.json"
    if (Test-Path $manifestPath) {
        $manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
        
        # Check structure
        if ($manifest -is [Array] -and $manifest.Count -gt 0) {
            $plugin = $manifest[0]
            
            # Validate required fields
            if ($plugin.guid) {
                if ($plugin.guid -eq "f87f700e-679d-43e6-9c7c-b3a410dc3f22") {
                    Add-Success "GUID matches expected value"
                } else {
                    Add-Error "GUID mismatch: $($plugin.guid)"
                }
            } else {
                Add-Error "GUID missing in manifest"
            }
            
            if ($plugin.name) {
                Add-Success "Plugin name: $($plugin.name)"
            } else {
                Add-Error "Plugin name missing"
            }
            
            if ($plugin.versions -and $plugin.versions.Count -gt 0) {
                $latestVersion = $plugin.versions[0]
                if ($latestVersion.version -eq "1.3.5") {
                    Add-Success "Latest version is 1.3.5"
                } else {
                    Add-Error "Latest version mismatch: $($latestVersion.version)"
                }
                
                # Check version fields
                $requiredVersionFields = @("version", "targetAbi", "sourceUrl", "checksum", "timestamp")
                foreach ($field in $requiredVersionFields) {
                    if ($latestVersion.$field) {
                        Add-Success "Version field '$field' present"
                    } else {
                        Add-Error "Version field '$field' missing"
                    }
                }
            } else {
                Add-Error "No versions found in manifest"
            }
        } else {
            Add-Error "Invalid manifest structure"
        }
    } else {
        Add-Error "manifest.json not found"
    }
} catch {
    Add-Error "Failed to parse manifest.json: $($_.Exception.Message)"
}

# Validate meta.json
try {
    $metaPath = Join-Path $pluginPath "meta.json"
    if (Test-Path $metaPath) {
        $meta = Get-Content $metaPath -Raw | ConvertFrom-Json
        Add-Success "meta.json parsed successfully"
        
        if ($meta.guid -eq "f87f700e-679d-43e6-9c7c-b3a410dc3f22") {
            Add-Success "meta.json GUID matches"
        } else {
            Add-Error "meta.json GUID mismatch"
        }
    } else {
        Add-Warning "meta.json not found (optional)"
    }
} catch {
    Add-Error "Failed to parse meta.json: $($_.Exception.Message)"
}

Write-Host "`n💻 Phase 3: Code Quality Analysis..." -ForegroundColor Yellow

# Check Plugin.cs
$pluginCsPath = Join-Path $pluginPath "Plugin.cs"
if (Test-Path $pluginCsPath) {
    $pluginContent = Get-Content $pluginCsPath -Raw
    
    # Check for required elements
    if ($pluginContent -match "namespace JellyfinUpscalerPlugin") {
        Add-Success "Correct namespace found"
    } else {
        Add-Error "Namespace missing or incorrect"
    }
    
    if ($pluginContent -match "class Plugin.*IHasWebPages") {
        Add-Success "Plugin class implements IHasWebPages"
    } else {
        Add-Error "Plugin class structure incorrect"
    }
    
    if ($pluginContent -match "new Guid\(`"f87f700e-679d-43e6-9c7c-b3a410dc3f22`"\)") {
        Add-Success "Plugin GUID correctly hardcoded"
    } else {
        Add-Error "Plugin GUID missing or incorrect"
    }
    
    if ($pluginContent -match "GetPages\(\)") {
        Add-Success "GetPages method found"
    } else {
        Add-Error "GetPages method missing"
    }
} else {
    Add-Error "Plugin.cs not found"
}

# Check PluginConfiguration.cs
$configPath = Join-Path $pluginPath "PluginConfiguration.cs"
if (Test-Path $configPath) {
    $configContent = Get-Content $configPath -Raw
    
    if ($configContent -match "class PluginConfiguration.*BasePluginConfiguration") {
        Add-Success "Configuration class inherits correctly"
    } else {
        Add-Error "Configuration class structure incorrect"
    }
    
    # Check for v1.3.5 specific settings
    $v135Settings = @("EnableAV1", "AV1Quality", "AV1Preset", "EnableMobileOptimization", "EnableBatteryMode")
    foreach ($setting in $v135Settings) {
        if ($configContent -match $setting) {
            Add-Success "v1.3.5 setting found: $setting"
        } else {
            Add-Warning "v1.3.5 setting missing: $setting"
        }
    }
} else {
    Add-Error "PluginConfiguration.cs not found"
}

# Check AV1VideoProcessor.cs (new in v1.3.5)
$av1ProcessorPath = Join-Path $pluginPath "AV1VideoProcessor.cs"
if (Test-Path $av1ProcessorPath) {
    $av1Content = Get-Content $av1ProcessorPath -Raw
    
    if ($av1Content -match "class AV1VideoProcessor") {
        Add-Success "AV1VideoProcessor class found"
    } else {
        Add-Error "AV1VideoProcessor class structure incorrect"
    }
    
    if ($av1Content -match "ProcessVideoAsync") {
        Add-Success "Main processing method found"
    } else {
        Add-Error "ProcessVideoAsync method missing"
    }
    
    if ($av1Content -match "BuildAV1FFmpegCommand") {
        Add-Success "AV1 FFmpeg command builder found"
    } else {
        Add-Warning "AV1 command builder missing"
    }
} else {
    Add-Error "AV1VideoProcessor.cs missing (critical for v1.3.5)"
}

Write-Host "`n🌐 Phase 4: Web Interface Validation..." -ForegroundColor Yellow

# Check main configuration page
$configPagePath = Join-Path $pluginPath "web/configurationpage.html"
if (Test-Path $configPagePath) {
    $configPageContent = Get-Content $configPagePath -Raw
    
    if ($configPageContent -match "<!DOCTYPE html>") {
        Add-Success "Configuration page has valid HTML structure"
    } else {
        Add-Error "Configuration page HTML structure invalid"
    }
    
    if ($configPageContent -match "Jellyfin Upscaler") {
        Add-Success "Configuration page title correct"
    } else {
        Add-Warning "Configuration page title missing"
    }
    
    # Check for v1.3.5 specific elements
    $v135Elements = @("AV1", "battery", "mobile", "preset")
    foreach ($element in $v135Elements) {
        if ($configPageContent -match $element) {
            Add-Success "v1.3.5 UI element found: $element"
        } else {
            Add-Warning "v1.3.5 UI element missing: $element"
        }
    }
} else {
    Add-Error "Main configuration page missing"
}

# Check JavaScript files
$jsFiles = @("upscaler.js", "playerButton.js", "quick-settings-av1.js")
foreach ($jsFile in $jsFiles) {
    $jsPath = Join-Path $pluginPath "web" $jsFile
    if (Test-Path $jsPath) {
        $jsContent = Get-Content $jsPath -Raw
        
        if ($jsContent.Length -gt 100) {
            Add-Success "$jsFile has substantial content"
        } else {
            Add-Warning "$jsFile seems too short"
        }
        
        if ($jsContent -match "function|=>|\{") {
            Add-Success "$jsFile contains JavaScript functions"
        } else {
            Add-Warning "$jsFile may not contain valid JavaScript"
        }
    } else {
        Add-Warning "$jsFile missing"
    }
}

Write-Host "`n🏗️ Phase 5: Build System Validation..." -ForegroundColor Yellow

# Check project file
$csprojPath = Join-Path $pluginPath "JellyfinUpscalerPlugin.csproj"
if (Test-Path $csprojPath) {
    $csprojContent = Get-Content $csprojPath -Raw
    
    if ($csprojContent -match "Project Sdk=") {
        Add-Success "Project uses SDK format"
    } else {
        Add-Error "Project format incorrect"
    }
    
    if ($csprojContent -match "net8\.0") {
        Add-Success "Targets .NET 8.0"
    } elseif ($csprojContent -match "net6\.0") {
        Add-Warning "Targets .NET 6.0 (consider upgrading)"
    } else {
        Add-Error "Unknown target framework"
    }
    
    if ($csprojContent -match "Jellyfin.*PackageReference") {
        Add-Success "Jellyfin dependencies found"
    } else {
        Add-Error "Jellyfin dependencies missing"
    }
} else {
    Add-Error "Project file missing"
}

# Check for solution file
$slnPath = Join-Path $pluginPath "JellyfinUpscalerPlugin.sln"
if (Test-Path $slnPath) {
    Add-Success "Solution file found"
} else {
    Add-Warning "Solution file missing (optional)"
}

Write-Host "`n📦 Phase 6: Asset Validation..." -ForegroundColor Yellow

# Check shader files
$shaderPath = Join-Path $pluginPath "shaders"
if (Test-Path $shaderPath) {
    $shaderCount = (Get-ChildItem $shaderPath -Recurse -File).Count
    if ($shaderCount -gt 0) {
        Add-Success "$shaderCount shader files found"
    } else {
        Add-Warning "Shader directory empty"
    }
} else {
    Add-Warning "Shader directory missing"
}

# Check configuration assets
$configPath = Join-Path $pluginPath "Configuration"
if (Test-Path $configPath) {
    $configFiles = Get-ChildItem $configPath -File
    if ($configFiles.Count -gt 0) {
        Add-Success "$($configFiles.Count) configuration files found"
    } else {
        Add-Warning "Configuration directory empty"
    }
} else {
    Add-Warning "Configuration directory missing"
}

Write-Host "`n📊 Phase 7: Error Summary..." -ForegroundColor Yellow

# Generate comprehensive report
$report = @"
# 🔍 PLUGIN ERROR ANALYSIS REPORT v1.3.5

## 📊 **Summary Statistics**
- **Errors:** $($errorLog.Count)
- **Warnings:** $($warningLog.Count)  
- **Successes:** $($successLog.Count)
- **Total Checks:** $(($errorLog.Count + $warningLog.Count + $successLog.Count))

## ❌ **Errors Found** ($($errorLog.Count))
$(if ($errorLog.Count -gt 0) { $errorLog | ForEach-Object { "$_`n" } } else { "✅ No errors found!`n" })

## ⚠️ **Warnings** ($($warningLog.Count))
$(if ($warningLog.Count -gt 0) { $warningLog | ForEach-Object { "$_`n" } } else { "✅ No warnings!`n" })

## ✅ **Successful Checks** ($($successLog.Count))
$(if ($successLog.Count -gt 0) { $successLog | Take 10 | ForEach-Object { "$_`n" } } else { "No successes recorded`n" })
$(if ($successLog.Count -gt 10) { "... and $($successLog.Count - 10) more successes`n" })

## 🎯 **Overall Status**
$(if ($errorLog.Count -eq 0) { 
    "🎉 **PLUGIN READY FOR RELEASE!**`nNo critical errors found. Plugin v1.3.5 appears to be properly structured and ready for deployment."
} elseif ($errorLog.Count -le 2) {
    "⚠️ **MINOR ISSUES DETECTED**`nFew errors found. Review and fix before release."
} else {
    "❌ **CRITICAL ISSUES DETECTED**`nMultiple errors found. Significant fixes required before release."
})

## 🔧 **Recommended Actions**
$(if ($errorLog.Count -gt 0) {
    "1. Fix all critical errors listed above`n2. Review and address warnings`n3. Re-run analysis after fixes`n4. Test plugin in Jellyfin environment"
} else {
    "1. ✅ Plugin structure validated`n2. ✅ Ready for GitHub upload`n3. ✅ Ready for release packaging`n4. ✅ Consider final testing"
})

---
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Plugin Path: $pluginPath
"@

# Save report
$reportPath = Join-Path (Split-Path $pluginPath -Parent) "PLUGIN-ERROR-ANALYSIS-v1.3.5.md"
Set-Content -Path $reportPath -Value $report -Encoding UTF8

# Display summary
Write-Host "`n📋 ANALYSIS COMPLETE!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "❌ Errors: $($errorLog.Count)" -ForegroundColor $(if ($errorLog.Count -eq 0) { "Green" } else { "Red" })
Write-Host "⚠️ Warnings: $($warningLog.Count)" -ForegroundColor $(if ($warningLog.Count -eq 0) { "Green" } else { "Yellow" })
Write-Host "✅ Successes: $($successLog.Count)" -ForegroundColor Green
Write-Host "📄 Report saved: $reportPath" -ForegroundColor Cyan

if ($errorLog.Count -eq 0) {
    Write-Host "`n🎉 PLUGIN READY FOR RELEASE!" -ForegroundColor Green
    Write-Host "No critical errors found. v1.3.5 is ready for GitHub upload." -ForegroundColor Green
} else {
    Write-Host "`n⚠️ ISSUES REQUIRE ATTENTION" -ForegroundColor Yellow
    Write-Host "Review errors above before proceeding with release." -ForegroundColor Yellow
}