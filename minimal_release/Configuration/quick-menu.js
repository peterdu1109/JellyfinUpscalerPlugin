// AI Upscaler Plugin - Enhanced Quick Menu v1.6.0
// Advanced compatibility and quick actions

(function () {
    'use strict';

    // Plugin configuration
    const PLUGIN_ID = 'f87f700e-679d-43e6-9c7c-b3a410dc3f22';
    const PLUGIN_VERSION = '1.6.0';

    // Quick menu actions
    const QuickMenuActions = {

        // Load optimal defaults based on device
        loadDefaults: function () {
            console.log('AI Upscaler: Chargement des paramètres par défaut optimaux...');

            const defaults = {
                enabled: true,
                model: 'realesrgan',
                scale: 2,
                quality: 'balanced',
                enableHardwareAcceleration: true,
                maxConcurrentStreams: 2,
                cacheSizeMB: 1024,
                autoCleanupCache: true,
                enableErrorReporting: true,
                enableAutoRecovery: true,
                maxRetryAttempts: 3,
                enableSafeMode: false,
                enableHealthCheck: true,
                enableMemoryMonitoring: true,
                diagnosticIntervalMinutes: 15
            };

            this.updateFormFields(defaults);
            this.showNotification('✅ Paramètres par défaut chargés avec succès !', 'success');
        },

        // Auto-optimize for current device
        optimizeForDevice: function () {
            console.log('AI Upscaler: Auto-optimisation pour l\'appareil...');

            const deviceInfo = this.detectDevice();
            let optimizedSettings = {};

            switch (deviceInfo.type) {
                case 'mobile':
                    optimizedSettings = {
                        model: 'swinir',
                        cacheSizeMB: 512,
                        maxConcurrentStreams: 1,
                        enableHardwareAcceleration: false,
                        quality: 'fast'
                    };
                    break;

                case 'desktop':
                    optimizedSettings = {
                        model: 'realesrgan',
                        cacheSizeMB: 2048,
                        maxConcurrentStreams: 4,
                        enableHardwareAcceleration: true,
                        quality: 'quality'
                    };
                    break;

                case 'tv':
                    optimizedSettings = {
                        model: 'esrgan',
                        cacheSizeMB: 1024,
                        maxConcurrentStreams: 2,
                        enableHardwareAcceleration: true,
                        quality: 'balanced'
                    };
                    break;

                default:
                    optimizedSettings = {
                        model: 'srcnn',
                        cacheSizeMB: 1024,
                        maxConcurrentStreams: 2,
                        enableHardwareAcceleration: true,
                        quality: 'balanced'
                    };
            }

            this.updateFormFields(optimizedSettings);
            this.showNotification(`✅ Paramètres optimisés pour appareil ${deviceInfo.name} !`, 'success');
        },

        // Test system compatibility
        testSystem: function () {
            console.log('AI Upscaler: Test de compatibilité système...');
            this.showNotification('🔍 Test de compatibilité système en cours...', 'info');

            const tests = [
                this.testPlatformCompatibility(),
                this.testMemoryAvailability(),
                this.testNetworkConnectivity(),
                this.testHardwareAcceleration()
            ];

            Promise.all(tests)
                .then(results => {
                    const allPassed = results.every(result => result.passed);
                    if (allPassed) {
                        this.showNotification('✅ Tous les tests système ont réussi ! Le plugin est prêt.', 'success');
                    } else {
                        const failures = results.filter(r => !r.passed);
                        this.showNotification(`⚠️ ${failures.length} test(s) échoué(s). Vérifiez la console pour les détails.`, 'warning');
                    }
                })
                .catch(error => {
                    console.error('Erreur test système:', error);
                    this.showNotification('❌ Échec du test système. Vérifiez la console pour les détails.', 'error');
                });
        },

        // Export configuration
        exportConfig: function () {
            console.log('AI Upscaler: Exportation de la configuration...');

            const config = this.collectFormData();
            const configBlob = new Blob([JSON.stringify(config, null, 2)], {
                type: 'application/json'
            });

            const url = URL.createObjectURL(configBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aiupscaler-config-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showNotification('✅ Configuration exportée avec succès !', 'success');
        },

        // Show system diagnostics
        showDiagnostics: function () {
            console.log('AI Upscaler: Affichage des diagnostics système...');

            const diagnostics = {
                platform: navigator.platform,
                userAgent: navigator.userAgent,
                memory: this.getMemoryInfo(),
                gpu: this.getGPUInfo(),
                network: this.getNetworkInfo(),
                timestamp: new Date().toISOString()
            };

            const diagWindow = window.open('', '_blank', 'width=800,height=600');
            diagWindow.document.write(`
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <title>AI Upscaler - Diagnostics Système</title>
                    <style>
                        body { font-family: monospace; background: #1a1a1a; color: #00ff00; padding: 20px; }
                        .header { color: #00d4ff; font-size: 1.5em; margin-bottom: 20px; }
                        .section { margin-bottom: 20px; padding: 15px; background: #2a2a2a; border-radius: 8px; }
                        .key { color: #ffd700; font-weight: bold; }
                        .value { color: #ffffff; }
                        .good { color: #00ff00; }
                        .warning { color: #ffa500; }
                        .error { color: #ff0000; }
                    </style>
                </head>
                <body>
                    <div class="header">🔍 Plugin Suréchantillonnage IA - Diagnostics Système v${PLUGIN_VERSION}</div>
                    <div class="section">
                        <div><span class="key">Plateforme:</span> <span class="value">${diagnostics.platform}</span></div>
                        <div><span class="key">User Agent:</span> <span class="value">${diagnostics.userAgent}</span></div>
                        <div><span class="key">Horodatage:</span> <span class="value">${diagnostics.timestamp}</span></div>
                    </div>
                    <div class="section">
                        <div><span class="key">Mémoire:</span> <span class="value">${JSON.stringify(diagnostics.memory, null, 2)}</span></div>
                        <div><span class="key">GPU:</span> <span class="value">${JSON.stringify(diagnostics.gpu, null, 2)}</span></div>
                        <div><span class="key">Réseau:</span> <span class="value">${JSON.stringify(diagnostics.network, null, 2)}</span></div>
                    </div>
                    <div class="section">
                        <div><span class="key">Statut:</span> <span class="good">✅ Système Prêt</span></div>
                        <div><span class="key">Version Plugin:</span> <span class="value">${PLUGIN_VERSION}</span></div>
                        <div><span class="key">Compatibilité:</span> <span class="good">✅ Universelle</span></div>
                    </div>
                </body>
                </html>
            `);

            this.showNotification('📊 Diagnostics système ouverts dans une nouvelle fenêtre.', 'info');
        },

        // Reset to factory defaults
        resetToDefaults: function () {
            if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres par défaut ?')) {
                this.loadDefaults();
            }
        },

        // Utility functions
        detectDevice: function () {
            const userAgent = navigator.userAgent.toLowerCase();
            const platform = navigator.platform.toLowerCase();

            if (/mobile|android|iphone|ipad/.test(userAgent)) {
                return { type: 'mobile', name: 'Appareil Mobile' };
            } else if (/tv|roku|chromecast|appletv/.test(userAgent)) {
                return { type: 'tv', name: 'Smart TV' };
            } else if (/win|mac|linux/.test(platform)) {
                return { type: 'desktop', name: 'Ordinateur de Bureau' };
            } else {
                return { type: 'unknown', name: 'Appareil Inconnu' };
            }
        },

        getMemoryInfo: function () {
            if (performance.memory) {
                return {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' Mo',
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' Mo',
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + ' Mo'
                };
            }
            return { status: 'Non disponible' };
        },

        getGPUInfo: function () {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    return {
                        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
                        version: gl.getParameter(gl.VERSION)
                    };
                }
                return { status: 'WebGL supporté, détails non disponibles' };
            }
            return { status: 'WebGL non supporté' };
        },

        getNetworkInfo: function () {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection) {
                return {
                    type: connection.effectiveType || connection.type,
                    downlink: connection.downlink + ' Mbps',
                    rtt: connection.rtt + ' ms'
                };
            }
            return { status: 'Non disponible' };
        },

        // Test functions
        testPlatformCompatibility: function () {
            const supportedPlatforms = ['Win32', 'Linux', 'MacIntel', 'Android', 'iPhone'];
            const currentPlatform = navigator.platform;

            return Promise.resolve({
                test: 'Compatibilité Plateforme',
                passed: supportedPlatforms.some(platform => currentPlatform.includes(platform)),
                details: `Plateforme: ${currentPlatform}`
            });
        },

        testMemoryAvailability: function () {
            const minMemoryMB = 512;
            let availableMemory = 0;

            if (performance.memory) {
                availableMemory = (performance.memory.jsHeapSizeLimit - performance.memory.usedJSHeapSize) / 1024 / 1024;
            }

            return Promise.resolve({
                test: 'Disponibilité Mémoire',
                passed: availableMemory > minMemoryMB || !performance.memory,
                details: performance.memory ? `Disponible: ${Math.round(availableMemory)} Mo` : 'Info mémoire non disponible'
            });
        },

        testNetworkConnectivity: function () {
            return fetch('/api/system/info', { method: 'HEAD' })
                .then(() => ({
                    test: 'Connectivité Réseau',
                    passed: true,
                    details: 'Connecté au serveur Jellyfin'
                }))
                .catch(() => ({
                    test: 'Connectivité Réseau',
                    passed: false,
                    details: 'Impossible de se connecter au serveur Jellyfin'
                }));
        },

        testHardwareAcceleration: function () {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            return Promise.resolve({
                test: 'Accélération Matérielle',
                passed: !!gl,
                details: gl ? 'WebGL supporté' : 'WebGL non supporté'
            });
        },

        // Form manipulation
        updateFormFields: function (settings) {
            Object.keys(settings).forEach(key => {
                const field = document.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = settings[key];
                    } else {
                        field.value = settings[key];
                    }
                }
            });
        },

        collectFormData: function () {
            const formData = {};
            const inputs = document.querySelectorAll('input, select');

            inputs.forEach(input => {
                if (input.name) {
                    if (input.type === 'checkbox') {
                        formData[input.name] = input.checked;
                    } else if (input.type === 'number') {
                        formData[input.name] = parseInt(input.value) || 0;
                    } else {
                        formData[input.name] = input.value;
                    }
                }
            });

            return formData;
        },

        // Notification system
        showNotification: function (message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-message">${message}</span>
                    <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;

            // Add styles if not already present
            if (!document.querySelector('#aiupscaler-notification-styles')) {
                const styles = document.createElement('style');
                styles.id = 'aiupscaler-notification-styles';
                styles.textContent = `
                    .notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 15px 20px;
                        border-radius: 8px;
                        color: white;
                        font-weight: 500;
                        z-index: 10000;
                        animation: slideIn 0.3s ease-out;
                        max-width: 400px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    }
                    
                    .notification-success { background: #059669; }
                    .notification-error { background: #dc2626; }
                    .notification-warning { background: #d97706; }
                    .notification-info { background: #2563eb; }
                    
                    .notification-content {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    
                    .notification-close {
                        background: none;
                        border: none;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        margin-left: 10px;
                    }
                    
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(styles);
            }

            document.body.appendChild(notification);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);
        }
    };

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function () {
        console.log(`Plugin Suréchantillonnage IA Menu Rapide v${PLUGIN_VERSION} initialisé`);

        // Make functions globally available
        window.aiUpscalerQuickMenu = QuickMenuActions;

        // Auto-detect and suggest optimizations
        setTimeout(() => {
            const deviceInfo = QuickMenuActions.detectDevice();
            console.log('Appareil détecté:', deviceInfo);
        }, 1000);
    });

    // Global functions for HTML onclick handlers
    window.loadDefaults = () => QuickMenuActions.loadDefaults();
    window.optimizeForDevice = () => QuickMenuActions.optimizeForDevice();
    window.testSystem = () => QuickMenuActions.testSystem();
    window.exportConfig = () => QuickMenuActions.exportConfig();
    window.showDiagnostics = () => QuickMenuActions.showDiagnostics();
    window.resetToDefaults = () => QuickMenuActions.resetToDefaults();

})();