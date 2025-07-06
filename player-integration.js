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