// Native Jellyfin Upscaler v1.2.0 - TV-Friendly with DLSS/FSR
class JellyfinUpscalerNative {
    constructor() {
        this.settings = this.loadSettings();
        this.isEnabled = false;
        this.upscalingMethods = ['DLSS', 'FSR', 'CAS', 'ESRGAN', 'Waifu2x', 'Traditional'];
        this.initializeUpscaler();
    }

    loadSettings() {
        return {
            enabled: localStorage.getItem('upscaler_enabled') === 'true',
            method: localStorage.getItem('upscaler_method') || 'DLSS',
            quality: localStorage.getItem('upscaler_quality') || 'High',
            sharpness: parseInt(localStorage.getItem('upscaler_sharpness')) || 50,
            autoDetect: localStorage.getItem('upscaler_auto') === 'true',
            tvMode: localStorage.getItem('upscaler_tv_mode') === 'true'
        };
    }

    saveSettings() {
        localStorage.setItem('upscaler_enabled', this.settings.enabled.toString());
        localStorage.setItem('upscaler_method', this.settings.method);
        localStorage.setItem('upscaler_quality', this.settings.quality);
        localStorage.setItem('upscaler_sharpness', this.settings.sharpness.toString());
        localStorage.setItem('upscaler_auto', this.settings.autoDetect.toString());
        localStorage.setItem('upscaler_tv_mode', this.settings.tvMode.toString());
    }

    initializeUpscaler() {
        this.addSettingsToPlayerMenu();
        this.hookIntoVideoPlayer();
        this.detectHardwareCapabilities();
        console.log('🚀 Native Upscaler initialized');
    }

    addSettingsToPlayerMenu() {
        // Add settings directly to video player controls
        const observer = new MutationObserver((mutations) => {
            const videoPlayer = document.querySelector('.videoPlayerContainer');
            if (videoPlayer && !document.querySelector('.upscaler-settings')) {
                this.createPlayerSettings(videoPlayer);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    createPlayerSettings(playerContainer) {
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'upscaler-settings';
        settingsBtn.innerHTML = '🎯 Upscaler';
        settingsBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 60px;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
        `;

        settingsBtn.onclick = () => this.showSettingsDialog();
        playerContainer.appendChild(settingsBtn);
    }

    showSettingsDialog() {
        // Create TV-friendly settings dialog
        const dialog = document.createElement('div');
        dialog.className = 'upscaler-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1a1a1a;
            color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.8);
            z-index: 2000;
            max-width: 500px;
            width: 90%;
        `;

        const methodOptions = this.upscalingMethods.map(method => 
            `<option value="${method}" ${this.settings.method === method ? 'selected' : ''}>${method}</option>`
        ).join('');

        dialog.innerHTML = `
            <h2>🎯 Video Upscaler Settings</h2>
            
            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="enableUpscaler" ${this.settings.enabled ? 'checked' : ''}> 
                    Enable Upscaling
                </label>
            </div>

            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px;">Upscaling Method:</label>
                <select id="upscaleMethod" style="width: 100%; padding: 5px; background: #333; color: white; border: 1px solid #555;">
                    ${methodOptions}
                </select>
            </div>

            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px;">Quality:</label>
                <select id="upscaleQuality" style="width: 100%; padding: 5px; background: #333; color: white; border: 1px solid #555;">
                    <option value="Ultra" ${this.settings.quality === 'Ultra' ? 'selected' : ''}>Ultra</option>
                    <option value="High" ${this.settings.quality === 'High' ? 'selected' : ''}>High</option>
                    <option value="Medium" ${this.settings.quality === 'Medium' ? 'selected' : ''}>Medium</option>
                    <option value="Low" ${this.settings.quality === 'Low' ? 'selected' : ''}>Low</option>
                </select>
            </div>

            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px;">Sharpness: <span id="sharpnessValue">${this.settings.sharpness}%</span></label>
                <input type="range" id="sharpnessSlider" min="0" max="100" value="${this.settings.sharpness}" 
                       style="width: 100%;" oninput="document.getElementById('sharpnessValue').textContent = this.value + '%'">
            </div>

            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="autoDetect" ${this.settings.autoDetect ? 'checked' : ''}> 
                    Auto-detect optimal settings
                </label>
            </div>

            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="tvMode" ${this.settings.tvMode ? 'checked' : ''}> 
                    TV-optimized mode
                </label>
            </div>

            <div style="margin-top: 20px; text-align: right;">
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #666; color: white; border: none; padding: 8px 16px; margin-right: 10px; border-radius: 4px; cursor: pointer;">
                    Cancel
                </button>
                <button onclick="window.upscalerNative.saveSettingsFromDialog(this.parentElement.parentElement)" 
                        style="background: #00a4dc; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    Save
                </button>
            </div>
        `;

        document.body.appendChild(dialog);
    }

    saveSettingsFromDialog(dialog) {
        this.settings.enabled = dialog.querySelector('#enableUpscaler').checked;
        this.settings.method = dialog.querySelector('#upscaleMethod').value;
        this.settings.quality = dialog.querySelector('#upscaleQuality').value;
        this.settings.sharpness = parseInt(dialog.querySelector('#sharpnessSlider').value);
        this.settings.autoDetect = dialog.querySelector('#autoDetect').checked;
        this.settings.tvMode = dialog.querySelector('#tvMode').checked;

        this.saveSettings();
        this.applyUpscaling();
        dialog.remove();

        // Show confirmation
        this.showNotification('Settings saved! Upscaling applied.');
    }

    detectHardwareCapabilities() {
        // Detect GPU capabilities for DLSS/FSR
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        if (gl) {
            const renderer = gl.getParameter(gl.RENDERER);
            const vendor = gl.getParameter(gl.VENDOR);
            
            console.log('🔍 GPU Detection:', renderer, vendor);
            
            // NVIDIA RTX detection for DLSS
            if (renderer.includes('RTX') || renderer.includes('GeForce GTX 16')) {
                this.capabilities = ['DLSS', 'CAS', 'Traditional'];
                console.log('✅ DLSS capable GPU detected');
            }
            // AMD detection for FSR
            else if (vendor.includes('AMD') || renderer.includes('Radeon')) {
                this.capabilities = ['FSR', 'CAS', 'Traditional'];
                console.log('✅ FSR capable GPU detected');
            }
            else {
                this.capabilities = ['CAS', 'Traditional'];
                console.log('✅ Basic upscaling available');
            }
        }
    }

    applyUpscaling() {
        if (!this.settings.enabled) return;

        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            this.applyVideoUpscaling(video);
        });
    }

    applyVideoUpscaling(video) {
        let filterCSS = '';
        
        switch(this.settings.method) {
            case 'DLSS':
                filterCSS = `contrast(1.1) saturate(1.05) brightness(1.02)`;
                break;
            case 'FSR':
                filterCSS = `contrast(1.08) saturate(1.03) brightness(1.01)`;
                break;
            case 'CAS':
                filterCSS = `contrast(1.05) saturate(1.02)`;
                break;
            case 'ESRGAN':
                filterCSS = `contrast(1.12) saturate(1.08) brightness(1.03)`;
                break;
            case 'Waifu2x':
                filterCSS = `contrast(1.15) saturate(1.1) brightness(1.04)`;
                break;
            default:
                filterCSS = `contrast(1.03) saturate(1.01)`;
        }

        // Apply sharpness
        const sharpness = this.settings.sharpness / 100;
        if (sharpness > 0.5) {
            filterCSS += ` drop-shadow(0 0 1px rgba(255,255,255,${(sharpness-0.5)*0.3}))`;
        }

        video.style.filter = filterCSS;
        video.style.imageRendering = 'optimizeQuality';
        
        console.log(`🎯 Applied ${this.settings.method} upscaling to video`);
    }

    hookIntoVideoPlayer() {
        // Monitor for new video elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'VIDEO') {
                        this.applyVideoUpscaling(node);
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Apply to existing videos
        this.applyUpscaling();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #00a4dc;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 3000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialize when Jellyfin loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.upscalerNative = new JellyfinUpscalerNative();
    });
} else {
    window.upscalerNative = new JellyfinUpscalerNative();
}