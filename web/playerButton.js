// AI Upscaler Plugin - Video Player Button Integration
(function() {
    'use strict';

    let isPluginEnabled = false;
    let playerButton = null;
    let upscaleDialog = null;

    // Initialize plugin when page loads
    function initializePlugin() {
        checkPluginStatus().then(enabled => {
            isPluginEnabled = enabled;
            if (enabled) {
                console.log('AI Upscaler Plugin: Initializing player integration');
                addPlayerButton();
                setupKeyboardShortcuts();
            }
        });
    }

    // Check if plugin is enabled
    async function checkPluginStatus() {
        try {
            const config = await ApiClient.getPluginConfiguration('f87f700e-679d-43e6-9c7c-b3a410dc3f22');
            return config.Enabled && config.ShowPlayerButton;
        } catch (error) {
            console.log('AI Upscaler Plugin: Not available or disabled');
            return false;
        }
    }

    // Add upscale button to video player
    function addPlayerButton() {
        // Wait for player to be ready
        const checkPlayer = setInterval(() => {
            const playerControls = document.querySelector('.videoOsdBottom .flex.align-items-center');
            const existingButton = document.getElementById('aiUpscaleButton');
            
            if (playerControls && !existingButton) {
                clearInterval(checkPlayer);
                createUpscaleButton(playerControls);
            }
        }, 1000);

        // Clear interval after 30 seconds if player not found
        setTimeout(() => clearInterval(checkPlayer), 30000);
    }

    // Create the upscale button
    function createUpscaleButton(playerControls) {
        playerButton = document.createElement('button');
        playerButton.id = 'aiUpscaleButton';
        playerButton.className = 'paper-icon-button-light';
        playerButton.title = 'AI Upscale Video';
        playerButton.innerHTML = `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.29,7 12,12 20.71,7"/>
                    <line x1="12" y1="22" x2="12" y2="12"/>
                </svg>
                <div style="position: absolute; top: -2px; right: -2px; background: #00d4ff; color: white; border-radius: 50%; width: 12px; height: 12px; font-size: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold;">AI</div>
            </div>
        `;
        
        // Style the button
        playerButton.style.cssText = `
            padding: 10px;
            margin: 0 5px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.5);
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        `;

        // Add hover effects
        playerButton.addEventListener('mouseenter', () => {
            playerButton.style.background = 'rgba(0, 212, 255, 0.2)';
            playerButton.style.transform = 'scale(1.1)';
        });

        playerButton.addEventListener('mouseleave', () => {
            playerButton.style.background = 'rgba(0, 0, 0, 0.5)';
            playerButton.style.transform = 'scale(1)';
        });

        // Add click handler
        playerButton.addEventListener('click', showUpscaleDialog);

        // Insert button before subtitle button or at the end
        const subtitleButton = playerControls.querySelector('[data-action="Subtitles"]');
        if (subtitleButton) {
            playerControls.insertBefore(playerButton, subtitleButton);
        } else {
            playerControls.appendChild(playerButton);
        }

        console.log('AI Upscaler Plugin: Player button added');
    }

    // Show upscale options dialog
    function showUpscaleDialog() {
        // Get current video info
        const videoElement = document.querySelector('video');
        if (!videoElement) {
            Dashboard.alert('No video found');
            return;
        }

        const currentItem = playbackManager.getCurrentMediaInfo() || {};
        const mediaSource = playbackManager.getCurrentMediaSource() || {};
        
        // Create dialog HTML
        const dialogHtml = `
            <div class="upscale-dialog" style="
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 500px;
                margin: 0 auto;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            ">
                <h2 style="
                    color: #2c3e50;
                    margin: 0 0 20px 0;
                    font-size: 24px;
                    text-align: center;
                ">
                    🚀 AI Upscale Video
                </h2>
                
                <div style="margin-bottom: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
                    <h3 style="margin: 0 0 10px 0; color: #34495e;">Current Video:</h3>
                    <p style="margin: 5px 0; color: #7f8c8d;">${currentItem.Name || 'Unknown'}</p>
                    <p style="margin: 5px 0; color: #7f8c8d;">
                        Resolution: ${videoElement.videoWidth || '?'}x${videoElement.videoHeight || '?'}
                    </p>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px;">Upscale Factor:</label>
                    <select id="upscaleFactorSelect" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        font-size: 14px;
                    ">
                        <option value="2">2x (${videoElement.videoWidth * 2}x${videoElement.videoHeight * 2})</option>
                        <option value="4">4x (${videoElement.videoWidth * 4}x${videoElement.videoHeight * 4})</option>
                        <option value="8">8x (${videoElement.videoWidth * 8}x${videoElement.videoHeight * 8})</option>
                    </select>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px;">AI Model:</label>
                    <select id="aiModelSelect" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        font-size: 14px;
                    ">
                        <option value="realesrgan">Real-ESRGAN (Recommended)</option>
                        <option value="hat">HAT (High Quality)</option>
                        <option value="srcnn">SRCNN (Fast)</option>
                        <option value="waifu2x">Waifu2x (Anime)</option>
                    </select>
                </div>

                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <button id="startUpscaleBtn" style="
                        flex: 1;
                        background: linear-gradient(45deg, #3498db, #2980b9);
                        color: white;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 6px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        ✨ Start Upscaling
                    </button>
                    <button id="cancelUpscaleBtn" style="
                        flex: 1;
                        background: #95a5a6;
                        color: white;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 6px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        // Show dialog
        require(['dialog'], function(dialog) {
            upscaleDialog = dialog({
                text: dialogHtml,
                title: '',
                buttons: []
            });

            // Add event handlers
            document.getElementById('startUpscaleBtn').addEventListener('click', startUpscaling);
            document.getElementById('cancelUpscaleBtn').addEventListener('click', closeUpscaleDialog);

            // Add hover effects
            const startBtn = document.getElementById('startUpscaleBtn');
            startBtn.addEventListener('mouseenter', () => {
                startBtn.style.background = 'linear-gradient(45deg, #2980b9, #1f4e79)';
                startBtn.style.transform = 'translateY(-2px)';
            });
            startBtn.addEventListener('mouseleave', () => {
                startBtn.style.background = 'linear-gradient(45deg, #3498db, #2980b9)';
                startBtn.style.transform = 'translateY(0)';
            });
        });
    }

    // Start upscaling process
    function startUpscaling() {
        const factor = document.getElementById('upscaleFactorSelect').value;
        const model = document.getElementById('aiModelSelect').value;
        const currentItem = playbackManager.getCurrentMediaInfo() || {};

        // Show progress
        Dashboard.showLoadingMsg();
        
        // Simulate upscaling process (in real implementation, this would call the actual upscaling API)
        setTimeout(() => {
            Dashboard.hideLoadingMsg();
            closeUpscaleDialog();
            
            // Show success notification
            showUpscaleNotification(currentItem.Name, factor, model);
        }, 2000);

        console.log(`AI Upscaler: Starting upscaling with factor ${factor}x using ${model} model`);
    }

    // Close upscale dialog
    function closeUpscaleDialog() {
        if (upscaleDialog && upscaleDialog.close) {
            upscaleDialog.close();
        }
    }

    // Show upscale notification
    function showUpscaleNotification(videoName, factor, model) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #27ae60, #2ecc71);
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            z-index: 9999;
            font-weight: 600;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">✨</span>
                <div>
                    <div>Upscaling Started!</div>
                    <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">
                        ${videoName} → ${factor}x with ${model}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Setup keyboard shortcuts
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl + U for upscale
            if (event.ctrlKey && event.key === 'u' && !event.shiftKey && !event.altKey) {
                event.preventDefault();
                if (playerButton && document.querySelector('video')) {
                    showUpscaleDialog();
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePlugin);
    } else {
        initializePlugin();
    }

    // Re-initialize when navigating between pages
    document.addEventListener('viewshow', () => {
        if (window.location.pathname.includes('/video')) {
            setTimeout(initializePlugin, 1000);
        }
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (playerButton && playerButton.parentNode) {
            playerButton.parentNode.removeChild(playerButton);
        }
        if (upscaleDialog && upscaleDialog.close) {
            upscaleDialog.close();
        }
    });

    console.log('AI Upscaler Plugin: Player integration script loaded');
})();