# Préparer une release Jellyfin propre

Ce dépôt contient tout le nécessaire pour générer un paquet `.jfupkg` propre du plugin **AI Upscaler**. Ce guide explique ce qui se trouve où et comment publier sans oublier les ressources front‑end.

## 1. Structure de build

```
./Configuration/         Pages HTML/JS embarquées dans l'assembly
./assets/                Logos utilisés par le manifeste et la vignette
./dist/                  Sortie brute du build `dotnet publish`
./release-v1.4.0/        Contenu prêt à empaqueter dans le `.jfupkg`
```

Pendant le build (`dotnet publish -c Release`), les fichiers suivants sont copiés automatiquement dans `dist/` :

- `Configuration/*.html` et `Configuration/*.js` (exposés comme ressources web dans Jellyfin)
- `thumb.jpg` et `meta.json`

Le dossier `release-v1.4.0/` reprend cette structure afin de pouvoir générer l'archive finale sans dépendre de la machine locale.

## 2. Générer l'archive `.jfupkg`

1. Nettoyer la sortie précédente :
   ```bash
   rm -rf dist publish-output
   ```
2. Publier le plugin :
   ```bash
   dotnet publish JellyfinUpscalerPlugin.csproj -c Release -o dist
   ```
3. Vérifier que `dist/Configuration/` et `dist/thumb.jpg` sont présents. Si besoin, recopier `assets/` pour inclure le logo :
   ```bash
   cp -r assets dist/
   ```
4. Empaqueter :
   ```bash
   cd dist
   zip -r JellyfinUpscalerPlugin_1.4.0.zip .
   mv JellyfinUpscalerPlugin_1.4.0.zip JellyfinUpscalerPlugin_1.4.0.jfupkg
   ```
5. Calculer la somme SHA256 pour le manifeste :
   ```bash
   sha256sum JellyfinUpscalerPlugin_1.4.0.jfupkg
   ```
6. Publier l'asset sur GitHub et reporter l'URL + le checksum dans `manifest.json`, `dist/manifest.json` et `repository-*.json`.

> ℹ️ **Important :** Jellyfin attend l'extension `.jfupkg`. Il s'agit d'une archive zip classique, renommée.

## 3. Garder le dépôt propre

- Les fichiers d'archives (`*.zip`, `*.jfupkg`) ne doivent pas être commités (voir `.gitignore`).
- Les dossiers `Configuration/` et `assets/` restent à la racine pour que les pages et logos puissent être packagés.
- Le dossier `release-v1.4.0/` reflète l'arborescence finale : si vous ajoutez une ressource (ex : nouvelle page JS), copiez-la aussi dans ce dossier pour vos tests manuels.

## 4. Mise à jour du manifeste

Quand vous publiez une nouvelle version :

1. Mettre à jour `version`, `targetAbi`, `sourceUrl`, `checksum` et `timestamp` dans :
   - `manifest.json`
   - `dist/manifest.json`
   - `repository-jellyfin.json`
   - `repository-simple.json`
2. Modifier `meta.json` (racine et `dist/`) avec la même version et le changelog.
3. Vérifier que `thumb.jpg` pointe toujours vers `assets/logo.png` (dans le fichier lui-même, ligne 2).

En suivant cette procédure, l'archive publiée contient bien `Configuration/`, `assets/`, `meta.json`, `thumb.jpg` et l'assembly compilée, ce qui garantit une installation fonctionnelle via Jellyfin.
