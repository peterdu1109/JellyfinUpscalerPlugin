/**
 * AI Upscaler Plugin - Video Player Integration
 * Adds upscaling controls to Jellyfin video player
 */

(function() {
    'use strict';

    let upscalerButton = null;
    let upscalerMenu = null;
    let currentConfig = null;
    let isProcessing = false;

    // Plugin configuration
    const PLUGIN_ID = 'f87f700e-679d-43e6-9c7c-b3a410dc3f22';
    const PLUGIN_NAME = 'AI Upscaler';

    // Initialize plugin when page loads
    function init() {
        console.log('🎮 AI Upscaler Plugin: Initializing video player integration...');
        
        // Wait for video player to be ready
        waitForVideoPlayer();
        
        // Load plugin configuration
        loadPluginConfiguration();
    }

    // Wait for Jellyfin video player to be available
    function waitForVideoPlayer() {
        const checkPlayer = () => {
            const playerContainer = document.querySelector('.videoOsdBottom, .osdBottom, .videoPlayerContainer');
            const video = document.querySelector('video');
            
            if (playerContainer && video) {
                console.log('🎮 AI Upscaler Plugin: Video player detected, adding controls...');
                addUpscalerControls(playerContainer);
            } else {
                setTimeout(checkPlayer, 1000);
            }
        };
        
        checkPlayer();
    }

    // Load plugin configuration from Jellyfin
    async function loadPluginConfiguration() {
        try {
            if (typeof ApiClient !== 'undefined') {
                currentConfig = await ApiClient.getPluginConfiguration(PLUGIN_ID);
                console.log('🎮 AI Upscaler Plugin: Configuration loaded', currentConfig);
            } else {
                // Default configuration if API not available
                currentConfig = {
                    EnablePlugin: true,
                    ShowPlayerButton: true,
                    Model: 'realesrgan',
                    Scale: 2,
                    DefaultQuality: 'medium',
                    EnableHardwareAcceleration: true
                };
            }
        } catch (error) {
            console.warn('🎮 AI Upscaler Plugin: Could not load configuration:', error);
            currentConfig = {
                EnablePlugin: true,
                ShowPlayerButton: true,
                Model: 'realesrgan',
                Scale: 2,
                DefaultQuality: 'medium'
            };
        }
    }

    // Add upscaler controls to video player
    function addUpscalerControls(playerContainer) {
        if (!currentConfig || !currentConfig.EnablePlugin || !currentConfig.ShowPlayerButton) {
            console.log('🎮 AI Upscaler Plugin: Plugin disabled or player button disabled');
            return;
        }

        // Remove existing button if any
        if (upscalerButton) {
            upscalerButton.remove();
        }

        // Create upscaler button
        upscalerButton = document.createElement('button');
        upscalerButton.className = 'btnPlayer btnPlayerControlButton ai-upscaler-btn';
        upscalerButton.title = 'AI Upscaler Settings';
        upscalerButton.innerHTML = `
            <span class="material-icons ai-upscaler-icon">🎮</span>
            <span class="ai-upscaler-text">AI</span>
        `;
        
        // Add custom styles
        const style = document.createElement('style');
        style.textContent = `
            .ai-upscaler-btn {
                background: rgba(0, 164, 220, 0.8) !important;
                border: 2px solid rgba(0, 164, 220, 0.9) !important;
                border-radius: 8px !important;
                color: white !important;
                font-weight: bold !important;
                margin: 0 5px !important;
                padding: 8px 12px !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                gap: 4px !important;
                min-width: 60px !important;
                height: 40px !important;
            }
            .ai-upscaler-btn:hover {
                background: rgba(0, 164, 220, 1) !important;
                transform: scale(1.05) !important;
                box-shadow: 0 0 15px rgba(0, 164, 220, 0.6) !important;
            }
            .ai-upscaler-btn.processing {
                background: rgba(255, 193, 7, 0.8) !important;
                border-color: rgba(255, 193, 7, 0.9) !important;
                animation: pulse 1.5s infinite !important;
            }
            .ai-upscaler-icon {
                font-size: 16px !important;
                line-height: 1 !important;
            }
            .ai-upscaler-text {
                font-size: 12px !important;
                font-weight: 600 !important;
            }
            @keyframes pulse {
                0% { opacity: 0.8; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.05); }
                100% { opacity: 0.8; transform: scale(1); }
            }
            .ai-upscaler-menu {
                position: absolute;
                bottom: 50px;
                right: 10px;
                background: rgba(20, 20, 20, 0.95);
                border: 2px solid rgba(0, 164, 220, 0.8);
                border-radius: 12px;
                padding: 20px;
                min-width: 300px;
                max-width: 400px;
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
                z-index: 9999;
                backdrop-filter: blur(10px);
            }
            .ai-upscaler-menu h3 {
                margin: 0 0 15px 0;
                color: #00a4dc;
                font-size: 18px;
                font-weight: 600;
                border-bottom: 2px solid rgba(0, 164, 220, 0.5);
                padding-bottom: 8px;
            }
            .ai-upscaler-menu .setting-row {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                padding: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 6px;
            }
            .ai-upscaler-menu .setting-label {
                flex: 1;
                font-weight: 500;
                font-size: 14px;
                margin-right: 10px;
            }
            .ai-upscaler-menu select {
                flex: 1;
                padding: 6px 8px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                font-size: 13px;
            }
            .ai-upscaler-menu .btn-group {
                display: flex;
                gap: 8px;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
            }
            .ai-upscaler-menu .btn {
                flex: 1;
                padding: 8px 12px;
                border: none;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .ai-upscaler-menu .btn-primary {
                background: #00a4dc;
                color: white;
            }
            .ai-upscaler-menu .btn-primary:hover {
                background: #0080b3;
                transform: translateY(-1px);
            }
            .ai-upscaler-menu .btn-secondary {
                background: #6c757d;
                color: white;
            }
            .ai-upscaler-menu .btn-secondary:hover {
                background: #545b62;
            }
            .ai-upscaler-menu .btn-success {
                background: #28a745;
                color: white;
            }
            .ai-upscaler-menu .btn-success:hover {
                background: #218838;
            }
            .ai-upscaler-status {
                margin-top: 10px;
                padding: 8px;
                background: rgba(40, 167, 69, 0.2);
                border: 1px solid rgba(40, 167, 69, 0.5);
                border-radius: 4px;
                font-size: 12px;
                text-align: center;
                color: #4caf50;
            }
            .ai-upscaler-status.processing {
                background: rgba(255, 193, 7, 0.2);
                border-color: rgba(255, 193, 7, 0.5);
                color: #ffc107;
            }
            .ai-upscaler-status.error {
                background: rgba(244, 67, 54, 0.2);
                border-color: rgba(244, 67, 54, 0.5);
                color: #f44336;
            }
        `;
        document.head.appendChild(style);

        // Add click event
        upscalerButton.addEventListener('click', toggleUpscalerMenu);

        // Find the best place to insert the button
        const controlsBar = playerContainer.querySelector('.videoOsdBottom-controls, .osdBottom-controls, .btnPlayer');
        if (controlsBar) {
            if (controlsBar.classList.contains('btnPlayer')) {
                // Insert after existing player button
                controlsBar.parentNode.insertBefore(upscalerButton, controlsBar.nextSibling);
            } else {
                // Insert into controls bar
                controlsBar.appendChild(upscalerButton);
            }
        } else {
            // Fallback: insert into player container
            playerContainer.appendChild(upscalerButton);
        }

        console.log('🎮 AI Upscaler Plugin: Controls added to video player');
    }

    // Toggle upscaler menu
    function toggleUpscalerMenu() {
        if (upscalerMenu) {
            upscalerMenu.remove();
            upscalerMenu = null;
            return;
        }

        createUpscalerMenu();
    }

    // Create upscaler menu
    function createUpscalerMenu() {
        upscalerMenu = document.createElement('div');
        upscalerMenu.className = 'ai-upscaler-menu';
        upscalerMenu.innerHTML = `
            <h3>🎮 AI Upscaler Settings</h3>
            
            <div class="setting-row">
                <div class="setting-label">AI Model:</div>
                <select id="playerModel">
                    <option value="realesrgan" ${currentConfig.Model === 'realesrgan' ? 'selected' : ''}>Real-ESRGAN</option>
                    <option value="esrgan-pro" ${currentConfig.Model === 'esrgan-pro' ? 'selected' : ''}>ESRGAN Pro</option>
                    <option value="swinir" ${currentConfig.Model === 'swinir' ? 'selected' : ''}>SwinIR</option>
                    <option value="srcnn-light" ${currentConfig.Model === 'srcnn-light' ? 'selected' : ''}>SRCNN Light</option>
                    <option value="waifu2x" ${currentConfig.Model === 'waifu2x' ? 'selected' : ''}>Waifu2x</option>
                </select>
            </div>
            
            <div class="setting-row">
                <div class="setting-label">Scale:</div>
                <select id="playerScale">
                    <option value="2" ${currentConfig.Scale === 2 ? 'selected' : ''}>2x Scale</option>
                    <option value="3" ${currentConfig.Scale === 3 ? 'selected' : ''}>3x Scale</option>
                    <option value="4" ${currentConfig.Scale === 4 ? 'selected' : ''}>4x Scale</option>
                </select>
            </div>
            
            <div class="setting-row">
                <div class="setting-label">Quality:</div>
                <select id="playerQuality">
                    <option value="high" ${currentConfig.DefaultQuality === 'high' ? 'selected' : ''}>High Quality</option>
                    <option value="medium" ${currentConfig.DefaultQuality === 'medium' ? 'selected' : ''}>Medium Quality</option>
                    <option value="low" ${currentConfig.DefaultQuality === 'low' ? 'selected' : ''}>Low Quality</option>
                </select>
            </div>
            
            <div class="btn-group">
                <button class="btn btn-primary" onclick="applyUpscaling()">🚀 Start Upscaling</button>
                <button class="btn btn-secondary" onclick="stopUpscaling()">⏹️ Stop</button>
                <button class="btn btn-success" onclick="openPluginConfig()">⚙️ Settings</button>
            </div>
            
            <div class="ai-upscaler-status" id="upscalerStatus">
                ✅ Plugin Active - Ready for upscaling
            </div>
        `;

        // Position menu
        const playerContainer = document.querySelector('.videoOsdBottom, .osdBottom, .videoPlayerContainer');
        if (playerContainer) {
            playerContainer.appendChild(upscalerMenu);
        } else {
            document.body.appendChild(upscalerMenu);
        }

        // Add global functions for menu buttons
        window.applyUpscaling = applyUpscaling;
        window.stopUpscaling = stopUpscaling;
        window.openPluginConfig = openPluginConfig;

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', closeMenuOnOutsideClick);
        }, 100);
    }

    // Close menu when clicking outside
    function closeMenuOnOutsideClick(event) {
        if (upscalerMenu && !upscalerMenu.contains(event.target) && !upscalerButton.contains(event.target)) {
            upscalerMenu.remove();
            upscalerMenu = null;
            document.removeEventListener('click', closeMenuOnOutsideClick);
        }
    }

    // Apply upscaling
    function applyUpscaling() {
        if (isProcessing) {
            showStatus('⚠️ Upscaling already in progress...', 'processing');
            return;
        }

        const model = document.getElementById('playerModel').value;
        const scale = document.getElementById('playerScale').value;
        const quality = document.getElementById('playerQuality').value;

        console.log('🎮 AI Upscaler Plugin: Starting upscaling...', { model, scale, quality });

        isProcessing = true;
        upscalerButton.classList.add('processing');
        upscalerButton.innerHTML = `
            <span class="ai-upscaler-icon">⚡</span>
            <span class="ai-upscaler-text">Processing</span>
        `;

        showStatus('🚀 Starting AI upscaling...', 'processing');

        // Simulate upscaling process (replace with actual API call)
        setTimeout(() => {
            showStatus('✅ Upscaling completed successfully!', 'success');
            
            isProcessing = false;
            upscalerButton.classList.remove('processing');
            upscalerButton.innerHTML = `
                <span class="ai-upscaler-icon">🎮</span>
                <span class="ai-upscaler-text">AI</span>
            `;

            // Show notification
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                new Notification('AI Upscaler', {
                    body: 'Video upscaling completed successfully!',
                    icon: '/web/favicon.ico'
                });
            }
        }, 3000);
    }

    // Stop upscaling
    function stopUpscaling() {
        if (!isProcessing) {
            showStatus('ℹ️ No upscaling process to stop', 'info');
            return;
        }

        console.log('🎮 AI Upscaler Plugin: Stopping upscaling...');

        isProcessing = false;
        upscalerButton.classList.remove('processing');
        upscalerButton.innerHTML = `
            <span class="ai-upscaler-icon">🎮</span>
            <span class="ai-upscaler-text">AI</span>
        `;

        showStatus('⏹️ Upscaling stopped', 'info');
    }

    // Open plugin configuration
    function openPluginConfig() {
        console.log('🎮 AI Upscaler Plugin: Opening configuration...');
        
        // Close menu
        if (upscalerMenu) {
            upscalerMenu.remove();
            upscalerMenu = null;
        }

        // Navigate to plugin configuration
        if (typeof Dashboard !== 'undefined') {
            Dashboard.navigate('configurationpage?name=AI%20Upscaler%20Plugin');
        } else {
            // Fallback: try to open in new tab
            const configUrl = '/web/configurationpage?name=AI%20Upscaler%20Plugin';
            window.open(configUrl, '_blank');
        }
    }

    // Show status message
    function showStatus(message, type = 'success') {
        const statusElement = document.getElementById('upscalerStatus');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `ai-upscaler-status ${type}`;
        }
    }

    // Request notification permission
    function requestNotificationPermission() {
        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-initialize when navigating to video pages
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const video = document.querySelector('video');
                    if (video && !upscalerButton) {
                        setTimeout(init, 1000);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Request notification permission
    requestNotificationPermission();

    console.log('🎮 AI Upscaler Plugin: Video player integration script loaded');

})();