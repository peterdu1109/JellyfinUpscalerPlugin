// Plugin Suréchantillonnage IA - Intégration Barre Latérale v1.6.0
// Crée un panneau latéral comme le plugin Playback Reporting

(function () {
    'use strict';

    // Configuration du plugin
    const PLUGIN_ID = 'f87f700e-679d-43e6-9c7c-b3a410dc3f22';
    const PLUGIN_VERSION = '1.6.0';

    // Gestionnaire d'intégration barre latérale
    const SidebarIntegration = {

        // Initialiser l'intégration barre latérale
        init: function () {
            console.log('Suréchantillonnage IA : Initialisation intégration barre latérale v1.6.0...');

            // Attendre que Jellyfin soit prêt
            this.waitForJellyfin();
        },

        // Attendre que le tableau de bord Jellyfin soit disponible
        waitForJellyfin: function () {
            const checkJellyfin = () => {
                try {
                    if (window.Dashboard && window.ApiClient) {
                        console.log('Suréchantillonnage IA : Tableau de bord Jellyfin détecté, intégration barre latérale...');
                        this.integrateSidebar();
                    } else {
                        setTimeout(checkJellyfin, 1000);
                    }
                } catch (error) {
                    console.error('Suréchantillonnage IA : Erreur attente Jellyfin :', error);
                    setTimeout(checkJellyfin, 2000);
                }
            };
            checkJellyfin();
        },

        // Intégrer avec la barre latérale Jellyfin
        integrateSidebar: function () {
            try {
                // Ajouter CSS pour le style de la barre latérale
                this.addSidebarStyles();

                // Attendre que la barre latérale soit disponible
                this.waitForSidebar();

            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur intégration barre latérale :', error);
            }
        },

        // Attendre que la navigation latérale soit disponible
        waitForSidebar: function () {
            let attempts = 0;
            const maxAttempts = 50;

            const checkSidebar = () => {
                attempts++;

                try {
                    const sidebar = document.querySelector('.mainDrawer-scrollContainer') ||
                        document.querySelector('.navDrawer-scrollContainer') ||
                        document.querySelector('.mainDrawerButton') ||
                        document.querySelector('.navMenuOption');

                    if (sidebar) {
                        console.log('Suréchantillonnage IA : Barre latérale trouvée, ajout élément menu...');
                        this.addSidebarMenuItem();
                    } else if (attempts < maxAttempts) {
                        setTimeout(checkSidebar, 500);
                    } else {
                        console.warn('Suréchantillonnage IA : Impossible de trouver la barre latérale après', maxAttempts, 'tentatives');
                        // Essayer méthode alternative
                        this.addMenuItemAlternative();
                    }
                } catch (error) {
                    console.error('Suréchantillonnage IA : Erreur vérification barre latérale :', error);
                    if (attempts < maxAttempts) {
                        setTimeout(checkSidebar, 1000);
                    }
                }
            };

            checkSidebar();
        },

        // Ajouter élément menu barre latérale
        addSidebarMenuItem: function () {
            try {
                // Trouver conteneur barre latérale
                const sidebarContainer = document.querySelector('.mainDrawer-scrollContainer') ||
                    document.querySelector('.navDrawer-scrollContainer') ||
                    document.querySelector('.navMenuContent');

                if (!sidebarContainer) {
                    console.warn('Suréchantillonnage IA : Conteneur barre latérale non trouvé');
                    return;
                }

                // Vérifier si notre élément de menu existe déjà
                if (document.querySelector('#ai-upscaler-sidebar-item')) {
                    console.log('Suréchantillonnage IA : Élément menu barre latérale existe déjà');
                    return;
                }

                // Créer élément menu
                const menuItem = this.createSidebarMenuItem();

                // Trouver point d'insertion (après Plugins ou Bibliothèques)
                const insertionPoint = this.findInsertionPoint(sidebarContainer);

                if (insertionPoint) {
                    insertionPoint.parentNode.insertBefore(menuItem, insertionPoint.nextSibling);
                } else {
                    sidebarContainer.appendChild(menuItem);
                }

                console.log('Suréchantillonnage IA : Élément menu barre latérale ajouté avec succès');

            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur ajout élément menu barre latérale :', error);
            }
        },

        // Créer HTML élément menu barre latérale
        createSidebarMenuItem: function () {
            const menuItem = document.createElement('a');
            menuItem.id = 'ai-upscaler-sidebar-item';
            menuItem.className = 'navMenuOption';
            menuItem.href = '#';

            menuItem.innerHTML = `
                <div class="navMenuOptionIcon">
                    <span class="material-icons">🎮</span>
                </div>
                <div class="navMenuOptionText">Suréchantillonnage IA</div>
            `;

            // Ajouter gestionnaire clic
            menuItem.addEventListener('click', (e) => {
                e.preventDefault();
                this.showUpscalerPanel();
            });

            return menuItem;
        },

        // Trouver point d'insertion dans barre latérale
        findInsertionPoint: function (container) {
            // Chercher Plugins, Bibliothèques ou éléments similaires
            const navItems = container.querySelectorAll('.navMenuOption');

            for (let item of navItems) {
                const text = item.textContent.toLowerCase();
                if (text.includes('plugin') || text.includes('libraries') || text.includes('settings')) {
                    return item;
                }
            }

            // Si non trouvé, retourner dernier élément
            return navItems[navItems.length - 1];
        },

        // Méthode alternative pour ajouter élément menu
        addMenuItemAlternative: function () {
            try {
                // Essayer d'ajouter à la navigation tableau de bord
                setTimeout(() => {
                    this.addDashboardMenuItem();
                }, 2000);
            } catch (error) {
                console.error('Suréchantillonnage IA : Intégration menu alternative échouée :', error);
            }
        },

        // Ajouter élément menu au tableau de bord
        addDashboardMenuItem: function () {
            try {
                // Créer bouton action flottant si intégration barre latérale échoue
                const fab = document.createElement('div');
                fab.id = 'ai-upscaler-fab';
                fab.className = 'ai-upscaler-fab';
                fab.innerHTML = '🎮';
                fab.title = 'Paramètres Suréchantillonnage IA';

                fab.addEventListener('click', () => {
                    this.showUpscalerPanel();
                });

                document.body.appendChild(fab);

                console.log('Suréchantillonnage IA : Bouton action flottant ajouté comme repli');

            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur ajout élément menu tableau de bord :', error);
            }
        },

        // Afficher panneau paramètres suréchantillonnage
        showUpscalerPanel: function () {
            try {
                console.log('Suréchantillonnage IA : Ouverture panneau paramètres...');

                // Supprimer panneau existant
                const existingPanel = document.getElementById('ai-upscaler-panel');
                if (existingPanel) {
                    existingPanel.remove();
                }

                // Créer panneau paramètres
                const panel = this.createSettingsPanel();
                document.body.appendChild(panel);

                // Charger paramètres actuels
                this.loadCurrentSettings();

                // Initialiser fonctionnalités panneau
                this.initializePanelFeatures();

            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur affichage panneau suréchantillonnage :', error);
            }
        },

        // Créer HTML panneau paramètres
        createSettingsPanel: function () {
            const panel = document.createElement('div');
            panel.id = 'ai-upscaler-panel';
            panel.className = 'ai-upscaler-panel';

            panel.innerHTML = `
                <div class="ai-upscaler-panel-overlay" onclick="window.SidebarIntegration.closePanel()"></div>
                <div class="ai-upscaler-panel-content">
                    <div class="ai-upscaler-panel-header">
                        <h2>🎮 Paramètres Suréchantillonnage IA</h2>
                        <button class="ai-upscaler-close-btn" onclick="window.SidebarIntegration.closePanel()">×</button>
                    </div>
                    
                    <div class="ai-upscaler-panel-body">
                        <!-- Status Section -->
                        <div class="ai-upscaler-section">
                            <h3>📊 État du Système</h3>
                            <div id="system-status" class="status-grid">
                                <div class="status-item">
                                    <span class="status-label">État du Plugin :</span>
                                    <span class="status-value" id="plugin-status">Chargement...</span>
                                </div>
                                <div class="status-item">
                                    <span class="status-label">Matériel :</span>
                                    <span class="status-value" id="hardware-status">Détection...</span>
                                </div>
                                <div class="status-item">
                                    <span class="status-label">Performance :</span>
                                    <span class="status-value" id="performance-status">Analyse...</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Quick Settings -->
                        <div class="ai-upscaler-section">
                            <h3>⚡ Réglages Rapides</h3>
                            <div class="settings-grid">
                                <div class="setting-item">
                                    <label for="quick-enable">Activer Suréchantillonnage IA :</label>
                                    <input type="checkbox" id="quick-enable" checked>
                                </div>
                                <div class="setting-item">
                                    <label for="quick-model">Modèle IA :</label>
                                    <select id="quick-model">
                                        <option value="fsrcnn">FSRCNN (Équilibré)</option>
                                        <option value="fsrcnn-light">FSRCNN Light (Rapide)</option>
                                        <option value="esrgan">ESRGAN (Qualité)</option>
                                        <option value="realesrgan">Real-ESRGAN (Meilleur)</option>
                                        <option value="waifu2x">Waifu2x (Anime)</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <label for="quick-scale">Facteur d'Échelle :</label>
                                    <select id="quick-scale">
                                        <option value="2">2x (Recommandé)</option>
                                        <option value="3">3x</option>
                                        <option value="4">4x</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <label for="quick-quality">Qualité :</label>
                                    <select id="quick-quality">
                                        <option value="performance">Performance</option>
                                        <option value="balanced" selected>Équilibré</option>
                                        <option value="quality">Qualité</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Hardware Benchmark -->
                        <div class="ai-upscaler-section">
                            <h3>🔬 Benchmark Matériel</h3>
                            <div class="benchmark-controls">
                                <button id="run-benchmark-btn" class="btn btn-primary">
                                    Lancer Test Matériel
                                </button>
                                <button id="view-results-btn" class="btn btn-secondary">
                                    Voir Résultats
                                </button>
                                <button id="auto-optimize-btn" class="btn btn-success">
                                    Auto-Optimisation
                                </button>
                            </div>
                            <div id="benchmark-console" class="benchmark-console" style="display: none;">
                                <div class="console-header">Console Benchmark</div>
                                <div id="console-output" class="console-output"></div>
                            </div>
                        </div>
                        
                        <!-- Advanced Features -->
                        <div class="ai-upscaler-section">
                            <h3>🚀 Fonctionnalités Avancées</h3>
                            <div class="advanced-grid">
                                <div class="feature-item">
                                    <input type="checkbox" id="enable-cache">
                                    <label for="enable-cache">Cache de Pré-traitement</label>
                                </div>
                                <div class="feature-item">
                                    <input type="checkbox" id="enable-fallback">
                                    <label for="enable-fallback">Repli Automatique</label>
                                </div>
                                <div class="feature-item">
                                    <input type="checkbox" id="enable-comparison">
                                    <label for="enable-comparison">Vue Comparaison</label>
                                </div>
                                <div class="feature-item">
                                    <input type="checkbox" id="enable-tv-optimization">
                                    <label for="enable-tv-optimization">Support Télécommande TV</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ai-upscaler-panel-footer">
                        <button id="save-settings-btn" class="btn btn-primary">Enregistrer Paramètres</button>
                        <button id="reset-settings-btn" class="btn btn-secondary">Réinitialiser par Défaut</button>
                        <button onclick="window.SidebarIntegration.closePanel()" class="btn btn-cancel">Annuler</button>
                    </div>
                </div>
            `;

            return panel;
        },

        // Initialiser fonctionnalités panneau
        initializePanelFeatures: function () {
            try {
                // Bouton Benchmark
                const benchmarkBtn = document.getElementById('run-benchmark-btn');
                if (benchmarkBtn) {
                    benchmarkBtn.addEventListener('click', () => {
                        this.runBenchmark();
                    });
                }

                // Bouton Auto-optimisation
                const optimizeBtn = document.getElementById('auto-optimize-btn');
                if (optimizeBtn) {
                    optimizeBtn.addEventListener('click', () => {
                        this.autoOptimize();
                    });
                }

                // Bouton Enregistrer
                const saveBtn = document.getElementById('save-settings-btn');
                if (saveBtn) {
                    saveBtn.addEventListener('click', () => {
                        this.saveSettings();
                    });
                }

                // Bouton Réinitialiser
                const resetBtn = document.getElementById('reset-settings-btn');
                if (resetBtn) {
                    resetBtn.addEventListener('click', () => {
                        this.resetSettings();
                    });
                }

                // Bouton Voir Résultats
                const resultsBtn = document.getElementById('view-results-btn');
                if (resultsBtn) {
                    resultsBtn.addEventListener('click', () => {
                        this.viewBenchmarkResults();
                    });
                }

            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur initialisation fonctionnalités panneau :', error);
            }
        },

        // Charger paramètres actuels
        loadCurrentSettings: function () {
            try {
                // Appel API pour obtenir paramètres actuels
                if (window.ApiClient) {
                    window.ApiClient.getJSON('/api/upscaler/status')
                        .then(response => {
                            this.updateStatusDisplay(response);
                        })
                        .catch(error => {
                            console.error('Suréchantillonnage IA : Erreur chargement paramètres :', error);
                        });
                }

                // Obtenir recommandations matérielles
                if (window.ApiClient) {
                    window.ApiClient.getJSON('/api/upscaler/recommendations')
                        .then(response => {
                            this.updateRecommendations(response);
                        })
                        .catch(error => {
                            console.error('Suréchantillonnage IA : Erreur chargement recommandations :', error);
                        });
                }

            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur dans loadCurrentSettings :', error);
            }
        },

        // Mettre à jour affichage état
        updateStatusDisplay: function (status) {
            try {
                const pluginStatusEl = document.getElementById('plugin-status');
                const hardwareStatusEl = document.getElementById('hardware-status');
                const performanceStatusEl = document.getElementById('performance-status');

                if (pluginStatusEl) {
                    pluginStatusEl.textContent = status.enabled ? 'Actif' : 'Désactivé';
                    pluginStatusEl.className = 'status-value ' + (status.enabled ? 'status-active' : 'status-inactive');
                }

                if (hardwareStatusEl) {
                    hardwareStatusEl.textContent = status.hardwareAcceleration ? 'GPU Activé' : 'CPU Uniquement';
                    hardwareStatusEl.className = 'status-value ' + (status.hardwareAcceleration ? 'status-active' : 'status-warning');
                }

                if (performanceStatusEl) {
                    performanceStatusEl.textContent = status.performance || 'Bonne';
                    performanceStatusEl.className = 'status-value status-active';
                }

            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur mise à jour affichage état :', error);
            }
        },

        // Lancer benchmark matériel
        runBenchmark: function () {
            try {
                console.log('Suréchantillonnage IA : Démarrage benchmark matériel...');

                const benchmarkBtn = document.getElementById('run-benchmark-btn');
                const consoleEl = document.getElementById('benchmark-console');
                const outputEl = document.getElementById('console-output');

                if (benchmarkBtn) {
                    benchmarkBtn.disabled = true;
                    benchmarkBtn.textContent = 'Benchmark en cours...';
                }

                if (consoleEl) {
                    consoleEl.style.display = 'block';
                }

                if (outputEl) {
                    outputEl.innerHTML = '<div class="console-line">Démarrage benchmark matériel...</div>';
                }

                // Appel API pour lancer benchmark
                if (window.ApiClient) {
                    const addConsoleOutput = (message) => {
                        if (outputEl) {
                            outputEl.innerHTML += `<div class="console-line">${new Date().toLocaleTimeString('fr-FR')}: ${message}</div>`;
                            outputEl.scrollTop = outputEl.scrollHeight;
                        }
                    };

                    addConsoleOutput('Détection matériel système...');

                    setTimeout(() => {
                        addConsoleOutput('Test performance modèles IA...');
                    }, 1000);

                    setTimeout(() => {
                        addConsoleOutput('Benchmark mise à l\'échelle...');
                    }, 2000);

                    setTimeout(() => {
                        window.ApiClient.ajax({
                            type: 'POST',
                            url: '/api/upscaler/benchmark',
                            dataType: 'json'
                        })
                            .then(response => {
                                addConsoleOutput('Benchmark terminé avec succès !');
                                addConsoleOutput(`Durée totale : ${response.results.duration.toFixed(1)}s`);
                                addConsoleOutput(`Modèle recommandé : ${response.results.optimalSettings.RecommendedModel}`);
                                addConsoleOutput(`Résolution recommandée : ${response.results.optimalSettings.RecommendedMaxResolution}`);

                                if (benchmarkBtn) {
                                    benchmarkBtn.disabled = false;
                                    benchmarkBtn.textContent = 'Lancer Test Matériel';
                                }
                            })
                            .catch(error => {
                                addConsoleOutput('Échec benchmark : ' + error.message);
                                console.error('Suréchantillonnage IA : Échec benchmark :', error);

                                if (benchmarkBtn) {
                                    benchmarkBtn.disabled = false;
                                    benchmarkBtn.textContent = 'Lancer Test Matériel';
                                }
                            });
                    }, 3000);
                }

            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur exécution benchmark :', error);
            }
        },

        // Auto-optimisation paramètres
        autoOptimize: function () {
            try {
                console.log('Suréchantillonnage IA : Auto-optimisation paramètres...');

                if (window.ApiClient) {
                    window.ApiClient.getJSON('/api/upscaler/recommendations')
                        .then(response => {
                            // Appliquer paramètres recommandés
                            const modelSelect = document.getElementById('quick-model');
                            const qualitySelect = document.getElementById('quick-quality');

                            if (modelSelect && response.recommended.model) {
                                modelSelect.value = response.recommended.model;
                            }

                            if (qualitySelect && response.recommended.quality) {
                                qualitySelect.value = response.recommended.quality;
                            }

                            // Afficher notification
                            this.showNotification('Paramètres optimisés pour votre matériel !', 'success');
                        })
                        .catch(error => {
                            console.error('Suréchantillonnage IA : Erreur auto-optimisation :', error);
                            this.showNotification('Échec auto-optimisation', 'error');
                        });
                }

            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur dans autoOptimize :', error);
            }
        },

        // Enregistrer paramètres
        saveSettings: function () {
            try {
                console.log('Suréchantillonnage IA : Enregistrement paramètres...');

                const settings = {
                    enabled: document.getElementById('quick-enable')?.checked,
                    model: document.getElementById('quick-model')?.value,
                    scale: parseInt(document.getElementById('quick-scale')?.value),
                    quality: document.getElementById('quick-quality')?.value,
                    enableCache: document.getElementById('enable-cache')?.checked,
                    enableFallback: document.getElementById('enable-fallback')?.checked,
                    enableComparison: document.getElementById('enable-comparison')?.checked,
                    enableTVOptimization: document.getElementById('enable-tv-optimization')?.checked
                };

                if (window.ApiClient) {
                    window.ApiClient.ajax({
                        type: 'POST',
                        url: '/api/upscaler/settings',
                        data: JSON.stringify(settings),
                        contentType: 'application/json',
                        dataType: 'json'
                    })
                        .then(response => {
                            this.showNotification('Paramètres enregistrés avec succès !', 'success');
                        })
                        .catch(error => {
                            console.error('Suréchantillonnage IA : Erreur enregistrement paramètres :', error);
                            this.showNotification('Échec enregistrement paramètres', 'error');
                        });
                }

            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur enregistrement paramètres :', error);
            }
        },

        // Réinitialiser paramètres par défaut
        resetSettings: function () {
            try {
                // Réinitialiser champs formulaire
                const quickEnable = document.getElementById('quick-enable');
                const quickModel = document.getElementById('quick-model');
                const quickScale = document.getElementById('quick-scale');
                const quickQuality = document.getElementById('quick-quality');

                if (quickEnable) quickEnable.checked = true;
                if (quickModel) quickModel.value = 'fsrcnn';
                if (quickScale) quickScale.value = '2';
                if (quickQuality) quickQuality.value = 'balanced';

                this.showNotification('Paramètres réinitialisés par défaut', 'info');

            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur réinitialisation paramètres :', error);
            }
        },

        // Voir résultats benchmark
        viewBenchmarkResults: function () {
            try {
                console.log('Suréchantillonnage IA : Ouverture résultats benchmark...');

                // Dans une implémentation réelle, cela ouvrirait une vue détaillée
                this.showNotification('Les résultats du benchmark seront affichés ici', 'info');

            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur affichage résultats benchmark :', error);
            }
        },

        // Afficher notification
        showNotification: function (message, type = 'info') {
            try {
                // Créer élément notification
                const notification = document.createElement('div');
                notification.className = `ai-upscaler-notification notification-${type}`;
                notification.textContent = message;

                document.body.appendChild(notification);

                // Supprimer après 3 secondes
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 3000);

            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur affichage notification :', error);
            }
        },

        // Fermer panneau
        closePanel: function () {
            try {
                const panel = document.getElementById('ai-upscaler-panel');
                if (panel) {
                    panel.remove();
                }
            } catch (error) {
                console.error('Suréchantillonnage IA : Erreur fermeture panneau :', error);
            }
        },

        // Ajouter styles CSS
        addSidebarStyles: function () {
            if (document.getElementById('ai-upscaler-sidebar-styles')) {
                return; // Styles déjà ajoutés
            }

            const style = document.createElement('style');
            style.id = 'ai-upscaler-sidebar-styles';
            style.textContent = `
                /* Styles Barre Latérale Suréchantillonnage IA */
                .ai-upscaler-fab {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 56px;
                    height: 56px;
                    background: #00a4dc;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    color: white;
                    cursor: pointer;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    z-index: 9999;
                    transition: all 0.3s ease;
                }
                
                .ai-upscaler-fab:hover {
                    background: #0084b4;
                    transform: scale(1.1);
                }
                
                .ai-upscaler-panel {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .ai-upscaler-panel-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.7);
                }
                
                .ai-upscaler-panel-content {
                    position: relative;
                    width: 90%;
                    max-width: 800px;
                    max-height: 90%;
                    background: #1e1e1e;
                    border-radius: 8px;
                    color: #ffffff;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                
                .ai-upscaler-panel-header {
                    padding: 20px;
                    background: #2d2d2d;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #404040;
                }
                
                .ai-upscaler-panel-header h2 {
                    margin: 0;
                    font-size: 24px;
                    color: #00a4dc;
                }
                
                .ai-upscaler-close-btn {
                    background: none;
                    border: none;
                    color: #ffffff;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 4px;
                    transition: background 0.3s ease;
                }
                
                .ai-upscaler-close-btn:hover {
                    background: #404040;
                }
                
                .ai-upscaler-panel-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                }
                
                .ai-upscaler-section {
                    margin-bottom: 30px;
                }
                
                .ai-upscaler-section h3 {
                    color: #00a4dc;
                    margin-bottom: 15px;
                    font-size: 18px;
                }
                
                .status-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }
                
                .status-item {
                    background: #2d2d2d;
                    padding: 15px;
                    border-radius: 6px;
                    border-left: 4px solid #00a4dc;
                }
                
                .status-label {
                    display: block;
                    font-size: 14px;
                    color: #cccccc;
                    margin-bottom: 5px;
                }
                
                .status-value {
                    font-weight: bold;
                    font-size: 16px;
                }
                
                .status-active {
                    color: #4caf50;
                }
                
                .status-warning {
                    color: #ff9800;
                }
                
                .status-inactive {
                    color: #f44336;
                }
                
                .settings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px;
                }
                
                .setting-item {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .setting-item label {
                    color: #cccccc;
                    font-size: 14px;
                }
                
                .setting-item input,
                .setting-item select {
                    background: #2d2d2d;
                    border: 1px solid #404040;
                    color: #ffffff;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                }
                
                .setting-item input:focus,
                .setting-item select:focus {
                    outline: none;
                    border-color: #00a4dc;
                }
                
                .benchmark-controls {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-bottom: 15px;
                }
                
                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                
                .btn-primary {
                    background: #00a4dc;
                    color: white;
                }
                
                .btn-primary:hover {
                    background: #0084b4;
                }
                
                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }
                
                .btn-secondary:hover {
                    background: #545b62;
                }
                
                .btn-success {
                    background: #28a745;
                    color: white;
                }
                
                .btn-success:hover {
                    background: #218838;
                }
                
                .btn-cancel {
                    background: #6c757d;
                    color: white;
                }
                
                .btn-cancel:hover {
                    background: #545b62;
                }
                
                .benchmark-console {
                    background: #1a1a1a;
                    border: 1px solid #404040;
                    border-radius: 4px;
                    height: 200px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                
                .console-header {
                    background: #2d2d2d;
                    padding: 8px 12px;
                    font-size: 12px;
                    color: #cccccc;
                    border-bottom: 1px solid #404040;
                }
                
                .console-output {
                    flex: 1;
                    padding: 10px;
                    overflow-y: auto;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    line-height: 1.4;
                }
                
                .console-line {
                    color: #00ff00;
                    margin-bottom: 2px;
                }
                
                .advanced-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }
                
                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px;
                    background: #2d2d2d;
                    border-radius: 4px;
                }
                
                .feature-item input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    margin: 0;
                }
                
                .feature-item label {
                    color: #cccccc;
                    cursor: pointer;
                    margin: 0;
                }
                
                .ai-upscaler-panel-footer {
                    padding: 20px;
                    background: #2d2d2d;
                    border-top: 1px solid #404040;
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                    flex-wrap: wrap;
                }
                
                .ai-upscaler-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    border-radius: 4px;
                    color: white;
                    font-size: 14px;
                    z-index: 10001;
                    opacity: 0;
                    animation: slideInNotification 0.3s ease forwards;
                }
                
                .notification-success {
                    background: #28a745;
                }
                
                .notification-error {
                    background: #dc3545;
                }
                
                .notification-info {
                    background: #17a2b8;
                }
                
                @keyframes slideInNotification {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    .ai-upscaler-panel-content {
                        width: 95%;
                        height: 95%;
                    }
                    
                    .status-grid,
                    .settings-grid,
                    .advanced-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .benchmark-controls {
                        flex-direction: column;
                    }
                    
                    .ai-upscaler-panel-footer {
                        flex-direction: column;
                    }
                }
            `;

            document.head.appendChild(style);
        }
    };

    // Rendre closePanel disponible globalement
    window.SidebarIntegration = SidebarIntegration;

    // Initialiser au chargement de la page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            SidebarIntegration.init();
        });
    } else {
        SidebarIntegration.init();
    }

    // Initialiser aussi lors des changements de navigation (pour comportement SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                SidebarIntegration.init();
            }, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

})();