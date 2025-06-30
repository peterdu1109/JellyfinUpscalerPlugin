/**
 * Advanced Plugin Settings with Multi-Language Support
 * Jellyfin AI Upscaler Plugin v1.3.0
 */

class AdvancedUpscalerSettings {
    constructor() {
        this.currentLanguage = this.detectJellyfinLanguage();
        this.translations = {};
        this.settings = this.loadSettings();
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.renderSettingsUI();
        this.bindEventListeners();
        this.detectHardware();
    }

    // 🌐 LANGUAGE DETECTION & MANAGEMENT
    detectJellyfinLanguage() {
        // Detect Jellyfin's current language
        const jellyfinLang = document.documentElement.lang || 
                           navigator.language.substring(0, 2) || 
                           'en';
        
        const supportedLanguages = ['en', 'de', 'fr', 'es', 'ja', 'ko', 'it', 'pt'];
        return supportedLanguages.includes(jellyfinLang) ? jellyfinLang : 'en';
    }

    async loadTranslations() {
        try {
            const response = await fetch('/plugins/JellyfinUpscaler/localization/languages.json');
            const allLanguages = await response.json();
            this.translations = allLanguages[this.currentLanguage].translations;
        } catch (error) {
            console.warn('Failed to load translations, using English fallback');
            this.translations = this.getEnglishFallback();
        }
    }

    t(key) {
        return this.translations[key] || key;
    }

    // 🎛️ SETTINGS MANAGEMENT
    loadSettings() {
        const defaultSettings = {
            // Language Settings
            language: 'auto', // 'auto' follows Jellyfin, or specific language code
            
            // Performance Settings
            aiMethod: 'auto', // 'dlss30', 'fsr30', 'xess', 'real_esrgan', 'waifu2x'
            scaleFactor: 2.0,
            enableHDR: false,
            frameInterpolation: false,
            motionCompensation: true,
            
            // Quality Settings
            sharpness: 0.5,
            saturation: 1.0,
            contrast: 1.0,
            brightness: 0.0,
            
            // Advanced Settings
            enableGPUScheduling: true,
            bufferSize: 'auto', // 'small', 'medium', 'large', 'auto'
            powerEfficiency: 'balanced', // 'performance', 'balanced', 'efficiency'
            
            // Content-Specific Settings
            animeOptimization: true,
            movieOptimization: true,
            tvShowOptimization: true,
            
            // UI Settings
            showPerformanceMonitor: true,
            showOptimizationTips: true,
            compactUI: false,
            
            // Hardware Settings (auto-detected)
            detectedGPU: null,
            supportedMethods: [],
            recommendedSettings: {}
        };

        const saved = localStorage.getItem('jellyfin-upscaler-settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('jellyfin-upscaler-settings', JSON.stringify(this.settings));
        this.applySettings();
    }

    // 🖥️ HARDWARE DETECTION
    async detectHardware() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    this.analyzeGPU(renderer);
                }
            }
        } catch (error) {
            console.warn('GPU detection failed:', error);
        }
    }

    analyzeGPU(renderer) {
        const gpu = {
            name: renderer,
            vendor: 'unknown',
            supportedMethods: [],
            recommendedScale: 2.0,
            maxScale: 4.0
        };

        // NVIDIA Detection
        if (renderer.includes('NVIDIA') || renderer.includes('GeForce') || renderer.includes('RTX')) {
            gpu.vendor = 'nvidia';
            if (renderer.includes('RTX 40')) {
                gpu.supportedMethods = ['dlss30', 'dlss24', 'fsr30', 'real_esrgan'];
                gpu.recommendedScale = 4.0;
            } else if (renderer.includes('RTX 30') || renderer.includes('RTX 20')) {
                gpu.supportedMethods = ['dlss24', 'fsr21', 'real_esrgan'];
                gpu.recommendedScale = 3.0;
            } else if (renderer.includes('GTX 16')) {
                gpu.supportedMethods = ['fsr21', 'traditional'];
                gpu.recommendedScale = 2.0;
            }
        }
        
        // AMD Detection
        else if (renderer.includes('AMD') || renderer.includes('Radeon') || renderer.includes('RX')) {
            gpu.vendor = 'amd';
            if (renderer.includes('RX 7')) {
                gpu.supportedMethods = ['fsr30', 'fsr21', 'real_esrgan'];
                gpu.recommendedScale = 3.0;
            } else if (renderer.includes('RX 6')) {
                gpu.supportedMethods = ['fsr21', 'cas', 'traditional'];
                gpu.recommendedScale = 2.5;
            }
        }
        
        // Intel Detection
        else if (renderer.includes('Intel') || renderer.includes('Arc')) {
            gpu.vendor = 'intel';
            if (renderer.includes('Arc')) {
                gpu.supportedMethods = ['xess', 'fsr21'];
                gpu.recommendedScale = 2.5;
            }
        }

        this.settings.detectedGPU = gpu;
        this.settings.supportedMethods = gpu.supportedMethods;
        this.updateHardwareUI();
    }

    // 🎨 UI RENDERING
    renderSettingsUI() {
        const container = document.getElementById('upscaler-settings-container');
        if (!container) return;

        container.innerHTML = `
            <div class="upscaler-settings-panel">
                <!-- Header -->
                <div class="settings-header">
                    <h2>🔥 ${this.t('plugin_name')} - ${this.t('settings')}</h2>
                    <div class="language-selector">
                        <label>${this.t('language')}:</label>
                        <select id="language-select">
                            <option value="auto">${this.t('auto_language')}</option>
                            <option value="en">🇺🇸 English</option>
                            <option value="de">🇩🇪 Deutsch</option>
                            <option value="fr">🇫🇷 Français</option>
                            <option value="es">🇪🇸 Español</option>
                            <option value="ja">🇯🇵 日本語</option>
                            <option value="ko">🇰🇷 한국어</option>
                            <option value="it">🇮🇹 Italiano</option>
                            <option value="pt">🇵🇹 Português</option>
                        </select>
                    </div>
                </div>

                <!-- Hardware Status -->
                <div class="hardware-status-card">
                    <h3>${this.t('hardware_detected')}</h3>
                    <div id="gpu-info">
                        <div class="gpu-name">Detecting...</div>
                        <div class="supported-methods"></div>
                    </div>
                </div>

                <!-- Performance Settings -->
                <div class="settings-section">
                    <h3>${this.t('performance')}</h3>
                    
                    <div class="setting-group">
                        <label>${this.t('method')}:</label>
                        <select id="ai-method">
                            <option value="auto">${this.t('auto_detect')}</option>
                            <option value="dlss30">DLSS 3.0</option>
                            <option value="dlss24">DLSS 2.4</option>
                            <option value="fsr30">FSR 3.0</option>
                            <option value="fsr21">FSR 2.1</option>
                            <option value="xess">XeSS</option>
                            <option value="real_esrgan">Real-ESRGAN</option>
                            <option value="waifu2x">Waifu2x</option>
                        </select>
                    </div>

                    <div class="setting-group">
                        <label>${this.t('scale_factor')}: <span id="scale-value">2.0x</span></label>
                        <input type="range" id="scale-factor" min="1.0" max="4.0" step="0.1" value="2.0">
                    </div>

                    <div class="setting-group checkbox-group">
                        <label>
                            <input type="checkbox" id="enable-hdr"> ${this.t('enable_hdr')}
                        </label>
                        <label>
                            <input type="checkbox" id="frame-interpolation"> ${this.t('frame_interpolation')}
                        </label>
                        <label>
                            <input type="checkbox" id="motion-compensation"> ${this.t('motion_compensation')}
                        </label>
                    </div>
                </div>

                <!-- Quality Settings -->
                <div class="settings-section">
                    <h3>${this.t('quality')}</h3>
                    
                    <div class="setting-group">
                        <label>Sharpness: <span id="sharpness-value">0.5</span></label>
                        <input type="range" id="sharpness" min="0" max="1" step="0.1" value="0.5">
                    </div>

                    <div class="setting-group">
                        <label>Saturation: <span id="saturation-value">1.0</span></label>
                        <input type="range" id="saturation" min="0.5" max="2.0" step="0.1" value="1.0">
                    </div>

                    <div class="setting-group">
                        <label>Contrast: <span id="contrast-value">1.0</span></label>
                        <input type="range" id="contrast" min="0.5" max="2.0" step="0.1" value="1.0">
                    </div>
                </div>

                <!-- Content Profiles -->
                <div class="settings-section">
                    <h3>Content Profiles</h3>
                    <div class="profile-buttons">
                        <button class="profile-btn" data-profile="anime">${this.t('profile_anime')}</button>
                        <button class="profile-btn" data-profile="movies">${this.t('profile_movies')}</button>
                        <button class="profile-btn" data-profile="tv">${this.t('profile_tv')}</button>
                        <button class="profile-btn" data-profile="custom">${this.t('profile_custom')}</button>
                    </div>
                </div>

                <!-- Performance Monitor -->
                <div class="settings-section" id="performance-monitor">
                    <h3>${this.t('performance')}</h3>
                    <div class="performance-stats">
                        <div class="stat-item">
                            <span>${this.t('gpu_usage')}:</span>
                            <span id="gpu-usage">0%</span>
                        </div>
                        <div class="stat-item">
                            <span>${this.t('fps')}:</span>
                            <span id="current-fps">0</span>
                        </div>
                        <div class="stat-item">
                            <span>${this.t('processing_time')}:</span>
                            <span id="processing-time">0ms</span>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="settings-actions">
                    <button id="save-settings" class="btn-primary">${this.t('save')}</button>
                    <button id="reset-settings" class="btn-secondary">${this.t('reset')}</button>
                    <button id="cancel-settings" class="btn-cancel">${this.t('cancel')}</button>
                </div>

                <!-- Optimization Tips -->
                <div class="optimization-tips">
                    <h4>${this.t('optimization_tips')}</h4>
                    <div id="tip-content"></div>
                </div>
            </div>

            <style>
                .upscaler-settings-panel {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background: var(--theme-body-bg);
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }

                .settings-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid var(--theme-primary-color);
                }

                .language-selector select {
                    padding: 8px 12px;
                    border: 1px solid var(--theme-primary-color);
                    border-radius: 4px;
                    background: var(--theme-body-bg);
                    color: var(--theme-text-color);
                }

                .hardware-status-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    color: white;
                }

                .settings-section {
                    margin-bottom: 25px;
                    padding: 15px;
                    border: 1px solid var(--theme-primary-color);
                    border-radius: 8px;
                }

                .setting-group {
                    margin-bottom: 15px;
                }

                .setting-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                }

                .setting-group input[type="range"] {
                    width: 100%;
                    margin: 5px 0;
                }

                .checkbox-group {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                }

                .checkbox-group label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .profile-buttons {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 10px;
                }

                .profile-btn {
                    padding: 12px 20px;
                    border: 2px solid var(--theme-primary-color);
                    border-radius: 6px;
                    background: transparent;
                    color: var(--theme-text-color);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .profile-btn:hover,
                .profile-btn.active {
                    background: var(--theme-primary-color);
                    color: white;
                }

                .performance-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                }

                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px;
                    background: var(--theme-accent-color);
                    border-radius: 4px;
                }

                .settings-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                    margin-top: 20px;
                }

                .settings-actions button {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .btn-primary {
                    background: var(--theme-primary-color);
                    color: white;
                }

                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }

                .btn-cancel {
                    background: transparent;
                    color: var(--theme-text-color);
                    border: 1px solid var(--theme-text-color);
                }

                .optimization-tips {
                    margin-top: 20px;
                    padding: 15px;
                    background: #fff3cd;
                    border-radius: 6px;
                    color: #856404;
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .settings-header {
                        flex-direction: column;
                        gap: 15px;
                    }

                    .profile-buttons {
                        grid-template-columns: 1fr 1fr;
                    }

                    .settings-actions {
                        flex-direction: column;
                    }
                }
            </style>
        `;
    }

    // 🔗 EVENT LISTENERS
    bindEventListeners() {
        // Language change
        document.getElementById('language-select')?.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        // Settings inputs
        document.getElementById('ai-method')?.addEventListener('change', (e) => {
            this.settings.aiMethod = e.target.value;
        });

        document.getElementById('scale-factor')?.addEventListener('input', (e) => {
            this.settings.scaleFactor = parseFloat(e.target.value);
            document.getElementById('scale-value').textContent = e.target.value + 'x';
        });

        // Checkboxes
        ['enable-hdr', 'frame-interpolation', 'motion-compensation'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', (e) => {
                const setting = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                this.settings[setting] = e.target.checked;
            });
        });

        // Profile buttons
        document.querySelectorAll('.profile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.applyProfile(e.target.dataset.profile);
            });
        });

        // Action buttons
        document.getElementById('save-settings')?.addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('reset-settings')?.addEventListener('click', () => {
            this.resetSettings();
        });
    }

    // 🌍 LANGUAGE MANAGEMENT
    async changeLanguage(newLang) {
        if (newLang === 'auto') {
            newLang = this.detectJellyfinLanguage();
        }
        
        this.currentLanguage = newLang;
        this.settings.language = newLang;
        
        await this.loadTranslations();
        this.renderSettingsUI();
        this.bindEventListeners();
        
        // Show restart notification
        this.showNotification(this.t('restart_required'), 'warning');
    }

    // 📊 PERFORMANCE MONITORING
    startPerformanceMonitoring() {
        setInterval(() => {
            this.updatePerformanceStats();
        }, 1000);
    }

    updatePerformanceStats() {
        // Mock performance data - in real implementation, get from GPU
        const stats = {
            gpuUsage: Math.floor(Math.random() * 30) + 60, // 60-90%
            fps: Math.floor(Math.random() * 10) + 55, // 55-65fps
            processingTime: Math.floor(Math.random() * 5) + 12 // 12-17ms
        };

        document.getElementById('gpu-usage').textContent = stats.gpuUsage + '%';
        document.getElementById('current-fps').textContent = stats.fps;
        document.getElementById('processing-time').textContent = stats.processingTime + 'ms';
    }

    // 💡 OPTIMIZATION TIPS
    showOptimizationTips() {
        const tips = this.generateOptimizationTips();
        document.getElementById('tip-content').innerHTML = tips.join('<br>');
    }

    generateOptimizationTips() {
        const tips = [];
        const gpu = this.settings.detectedGPU;

        if (gpu?.vendor === 'nvidia' && gpu.name.includes('RTX 40')) {
            tips.push('🔥 RTX 40-series detected! Enable DLSS 3.0 for best performance.');
        }
        
        if (this.settings.scaleFactor > 3.0) {
            tips.push('⚡ High scale factor detected. Consider reducing for better performance.');
        }

        if (this.settings.enableHDR && !gpu?.supportedMethods.includes('rtx_hdr')) {
            tips.push('💡 HDR enhancement works best with RTX cards.');
        }

        return tips;
    }

    // 🎯 PROFILE MANAGEMENT
    applyProfile(profileName) {
        const profiles = {
            anime: {
                aiMethod: 'waifu2x',
                scaleFactor: 2.0,
                sharpness: 0.3,
                saturation: 1.2,
                animeOptimization: true
            },
            movies: {
                aiMethod: 'real_esrgan',
                scaleFactor: 2.5,
                enableHDR: true,
                sharpness: 0.6,
                movieOptimization: true
            },
            tv: {
                aiMethod: 'fsr21',
                scaleFactor: 2.0,
                sharpness: 0.4,
                tvShowOptimization: true
            },
            custom: {
                // Keep current settings
            }
        };

        if (profiles[profileName]) {
            Object.assign(this.settings, profiles[profileName]);
            this.updateUIFromSettings();
        }
    }

    // 🔄 UTILITY METHODS
    updateUIFromSettings() {
        // Update all UI elements to match current settings
        Object.keys(this.settings).forEach(key => {
            const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings[key];
                } else {
                    element.value = this.settings[key];
                }
            }
        });
    }

    updateHardwareUI() {
        const gpuInfo = document.getElementById('gpu-info');
        if (gpuInfo && this.settings.detectedGPU) {
            const gpu = this.settings.detectedGPU;
            gpuInfo.innerHTML = `
                <div class="gpu-name">🎮 ${gpu.name}</div>
                <div class="supported-methods">
                    Supported: ${gpu.supportedMethods.join(', ') || 'Basic upscaling'}
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `upscaler-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    resetSettings() {
        this.settings = this.loadSettings();
        this.updateUIFromSettings();
        this.showNotification('Settings reset to default', 'success');
    }

    applySettings() {
        // Apply settings to the upscaler engine
        console.log('Applying settings:', this.settings);
        this.showNotification('Settings saved successfully', 'success');
    }

    getEnglishFallback() {
        return {
            plugin_name: "AI Video Upscaler",
            settings: "Settings",
            language: "Language",
            auto_language: "Auto (Follow Jellyfin)",
            performance: "Performance",
            quality: "Quality",
            save: "Save",
            cancel: "Cancel",
            reset: "Reset to Default"
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.upscalerSettings = new AdvancedUpscalerSettings();
});