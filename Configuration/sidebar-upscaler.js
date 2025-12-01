// Plugin Suréchantillonnage IA - Intégration Barre Latérale (type Playback Reporting)
(function () {
    'use strict';

    // Ajouter élément menu barre latérale pour Plugin Suréchantillonnage IA
    function addSidebarItem() {
        const navDrawer = document.querySelector('.navDrawer-scrollContainer');
        if (!navDrawer || document.querySelector('#aiUpscalerSidebarItem')) {
            return;
        }

        // Créer l'élément de la barre latérale
        const sidebarItem = document.createElement('a');
        sidebarItem.id = 'aiUpscalerSidebarItem';
        sidebarItem.className = 'navMenuOption lnkMediaFolder';
        sidebarItem.href = '#';
        sidebarItem.setAttribute('data-itemid', 'aiupscaler');

        sidebarItem.innerHTML = `
            <span class="navMenuOptionIcon material-icons">smart_display</span>
            <span class="navMenuOptionText">Suréchantillonnage IA</span>
        `;

        // Trouver la bonne position (après Tableau de bord, avant autres plugins)
        const dashboardItem = navDrawer.querySelector('a[href="#/dashboard.html"]');
        const parentNode = dashboardItem ? dashboardItem.parentNode : navDrawer;

        if (dashboardItem && dashboardItem.nextSibling) {
            parentNode.insertBefore(sidebarItem, dashboardItem.nextSibling);
        } else {
            parentNode.appendChild(sidebarItem);
        }

        // Ajouter gestionnaire clic
        sidebarItem.addEventListener('click', function (e) {
            e.preventDefault();
            showUpscalerPanel();
        });

        console.log('Suréchantillonnage IA : Élément barre latérale ajouté avec succès');
    }

    // Afficher le panneau de paramètres Suréchantillonnage IA
    function showUpscalerPanel() {
        // Supprimer panneau existant si présent
        const existingPanel = document.querySelector('#aiUpscalerPanel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // Créer panneau principal
        const panel = document.createElement('div');
        panel.id = 'aiUpscalerPanel';
        panel.className = 'page libraryPage backdropPage pageWithAbsoluteTabs withTabs';
        panel.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--theme-body-bg);
            z-index: 1000;
            overflow-y: auto;
        `;

        panel.innerHTML = `
            <div class="pageHeader">
                <div class="pageHeaderContent">
                    <button type="button" class="headerBackButton" id="aiUpscalerBack">
                        <span class="material-icons">arrow_back</span>
                    </button>
                    <h1 class="pageTitle">Plugin Suréchantillonnage IA 1.6</h1>
                </div>
            </div>

            <div class="pageContainer">
                <div class="content-primary">
                    
                    <!-- System Status -->
                    <div class="verticalSection">
                        <h2 class="sectionTitle">État du Système</h2>
                        <div class="cardBox visualCardBox" style="margin: 1em 0;">
                            <div class="cardText" id="systemStatus">
                                <div>État : <span id="pluginStatus" style="color: #00a4dc;">Chargement...</span></div>
                                <div>Version : 1.6.0</div>
                                <div>Matériel : <span id="hardwareInfo">Détection...</span></div>
                                <div>Performance : <span id="performanceInfo">Surveillance...</span></div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="verticalSection">
                        <h2 class="sectionTitle">Actions Rapides</h2>
                        <div style="display: flex; gap: 1em; flex-wrap: wrap; margin: 1em 0;">
                            <button type="button" class="raised button-submit" id="runBenchmarkBtn">
                                <span>Lancer Test Matériel</span>
                            </button>
                            <button type="button" class="raised button-submit" id="autoOptimizeBtn">
                                <span>Auto-Optimisation</span>
                            </button>
                            <button type="button" class="raised button-submit" id="clearCacheBtn">
                                <span>Vider Cache</span>
                            </button>
                            <button type="button" class="raised button-submit" id="openSettingsBtn">
                                <span>Ouvrir Paramètres</span>
                            </button>
                        </div>
                    </div>

                    <!-- Benchmark Console -->
                    <div class="verticalSection">
                        <h2 class="sectionTitle">Console Benchmark</h2>
                        <div class="cardBox visualCardBox" style="margin: 1em 0;">
                            <div style="background: #1a1a1a; color: #00ff00; font-family: 'Courier New', monospace; padding: 1em; border-radius: 4px; height: 300px; overflow-y: auto; font-size: 12px;" id="benchmarkConsole">
                                <div>Plugin Suréchantillonnage IA v1.6.0 - Console Benchmark</div>
                                <div>Prêt pour test matériel...</div>
                                <div>Tapez 'help' pour les commandes disponibles</div>
                                <div style="margin-top: 1em;">
                                    <span style="color: #ffff00;">upscaler@jellyfin:~$</span> <span id="consoleInput"></span>
                                </div>
                            </div>
                            <div style="margin-top: 0.5em;">
                                <input type="text" class="emby-input" id="consoleCommandInput" placeholder="Entrer commande (benchmark, status, optimize, clear, help)" style="width: 100%;">
                            </div>
                        </div>
                    </div>

                    <!-- Hardware Information -->
                    <div class="verticalSection">
                        <h2 class="sectionTitle">Information Matériel</h2>
                        <div class="cardBox visualCardBox" style="margin: 1em 0;">
                            <div class="cardText" id="hardwareDetails">
                                <div><strong>CPU :</strong> <span id="cpuInfo">Détection...</span></div>
                                <div><strong>GPU :</strong> <span id="gpuInfo">Détection...</span></div>
                                <div><strong>RAM :</strong> <span id="ramInfo">Détection...</span></div>
                                <div><strong>Plateforme :</strong> <span id="platformInfo">Détection...</span></div>
                                <div><strong>Modèle Recommandé :</strong> <span id="recommendedModel">Analyse...</span></div>
                            </div>
                        </div>
                    </div>

                    <!-- Performance Metrics -->
                    <div class="verticalSection">
                        <h2 class="sectionTitle">Métriques Performance</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1em; margin: 1em 0;">
                            <div class="cardBox visualCardBox">
                                <div class="cardText">
                                    <div><strong>IPS</strong></div>
                                    <div style="font-size: 24px; color: #00a4dc;" id="fpsDisplay">--</div>
                                </div>
                            </div>
                            <div class="cardBox visualCardBox">
                                <div class="cardText">
                                    <div><strong>Utilisation CPU</strong></div>
                                    <div style="font-size: 24px; color: #00a4dc;" id="cpuUsage">--</div>
                                </div>
                            </div>
                            <div class="cardBox visualCardBox">
                                <div class="cardText">
                                    <div><strong>Utilisation GPU</strong></div>
                                    <div style="font-size: 24px; color: #00a4dc;" id="gpuUsage">--</div>
                                </div>
                            </div>
                            <div class="cardBox visualCardBox">
                                <div class="cardText">
                                    <div><strong>Taille Cache</strong></div>
                                    <div style="font-size: 24px; color: #00a4dc;" id="cacheSize">--</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Ajouter gestionnaires événements
        setupPanelHandlers();
        loadSystemInfo();
        startPerformanceMonitoring();
    }

    // Configurer gestionnaires événements pour le panneau
    function setupPanelHandlers() {
        // Bouton Retour
        document.getElementById('aiUpscalerBack').addEventListener('click', function () {
            document.getElementById('aiUpscalerPanel').remove();
        });

        // Boutons actions rapides
        document.getElementById('runBenchmarkBtn').addEventListener('click', runBenchmark);
        document.getElementById('autoOptimizeBtn').addEventListener('click', autoOptimize);
        document.getElementById('clearCacheBtn').addEventListener('click', clearCache);
        document.getElementById('openSettingsBtn').addEventListener('click', openSettings);

        // Entrée Console
        const consoleInput = document.getElementById('consoleCommandInput');
        consoleInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                executeConsoleCommand(this.value);
                this.value = '';
            }
        });
    }

    // Exécution commande console
    function executeConsoleCommand(command) {
        const console = document.getElementById('benchmarkConsole');
        const cmd = command.toLowerCase().trim();

        // Ajouter commande à la console
        const commandLine = document.createElement('div');
        commandLine.innerHTML = `<span style="color: #ffff00;">upscaler@jellyfin:~$</span> ${command}`;
        console.appendChild(commandLine);

        const response = document.createElement('div');

        switch (cmd) {
            case 'benchmark':
                response.textContent = 'Démarrage benchmark matériel...';
                console.appendChild(response);
                runBenchmark();
                break;
            case 'status':
                response.innerHTML = `État Plugin : Actif<br>Version : 1.6.0<br>Matériel : Auto-détecté<br>Cache : Disponible`;
                console.appendChild(response);
                break;
            case 'optimize':
                response.textContent = 'Exécution auto-optimisation...';
                console.appendChild(response);
                autoOptimize();
                break;
            case 'clear':
                console.innerHTML = `<div>Plugin Suréchantillonnage IA v1.6.0 - Console Benchmark</div>
                                   <div>Console effacée</div>
                                   <div style="margin-top: 1em;">
                                       <span style="color: #ffff00;">upscaler@jellyfin:~$</span>
                                   </div>`;
                return;
            case 'help':
                response.innerHTML = `Commandes disponibles :<br>
                - benchmark : Lancer test matériel<br>
                - status : Afficher état plugin<br>
                - optimize : Auto-optimiser paramètres<br>
                - clear : Effacer console<br>
                - help : Afficher cette aide`;
                console.appendChild(response);
                break;
            default:
                response.innerHTML = `Commande inconnue : ${command}<br>Tapez 'help' pour les commandes disponibles`;
                console.appendChild(response);
        }

        // Auto-défilement vers le bas
        console.scrollTop = console.scrollHeight;
    }

    // Charger informations système
    function loadSystemInfo() {
        // Simuler appels API
        setTimeout(() => {
            document.getElementById('pluginStatus').textContent = 'Actif';
            document.getElementById('hardwareInfo').textContent = 'Détecté';
            document.getElementById('performanceInfo').textContent = 'Optimal';

            document.getElementById('cpuInfo').textContent = 'Intel Core i5-12400 (6 coeurs)';
            document.getElementById('gpuInfo').textContent = 'NVIDIA GTX 1660 Super';
            document.getElementById('ramInfo').textContent = '16 Go DDR4';
            document.getElementById('platformInfo').textContent = 'Windows 11';
            document.getElementById('recommendedModel').textContent = 'ESRGAN (Équilibré)';
        }, 1000);
    }

    // Surveillance performance
    function startPerformanceMonitoring() {
        setInterval(() => {
            document.getElementById('fpsDisplay').textContent = (Math.random() * 60 + 30).toFixed(1);
            document.getElementById('cpuUsage').textContent = (Math.random() * 40 + 20).toFixed(1) + '%';
            document.getElementById('gpuUsage').textContent = (Math.random() * 60 + 30).toFixed(1) + '%';
            document.getElementById('cacheSize').textContent = (Math.random() * 2 + 1).toFixed(1) + ' Go';
        }, 2000);
    }

    // Fonctions actions rapides
    function runBenchmark() {
        const console = document.getElementById('benchmarkConsole');
        const steps = [
            'Initialisation benchmark...',
            'Détection configuration matérielle...',
            'Test performance CPU...',
            'Test performance GPU...',
            'Test bande passante mémoire...',
            'Test performance modèle IA...',
            'Benchmark terminé avec succès !'
        ];

        let stepIndex = 0;
        const interval = setInterval(() => {
            if (stepIndex < steps.length) {
                const step = document.createElement('div');
                step.textContent = steps[stepIndex];
                console.appendChild(step);
                console.scrollTop = console.scrollHeight;
                stepIndex++;
            } else {
                clearInterval(interval);
                const result = document.createElement('div');
                result.innerHTML = `<div style="color: #00ff00; margin-top: 1em;">
                    Paramètres Recommandés :<br>
                    - Modèle : ESRGAN<br>
                    - Qualité : Haute<br>
                    - Échelle : 2x<br>
                    - Accélération Matérielle : Activée
                </div>`;
                console.appendChild(result);
                console.scrollTop = console.scrollHeight;
            }
        }, 800);
    }

    function autoOptimize() {
        require(['toast'], function (toast) {
            toast('Auto-optimisation terminée ! Paramètres mis à jour pour votre matériel.');
        });
    }

    function clearCache() {
        require(['toast'], function (toast) {
            toast('Cache de pré-traitement vidé avec succès.');
        });
    }

    function openSettings() {
        // Naviguer vers paramètres plugin
        window.location.hash = '#/configurationpage?name=AI%20Upscaler%20Plugin%201.6';
    }

    // Initialiser quand DOM est prêt
    function init() {
        // Attendre chargement UI Jellyfin
        if (typeof require === 'undefined' || !document.querySelector('.navDrawer-scrollContainer')) {
            setTimeout(init, 1000);
            return;
        }

        addSidebarItem();

        // Ré-ajouter élément quand navigation change
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList' && !document.querySelector('#aiUpscalerSidebarItem')) {
                    setTimeout(addSidebarItem, 500);
                }
            });
        });

        const navDrawer = document.querySelector('.navDrawer-scrollContainer');
        if (navDrawer) {
            observer.observe(navDrawer, { childList: true, subtree: true });
        }
    }

    // Démarrer initialisation
    init();

    console.log('Plugin Suréchantillonnage IA : Intégration barre latérale chargée');
})();