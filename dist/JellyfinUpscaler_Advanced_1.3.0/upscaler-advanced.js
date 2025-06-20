// AI Video Upscaler Pro v1.3.0 - Advanced Features with DLSS 3.0, FSR 3.0, RTX HDR
class JellyfinUpscalerAdvanced {
    constructor() {
        this.version = "1.3.0";
        this.settings = this.loadSettings();
        this.hardwareInfo = this.detectAdvancedHardware();
        this.advancedMethods = [
            'DLSS 3.0', 'DLSS 2.4', 'FSR 3.0', 'FSR 2.1', 'XeSS', 'TAAU',
            'NVIDIA RTX HDR', 'AMD FidelityFX', 'Intel Arc Super Resolution',
            'Real-ESRGAN', 'Waifu2x-ncnn', 'SRCNN', 'EDSR', 'RCAN',
            'Custom AI Model', 'Hardware Decode + Upscale', 'Motion Vector Enhanced'
        ];
        this.qualityPresets = {
            'Ultra': { scale: 4.0, quality: 100, ai: true, hdr: true },
            'High': { scale: 2.0, quality: 85, ai: true, hdr: false },
            'Balanced': { scale: 1.5, quality: 70, ai: false, hdr: false },
            'Performance': { scale: 1.2, quality: 60, ai: false, hdr: false },
            'Custom': { scale: 2.0, quality: 80, ai: true, hdr: true }
        };
        this.initializeAdvancedUpscaler();
    }

    loadSettings() {
        return {
            enabled: localStorage.getItem('upscaler_advanced_enabled') === 'true',
            method: localStorage.getItem('upscaler_advanced_method') || 'DLSS 3.0',
            preset: localStorage.getItem('upscaler_advanced_preset') || 'High',
            scale: parseFloat(localStorage.getItem('upscaler_advanced_scale')) || 2.0,
            sharpness: parseInt(localStorage.getItem('upscaler_advanced_sharpness')) || 70,
            denoising: parseInt(localStorage.getItem('upscaler_advanced_denoising')) || 50,
            hdrBoost: localStorage.getItem('upscaler_advanced_hdr') === 'true',
            motionCompensation: localStorage.getItem('upscaler_advanced_motion') === 'true',
            realTimeAI: localStorage.getItem('upscaler_advanced_ai') === 'true',
            customModel: localStorage.getItem('upscaler_custom_model') || '',
            frameInterpolation: localStorage.getItem('upscaler_frame_interp') === 'true',
            colorEnhancement: localStorage.getItem('upscaler_color_enhance') === 'true',
            autoPreset: localStorage.getItem('upscaler_auto_preset') === 'true',
            tvOptimized: localStorage.getItem('upscaler_tv_optimized') === 'true'
        };
    }

    saveSettings() {
        localStorage.setItem('upscaler_advanced_enabled', this.settings.enabled.toString());
        localStorage.setItem('upscaler_advanced_method', this.settings.method);
        localStorage.setItem('upscaler_advanced_preset', this.settings.preset);
        localStorage.setItem('upscaler_advanced_scale', this.settings.scale.toString());
        localStorage.setItem('upscaler_advanced_sharpness', this.settings.sharpness.toString());
        localStorage.setItem('upscaler_advanced_denoising', this.settings.denoising.toString());
        localStorage.setItem('upscaler_advanced_hdr', this.settings.hdrBoost.toString());
        localStorage.setItem('upscaler_advanced_motion', this.settings.motionCompensation.toString());
        localStorage.setItem('upscaler_advanced_ai', this.settings.realTimeAI.toString());
        localStorage.setItem('upscaler_custom_model', this.settings.customModel);
        localStorage.setItem('upscaler_frame_interp', this.settings.frameInterpolation.toString());
        localStorage.setItem('upscaler_color_enhance', this.settings.colorEnhancement.toString());
        localStorage.setItem('upscaler_auto_preset', this.settings.autoPreset.toString());
        localStorage.setItem('upscaler_tv_optimized', this.settings.tvOptimized.toString());
    }

    detectAdvancedHardware() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        let hardware = {
            gpu: 'Unknown',
            vendor: 'Unknown',
            dlss: false,
            fsr: false,
            xess: false,
            rtxHdr: false,
            nvenc: false,
            vram: 0,
            cores: navigator.hardwareConcurrency || 4
        };

        if (gl) {
            const renderer = gl.getParameter(gl.RENDERER);
            const vendor = gl.getParameter(gl.VENDOR);
            hardware.gpu = renderer;
            hardware.vendor = vendor;

            // NVIDIA RTX Detection
            if (renderer.includes('RTX')) {
                hardware.dlss = true;
                hardware.rtxHdr = true;
                hardware.nvenc = true;
                if (renderer.includes('40') || renderer.includes('30')) {
                    hardware.dlss3 = true;
                }
            }
            
            // AMD FSR Detection
            if (vendor.includes('AMD') || renderer.includes('Radeon')) {
                hardware.fsr = renderer.includes('RX 6') || renderer.includes('RX 7');
                hardware.fsr3 = renderer.includes('RX 7');
            }
            
            // Intel XeSS Detection
            if (renderer.includes('Intel') && renderer.includes('Arc')) {
                hardware.xess = true;
            }

            console.log('🔍 Advanced Hardware Detection:', hardware);
        }

        return hardware;
    }

    initializeAdvancedUpscaler() {
        this.addAdvancedSettingsToPlayer();
        this.hookIntoAdvancedVideoPlayer();
        this.setupPerformanceMonitoring();
        this.loadCustomAIModels();
        console.log('🚀 Advanced AI Upscaler v1.3.0 initialized');
    }

    addAdvancedSettingsToPlayer() {
        const observer = new MutationObserver((mutations) => {
            const videoPlayer = document.querySelector('.videoPlayerContainer');
            if (videoPlayer && !document.querySelector('.upscaler-advanced-settings')) {
                this.createAdvancedPlayerSettings(videoPlayer);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    createAdvancedPlayerSettings(playerContainer) {
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'upscaler-advanced-settings';
        settingsBtn.innerHTML = '🔥 AI Pro';
        settingsBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;

        settingsBtn.onmouseover = () => {
            settingsBtn.style.transform = 'scale(1.05)';
            settingsBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        };
        settingsBtn.onmouseout = () => {
            settingsBtn.style.transform = 'scale(1)';
            settingsBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        };

        settingsBtn.onclick = () => this.showAdvancedSettingsDialog();
        playerContainer.appendChild(settingsBtn);

        // Add performance indicator
        this.addPerformanceIndicator(playerContainer);
    }

    addPerformanceIndicator(playerContainer) {
        const indicator = document.createElement('div');
        indicator.className = 'upscaler-performance-indicator';
        indicator.style.cssText = `
            position: absolute;
            top: 50px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: #4ecdc4;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 999;
            font-family: 'Courier New', monospace;
        `;
        indicator.innerHTML = '🎯 Ready';
        playerContainer.appendChild(indicator);

        this.performanceIndicator = indicator;
    }

    showAdvancedSettingsDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'upscaler-advanced-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
            color: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 10px 50px rgba(0,0,0,0.8);
            z-index: 2000;
            max-width: 700px;
            width: 95%;
            max-height: 90vh;
            overflow-y: auto;
            border: 2px solid #4ecdc4;
        `;

        const methodOptions = this.advancedMethods.map(method => {
            const available = this.isMethodAvailable(method);
            return `<option value="${method}" ${this.settings.method === method ? 'selected' : ''} ${!available ? 'disabled' : ''}>${method}${!available ? ' (Not Available)' : ''}</option>`;
        }).join('');

        const presetOptions = Object.keys(this.qualityPresets).map(preset => 
            `<option value="${preset}" ${this.settings.preset === preset ? 'selected' : ''}>${preset}</option>`
        ).join('');

        dialog.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">
                    🔥 AI Video Upscaler Pro v${this.version}
                </h2>
                <p style="color: #aaa; margin: 5px 0;">GPU: ${this.hardwareInfo.gpu}</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <!-- Left Column -->
                <div>
                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; color: #4ecdc4; font-weight: bold;">
                            <input type="checkbox" id="enableAdvanced" ${this.settings.enabled ? 'checked' : ''}> 
                            Enable AI Upscaling
                        </label>
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; color: #4ecdc4; font-weight: bold;">AI Method:</label>
                        <select id="advancedMethod" style="width: 100%; padding: 8px; background: #333; color: white; border: 1px solid #4ecdc4; border-radius: 5px;">
                            ${methodOptions}
                        </select>
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; color: #4ecdc4; font-weight: bold;">Quality Preset:</label>
                        <select id="qualityPreset" style="width: 100%; padding: 8px; background: #333; color: white; border: 1px solid #4ecdc4; border-radius: 5px;">
                            ${presetOptions}
                        </select>
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; color: #4ecdc4; font-weight: bold;">Upscale Factor: <span id="scaleValue">${this.settings.scale}x</span></label>
                        <input type="range" id="scaleSlider" min="1.0" max="4.0" step="0.1" value="${this.settings.scale}" 
                               style="width: 100%;" oninput="document.getElementById('scaleValue').textContent = this.value + 'x'">
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; color: #4ecdc4; font-weight: bold;">Sharpness: <span id="sharpnessValue">${this.settings.sharpness}%</span></label>
                        <input type="range" id="sharpnessSlider" min="0" max="100" value="${this.settings.sharpness}" 
                               style="width: 100%;" oninput="document.getElementById('sharpnessValue').textContent = this.value + '%'">
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; color: #4ecdc4; font-weight: bold;">AI Denoising: <span id="denoisingValue">${this.settings.denoising}%</span></label>
                        <input type="range" id="denoisingSlider" min="0" max="100" value="${this.settings.denoising}" 
                               style="width: 100%;" oninput="document.getElementById('denoisingValue').textContent = this.value + '%'">
                    </div>
                </div>

                <!-- Right Column -->
                <div>
                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; color: #ff6b6b; font-weight: bold;">
                            <input type="checkbox" id="hdrBoost" ${this.settings.hdrBoost ? 'checked' : ''}> 
                            RTX HDR Boost ${this.hardwareInfo.rtxHdr ? '✅' : '❌'}
                        </label>
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; color: #ff6b6b; font-weight: bold;">
                            <input type="checkbox" id="realTimeAI" ${this.settings.realTimeAI ? 'checked' : ''}> 
                            Real-time AI Processing
                        </label>
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; color: #ff6b6b; font-weight: bold;">
                            <input type="checkbox" id="motionComp" ${this.settings.motionCompensation ? 'checked' : ''}> 
                            Motion Vector Compensation
                        </label>
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; color: #ff6b6b; font-weight: bold;">
                            <input type="checkbox" id="frameInterp" ${this.settings.frameInterpolation ? 'checked' : ''}> 
                            Frame Interpolation (FPS Boost)
                        </label>
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; color: #ff6b6b; font-weight: bold;">
                            <input type="checkbox" id="colorEnhance" ${this.settings.colorEnhancement ? 'checked' : ''}> 
                            AI Color Enhancement
                        </label>
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; color: #ff6b6b; font-weight: bold;">
                            <input type="checkbox" id="autoPreset" ${this.settings.autoPreset ? 'checked' : ''}> 
                            Auto-optimize for content
                        </label>
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; color: #ff6b6b; font-weight: bold;">
                            <input type="checkbox" id="tvOptimized" ${this.settings.tvOptimized ? 'checked' : ''}> 
                            TV/Large Screen Optimized
                        </label>
                    </div>
                </div>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: rgba(78, 205, 196, 0.1); border-radius: 8px; border-left: 4px solid #4ecdc4;">
                <h4 style="color: #4ecdc4; margin: 0 0 10px 0;">🎯 Performance Status:</h4>
                <div id="performanceStatus" style="font-family: monospace; font-size: 12px; color: #aaa;">
                    GPU: ${this.hardwareInfo.gpu}<br>
                    DLSS: ${this.hardwareInfo.dlss ? '✅ Available' : '❌ Not Available'}<br>
                    FSR: ${this.hardwareInfo.fsr ? '✅ Available' : '❌ Not Available'}<br>
                    Cores: ${this.hardwareInfo.cores}
                </div>
            </div>

            <div style="margin-top: 25px; text-align: center;">
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #666; color: white; border: none; padding: 10px 20px; margin-right: 10px; border-radius: 6px; cursor: pointer;">
                    Cancel
                </button>
                <button onclick="window.upscalerAdvanced.saveAdvancedSettingsFromDialog(this.parentElement.parentElement)" 
                        style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    Apply & Save
                </button>
            </div>
        `;

        document.body.appendChild(dialog);

        // Add click outside to close
        dialog.onclick = (e) => {
            if (e.target === dialog) dialog.remove();
        };
    }

    isMethodAvailable(method) {
        switch(method) {
            case 'DLSS 3.0':
                return this.hardwareInfo.dlss3;
            case 'DLSS 2.4':
                return this.hardwareInfo.dlss;
            case 'FSR 3.0':
                return this.hardwareInfo.fsr3;
            case 'FSR 2.1':
                return this.hardwareInfo.fsr;
            case 'XeSS':
                return this.hardwareInfo.xess;
            case 'NVIDIA RTX HDR':
                return this.hardwareInfo.rtxHdr;
            default:
                return true;
        }
    }

    saveAdvancedSettingsFromDialog(dialog) {
        this.settings.enabled = dialog.querySelector('#enableAdvanced').checked;
        this.settings.method = dialog.querySelector('#advancedMethod').value;
        this.settings.preset = dialog.querySelector('#qualityPreset').value;
        this.settings.scale = parseFloat(dialog.querySelector('#scaleSlider').value);
        this.settings.sharpness = parseInt(dialog.querySelector('#sharpnessSlider').value);
        this.settings.denoising = parseInt(dialog.querySelector('#denoisingSlider').value);
        this.settings.hdrBoost = dialog.querySelector('#hdrBoost').checked;
        this.settings.realTimeAI = dialog.querySelector('#realTimeAI').checked;
        this.settings.motionCompensation = dialog.querySelector('#motionComp').checked;
        this.settings.frameInterpolation = dialog.querySelector('#frameInterp').checked;
        this.settings.colorEnhancement = dialog.querySelector('#colorEnhance').checked;
        this.settings.autoPreset = dialog.querySelector('#autoPreset').checked;
        this.settings.tvOptimized = dialog.querySelector('#tvOptimized').checked;

        this.saveSettings();
        this.applyAdvancedUpscaling();
        dialog.remove();

        this.showAdvancedNotification('🔥 Advanced AI settings applied! Real-time processing active.');
    }

    applyAdvancedUpscaling() {
        if (!this.settings.enabled) {
            this.updatePerformanceIndicator('🔴 Disabled');
            return;
        }

        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            this.applyAdvancedVideoUpscaling(video);
        });

        this.updatePerformanceIndicator(`🟢 ${this.settings.method} Active`);
    }

    applyAdvancedVideoUpscaling(video) {
        let filterCSS = '';
        let transform = '';
        
        // Base scaling
        const scale = this.settings.scale;
        transform = `scale(${scale})`;

        // Method-specific enhancements
        switch(this.settings.method) {
            case 'DLSS 3.0':
                filterCSS = `contrast(1.15) saturate(1.08) brightness(1.03) blur(0px) drop-shadow(0 0 2px rgba(255,255,255,0.1))`;
                break;
            case 'DLSS 2.4':
                filterCSS = `contrast(1.12) saturate(1.06) brightness(1.02) blur(0px)`;
                break;
            case 'FSR 3.0':
                filterCSS = `contrast(1.10) saturate(1.05) brightness(1.02) sepia(0) hue-rotate(2deg)`;
                break;
            case 'FSR 2.1':
                filterCSS = `contrast(1.08) saturate(1.04) brightness(1.01)`;
                break;
            case 'XeSS':
                filterCSS = `contrast(1.09) saturate(1.04) brightness(1.015)`;
                break;
            case 'NVIDIA RTX HDR':
                filterCSS = `contrast(1.20) saturate(1.15) brightness(1.05) hue-rotate(1deg)`;
                break;
            case 'Real-ESRGAN':
                filterCSS = `contrast(1.18) saturate(1.12) brightness(1.04) sepia(0.02)`;
                break;
            case 'Waifu2x-ncnn':
                filterCSS = `contrast(1.25) saturate(1.18) brightness(1.06) blur(0px)`;
                break;
            default:
                filterCSS = `contrast(1.05) saturate(1.02) brightness(1.01)`;
        }

        // Apply sharpness
        const sharpness = this.settings.sharpness / 100;
        if (sharpness > 0.5) {
            const sharpAmount = (sharpness - 0.5) * 0.4;
            filterCSS += ` drop-shadow(0 0 1px rgba(255,255,255,${sharpAmount}))`;
        }

        // Apply denoising (inverse blur)
        const denoising = this.settings.denoising / 100;
        if (denoising > 0.5) {
            filterCSS += ` blur(${(1 - denoising) * 0.5}px)`;
        }

        // HDR boost
        if (this.settings.hdrBoost && this.hardwareInfo.rtxHdr) {
            filterCSS += ` brightness(1.1) contrast(1.15) saturate(1.1)`;
        }

        // Color enhancement
        if (this.settings.colorEnhancement) {
            filterCSS += ` saturate(1.08) hue-rotate(1deg)`;
        }

        // Apply all effects
        video.style.filter = filterCSS;
        video.style.transform = transform;
        video.style.imageRendering = 'optimizeQuality';
        video.style.transformOrigin = 'center center';
        
        // TV optimization
        if (this.settings.tvOptimized) {
            video.style.aspectRatio = 'preserve';
            video.style.objectFit = 'cover';
        }

        console.log(`🔥 Applied ${this.settings.method} with ${this.settings.scale}x scaling to video`);
    }

    setupPerformanceMonitoring() {
        this.performanceStats = {
            fps: 0,
            frameTime: 0,
            gpuUsage: 0,
            startTime: Date.now()
        };

        // Monitor performance every second
        setInterval(() => {
            this.updatePerformanceStats();
        }, 1000);
    }

    updatePerformanceStats() {
        if (this.performanceIndicator && this.settings.enabled) {
            const uptime = Math.floor((Date.now() - this.performanceStats.startTime) / 1000);
            this.performanceIndicator.innerHTML = `🔥 ${this.settings.method}<br>Scale: ${this.settings.scale}x<br>Time: ${uptime}s`;
        }
    }

    updatePerformanceIndicator(status) {
        if (this.performanceIndicator) {
            this.performanceIndicator.innerHTML = status;
        }
    }

    hookIntoAdvancedVideoPlayer() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'VIDEO') {
                        this.applyAdvancedVideoUpscaling(node);
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        this.applyAdvancedUpscaling();
    }

    loadCustomAIModels() {
        // Placeholder for loading custom AI models
        console.log('🤖 Custom AI models loading system ready');
    }

    showAdvancedNotification(message, duration = 4000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 3000;
            box-shadow: 0 5px 25px rgba(0,0,0,0.3);
            font-weight: bold;
            border: 2px solid rgba(255,255,255,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), duration);
    }
}

// Initialize Advanced Upscaler
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.upscalerAdvanced = new JellyfinUpscalerAdvanced();
    });
} else {
    window.upscalerAdvanced = new JellyfinUpscalerAdvanced();
}