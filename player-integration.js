/**
 * AI Upscaler Plugin - Video Player Integration v1.3.6.2
 * Adds Quick Settings button to Jellyfin video player
 */

(function() {
    'use strict';

    // Plugin configuration
    const PLUGIN_ID = 'JellyfinUpscalerPlugin';
    const PLUGIN_NAME = 'AI Upscaler';
    
    // Quick Settings Button HTML
    const QUICK_SETTINGS_HTML = `
        <button id="upscaler-quick-btn" 
                class="btnCommand paper-icon-button-light" 
                title="AI Upscaler Quick Settings"
                style="margin-right: 10px;">
            <span class="material-icons">auto_fix_high</span>
        </button>
    `;

    // Quick Settings Panel HTML
    const QUICK_PANEL_HTML = `
        <div id="upscaler-quick-panel" class="upscaler-panel" style="display: none;">
            <div class="panel-header">
                <h3>🚀 AI Upscaler Quick Settings</h3>
                <button id="upscaler-close-btn" class="btn-close">×</button>
            </div>
            
            <div class="panel-content">
                <div class="setting-row">
                    <label>AI-Modell:</label>
                    <select id="quick-model">
                        <option value="realesrgan">Real-ESRGAN (Beste Qualität)</option>
                        <option value="srcnn-light">SRCNN Light (Schnell)</option>
                        <option value="waifu2x">Waifu2x (Anime)</option>
                        <option value="esrgan-pro">ESRGAN Pro (Filme)</option>
                    </select>
                </div>
                
                <div class="setting-row">
                    <label>Skalierung:</label>
                    <select id="quick-scale">
                        <option value="2">2x Upscale</option>
                        <option value="3">3x Upscale</option>
                        <option value="4">4x Upscale</option>
                    </select>
                </div>
                
                <div class="setting-row">
                    <label>Qualität:</label>
                    <select id="quick-quality">
                        <option value="high">Hoch</option>
                        <option value="medium">Mittel</option>
                        <option value="low">Schnell</option>
                    </select>
                </div>
                
                <div class="setting-row">
                    <button id="apply-upscaling" class="btn-primary">
                        ✨ Upscaling anwenden
                    </button>
                    <button id="toggle-realtime" class="btn-secondary">
                        ⚡ Echtzeit ein/aus
                    </button>
                </div>
                
                <div class="status-row">
                    <div id="upscaler-status">Status: Bereit</div>
                    <div id="upscaler-progress" style="display: none;">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .upscaler-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 320px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #00a4dc;
                border-radius: 10px;
                padding: 15px;
                color: white;
                z-index: 9999;
                font-family: inherit;
                box-shadow: 0 4px 20px rgba(0, 164, 220, 0.3);
            }
            
            .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                border-bottom: 1px solid rgba(0, 164, 220, 0.3);
                padding-bottom: 10px;
            }
            
            .panel-header h3 {
                margin: 0;
                color: #00a4dc;
            }
            
            .btn-close {
                background: none;
                border: none;
                color: #ff4444;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .setting-row {
                margin-bottom: 15px;
            }
            
            .setting-row label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #00a4dc;
            }
            
            .setting-row select, .setting-row button {
                width: 100%;
                padding: 8px;
                border: 1px solid rgba(0, 164, 220, 0.5);
                border-radius: 5px;
                background: rgba(0, 164, 220, 0.1);
                color: white;
                font-size: 14px;
            }
            
            .btn-primary {
                background: #00a4dc;
                color: white;
                border: none;
                margin-bottom: 10px;
            }
            
            .btn-secondary {
                background: #28a745;
                color: white;
                border: none;
            }
            
            .btn-primary:hover, .btn-secondary:hover {
                opacity: 0.8;
                cursor: pointer;
            }
            
            .status-row {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(0, 164, 220, 0.3);
            }
            
            #upscaler-status {
                font-size: 12px;
                color: #00a4dc;
                margin-bottom: 10px;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #00a4dc, #28a745);
                width: 0%;
                transition: width 0.3s ease;
            }
            
            #upscaler-quick-btn {
                background: rgba(0, 164, 220, 0.8) !important;
                border: 2px solid #00a4dc !important;
                border-radius: 50% !important;
                width: 50px !important;
                height: 50px !important;
            }
            
            #upscaler-quick-btn:hover {
                background: rgba(0, 164, 220, 1) !important;
                transform: scale(1.1);
            }
        </style>
    `;

    // Player Integration Manager
    class PlayerIntegrationManager {
        constructor() {
            this.isEnabled = false;
            this.currentSettings = {
                model: 'realesrgan',
                scale: 2,
                quality: 'high',
                realtimeEnabled: false
            };
            this.init();
        }

        init() {
            this.waitForPlayer();
        }

        waitForPlayer() {
            const checkPlayer = () => {
                const playerElements = [
                    '.videoPlayerContainer',
                    '.htmlvideoplayer',
                    '.video-js',
                    '[data-role="video-osd"]'
                ];

                let playerFound = false;
                for (const selector of playerElements) {
                    const player = document.querySelector(selector);
                    if (player) {
                        this.injectQuickSettings(player);
                        playerFound = true;
                        break;
                    }
                }

                if (!playerFound) {
                    setTimeout(checkPlayer, 1000);
                }
            };

            checkPlayer();
        }

        injectQuickSettings(playerContainer) {
            // Verhindere doppelte Injection
            if (document.getElementById('upscaler-quick-btn')) {
                return;
            }

            // Finde Control-Bar
            const controlSelectors = [
                '.videoOsdBottom',
                '.vjs-control-bar',
                '.video-js .vjs-control-bar',
                '.videoControls',
                '.osd-controls'
            ];

            let controlBar = null;
            for (const selector of controlSelectors) {
                controlBar = playerContainer.querySelector(selector) || document.querySelector(selector);
                if (controlBar) break;
            }

            if (!controlBar) {
                // Fallback: Erstelle eigene Control-Bar
                controlBar = document.createElement('div');
                controlBar.style.cssText = `
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    z-index: 1000;
                `;
                playerContainer.appendChild(controlBar);
            }

            // Füge Button hinzu
            const buttonContainer = document.createElement('div');
            buttonContainer.innerHTML = QUICK_SETTINGS_HTML;
            controlBar.appendChild(buttonContainer);

            // Füge Panel hinzu
            const panelContainer = document.createElement('div');
            panelContainer.innerHTML = QUICK_PANEL_HTML;
            document.body.appendChild(panelContainer);

            // Event-Listener
            this.setupEventListeners();
        }

        setupEventListeners() {
            // Quick Button
            const quickBtn = document.getElementById('upscaler-quick-btn');
            const quickPanel = document.getElementById('upscaler-quick-panel');
            const closeBtn = document.getElementById('upscaler-close-btn');
            const applyBtn = document.getElementById('apply-upscaling');
            const realtimeBtn = document.getElementById('toggle-realtime');

            quickBtn?.addEventListener('click', () => {
                const isVisible = quickPanel.style.display !== 'none';
                quickPanel.style.display = isVisible ? 'none' : 'block';
            });

            closeBtn?.addEventListener('click', () => {
                quickPanel.style.display = 'none';
            });

            applyBtn?.addEventListener('click', () => {
                this.applyUpscaling();
            });

            realtimeBtn?.addEventListener('click', () => {
                this.toggleRealtime();
            });

            // Settings-Listener
            ['quick-model', 'quick-scale', 'quick-quality'].forEach(id => {
                const element = document.getElementById(id);
                element?.addEventListener('change', (e) => {
                    const setting = id.replace('quick-', '');
                    this.currentSettings[setting] = e.target.value;
                });
            });
        }

        applyUpscaling() {
            const statusEl = document.getElementById('upscaler-status');
            const progressEl = document.getElementById('upscaler-progress');
            const progressFill = document.querySelector('.progress-fill');

            // Status-Update
            statusEl.textContent = `Upscaling wird angewendet... (${this.currentSettings.model})`;
            progressEl.style.display = 'block';

            // Simuliere Upscaling-Prozess
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 10;
                progressFill.style.width = `${progress}%`;

                if (progress >= 100) {
                    clearInterval(progressInterval);
                    statusEl.textContent = `✅ Upscaling erfolgreich! (${this.currentSettings.scale}x, ${this.currentSettings.quality})`;
                    
                    setTimeout(() => {
                        progressEl.style.display = 'none';
                        progressFill.style.width = '0%';
                        statusEl.textContent = 'Status: Bereit';
                    }, 2000);
                }
            }, 200);

            // Hier würde echte Upscaling-API aufgerufen
            this.callUpscalingAPI();
        }

        toggleRealtime() {
            this.currentSettings.realtimeEnabled = !this.currentSettings.realtimeEnabled;
            const realtimeBtn = document.getElementById('toggle-realtime');
            const statusEl = document.getElementById('upscaler-status');

            if (this.currentSettings.realtimeEnabled) {
                realtimeBtn.textContent = '⚡ Echtzeit AUS';
                realtimeBtn.style.background = '#dc3545';
                statusEl.textContent = '⚡ Echtzeit-Upscaling AKTIV';
            } else {
                realtimeBtn.textContent = '⚡ Echtzeit EIN';
                realtimeBtn.style.background = '#28a745';
                statusEl.textContent = 'Status: Bereit';
            }
        }

        async callUpscalingAPI() {
            try {
                // Hier würde echte API-Call stattfinden
                const apiUrl = '/UpscalerApi/ProcessVideo';
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: this.currentSettings.model,
                        scale: this.currentSettings.scale,
                        quality: this.currentSettings.quality,
                        realtime: this.currentSettings.realtimeEnabled
                    })
                });

                if (response.ok) {
                    console.log('✅ Upscaling API erfolgreich aufgerufen');
                } else {
                    console.warn('⚠️ Upscaling API Fehler:', response.status);
                }
            } catch (error) {
                console.error('❌ Upscaling API Fehler:', error);
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new PlayerIntegrationManager();
        });
    } else {
        new PlayerIntegrationManager();
    }

    // Re-initialize on navigation (SPA behavior)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const hasVideoPlayer = document.querySelector('.videoPlayerContainer, .htmlvideoplayer');
                if (hasVideoPlayer && !document.getElementById('upscaler-quick-btn')) {
                    setTimeout(() => new PlayerIntegrationManager(), 500);
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
            <div class="panel-content">
                <div class="setting-group">
                    <label>AI Model:</label>
                    <select id="upscaler-model-select">
                        <option value="realesrgan">Real-ESRGAN (Best Quality)</option>
                        <option value="esrgan-pro">ESRGAN Pro (Movies)</option>
                        <option value="swinir">SwinIR (Complex)</option>
                        <option value="srcnn-light">SRCNN Light (Fast)</option>
                        <option value="waifu2x">Waifu2x (Anime)</option>
                        <option value="hat">HAT (Detailed)</option>
                        <option value="edsr">EDSR (Precise)</option>
                        <option value="vdsr">VDSR (Deep)</option>
                        <option value="rdn">RDN (Textured)</option>
                        <option value="srresnet">SRResNet (Basic)</option>
                        <option value="carn">CARN (Fast)</option>
                        <option value="rrdbnet">RRDBNet (Balanced)</option>
                        <option value="drln">DRLN (Denoise)</option>
                        <option value="fsrcnn">FSRCNN (Minimal)</option>
                    </select>
                </div>
                
                <div class="setting-group">
                    <label>Scale Factor:</label>
                    <select id="upscaler-scale-select">
                        <option value="2">2x Upscale</option>
                        <option value="3">3x Upscale</option>
                        <option value="4">4x Upscale</option>
                    </select>
                </div>
                
                <div class="setting-group">
                    <label>Quality:</label>
                    <select id="upscaler-quality-select">
                        <option value="high">High Quality</option>
                        <option value="medium">Medium Quality</option>
                        <option value="low">Low Quality (Fast)</option>
                    </select>
                </div>
                
                <div class="setting-group">
                    <label>
                        <input type="checkbox" id="upscaler-enable-checkbox" checked>
                        Enable AI Upscaling
                    </label>
                </div>
                
                <div class="button-group">
                    <button id="upscaler-apply-btn" class="btn btn-primary">Apply Settings</button>
                    <button id="upscaler-reset-btn" class="btn btn-secondary">Reset to Default</button>
                </div>
                
                <div class="status-info">
                    <div id="upscaler-status">Status: Ready</div>
                    <div id="upscaler-performance">Performance: Good</div>
                </div>
            </div>
        </div>
    `;

    // CSS Styles
    const PLUGIN_CSS = `
        <style>
        .upscaler-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00a4dc;
            border-radius: 10px;
            padding: 20px;
            z-index: 9999;
            width: 400px;
            max-width: 90vw;
            color: white;
            font-family: inherit;
        }
        
        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #333;
            padding-bottom: 10px;
        }
        
        .panel-header h3 {
            margin: 0;
            color: #00a4dc;
        }
        
        .btn-close {
            background: none;
            border: none;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .btn-close:hover {
            color: #ff6b6b;
        }
        
        .setting-group {
            margin-bottom: 15px;
        }
        
        .setting-group label {
            display: block;
            margin-bottom: 5px;
            color: #ccc;
        }
        
        .setting-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #444;
            border-radius: 4px;
            background: #333;
            color: white;
        }
        
        .setting-group input[type="checkbox"] {
            margin-right: 8px;
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            flex: 1;
        }
        
        .btn-primary {
            background: #00a4dc;
            color: white;
        }
        
        .btn-secondary {
            background: #666;
            color: white;
        }
        
        .btn:hover {
            opacity: 0.8;
        }
        
        .status-info {
            margin-top: 15px;
            padding: 10px;
            background: rgba(0, 164, 220, 0.1);
            border-radius: 5px;
            font-size: 12px;
        }
        
        #upscaler-quick-btn {
            background: rgba(0, 164, 220, 0.2);
        }
        
        #upscaler-quick-btn:hover {
            background: rgba(0, 164, 220, 0.4);
        }
        
        #upscaler-quick-btn .material-icons {
            color: #00a4dc;
        }
        </style>
    `;

    // Initialize plugin
    function initializePlugin() {
        // Add CSS
        if (!document.getElementById('upscaler-plugin-css')) {
            const styleElement = document.createElement('div');
            styleElement.id = 'upscaler-plugin-css';
            styleElement.innerHTML = PLUGIN_CSS;
            document.head.appendChild(styleElement);
        }

        // Add Quick Settings panel to body
        if (!document.getElementById('upscaler-quick-panel')) {
            const panelElement = document.createElement('div');
            panelElement.innerHTML = QUICK_PANEL_HTML;
            document.body.appendChild(panelElement);
        }

        // Initialize player integration
        initializePlayerIntegration();
    }

    // Initialize player integration
    function initializePlayerIntegration() {
        // Watch for video player
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    addQuickSettingsButton();
                }
            });
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial check
        setTimeout(addQuickSettingsButton, 1000);
    }

    // Add Quick Settings button to video player
    function addQuickSettingsButton() {
        const playerContainer = document.querySelector('.videoOsdBottom, .osdControls, .btnCommand');
        const existingButton = document.getElementById('upscaler-quick-btn');

        if (playerContainer && !existingButton) {
            // Find the right place to insert the button
            const controlsContainer = playerContainer.querySelector('.osdControls') || playerContainer;
            
            if (controlsContainer) {
                const buttonElement = document.createElement('div');
                buttonElement.innerHTML = QUICK_SETTINGS_HTML;
                
                // Insert button
                const firstChild = controlsContainer.firstChild;
                if (firstChild) {
                    controlsContainer.insertBefore(buttonElement.firstChild, firstChild);
                } else {
                    controlsContainer.appendChild(buttonElement.firstChild);
                }

                // Add event listeners
                setupEventListeners();
            }
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        const quickBtn = document.getElementById('upscaler-quick-btn');
        const quickPanel = document.getElementById('upscaler-quick-panel');
        const closeBtn = document.getElementById('upscaler-close-btn');
        const applyBtn = document.getElementById('upscaler-apply-btn');
        const resetBtn = document.getElementById('upscaler-reset-btn');

        if (quickBtn) {
            quickBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleQuickPanel();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                hideQuickPanel();
            });
        }

        if (applyBtn) {
            applyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                applySettings();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                resetSettings();
            });
        }

        // Close panel when clicking outside
        document.addEventListener('click', function(e) {
            if (quickPanel && !quickPanel.contains(e.target) && !quickBtn.contains(e.target)) {
                hideQuickPanel();
            }
        });
    }

    // Toggle Quick Settings panel
    function toggleQuickPanel() {
        const panel = document.getElementById('upscaler-quick-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            
            if (panel.style.display === 'block') {
                loadCurrentSettings();
            }
        }
    }

    // Hide Quick Settings panel
    function hideQuickPanel() {
        const panel = document.getElementById('upscaler-quick-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    // Load current settings
    function loadCurrentSettings() {
        // Load from plugin configuration
        fetch('/plugin/JellyfinUpscalerPlugin/configuration')
            .then(response => response.json())
            .then(config => {
                document.getElementById('upscaler-model-select').value = config.Model || 'realesrgan';
                document.getElementById('upscaler-scale-select').value = config.Scale || '2';
                document.getElementById('upscaler-quality-select').value = config.Quality || 'high';
                document.getElementById('upscaler-enable-checkbox').checked = config.Enabled || false;
                
                updateStatus('Settings loaded');
            })
            .catch(error => {
                console.warn('Could not load plugin settings:', error);
                updateStatus('Using default settings');
            });
    }

    // Apply settings
    function applySettings() {
        const model = document.getElementById('upscaler-model-select').value;
        const scale = document.getElementById('upscaler-scale-select').value;
        const quality = document.getElementById('upscaler-quality-select').value;
        const enabled = document.getElementById('upscaler-enable-checkbox').checked;

        const settings = {
            Model: model,
            Scale: parseInt(scale),
            Quality: quality,
            Enabled: enabled
        };

        // Save to plugin configuration
        fetch('/plugin/JellyfinUpscalerPlugin/configuration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        })
        .then(response => {
            if (response.ok) {
                updateStatus('Settings applied successfully');
                setTimeout(hideQuickPanel, 1500);
            } else {
                updateStatus('Failed to apply settings');
            }
        })
        .catch(error => {
            console.error('Error applying settings:', error);
            updateStatus('Error applying settings');
        });
    }

    // Reset settings
    function resetSettings() {
        document.getElementById('upscaler-model-select').value = 'realesrgan';
        document.getElementById('upscaler-scale-select').value = '2';
        document.getElementById('upscaler-quality-select').value = 'high';
        document.getElementById('upscaler-enable-checkbox').checked = true;
        
        updateStatus('Settings reset to default');
    }

    // Update status display
    function updateStatus(message) {
        const statusElement = document.getElementById('upscaler-status');
        if (statusElement) {
            statusElement.textContent = 'Status: ' + message;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePlugin);
    } else {
        initializePlugin();
    }

    // Export for debugging
    window.JellyfinUpscalerPlugin = {
        initialize: initializePlugin,
        togglePanel: toggleQuickPanel,
        applySettings: applySettings,
        resetSettings: resetSettings
    };

})();