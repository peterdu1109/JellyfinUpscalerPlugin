/**
 * Light Mode Manager for AI Upscaler Plugin v1.3.4
 * Automatically detects hardware and optimizes settings
 */

class LightModeManager {
    constructor() {
        this.hardwareInfo = {
            cpu: null,
            gpu: null,
            ram: null,
            platform: null
        };
        this.performanceMetrics = {
            cpuUsage: 0,
            memoryUsage: 0,
            gpuUsage: 0,
            temperature: 0
        };
        this.isLightModeActive = false;
        this.monitoringInterval = null;
    }

    /**
     * Initialize Light Mode Manager
     */
    async initialize() {
        console.log('🔋 Light Mode Manager initializing...');
        
        try {
            await this.detectHardware();
            this.startPerformanceMonitoring();
            this.setupEventListeners();
            
            console.log('✅ Light Mode Manager initialized successfully');
        } catch (error) {
            console.error('❌ Light Mode Manager initialization failed:', error);
        }
    }

    /**
     * Detect system hardware capabilities
     */
    async detectHardware() {
        try {
            // Get system information from navigator API
            this.hardwareInfo.platform = navigator.platform;
            this.hardwareInfo.userAgent = navigator.userAgent;
            
            // Detect RAM (approximate)
            if (navigator.deviceMemory) {
                this.hardwareInfo.ram = navigator.deviceMemory;
            }
            
            // Detect GPU capabilities
            await this.detectGPU();
            
            // CPU detection (limited in browser)
            this.hardwareInfo.cpu = navigator.hardwareConcurrency || 4;
            
            // Make recommendation based on hardware
            this.makeHardwareRecommendation();
            
            return this.hardwareInfo;
        } catch (error) {
            console.error('Hardware detection failed:', error);
            return null;
        }
    }

    /**
     * Detect GPU capabilities using WebGL
     */
    async detectGPU() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    this.hardwareInfo.gpu = {
                        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
                    };
                }
                
                // Test GPU performance
                const startTime = performance.now();
                gl.clear(gl.COLOR_BUFFER_BIT);
                const endTime = performance.now();
                
                this.hardwareInfo.gpuPerformance = endTime - startTime;
            }
        } catch (error) {
            console.warn('GPU detection failed:', error);
        }
    }

    /**
     * Make hardware-based recommendations
     */
    makeHardwareRecommendation() {
        const ram = this.hardwareInfo.ram || 4;
        const cpuCores = this.hardwareInfo.cpu || 4;
        const gpuCapable = this.hardwareInfo.gpu !== null;
        
        let recommendation = 'standard';
        let reason = '';
        
        // Low-end hardware detection
        if (ram < 8 || cpuCores < 4) {
            recommendation = 'light';
            reason = 'Limited RAM or CPU cores detected';
        }
        
        // Very low-end detection
        if (ram < 4 || cpuCores < 2) {
            recommendation = 'ultra-light';
            reason = 'Very limited hardware detected';
        }
        
        // High-end hardware detection
        if (ram >= 16 && cpuCores >= 8 && gpuCapable) {
            recommendation = 'performance';
            reason = 'High-performance hardware detected';
        }
        
        this.hardwareInfo.recommendation = recommendation;
        this.hardwareInfo.reason = reason;
        
        // Auto-enable light mode if recommended
        if (recommendation === 'light' || recommendation === 'ultra-light') {
            this.enableLightMode(true);
        }
    }

    /**
     * Enable or disable light mode
     */
    enableLightMode(enable = true) {
        this.isLightModeActive = enable;
        
        if (enable) {
            console.log('🔋 Light Mode activated');
            this.applyLightModeSettings();
            this.showLightModeNotification();
        } else {
            console.log('⚡ Standard Mode activated');
            this.revertLightModeSettings();
        }
        
        // Trigger event for UI updates
        document.dispatchEvent(new CustomEvent('lightModeChanged', {
            detail: { enabled: enable, hardware: this.hardwareInfo }
        }));
    }

    /**
     * Apply light mode optimizations
     */
    applyLightModeSettings() {
        const lightModeConfig = {
            maxResolution: 1080,
            model: 'bicubic',
            scale: 2,
            quality: 'fast',
            maxConcurrentJobs: 1,
            enableGPU: false,
            turboMode: false,
            frameInterpolation: false,
            serverSideUpscaling: true
        };
        
        // Apply settings to configuration
        if (window.UpscalerConfig) {
            Object.assign(window.UpscalerConfig, lightModeConfig);
        }
        
        // Update UI elements
        this.updateUIForLightMode();
    }

    /**
     * Revert light mode settings
     */
    revertLightModeSettings() {
        // Restore default settings
        const defaultConfig = {
            maxResolution: 2160,
            model: 'realesrgan',
            scale: 2,
            quality: 'high',
            maxConcurrentJobs: 2,
            enableGPU: true,
            turboMode: true,
            frameInterpolation: true,
            serverSideUpscaling: false
        };
        
        if (window.UpscalerConfig) {
            Object.assign(window.UpscalerConfig, defaultConfig);
        }
        
        this.updateUIForStandardMode();
    }

    /**
     * Update UI for light mode
     */
    updateUIForLightMode() {
        // Add light mode indicator
        const indicator = document.createElement('div');
        indicator.id = 'lightModeIndicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #f39c12, #e67e22);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
                z-index: 10000;
                animation: fadeIn 0.5s ease;
            ">
                🔋 Light Mode Active
            </div>
        `;
        
        document.body.appendChild(indicator);
        
        // Dim non-essential UI elements
        const style = document.createElement('style');
        style.id = 'lightModeStyles';
        style.textContent = `
            .config-item.premium {
                opacity: 0.6;
                pointer-events: none;
            }
            .new-feature-badge {
                opacity: 0.5;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Update UI for standard mode
     */
    updateUIForStandardMode() {
        // Remove light mode indicator
        const indicator = document.getElementById('lightModeIndicator');
        if (indicator) {
            indicator.remove();
        }
        
        // Remove light mode styles
        const styles = document.getElementById('lightModeStyles');
        if (styles) {
            styles.remove();
        }
    }

    /**
     * Show light mode notification
     */
    showLightModeNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #27ae60, #2ecc71);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(39, 174, 96, 0.3);
                z-index: 10001;
                animation: slideUp 0.5s ease, fadeOut 3s ease 2s forwards;
                max-width: 400px;
                text-align: center;
            ">
                <strong>🔋 Light Mode Activated</strong><br>
                <small>Optimized for your hardware: ${this.hardwareInfo.reason}</small>
            </div>
            <style>
                @keyframes slideUp {
                    from { opacity: 0; transform: translate(-50%, 100%); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                @keyframes fadeOut {
                    to { opacity: 0; transform: translate(-50%, -20px); }
                }
            </style>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        this.monitoringInterval = setInterval(() => {
            this.updatePerformanceMetrics();
            this.checkPerformanceThresholds();
        }, 2000);
    }

    /**
     * Update performance metrics
     */
    updatePerformanceMetrics() {
        // Simulate performance data (in real implementation, get from server)
        this.performanceMetrics = {
            cpuUsage: Math.floor(Math.random() * 50 + 10),
            memoryUsage: Math.floor(Math.random() * 40 + 30),
            gpuUsage: Math.floor(Math.random() * 60 + 20),
            temperature: Math.floor(Math.random() * 25 + 60)
        };
        
        // Update UI if elements exist
        this.updatePerformanceUI();
    }

    /**
     * Update performance UI elements
     */
    updatePerformanceUI() {
        const elements = {
            cpuUsage: document.getElementById('cpuUsage'),
            memoryUsage: document.getElementById('memoryUsage'),
            gpuUsage: document.getElementById('gpuUsage'),
            temperature: document.getElementById('temperature')
        };
        
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                const value = this.performanceMetrics[key];
                elements[key].textContent = key === 'temperature' ? `${value}°C` : `${value}%`;
                
                // Color coding based on usage
                if (key !== 'temperature') {
                    if (value > 80) {
                        elements[key].style.color = '#e74c3c';
                    } else if (value > 60) {
                        elements[key].style.color = '#f39c12';
                    } else {
                        elements[key].style.color = '#27ae60';
                    }
                } else {
                    if (value > 85) {
                        elements[key].style.color = '#e74c3c';
                    } else if (value > 75) {
                        elements[key].style.color = '#f39c12';
                    } else {
                        elements[key].style.color = '#3498db';
                    }
                }
            }
        });
    }

    /**
     * Check performance thresholds
     */
    checkPerformanceThresholds() {
        const { cpuUsage, memoryUsage, temperature } = this.performanceMetrics;
        
        // Auto-enable light mode if performance is poor
        if (!this.isLightModeActive) {
            if (cpuUsage > 85 || memoryUsage > 85 || temperature > 85) {
                console.warn('🔋 High resource usage detected, enabling Light Mode');
                this.enableLightMode(true);
            }
        }
        
        // Thermal throttling
        if (temperature > 90) {
            console.warn('🌡️ High temperature detected, applying thermal throttling');
            this.applyThermalThrottling();
        }
    }

    /**
     * Apply thermal throttling
     */
    applyThermalThrottling() {
        const throttleConfig = {
            quality: 'fast',
            scale: 1,
            maxConcurrentJobs: 1,
            enableGPU: false
        };
        
        if (window.UpscalerConfig) {
            Object.assign(window.UpscalerConfig, throttleConfig);
        }
        
        // Show thermal warning
        this.showThermalWarning();
    }

    /**
     * Show thermal warning
     */
    showThermalWarning() {
        const warning = document.createElement('div');
        warning.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
                padding: 20px 30px;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(231, 76, 60, 0.4);
                z-index: 10002;
                text-align: center;
                animation: shake 0.5s ease;
            ">
                <div style="font-size: 32px; margin-bottom: 10px;">🌡️</div>
                <strong>Thermal Protection Active</strong><br>
                <small>Performance reduced to prevent overheating</small>
            </div>
            <style>
                @keyframes shake {
                    0%, 100% { transform: translate(-50%, -50%); }
                    25% { transform: translate(-52%, -50%); }
                    75% { transform: translate(-48%, -50%); }
                }
            </style>
        `;
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 4000);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Light mode toggle
        document.addEventListener('change', (event) => {
            if (event.target.id === 'chkLightMode') {
                this.enableLightMode(event.target.checked);
            }
        });
        
        // Auto-detect hardware toggle
        document.addEventListener('change', (event) => {
            if (event.target.id === 'chkAutoDetectHardware') {
                if (event.target.checked) {
                    this.detectHardware();
                } else {
                    this.hideHardwareInfo();
                }
            }
        });
        
        // Window visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Reduce monitoring frequency when tab is hidden
                if (this.monitoringInterval) {
                    clearInterval(this.monitoringInterval);
                    this.monitoringInterval = setInterval(() => {
                        this.updatePerformanceMetrics();
                    }, 10000); // 10 seconds instead of 2
                }
            } else {
                // Resume normal monitoring
                if (this.monitoringInterval) {
                    clearInterval(this.monitoringInterval);
                    this.startPerformanceMonitoring();
                }
            }
        });
    }

    /**
     * Hide hardware information
     */
    hideHardwareInfo() {
        const hardwareInfo = document.getElementById('hardwareInfo');
        if (hardwareInfo) {
            hardwareInfo.style.display = 'none';
        }
    }

    /**
     * Get current hardware info
     */
    getHardwareInfo() {
        return this.hardwareInfo;
    }

    /**
     * Get current performance metrics
     */
    getPerformanceMetrics() {
        return this.performanceMetrics;
    }

    /**
     * Destroy the manager
     */
    destroy() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        
        // Remove UI elements
        this.updateUIForStandardMode();
        
        console.log('🔋 Light Mode Manager destroyed');
    }
}

// Export for use in other modules
window.LightModeManager = LightModeManager;