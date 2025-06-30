#!/usr/bin/env pwsh

# 🚀 AI Upscaler Plugin v1.3.6 Ultimate Build Script
# Erstellt optimiertes ZIP-Paket für GitHub Release

Write-Host "🚀 Building AI Upscaler Plugin v1.3.6 Ultimate..." -ForegroundColor Green
Write-Host "=" * 60

# Build-Verzeichnis vorbereiten
$buildDir = "release-build"
$outputZip = "JellyfinUpscalerPlugin-v1.3.6-Ultimate.zip"

if (Test-Path $buildDir) {
    Remove-Item $buildDir -Recurse -Force
}
New-Item -ItemType Directory -Path $buildDir | Out-Null

Write-Host "✅ Build-Verzeichnis erstellt: $buildDir" -ForegroundColor Cyan

# .NET Build (nur DLL erstellen)
Write-Host "🔨 Building .NET Project..." -ForegroundColor Yellow
try {
    dotnet build --configuration Release --output $buildDir --no-restore
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
    Write-Host "✅ .NET Build erfolgreich" -ForegroundColor Green
} catch {
    Write-Host "❌ .NET Build fehlgeschlagen: $_" -ForegroundColor Red
    exit 1
}

# Zusätzliche Plugin-Dateien kopieren (die nicht beim Build dabei sind)
Write-Host "📂 Kopiere zusätzliche Plugin-Dateien..." -ForegroundColor Yellow

$additionalFiles = @(
    "manifest.json",
    "meta.json"
)

foreach ($file in $additionalFiles) {
    if (Test-Path $file) {
        Copy-Item $file $buildDir/
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  $file nicht gefunden" -ForegroundColor Yellow
    }
}

# Web-Dateien kopieren
if (Test-Path "web") {
    Copy-Item "web" $buildDir/ -Recurse
    Write-Host "✅ Web-Dateien kopiert" -ForegroundColor Green
}

# Shader-Dateien kopieren
if (Test-Path "shaders") {
    Copy-Item "shaders" $buildDir/ -Recurse
    Write-Host "✅ Shader-Dateien kopiert" -ForegroundColor Green
}

# Configuration-Dateien kopieren
if (Test-Path "Configuration") {
    Copy-Item "Configuration" $buildDir/ -Recurse
    Write-Host "✅ Configuration-Dateien kopiert" -ForegroundColor Green
}

# ZIP-Paket erstellen
Write-Host "📦 Erstelle ZIP-Paket..." -ForegroundColor Yellow
try {
    if (Test-Path $outputZip) {
        Remove-Item $outputZip -Force
    }
    
    Compress-Archive -Path "$buildDir/*" -DestinationPath $outputZip -CompressionLevel Optimal
    
    $zipSize = (Get-Item $outputZip).Length
    $zipSizeMB = [math]::Round($zipSize / 1MB, 2)
    
    Write-Host "ZIP-Paket erstellt: $outputZip" -ForegroundColor Green
    Write-Host "Groesse: $zipSizeMB MB" -ForegroundColor Green
} catch {
    Write-Host "ZIP-Erstellung fehlgeschlagen" -ForegroundColor Red
    exit 1
}

# Build-Summary
Write-Host ""
Write-Host "🎉 BUILD ERFOLGREICH!" -ForegroundColor Green
Write-Host "=" * 60
Write-Host "📦 Ausgabe: $outputZip"
Write-Host "📊 Größe: $zipSizeMB MB"
Write-Host "🔧 Build-Verzeichnis: $buildDir"
Write-Host ""
Write-Host "🚀 Bereit für GitHub Release!" -ForegroundColor Cyan
Write-Host "Manual upload zu: https://github.com/Kuschel-code/JellyfinUpscalerPlugin/releases/new"