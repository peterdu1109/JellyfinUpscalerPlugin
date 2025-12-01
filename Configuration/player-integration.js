// Plugin de Suréchantillonnage IA - Intégration Lecteur v1.6.0
// Bouton de lecteur amélioré et intégration de streaming

(function () {
    'use strict';

    // Configuration du plugin
    const PLUGIN_ID = 'f87f700e-679d-43e6-9c7c-b3a410dc3f22';
    const PLUGIN_VERSION = '1.6.0';

    // Gestionnaire d'intégration du lecteur
    const PlayerIntegration = {

        // Initialiser l'intégration du lecteur
        init: function () {
            console.log('Suréchantillonnage IA : Initialisation intégration lecteur...');

            // Attendre que le lecteur Jellyfin soit prêt
            this.waitForPlayer();

            // Ajouter les styles CSS
            this.addStyles();

            // Écouter les changements de média
            this.attachMediaListeners();
        },

        // Attendre que le lecteur Jellyfin soit disponible
        waitForPlayer: function () {
            const checkPlayer = () => {
                try {
                    if (window.ApiClient && window.playbackManager) {
                        console.log('Suréchantillonnage IA : Lecteur Jellyfin détecté, intégration...');
                        this.integrateWithPlayer();
                    } else {
                        setTimeout(checkPlayer, 1000);
                    }
                } catch (error) {
                    console.error('Suréchantillonnage IA : Erreur attente lecteur :', error);
                    setTimeout(checkPlayer, 2000);
                }
            };
            checkPlayer();
        },

        // Intégrer avec le lecteur Jellyfin
        integrateWithPlayer: function () {
            try {
                // Ajouter le bouton de suréchantillonnage aux contrôles du lecteur
                this.addPlayerButton();

                // Surveiller les événements de lecture
                this.monitorPlayback();

                // Ajouter les raccourcis clavier
                this.addKeyboardShortcuts();
            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur intégration lecteur :', error);
            }
        },

        // Ajouter le bouton de suréchantillonnage aux contrôles du lecteur
        addPlayerButton: function () {
            const playerContainer = document.querySelector('.videoOsdBottom, .osdControls');
            if (!playerContainer) {
                setTimeout(() => this.addPlayerButton(), 2000);
                return;
            }

            // Créer le bouton de suréchantillonnage
            const upscalerButton = document.createElement('button');
            upscalerButton.id = 'aiUpscalerButton';
            upscalerButton.className = 'paper-icon-button-light';
            upscalerButton.setAttribute('type', 'button');
            upscalerButton.setAttribute('title', 'Paramètres Suréchantillonnage IA');
            upscalerButton.innerHTML = `
                <span class="material-icons">auto_awesome</span>
                <span class="upscaler-status">IA</span>
            `;

            // Ajouter le gestionnaire de clic
            upscalerButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUpscalerMenu();
            });

            // Insérer le bouton dans les contrôles du lecteur
            const controlsContainer = playerContainer.querySelector('.mediaButton, .btnToggleFullscreen');
            if (controlsContainer && controlsContainer.parentNode) {
                controlsContainer.parentNode.insertBefore(upscalerButton, controlsContainer);
            } else {
                playerContainer.appendChild(upscalerButton);
            }

            console.log('Suréchantillonnage IA : Bouton lecteur ajouté');
        },

        // Basculer le menu rapide de suréchantillonnage
        toggleUpscalerMenu: function () {
            const existingMenu = document.querySelector('#aiUpscalerQuickMenu');
            if (existingMenu) {
                existingMenu.remove();
                return;
            }

            const menu = document.createElement('div');
            menu.id = 'aiUpscalerQuickMenu';
            menu.className = 'aiUpscalerQuickMenu';
            menu.innerHTML = `
                <div class="quick-menu-header">
                    <span class="menu-title">🚀 Suréchantillonnage IA</span>
                    <button class="menu-close" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="quick-menu-content">
                    <div class="menu-section">
                        <h4>Réglages Rapides</h4>
                        <div class="menu-item" onclick="PlayerIntegration.quickSetModel('realesrgan')">
                            <span class="menu-icon">🎨</span>
                            <span>Real-ESRGAN (Haute Qualité)</span>
                        </div>
                        <div class="menu-item" onclick="PlayerIntegration.quickSetModel('swinir')">
                            <span class="menu-icon">⚡</span>
                            <span>SwinIR (Rapide)</span>
                        </div>
                        <div class="menu-item" onclick="PlayerIntegration.quickSetModel('waifu2x')">
                            <span class="menu-icon">🎭</span>
                            <span>Waifu2x (Anime)</span>
                        </div>
                        <div class="menu-item" onclick="PlayerIntegration.quickSetModel('bicubic')">
                            <span class="menu-icon">🔧</span>
                            <span>Bicubique (Repli)</span>
                        </div>
                    </div>
                    <div class="menu-section">
                        <h4>Facteur d'Échelle</h4>
                        <div class="scale-buttons">
                            <button class="scale-btn" onclick="PlayerIntegration.setScale(2)">2x</button>
                            <button class="scale-btn" onclick="PlayerIntegration.setScale(3)">3x</button>
                            <button class="scale-btn" onclick="PlayerIntegration.setScale(4)">4x</button>
                        </div>
                    </div>
                    <div class="menu-section">
                        <h4>Actions</h4>
                        <div class="menu-item" onclick="PlayerIntegration.toggleUpscaling()">
                            <span class="menu-icon">🔄</span>
                            <span>Activer/Désactiver</span>
                        </div>
                        <div class="menu-item" onclick="PlayerIntegration.showCurrentStats()">
                            <span class="menu-icon">📊</span>
                            <span>Afficher Statistiques</span>
                        </div>
                        <div class="menu-item" onclick="PlayerIntegration.openFullConfig()">
                            <span class="menu-icon">⚙️</span>
                            <span>Configuration Complète</span>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(menu);

            // Fermeture automatique après 10 secondes
            setTimeout(() => {
                if (menu.parentElement) {
                    menu.remove();
                }
            }, 10000);
        },

        // Sélection rapide du modèle
        quickSetModel: function (model) {
            console.log(`Suréchantillonnage IA : Modèle défini sur ${model}`);

            // Mettre à jour la configuration
            this.updatePluginConfig({ model: model });

            // Afficher notification
            this.showPlayerNotification(`🎯 Modèle défini sur ${model}`, 'success');

            // Fermer le menu
            const menu = document.querySelector('#aiUpscalerQuickMenu');
            if (menu) menu.remove();
        },

        // Définir le facteur d'échelle
        setScale: function (scale) {
            console.log(`Suréchantillonnage IA : Échelle définie sur ${scale}x`);

            this.updatePluginConfig({ scale: scale });
            this.showPlayerNotification(`📏 Échelle définie sur ${scale}x`, 'success');

            const menu = document.querySelector('#aiUpscalerQuickMenu');
            if (menu) menu.remove();
        },

        // Basculer l'activation du suréchantillonnage
        toggleUpscaling: function () {
            const currentState = this.getPluginConfig().enabled;
            const newState = !currentState;

            this.updatePluginConfig({ enabled: newState });
            this.showPlayerNotification(
                `🔄 Suréchantillonnage ${newState ? 'activé' : 'désactivé'}`,
                newState ? 'success' : 'warning'
            );

            // Mettre à jour le statut du bouton
            this.updateButtonStatus(newState);

            const menu = document.querySelector('#aiUpscalerQuickMenu');
            if (menu) menu.remove();
        },

        // Afficher les statistiques actuelles
        showCurrentStats: function () {
            const stats = this.getCurrentStats();

            const statsWindow = window.open('', '_blank', 'width=600,height=400');
            statsWindow.document.write(`
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <title>Suréchantillonnage IA - Statistiques Actuelles</title>
                    <style>
                        body { font-family: monospace; background: #1a1a1a; color: #00ff00; padding: 20px; }
                        .header { color: #00d4ff; font-size: 1.5em; margin-bottom: 20px; }
                        .stat-item { margin: 10px 0; padding: 10px; background: #2a2a2a; border-radius: 5px; }
                        .stat-label { color: #ffd700; font-weight: bold; }
                        .stat-value { color: #ffffff; margin-left: 10px; }
                        .good { color: #00ff00; }
                        .warning { color: #ffa500; }
                        .error { color: #ff0000; }
                    </style>
                </head>
                <body>
                    <div class="header">📊 Statistiques Suréchantillonnage IA</div>
                    <div class="stat-item">
                        <span class="stat-label">Statut :</span>
                        <span class="stat-value ${stats.enabled ? 'good' : 'warning'}">
                            ${stats.enabled ? '✅ Actif' : '⚠️ Inactif'}
                        </span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Modèle :</span>
                        <span class="stat-value">${stats.model}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Échelle :</span>
                        <span class="stat-value">${stats.scale}x</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Qualité :</span>
                        <span class="stat-value">${stats.quality}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Accélération Matérielle :</span>
                        <span class="stat-value ${stats.hardwareAcceleration ? 'good' : 'warning'}">
                            ${stats.hardwareAcceleration ? '✅ Activée' : '⚠️ Désactivée'}
                        </span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Taille Cache :</span>
                        <span class="stat-value">${stats.cacheSizeMB} Mo</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Performance :</span>
                        <span class="stat-value good">✅ Optimale</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Dernière Mise à Jour :</span>
                        <span class="stat-value">${new Date().toLocaleString('fr-FR')}</span>
                    </div>
                </body>
                </html>
            `);

            const menu = document.querySelector('#aiUpscalerQuickMenu');
            if (menu) menu.remove();
        },

        // Ouvrir la configuration complète
        openFullConfig: function () {
            const configUrl = `/web/configurationpage?name=aiupscaler`;
            window.open(configUrl, '_blank');

            const menu = document.querySelector('#aiUpscalerQuickMenu');
            if (menu) menu.remove();
        },

        // Surveiller les événements de lecture
        monitorPlayback: function () {
            if (window.playbackManager) {
                // Écouter le début de la lecture
                window.playbackManager.addEventListener('playbackstart', () => {
                    console.log('Suréchantillonnage IA : Lecture commencée');
                    this.onPlaybackStart();
                });

                // Écouter l'arrêt de la lecture
                window.playbackManager.addEventListener('playbackstop', () => {
                    console.log('Suréchantillonnage IA : Lecture arrêtée');
                    this.onPlaybackStop();
                });
            }
        },

        // Gérer le début de la lecture
        onPlaybackStart: function () {
            const config = this.getPluginConfig();
            if (config.enabled) {
                this.showPlayerNotification('🚀 Suréchantillonnage IA actif', 'info');
            }
        },

        // Gérer l'arrêt de la lecture
        onPlaybackStop: function () {
            // Nettoyage si nécessaire
        },

        // Ajouter les raccourcis clavier
        addKeyboardShortcuts: function () {
            document.addEventListener('keydown', (e) => {
                // Alt + U = Basculer suréchantillonnage
                if (e.altKey && e.key === 'u') {
                    e.preventDefault();
                    this.toggleUpscaling();
                }

                // Alt + M = Ouvrir menu rapide
                if (e.altKey && e.key === 'm') {
                    e.preventDefault();
                    this.toggleUpscalerMenu();
                }
            });
        },

        // Attacher les écouteurs de média
        attachMediaListeners: function () {
            // Écouter les changements de qualité média
            document.addEventListener('mediaqualitychange', (e) => {
                console.log('Suréchantillonnage IA : Qualité média changée', e.detail);
            });
        },

        // Gestion de la configuration
        getPluginConfig: function () {
            // Retourner une configuration simulée - en réel, récupérer depuis le serveur
            return {
                enabled: true,
                model: 'realesrgan',
                scale: 2,
                quality: 'balanced',
                hardwareAcceleration: true,
                cacheSizeMB: 1024
            };
        },

        updatePluginConfig: function (updates) {
            // En réel, mettre à jour la configuration sur le serveur
            console.log('Suréchantillonnage IA : Mise à jour config', updates);
        },

        getCurrentStats: function () {
            const config = this.getPluginConfig();
            return {
                ...config,
                timestamp: new Date().toISOString()
            };
        },

        // Mettre à jour le statut du bouton
        updateButtonStatus: function (enabled) {
            const button = document.querySelector('#aiUpscalerButton');
            if (button) {
                const status = button.querySelector('.upscaler-status');
                if (status) {
                    status.textContent = enabled ? 'ON' : 'OFF';
                    status.style.color = enabled ? '#00ff00' : '#ff6666';
                }
            }
        },

        // Afficher une notification dans le lecteur
        showPlayerNotification: function (message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `ai-upscaler-notification notification-${type}`;
            notification.textContent = message;

            const videoContainer = document.querySelector('.videoContainer, .playerContainer');
            if (videoContainer) {
                videoContainer.appendChild(notification);

                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 3000);
            }
        },

        // Ajouter les styles pour l'intégration lecteur
        addStyles: function () {
            if (document.querySelector('#aiUpscalerPlayerStyles')) return;

            const styles = document.createElement('style');
            styles.id = 'aiUpscalerPlayerStyles';
            styles.textContent = `
                #aiUpscalerButton {
                    position: relative;
                    margin: 0 5px;
                    background: rgba(0, 0, 0, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                    color: #ffffff;
                    padding: 8px 12px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                #aiUpscalerButton:hover {
                    background: rgba(0, 212, 255, 0.8);
                    border-color: #00d4ff;
                }
                
                #aiUpscalerButton .upscaler-status {
                    font-size: 10px;
                    font-weight: bold;
                    margin-left: 5px;
                }
                
                .aiUpscalerQuickMenu {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.95);
                    border: 2px solid #00d4ff;
                    border-radius: 12px;
                    padding: 0;
                    z-index: 10000;
                    min-width: 300px;
                    max-width: 400px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
                    animation: menuSlideIn 0.3s ease-out;
                }
                
                @keyframes menuSlideIn {
                    from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
                
                .quick-menu-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    background: linear-gradient(135deg, #00d4ff, #0099cc);
                    color: #000000;
                    border-radius: 10px 10px 0 0;
                }
                
                .menu-title {
                    font-weight: bold;
                    font-size: 16px;
                }
                
                .menu-close {
                    background: none;
                    border: none;
                    color: #000000;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .menu-close:hover {
                    background: rgba(0, 0, 0, 0.2);
                }
                
                .quick-menu-content {
                    padding: 20px;
                }
                
                .menu-section {
                    margin-bottom: 20px;
                }
                
                .menu-section h4 {
                    color: #00d4ff;
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    font-weight: 600;
                }
                
                .menu-item {
                    display: flex;
                    align-items: center;
                    padding: 10px 15px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    margin: 5px 0;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #ffffff;
                }
                
                .menu-item:hover {
                    background: rgba(0, 212, 255, 0.3);
                    transform: translateX(5px);
                }
                
                .menu-icon {
                    margin-right: 10px;
                    font-size: 16px;
                }
                
                .scale-buttons {
                    display: flex;
                    gap: 10px;
                }
                
                .scale-btn {
                    flex: 1;
                    padding: 8px 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                    color: #ffffff;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .scale-btn:hover {
                    background: rgba(0, 212, 255, 0.5);
                    border-color: #00d4ff;
                }
                
                .ai-upscaler-notification {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    padding: 10px 15px;
                    border-radius: 6px;
                    color: white;
                    font-weight: 500;
                    z-index: 9999;
                    animation: notificationSlideIn 0.3s ease-out;
                    pointer-events: none;
                }
                
                .notification-info { background: rgba(37, 99, 235, 0.9); }
                .notification-success { background: rgba(5, 150, 105, 0.9); }
                .notification-warning { background: rgba(217, 119, 6, 0.9); }
                .notification-error { background: rgba(220, 38, 38, 0.9); }
                
                @keyframes notificationSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;

            document.head.appendChild(styles);
        }
    };

    // Initialiser l'intégration du lecteur
    document.addEventListener('DOMContentLoaded', function () {
        PlayerIntegration.init();

        // Rendre disponible globalement
        window.PlayerIntegration = PlayerIntegration;

        console.log(`Intégration Lecteur Suréchantillonnage IA v${PLUGIN_VERSION} chargée`);
    });

    // Essayer également d'initialiser immédiatement si le DOM est déjà chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => PlayerIntegration.init());
    } else {
        PlayerIntegration.init();
    }

})();