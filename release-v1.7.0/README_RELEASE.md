# 🎯 Plugin de Suréchantillonnage IA v1.7.0 - RELEASE FINALE

## 📦 Informations de Release

| Info | Valeur |
|------|--------|
| **Version** | 1.7.0 |
| **Taille** | 1.4 MB |
| **Checksum MD5** | `404C27B13B148B142815FD91EF4925D1` |
| **Compatible** | Jellyfin 10.11.4+ |
| **Date** | 2 Décembre 2025 |

## ✨ Nouveautés v1.7.0

### ✅ Page de Configuration Fonctionnelle
- Formulaire s'affiche correctement (résolution écran noir)
- Tous les paramètres chargés avec valeurs par défaut
- Sauvegarde fonctionnelle avec feedback visuel

### ✅ Logs de Débogage
- Console logs détaillés pour diagnostic
- Messages d'erreur clairs
- Toast notifications pour feedback utilisateur

### ✅ Corrections Critiques
- **Erreur DI résolue:** Plus d'erreur `InvalidOperationException`
- **Natives DLLs retirées:** Plus de `BadImageFormatException`
- **Interface française:** 100% traduite

## 📋 Paramètres Configurables

### ⚙️ Paramètres de Base
- ✅ Activer/désactiver le plugin
- ✅ Modèle IA (Real-ESRGAN, ESRGAN, Waifu2x, FSRCNN, SRCNN)
- ✅ Facteur d'échelle (2x, 3x, 4x)
- ✅ Accélération matérielle (GPU)

### 🚀 Performance
- ✅ Taille du cache (256 MB - 10 GB)
- ✅ Flux simultanés max (1-8)
- ✅ Activation du cache

### 🔬 Benchmarking
- ✅ Benchmark automatique au démarrage
- ✅ Système de repli intelligent

## 🚀 Installation

### Windows
```powershell
# 1. Arrêter Jellyfin
Stop-Service JellyfinServer

# 2. Extraire le ZIP
Expand-Archive -Path "JellyfinUpscalerPlugin-v1.7.0.zip" `
  -DestinationPath "C:\ProgramData\Jellyfin\Server\plugins\JellyfinUpscalerPlugin\"

# 3. Redémarrer Jellyfin
Start-Service JellyfinServer
```

### Linux
```bash
# 1. Arrêter Jellyfin
sudo systemctl stop jellyfin

# 2. Extraire le ZIP
sudo unzip JellyfinUpscalerPlugin-v1.7.0.zip \
  -d /var/lib/jellyfin/plugins/JellyfinUpscalerPlugin/

# 3. Redémarrer Jellyfin
sudo systemctl start jellyfin
```

## 🔍 Vérification de l'Installation

1. **Ouvrir Dashboard** → Plugins
2. **Vérifier** que "Plugin de Suréchantillonnage IA 1.7" apparaît
3. **Cliquer** sur "Paramètres"
4. **Vérifier** que la page de configuration s'affiche

## 🐛 Débogage

### Si la page de configuration est noire:
1. Vérifier que tous les fichiers du ZIP ont été extraits
2. Redémarrer Jellyfin complètement
3. Vérifier les logs Jellyfin pour des erreurs

### Si la sauvegarde ne fonctionne pas:
1. **Ouvrir F12** dans le navigateur
2. Aller dans l'onglet **Console**
3. Cliquer sur "Enregistrer"
4. **Chercher les logs** `[UpscalerPlugin]`
5. Si erreur, noter le message exact

### Logs attendus lors du save:
```
[UpscalerPlugin] Script loaded
[UpscalerPlugin] viewshow event
[UpscalerPlugin] Loading configuration...
[UpscalerPlugin] Config loaded: {...}
[UpscalerPlugin] Form populated
[UpscalerPlugin] Save clicked
[UpscalerPlugin] Current config: {...}
[UpscalerPlugin] Config to save: {...}
[UpscalerPlugin] Save success: {...}
✅ Configuration enregistrée !
```

## ⚠️ Limitations

### CPU-Only
Ce plugin utilise **uniquement le CPU** pour l'IA ONNX afin d'éviter les problèmes de compatibilité avec les natives DLLs. L'accélération GPU est disponible pour FFmpeg uniquement.

### Modèles ONNX Non Inclus
Les modèles d'IA (fichiers `.onnx`) ne sont **PAS inclus** dans ce package. Vous devez les télécharger séparément et les placer dans:
```
%LOCALAPPDATA%\Jellyfin\data\plugins\JellyfinUpscalerPlugin\models\
```

Modèles recommandés:
- Real-ESRGAN (haute qualité)
- ESRGAN (équilibré)
- Waifu2x (anime/dessins)
- FSRCNN (rapide)

## 📁 Contenu du Package

```
JellyfinUpscalerPlugin-v1.7.0.zip
├── DLLs (11 fichiers)
│   ├── JellyfinUpscalerPlugin.dll
│   ├── Microsoft.ML.OnnxRuntime.dll
│   ├── FFMpegCore.dll
│   ├── CliWrap.dll
│   ├── SixLabors.ImageSharp.dll
│   └── ... (6 autres)
├── Configuration/ (9 fichiers)
│   ├── configurationpage.html ← Page principale
│   ├── config.js
│   ├── quick-menu.js
│   ├── player-integration.js
│   └── ... (5 autres)
├── meta.json
└── thumb.jpg
```

## 🔗 Liens Utiles

- **Repository GitHub:** https://github.com/peterdu1109/JellyfinUpscalerPlugin
- **Issues:** https://github.com/peterdu1109/JellyfinUpscalerPlugin/issues
- **Releases:** https://github.com/peterdu1109/JellyfinUpscalerPlugin/releases

## 📝 Changelog Complet

### v1.7.0 (2025-12-02)
- ✅ **FIX:** Page de configuration enfin fonctionnelle
- ✅ **FIX:** Sauvegarde qui fonctionne avec logs debug
- ✅ **FIX:** Erreur DI (Dependency Injection) résolue
- ✅ **FIX:** BadImageFormatException (natives DLLs retirées)
- ✅ **NEW:** Logs console détaillés pour diagnostic
- ✅ **NEW:** Toast notifications pour feedback
- ✅ Interface 100% française maintenue
- ⚠️ **CHANGE:** CPU-only (pas de GPU ONNX)

### v1.6.0 (2025-12-01)
- Interface de configuration traduite en français
- Amélioration de la stabilité

## 🎉 Remerciements

Merci d'utiliser le Plugin de Suréchantillonnage IA !

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

**Bon upscaling ! 🚀**
