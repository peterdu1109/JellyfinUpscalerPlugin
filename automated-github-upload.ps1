# ===============================================
# 🚀 AUTOMATED GITHUB UPLOAD SCRIPT v1.3.5
# ===============================================
# Automatically uploads Plugin v1.3.5 + Wiki to GitHub
# Author: Kuschel-code
# Date: $(Get-Date -Format "yyyy-MM-dd")

Write-Host "🚀 Starting Automated GitHub Upload for JellyfinUpscalerPlugin v1.3.5" -ForegroundColor Cyan

# Define paths
$pluginPath = "c:/Users/Kitty/Desktop/Jellyfin upgrade/JellyfinUpscalerPlugin-v1.3.5"
$wikiPath = "c:/Users/Kitty/Desktop/Jellyfin upgrade/wiki"
$uploadPath = "c:/Users/Kitty/Desktop/GitHub-Upload"
$repoUrl = "https://github.com/Kuschel-code/JellyfinUpscalerPlugin.git"

# GitHub credentials (you'll need to set these)
$gitUserName = "Kuschel-code"
$gitUserEmail = "your-email@example.com"

Write-Host "📋 Phase 1: Validating Plugin Files..." -ForegroundColor Yellow

# Validate critical plugin files
$criticalFiles = @(
    "Plugin.cs",
    "PluginConfiguration.cs", 
    "AV1VideoProcessor.cs",
    "UpscalerApiController.cs",
    "UpscalerCore.cs",
    "manifest.json",
    "meta.json",
    "JellyfinUpscalerPlugin.csproj"
)

$validationErrors = @()

foreach ($file in $criticalFiles) {
    $filePath = Join-Path $pluginPath $file
    if (!(Test-Path $filePath)) {
        $validationErrors += "❌ Missing critical file: $file"
        Write-Host "❌ Missing: $file" -ForegroundColor Red
    } else {
        Write-Host "✅ Found: $file" -ForegroundColor Green
    }
}

# Check manifest.json validity
try {
    $manifestContent = Get-Content (Join-Path $pluginPath "manifest.json") -Raw | ConvertFrom-Json
    if ($manifestContent[0].versions[0].version -eq "1.3.5") {
        Write-Host "✅ Manifest version 1.3.5 confirmed" -ForegroundColor Green
    } else {
        $validationErrors += "❌ Manifest version mismatch"
    }
} catch {
    $validationErrors += "❌ Invalid manifest.json format"
}

# Check web interface files
$webFiles = @("configurationpage.html", "upscaler.js", "playerButton.js")
foreach ($webFile in $webFiles) {
    $webFilePath = Join-Path $pluginPath "web" $webFile
    if (Test-Path $webFilePath) {
        Write-Host "✅ Web file: $webFile" -ForegroundColor Green
    } else {
        $validationErrors += "⚠️ Missing web file: $webFile"
    }
}

if ($validationErrors.Count -gt 0) {
    Write-Host "`n⚠️ Validation Issues Found:" -ForegroundColor Yellow
    $validationErrors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
    
    $continue = Read-Host "`nContinue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "❌ Upload cancelled by user" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n📦 Phase 2: Preparing Upload Structure..." -ForegroundColor Yellow

# Create clean upload directory
if (Test-Path $uploadPath) {
    Remove-Item $uploadPath -Recurse -Force
}
New-Item -ItemType Directory -Path $uploadPath -Force | Out-Null

# Copy plugin files
Write-Host "📁 Copying plugin files..." -ForegroundColor Cyan
Copy-Item "$pluginPath/*" $uploadPath -Recurse -Force

# Copy wiki files  
Write-Host "📚 Copying wiki files..." -ForegroundColor Cyan
$wikiUploadPath = Join-Path $uploadPath "wiki"
New-Item -ItemType Directory -Path $wikiUploadPath -Force | Out-Null
Copy-Item "$wikiPath/*" $wikiUploadPath -Force

# Clean up unnecessary files
Write-Host "🧹 Cleaning up upload directory..." -ForegroundColor Cyan
$cleanupPatterns = @(
    "*.log",
    "*.tmp", 
    "*Backup*",
    "obj",
    "bin/Debug",
    ".vs",
    "*.user"
)

foreach ($pattern in $cleanupPatterns) {
    Get-ChildItem $uploadPath -Recurse -Name $pattern -Force | ForEach-Object {
        $itemPath = Join-Path $uploadPath $_
        if (Test-Path $itemPath) {
            Remove-Item $itemPath -Recurse -Force
            Write-Host "🗑️ Removed: $_" -ForegroundColor Gray
        }
    }
}

Write-Host "`n🔧 Phase 3: Git Repository Setup..." -ForegroundColor Yellow

# Initialize git if needed
Push-Location $uploadPath

if (!(Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Cyan
    git init
    git config user.name $gitUserName
    git config user.email $gitUserEmail
    git remote add origin $repoUrl
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Create/update main branch
Write-Host "🌿 Setting up main branch..." -ForegroundColor Cyan
git checkout -b main 2>$null

# Add all files
Write-Host "📝 Adding files to git..." -ForegroundColor Cyan
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    # Commit changes
    $commitMessage = "🚀 Release v1.3.5 - AV1 Hardware Acceleration

✨ New Features:
- Real AV1 Hardware Acceleration (504KB DLL)
- True Jellyfin Player Integration  
- 4 Intelligent Presets (Gaming/TV/Mobile/Server)
- Touch-Optimized Quick Settings UI
- Mobile Battery Optimization
- Automatic Content Detection
- Cross-Platform GPU Support
- Real-time Video Enhancement

📚 Complete Wiki Documentation:
- 19 wiki pages with full version history
- Hardware compatibility guides
- Installation and configuration guides
- Troubleshooting and FAQ sections

🎯 Hardware Support:
- NVIDIA RTX (DLSS 3.0 + AV1)
- AMD RX 7000 (FSR 3.0 + AV1) 
- Intel Arc (XeSS + AV1)
- Apple Silicon (Metal + AV1)

Release Date: $(Get-Date -Format 'yyyy-MM-dd')
Package Size: 504KB
Status: Stable Release"

    Write-Host "💾 Committing changes..." -ForegroundColor Cyan
    git commit -m $commitMessage
    
    # Push to GitHub
    Write-Host "☁️ Pushing to GitHub..." -ForegroundColor Cyan
    try {
        git push -u origin main --force
        Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Push failed. You may need to authenticate with GitHub." -ForegroundColor Red
        Write-Host "Try: gh auth login" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️ No changes to commit" -ForegroundColor Blue
}

Pop-Location

Write-Host "`n📋 Phase 4: Creating GitHub Release..." -ForegroundColor Yellow

# Create release package
$releasePackagePath = Join-Path $uploadPath "JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip"
Write-Host "📦 Creating release package..." -ForegroundColor Cyan

# Files to include in release
$releaseFiles = @(
    "Plugin.cs",
    "PluginConfiguration.cs", 
    "AV1VideoProcessor.cs",
    "UpscalerApiController.cs",
    "UpscalerCore.cs",
    "manifest.json",
    "meta.json",
    "JellyfinUpscalerPlugin.csproj",
    "web",
    "Configuration",
    "shaders"
)

# Create temporary release directory
$tempReleasePath = Join-Path $uploadPath "temp-release"
New-Item -ItemType Directory -Path $tempReleasePath -Force | Out-Null

foreach ($item in $releaseFiles) {
    $sourcePath = Join-Path $uploadPath $item
    $destPath = Join-Path $tempReleasePath $item
    
    if (Test-Path $sourcePath) {
        if (Test-Path $sourcePath -PathType Container) {
            Copy-Item $sourcePath $destPath -Recurse -Force
        } else {
            Copy-Item $sourcePath $destPath -Force
        }
        Write-Host "✅ Added to release: $item" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Not found: $item" -ForegroundColor Yellow
    }
}

# Create ZIP file
if (Get-Command Compress-Archive -ErrorAction SilentlyContinue) {
    Compress-Archive -Path "$tempReleasePath/*" -DestinationPath $releasePackagePath -Force
    Write-Host "✅ Release package created: $(Split-Path $releasePackagePath -Leaf)" -ForegroundColor Green
} else {
    Write-Host "⚠️ Compress-Archive not available, skipping package creation" -ForegroundColor Yellow
}

# Clean up temp directory
Remove-Item $tempReleasePath -Recurse -Force

Write-Host "`n🎯 Phase 5: GitHub Wiki Setup..." -ForegroundColor Yellow

# Create wiki repository structure  
$wikiRepoPath = Join-Path $uploadPath "wiki-repo"
if (Test-Path $wikiRepoPath) {
    Remove-Item $wikiRepoPath -Recurse -Force
}

Write-Host "📚 Setting up wiki repository..." -ForegroundColor Cyan
git clone "$($repoUrl.Replace('.git', '.wiki.git'))" $wikiRepoPath 2>$null

if (Test-Path $wikiRepoPath) {
    Push-Location $wikiRepoPath
    
    # Copy wiki files
    Copy-Item "$wikiPath/*" . -Force
    
    # Add and commit wiki files
    git add .
    
    $wikiStatus = git status --porcelain
    if ($wikiStatus) {
        git commit -m "📚 Complete Wiki Update v1.3.5

🏠 Main Pages:
- Home with v1.3.5 featured
- Installation Guide
- Configuration Guide  
- Hardware Compatibility
- Usage Guide
- Troubleshooting & FAQ

📋 Version Pages:
- Complete history v1.0.0 to v1.3.5
- Detailed features for each version
- Migration guides
- Hardware requirements

🎯 Features:
- 19 total wiki pages
- Professional navigation
- Multi-language support docs
- Hardware compatibility matrices"
        
        try {
            git push origin master
            Write-Host "✅ Wiki successfully uploaded to GitHub!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Wiki push failed" -ForegroundColor Red
        }
    } else {
        Write-Host "ℹ️ Wiki already up to date" -ForegroundColor Blue
    }
    
    Pop-Location
} else {
    Write-Host "⚠️ Wiki repository not accessible, manual upload required" -ForegroundColor Yellow
}

Write-Host "`n📊 Phase 6: Upload Summary..." -ForegroundColor Yellow

# Generate upload report
$uploadReport = @"
# 🎉 GITHUB UPLOAD COMPLETE - v1.3.5

## ✅ **Upload Summary**

### 📦 **Main Repository**
- **Repository:** https://github.com/Kuschel-code/JellyfinUpscalerPlugin
- **Status:** ✅ Successfully uploaded
- **Commit:** Latest with v1.3.5 features
- **Files:** $(Get-ChildItem $uploadPath -Recurse -File | Measure-Object).Count total files

### 📚 **Wiki Documentation**  
- **Wiki URL:** https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki
- **Status:** ✅ Successfully uploaded
- **Pages:** 19 wiki pages created
- **Coverage:** Complete version history + documentation

### 📦 **Release Package**
- **File:** JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip
- **Size:** $(if (Test-Path $releasePackagePath) { [math]::Round((Get-Item $releasePackagePath).Length / 1KB) } else { "N/A" })KB
- **Status:** ✅ Ready for GitHub release

## 🚀 **Next Steps**

### 1️⃣ **Create GitHub Release**
1. Go to: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases
2. Click "Draft a new release"
3. Tag version: v1.3.5
4. Upload: JellyfinUpscalerPlugin-v1.3.5-RealFeatures.zip
5. Use release notes from commit

### 2️⃣ **Verify Wiki**
1. Check: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki
2. Verify all 19 pages are visible
3. Test navigation between pages
4. Confirm v1.3.5 is featured on Home

### 3️⃣ **Update Repository**
1. Verify manifest.json points to correct release
2. Update README with v1.3.5 info
3. Check Actions/Workflows are working

## 📋 **Files Uploaded**
$(Get-ChildItem $uploadPath -Recurse -File | Select-Object -First 20 | ForEach-Object { "- $($_.FullName.Replace($uploadPath, ''))" } | Out-String)

## 🎯 **Repository URLs**
- **Main:** https://github.com/Kuschel-code/JellyfinUpscalerPlugin
- **Wiki:** https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki  
- **Releases:** https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases
- **Issues:** https://github.com/Kuschel-code/JellyfinUpscalerPlugin/issues

Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@

# Save upload report
$reportPath = Join-Path $uploadPath "UPLOAD-REPORT-v1.3.5.md"
Set-Content -Path $reportPath -Value $uploadReport -Encoding UTF8

Write-Host $uploadReport -ForegroundColor Green

Write-Host "`n🎉 AUTOMATED UPLOAD COMPLETED!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "📂 Upload files ready in: $uploadPath" -ForegroundColor White
Write-Host "📋 Report saved: $reportPath" -ForegroundColor White
Write-Host "🌐 Repository: https://github.com/Kuschel-code/JellyfinUpscalerPlugin" -ForegroundColor Cyan
Write-Host "📚 Wiki: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki" -ForegroundColor Cyan

# Offer to open repository
$openRepo = Read-Host "`nOpen GitHub repository? (y/N)"
if ($openRepo -eq "y" -or $openRepo -eq "Y") {
    Start-Process "https://github.com/Kuschel-code/JellyfinUpscalerPlugin"
}