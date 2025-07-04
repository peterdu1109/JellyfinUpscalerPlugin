/**
 * AI Upscaler Plugin - Advanced Diagnostic UI
 * Provides intelligent error diagnosis and solutions for users
 */

class UpscalerDiagnostics {
    constructor() {
        this.diagnosticHistory = [];
        this.systemInfo = null;
        this.errorSolutions = this.initializeErrorSolutions();
        
        this.init();
    }
    
    async init() {
        await this.detectSystemCapabilities();
        this.setupEventListeners();
        this.startPerformanceMonitoring();
    }
    
    initializeErrorSolutions() {
        return {
            'insufficient_vram': {
                title: '🚨 Nicht genug GPU-Speicher',
                severity: 'high',
                message: 'Ihr System hat nicht genügend VRAM für das gewählte AI-Modell.',
                causes: [
                    'GPU hat weniger als 2GB VRAM',
                    'Andere Programme verwenden GPU-Speicher',
                    'Zu großes AI-Modell für Hardware gewählt'
                ],
                solutions: [
                    {
                        text: 'Automatisch zu FSRCNN wechseln (256MB VRAM)',
                        action: () => this.applySolution('switch_to_fsrcnn'),
                        difficulty: 'easy'
                    },
                    {
                        text: 'Auflösung auf 1080p reduzieren',
                        action: () => this.applySolution('reduce_resolution'),
                        difficulty: 'easy'
                    },
                    {
                        text: 'Andere GPU-Programme schließen',
                        action: () => this.showGPUProcesses(),
                        difficulty: 'medium'
                    },
                    {
                        text: 'Software-Rendering aktivieren',
                        action: () => this.applySolution('enable_software_rendering'),
                        difficulty: 'medium'
                    }
                ]
            },
            
            'model_load_failed': {
                title: '❌ AI-Modell konnte nicht geladen werden',
                severity: 'medium',
                message: 'Das gewählte AI-Modell ist beschädigt oder nicht kompatibel.',
                causes: [
                    'Modell-Datei ist beschädigt',
                    'Inkompatible GPU-Architektur',
                    'Ungenügender Speicher'
                ],
                solutions: [
                    {
                        text: 'Modell neu herunterladen',
                        action: () => this.applySolution('redownload_model'),
                        difficulty: 'easy'
                    },
                    {
                        text: 'Auf Fallback-Modell wechseln',
                        action: () => this.applySolution('use_fallback_model'),
                        difficulty: 'easy'
                    },
                    {
                        text: 'Cache leeren und neu starten',
                        action: () => this.applySolution('clear_cache_restart'),
                        difficulty: 'medium'
                    }
                ]
            },
            
            'hardware_unsupported': {
                title: '⚠️ Hardware nicht unterstützt',
                severity: 'medium',
                message: 'Ihre GPU unterstützt keine Hardware-Beschleunigung für AI-Upscaling.',
                causes: [
                    'Alte GPU ohne CUDA/OpenCL Support',
                    'Fehlende Treiber',
                    'Integrierte Grafik ohne ausreichende Leistung'
                ],
                solutions: [
                    {
                        text: 'CPU-basiertes FSRCNN verwenden',
                        action: () => this.applySolution('enable_cpu_mode'),
                        difficulty: 'easy'
                    },
                    {
                        text: 'GPU-Treiber aktualisieren',
                        action: () => this.showDriverUpdateGuide(),
                        difficulty: 'medium'
                    },
                    {
                        text: 'Nur Shader-Upscaling aktivieren',
                        action: () => this.applySolution('shader_only_mode'),
                        difficulty: 'easy'
                    }
                ]
            },
            
            'thermal_throttling': {
                title: '🌡️ Überhitzungsschutz aktiv',
                severity: 'high',
                message: 'Die GPU-Temperatur ist zu hoch. Leistung wird reduziert.',
                causes: [
                    'Unzureichende Kühlung',
                    'Verstaubte Lüfter',
                    'Zu hohe Umgebungstemperatur'
                ],
                solutions: [
                    {
                        text: 'Temperaturlimit reduzieren (75°C)',
                        action: () => this.applySolution('reduce_thermal_limit'),
                        difficulty: 'easy'
                    },
                    {
                        text: 'Performance-Modus aktivieren',
                        action: () => this.applySolution('enable_performance_mode'),
                        difficulty: 'easy'
                    },
                    {
                        text: 'Lüfterkurve anpassen',
                        action: () => this.showCoolingGuide(),
                        difficulty: 'advanced'
                    }
                ]
            },
            
            'bandwidth_insufficient': {
                title: '🌐 Netzwerk zu langsam',
                severity: 'medium',
                message: 'Die Netzwerkbandbreite reicht nicht für hochqualitatives Streaming.',
                causes: [
                    'Langsame Internetverbindung',
                    'Überlastetes WLAN',
                    'Zu hohe Qualitätseinstellungen'
                ],
                solutions: [
                    {
                        text: 'Qualität automatisch anpassen',
                        action: () => this.applySolution('enable_adaptive_quality'),
                        difficulty: 'easy'
                    },
                    {
                        text: 'Auflösung auf 720p reduzieren',
                        action: () => this.applySolution('reduce_streaming_quality'),
                        difficulty: 'easy'
                    },
                    {
                        text: 'Lokales Pre-Caching aktivieren',
                        action: () => this.applySolution('enable_precaching'),
                        difficulty: 'medium'
                    }
                ]
            }
        };
    }
    
    async detectSystemCapabilities() {
        this.systemInfo = {
            gpu: await this.detectGPU(),
            ram: this.detectRAM(),
            cpu: this.detectCPU(),
            bandwidth: await this.measureBandwidth(),
            platform: this.detectPlatform()
        };
        
        console.log('System capabilities detected:', this.systemInfo);
    }
    
    async detectGPU() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            
            if (!gl) return { vendor: 'Unknown', renderer: 'No WebGL', memory: 0 };
            
            const vendor = gl.getParameter(gl.VENDOR);
            const renderer = gl.getParameter(gl.RENDERER);
            
            // Estimate VRAM based on renderer string
            let estimatedVRAM = 0;
            if (renderer.includes('RTX 4090')) estimatedVRAM = 24576;
            else if (renderer.includes('RTX 4080')) estimatedVRAM = 16384;
            else if (renderer.includes('RTX 4070')) estimatedVRAM = 12288;
            else if (renderer.includes('RTX 3060')) estimatedVRAM = 8192;
            else if (renderer.includes('GTX')) estimatedVRAM = 4096;
            else estimatedVRAM = 2048; // Conservative estimate
            
            return {
                vendor,
                renderer,
                memory: estimatedVRAM,
                webglVersion: gl.getParameter(gl.VERSION)
            };
        } catch (error) {
            return { vendor: 'Unknown', renderer: 'Detection failed', memory: 0 };
        }
    }
    
    detectRAM() {
        // Use navigator.deviceMemory if available (Chrome)
        if ('deviceMemory' in navigator) {
            return navigator.deviceMemory * 1024; // Convert GB to MB
        }
        return 8192; // Fallback: assume 8GB
    }
    
    detectCPU() {
        return {
            cores: navigator.hardwareConcurrency || 4,
            platform: navigator.platform
        };
    }
    
    async measureBandwidth() {
        try {
            const startTime = performance.now();
            const response = await fetch('/web/test-image.jpg?t=' + Date.now(), { 
                cache: 'no-cache' 
            });
            const endTime = performance.now();
            
            if (response.ok) {
                const contentLength = response.headers.get('content-length');
                const duration = (endTime - startTime) / 1000; // seconds
                const bytes = parseInt(contentLength) || 1024000; // 1MB fallback
                const bitsPerSecond = (bytes * 8) / duration;
                
                return Math.round(bitsPerSecond);
            }
        } catch (error) {
            console.warn('Bandwidth measurement failed:', error);
        }
        return 10000000; // 10 Mbps fallback
    }
    
    detectPlatform() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('mobile') || userAgent.includes('android')) {
            return 'mobile';
        } else if (userAgent.includes('ipad') || userAgent.includes('tablet')) {
            return 'tablet';
        } else if (userAgent.includes('smart-tv') || userAgent.includes('roku')) {
            return 'tv';
        } else {
            return 'desktop';
        }
    }
    
    runDiagnostic(errorType, additionalData = {}) {
        const error = this.errorSolutions[errorType];
        if (!error) {
            console.warn('Unknown error type:', errorType);
            return;
        }
        
        const diagnostic = {
            timestamp: Date.now(),
            errorType,
            systemInfo: this.systemInfo,
            additionalData,
            resolved: false
        };
        
        this.diagnosticHistory.push(diagnostic);
        this.showDiagnosticDialog(error, diagnostic);
    }
    
    showDiagnosticDialog(error, diagnostic) {
        const dialog = document.createElement('div');
        dialog.className = 'diagnostic-dialog';
        dialog.innerHTML = this.generateDialogHTML(error, diagnostic);
        
        document.body.appendChild(dialog);
        
        // Animate in
        requestAnimationFrame(() => {
            dialog.style.opacity = '1';
            dialog.querySelector('.diagnostic-content').style.transform = 'translateY(0)';
        });
        
        this.setupDialogEventListeners(dialog, error, diagnostic);
    }
    
    generateDialogHTML(error, diagnostic) {
        const severityColors = {
            high: '#ff4757',
            medium: '#ffa502',
            low: '#2ed573'
        };
        
        const difficultyIcons = {
            easy: '🟢',
            medium: '🟡',
            advanced: '🔴'
        };
        
        return `
            <div class="diagnostic-overlay">
                <div class="diagnostic-content">
                    <div class="diagnostic-header" style="border-left: 4px solid ${severityColors[error.severity]}">
                        <h2>${error.title}</h2>
                        <span class="severity-badge ${error.severity}">${error.severity.toUpperCase()}</span>
                    </div>
                    
                    <div class="diagnostic-body">
                        <p class="error-message">${error.message}</p>
                        
                        <div class="system-info">
                            <h4>📊 System Information</h4>
                            <div class="info-grid">
                                <div>GPU: ${diagnostic.systemInfo.gpu.renderer}</div>
                                <div>VRAM: ${diagnostic.systemInfo.gpu.memory}MB</div>
                                <div>RAM: ${diagnostic.systemInfo.ram}MB</div>
                                <div>Platform: ${diagnostic.systemInfo.platform}</div>
                            </div>
                        </div>
                        
                        <div class="possible-causes">
                            <h4>🔍 Mögliche Ursachen</h4>
                            <ul>
                                ${error.causes.map(cause => `<li>${cause}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="solutions-section">
                            <h4>🔧 Lösungsvorschläge</h4>
                            <div class="solutions-list">
                                ${error.solutions.map((solution, index) => `
                                    <div class="solution-item" data-solution-index="${index}">
                                        <div class="solution-header">
                                            <span class="difficulty">${difficultyIcons[solution.difficulty]}</span>
                                            <span class="solution-text">${solution.text}</span>
                                        </div>
                                        <button class="solution-button" onclick="this.parentElement.parentElement.click()">
                                            Anwenden
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="diagnostic-footer">
                        <button class="btn-secondary" onclick="this.closest('.diagnostic-dialog').remove()">
                            Schließen
                        </button>
                        <button class="btn-primary" onclick="this.showAdvancedDiagnostics()">
                            Erweiterte Diagnose
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                .diagnostic-dialog {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.7);
                    z-index: 10000;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                
                .diagnostic-overlay {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                }
                
                .diagnostic-content {
                    background: white;
                    border-radius: 16px;
                    max-width: 600px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    transform: translateY(20px);
                    transition: transform 0.3s;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                
                .diagnostic-header {
                    padding: 24px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .diagnostic-header h2 {
                    margin: 0;
                    font-size: 24px;
                    color: #333;
                }
                
                .severity-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                
                .severity-badge.high {
                    background: #ffebee;
                    color: #c62828;
                }
                
                .severity-badge.medium {
                    background: #fff3e0;
                    color: #ef6c00;
                }
                
                .severity-badge.low {
                    background: #e8f5e8;
                    color: #2e7d32;
                }
                
                .diagnostic-body {
                    padding: 24px;
                }
                
                .error-message {
                    font-size: 16px;
                    color: #555;
                    margin-bottom: 24px;
                    line-height: 1.5;
                }
                
                .system-info {
                    background: #f8f9fa;
                    padding: 16px;
                    border-radius: 8px;
                    margin-bottom: 24px;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    font-family: monospace;
                    font-size: 14px;
                }
                
                .solutions-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .solution-item {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    padding: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .solution-item:hover {
                    background: #e9ecef;
                    border-color: #667eea;
                }
                
                .solution-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 8px;
                }
                
                .solution-text {
                    flex: 1;
                    font-weight: 500;
                }
                
                .solution-button {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                
                .solution-button:hover {
                    background: #5a6fd8;
                }
                
                .diagnostic-footer {
                    padding: 24px;
                    border-top: 1px solid #eee;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }
                
                .btn-primary, .btn-secondary {
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .btn-primary {
                    background: #667eea;
                    color: white;
                    border: none;
                }
                
                .btn-secondary {
                    background: transparent;
                    color: #666;
                    border: 1px solid #ddd;
                }
            </style>
        `;
    }
    
    setupDialogEventListeners(dialog, error, diagnostic) {
        // Solution item clicks
        dialog.querySelectorAll('.solution-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const solution = error.solutions[index];
                this.applySolutionFromDialog(solution, diagnostic);
            });
        });
    }
    
    async applySolutionFromDialog(solution, diagnostic) {
        try {
            await solution.action();
            diagnostic.resolved = true;
            this.showSuccessMessage('Lösung erfolgreich angewendet!');
        } catch (error) {
            this.showErrorMessage('Lösung konnte nicht angewendet werden: ' + error.message);
        }
    }
    
    async applySolution(solutionType) {
        const solutions = {
            'switch_to_fsrcnn': async () => {
                if (window.UpscalerPlugin) {
                    await window.UpscalerPlugin.updateSettings({
                        aiModel: 'FSRCNN',
                        targetResolution: '1080p',
                        qualityLevel: 0.6
                    });
                }
            },
            
            'reduce_resolution': async () => {
                if (window.UpscalerPlugin) {
                    await window.UpscalerPlugin.updateSettings({
                        targetResolution: '1080p',
                        maxUpscaleFactor: 2.0
                    });
                }
            },
            
            'enable_software_rendering': async () => {
                if (window.UpscalerPlugin) {
                    await window.UpscalerPlugin.updateSettings({
                        hardwareAcceleration: false,
                        aiModel: 'FSRCNN' // CPU-friendly model
                    });
                }
            },
            
            'enable_adaptive_quality': async () => {
                if (window.UpscalerPlugin) {
                    await window.UpscalerPlugin.updateSettings({
                        adaptiveStreaming: true,
                        bandwidthAdaptation: true
                    });
                }
            }
        };
        
        const solution = solutions[solutionType];
        if (solution) {
            await solution();
        } else {
            throw new Error('Unknown solution type: ' + solutionType);
        }
    }
    
    showSuccessMessage(message) {
        // Create and show success notification
        const notification = document.createElement('div');
        notification.className = 'diagnostic-notification success';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }
    
    showErrorMessage(message) {
        // Create and show error notification
        const notification = document.createElement('div');
        notification.className = 'diagnostic-notification error';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }
    
    startPerformanceMonitoring() {
        // Monitor for common issues
        setInterval(() => {
            this.checkForIssues();
        }, 30000); // Check every 30 seconds
    }
    
    checkForIssues() {
        // Check for thermal throttling
        if (this.systemInfo.gpu.temperature > 85) {
            this.runDiagnostic('thermal_throttling', {
                currentTemp: this.systemInfo.gpu.temperature
            });
        }
        
        // Check bandwidth
        if (this.systemInfo.bandwidth < 5000000) { // 5 Mbps
            this.runDiagnostic('bandwidth_insufficient', {
                currentBandwidth: this.systemInfo.bandwidth
            });
        }
    }
    
    setupEventListeners() {
        // Listen for plugin errors
        window.addEventListener('upscaler-error', (event) => {
            this.runDiagnostic(event.detail.type, event.detail.data);
        });
        
        // Add diagnostic button to UI
        this.addDiagnosticButton();
    }
    
    addDiagnosticButton() {
        const button = document.createElement('button');
        button.textContent = '🔍 Diagnose';
        button.className = 'diagnostic-trigger';
        button.onclick = () => this.showDiagnosticCenter();
        
        // Add to player controls if available
        const playerControls = document.querySelector('.videoPlayerContainer') || document.body;
        playerControls.appendChild(button);
    }
    
    showDiagnosticCenter() {
        // Show comprehensive diagnostic interface
        console.log('Opening diagnostic center...');
        
        // TODO: Implement full diagnostic center UI
        this.runSystemDiagnostic();
    }
    
    async runSystemDiagnostic() {
        console.log('Running full system diagnostic...');
        
        const results = {
            gpu: this.systemInfo.gpu.memory < 2048 ? 'insufficient_vram' : 'ok',
            bandwidth: this.systemInfo.bandwidth < 10000000 ? 'bandwidth_insufficient' : 'ok',
            platform: this.systemInfo.platform === 'mobile' ? 'mobile_optimization_needed' : 'ok'
        };
        
        // Show first detected issue
        for (const [category, result] of Object.entries(results)) {
            if (result !== 'ok') {
                this.runDiagnostic(result);
                break;
            }
        }
        
        if (Object.values(results).every(r => r === 'ok')) {
            this.showSuccessMessage('System läuft optimal! 🎉');
        }
    }
}

// Initialize diagnostics when the page loads
if (typeof window !== 'undefined') {
    window.UpscalerDiagnostics = new UpscalerDiagnostics();
    
    // Expose for testing
    window.runDiagnostic = (type) => window.UpscalerDiagnostics.runDiagnostic(type);
}