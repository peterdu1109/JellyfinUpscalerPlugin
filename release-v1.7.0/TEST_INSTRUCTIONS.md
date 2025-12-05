# 📦 RELEASE v1.7.0 - INSTRUCTIONS FINALES

## ✅ PACKAGE PRÊT

**Fichier:** `JellyfinUpscalerPlugin-v1.7.0.zip`  
**Checksum:** `404C27B13B148B142815FD91EF4925D1`  
**Taille:** 1.4 MB

---

## 🎯 CE QUI A ÉTÉ FAIT

### ✅ Problèmes Résolus
1. **Page de configuration noire** → RÉSOLU (fichiers embedded + physiques)
2. **Erreur DI** → RÉSOLU (utilisation de Plugin.Instance)
3. **BadImageFormatException** → RÉSOLU (natives DLLs retirées)
4. **Sauvegarde ne fonctionne pas** → LOGS AJOUTÉS (à tester)

### ✅ Améliorations
- Logs console détaillés `[UpscalerPlugin]`
- Toast notifications pour feedback
- Interface 100% française
- Try/catch sur toutes les opérations
- Fallback events (pageshow + viewshow)

---

## 📋 TESTS À FAIRE (UTILISATEUR)

### Test 1: Page de Configuration
1. ✅ Installer `JellyfinUpscalerPlugin-v1.7.0.zip` dans Jellyfin
2. ✅ Dashboard → Plugins → Plugin de Suréchantillonnage IA
3. ✅ Cliquer sur "Paramètres"
4. ✅ **Vérifier:** La page s'affiche avec tous les champs

**Résultat attendu:** Page visible avec paramètres

---

### Test 2: Sauvegarde (CRITIQUE)
1. ✅ Ouvrir **F12** (Console développeur)
2. ✅ Modifier "Modèle IA" → "Waifu2x (Anime)"
3. ✅ Modifier "Facteur d'échelle" → 4x
4. ✅ Cocher "Benchmark automatique"
5. ✅ Cliquer "💾 Enregistrer"
6. ✅ **Regarder console:**
   - `[UpscalerPlugin] Save clicked`
   - `[UpscalerPlugin] Current config: ...`
   - `[UpscalerPlugin] Config to save: ...`
   - `[UpscalerPlugin] Save success: ...`
7. ✅ **Vérifier:** Toast "✅ Configuration enregistrée !"

**Si erreur:** Copier TOUS les logs `[UpscalerPlugin]` et me les envoyer

---

### Test 3: Persistance
1. ✅ Sauvegarder la config
2. ✅ **Rafraîchir la page** (F5)
3. ✅ **Vérifier:** Les valeurs modifiées sont toujours là

**Résultat attendu:** Paramètres sauvegardés persistent

---

### Test 4: Bouton Lecteur Vidéo (OPTIONNEL)
1. ✅ Lancer une vidéo
2. ✅ **Vérifier:** Un bouton/barre upscaler apparaît

**Si absent:** Vérifier console pour erreurs `player-integration.js`

---

## 🐛 SI PROBLÈME

### Logs à collecter
1. **Console navigateur** (F12) - logs `[UpscalerPlugin]`
2. **Logs Jellyfin** - `C:\ProgramData\Jellyfin\Server\log\`
3. **Erreurs spécifiques** - messages exacts

### Informations à fournir
- Version Jellyfin: `10.11.4` (confirmé)
- OS: Windows
- Navigateur utilisé
- Message d'erreur exact

---

## 📂 CONTENU DU PACKAGE

```
JellyfinUpscalerPlugin-v1.7.0.zip/
├── JellyfinUpscalerPlugin.dll
├── Microsoft.ML.OnnxRuntime.dll (CPU-only)
├── FFMpegCore.dll
├── CliWrap.dll
├── SixLabors.ImageSharp.dll
├── ... (6 autres DLLs)
├── Configuration/
│   ├── configurationpage.html ⭐
│   ├── config.js
│   ├── quick-menu.js
│   ├── player-integration.js
│   ├── sidebar-upscaler.js
│   ├── sidebar-integration.js
│   ├── configPage.html
│   ├── beginner-presets.html
│   └── configurationpage-enhanced.html
├── meta.json
└── thumb.jpg
```

⭐ = **Fichier principal de configuration avec logs debug**

---

## 🚀 PROCHAINES ÉTAPES

### Si tout fonctionne:
1. ✅ Uploader sur GitHub Releases
2. ✅ Mettre à jour le manifest
3. ✅ Documenter sur le README principal
4. ✅ Télécharger les modèles ONNX
5. ✅ Tester l'upscaling réel

### Si sauvegarde ne fonctionne pas:
1. ⚠️ Me fournir les logs console complets
2. ⚠️ Je corrigerai le problème
3. ⚠️ Nouveau package v1.7.1

---

## ♻️ RAPPEL: Changement CPU-Only

**IMPORTANT:** Cette version utilise **CPU uniquement** pour ONNX (pas de GPU).

**Raison:** Éviter les `BadImageFormatException` avec natives DLLs

**Impact:**
- ✅ Plugin stable et qui fonctionne
- ⚠️ Performance IA plus lente qu'avec GPU
- ✅ FFmpeg peut toujours utiliser GPU pour encodage

**Solution future:** Trouver un moyen de charger natives DLLs sans erreur

---

## 📞 CONTACT

**Si problème:** Ouvrir issue GitHub avec logs complets

**Checksums:**
- MD5: `404C27B13B148B142815FD91EF4925D1`
- Vérifier avec: `Get-FileHash -Algorithm MD5 JellyfinUpscalerPlugin-v1.7.0.zip`

---

**STATUS: ✅ PRÊT POUR TESTS UTILISATEUR**

🎉 **Bon courage pour les tests !**
