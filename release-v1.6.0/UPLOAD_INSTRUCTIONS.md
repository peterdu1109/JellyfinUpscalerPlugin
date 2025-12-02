# 📦 Release v1.6.0 - Guide d'Upload

## Fichiers à Uploader sur GitHub

### Fichier Principal
📁 `JellyfinUpscalerPlugin.zip` (400 MB)
- Checksum MD5: `3C44B072F7E222812D1A9F448A8606C5`
- Compatible Jellyfin 10.11.4+

### Fichiers Complémentaires
📄 `manifest.json` - Métadonnées du plugin
📄 `RELEASE_NOTES.md` - Notes de version
📄 `meta.json` - Informations du plugin
🖼️ `thumb.jpg` - Miniature du plugin

## 🚀 Instructions d'Upload GitHub

1. **Créer une nouvelle release sur GitHub**:
   ```
   Tag: v1.6.0
   Title: Plugin de Suréchantillonnage IA v1.6.0 - Version Française
   ```

2. **Uploader les fichiers**:
   - Glisser-déposer `JellyfinUpscalerPlugin.zip`
   - Ajouter les autres fichiers si nécessaire

3. **Description de la release**:
   Copier le contenu de `RELEASE_NOTES.md`

4. **Vérifier l'URL de téléchargement**:
   L'URL finale devrait être:
   ```
   https://github.com/peterdu1109/JellyfinUpscalerPlugin/releases/download/v1.6.0/JellyfinUpscalerPlugin.zip
   ```
   Cette URL DOIT correspondre à celle dans `manifest.json`!

5. **Publier la release**:
   - Cocher "Set as latest release"
   - Cliquer sur "Publish release"

## ✅ Vérification Post-Upload

1. Vérifier que le fichier ZIP est téléchargeable
2. Vérifier que le checksum MD5 correspond
3. Tester l'installation via le catalogue Jellyfin

## 🔄 Mise à jour du Repository Manifest

Après l'upload, copier le `manifest.json` mis à jour vers:
```
/repository-jellyfin.json
```
Et faire un commit/push pour mettre à jour le catalogue.

---

**La release est prête pour Jellyfin 10.11.4!** 🎉
