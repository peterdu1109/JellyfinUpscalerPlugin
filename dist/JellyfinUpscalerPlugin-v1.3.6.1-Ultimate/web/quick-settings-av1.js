// JellyfinUpscalerPlugin v1.3.5 - REAL Jellyfin Player Integration  
// Hardware-accelerated AV1 processing with live video enhancement

(function() {
    'use strict';
    
    console.log('🚀 AI Upscaler v1.3.5 - Starting real Jellyfin integration...');
    
    // Jellyfin API integration
    let apiClient = null;
    let playbackManager = null;
    let currentPlayer = null;
    let mediaInfo = null;
    let quickSettingsMenu = null;
    
    // Enhanced settings with hardware detection
    let currentSettings = {
        profile: 'auto',
        resolution: 'auto',
        sharpness: 50,
        av1Transcode: 'auto',
        hdrMode: 'auto',
        audioMode: 'passthrough',
        enabled: false,
        hardwareAccel: true,
        batteryMode: false
    };
    
    // Hardware profile cache
    let hardwareProfile = {
        supportsAV1: false,
        gpuVendor: 'unknown',
        gpuModel: 'unknown',
        maxResolution: '1080p',
        encoder: 'software'
    };
    
    // Enhanced CSS with AV1 theming
    const quickSettingsCSS = `
        .quick-settings-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .quick-settings-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 12px;
            padding: 12px 16px;
            color: white;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .quick-settings-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        
        .quick-settings-btn.active {
            background: linear-gradient(135deg, #00C851 0%, #007E33 100%);
            animation: pulse-av1 2s infinite;
        }
        
        @keyframes pulse-av1 {
            0% { box-shadow: 0 0 0 0 rgba(0, 200, 81, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(0, 200, 81, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 200, 81, 0); }
        }
        
        .quick-settings-menu {
            position: absolute;
            top: 60px;
            right: 0;
            background: rgba(25, 25, 25, 0.98);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 24px;
            min-width: 400px;
            max-width: 450px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            transform: translateY(-10px);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .quick-settings-menu.visible {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .settings-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .settings-title {
            color: #fff;
            font-size: 18px;
            font-weight: 700;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .av1-badge {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .settings-close {
            background: none;
            border: none;
            color: #999;
            font-size: 24px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: color 0.3s ease;
        }
        
        .settings-close:hover {
            color: #fff;
        }
        
        .settings-group {
            margin-bottom: 20px;
        }
        
        .settings-group-title {
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .settings-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding: 12px;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            transition: background 0.3s ease;
        }
        
        .settings-row:hover {
            background: rgba(255,255,255,0.08);
        }
        
        .settings-label {
            color: #fff;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .settings-control {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .settings-select {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            color: #fff;
            padding: 8px 12px;
            font-size: 13px;
            min-width: 140px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .settings-select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .settings-select option {
            background: #333;
            color: #fff;
        }
        
        .settings-toggle {
            width: 56px;
            height: 32px;
            background: rgba(255,255,255,0.2);
            border-radius: 16px;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .settings-toggle.active {
            background: linear-gradient(135deg, #00C851, #007E33);
        }
        
        .settings-toggle-knob {
            width: 28px;
            height: 28px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .settings-toggle.active .settings-toggle-knob {
            transform: translateX(24px);
        }
        
        .settings-slider {
            width: 120px;
            height: 4px;
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
            outline: none;
            cursor: pointer;
            -webkit-appearance: none;
        }
        
        .settings-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .settings-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .preset-buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-top: 16px;
        }
        
        .preset-btn {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            color: #fff;
            padding: 10px 16px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        
        .preset-btn:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-1px);
        }
        
        .preset-btn.active {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-color: #667eea;
        }
        
        .status-display {
            margin-top: 20px;
            padding: 16px;
            background: rgba(0,200,81,0.1);
            border: 1px solid rgba(0,200,81,0.3);
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .status-display.warning {
            background: rgba(255,193,7,0.1);
            border-color: rgba(255,193,7,0.3);
        }
        
        .status-display.error {
            background: rgba(220,53,69,0.1);
            border-color: rgba(220,53,69,0.3);
        }
        
        .status-icon {
            font-size: 16px;
        }
        
        .status-text {
            color: #fff;
            font-size: 13px;
            line-height: 1.4;
            flex: 1;
        }
        
        .codec-indicator {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 6px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .codec-av1 { background: linear-gradient(135deg, #ff6b6b, #ee5a24); }
        .codec-hevc { background: linear-gradient(135deg, #4ecdc4, #44a08d); }
        .codec-h264 { background: linear-gradient(135deg, #667eea, #764ba2); }
    `;
    
    // Settings API communication
    async function loadSettings() {
        try {
            const response = await fetch('/JellyfinUpscalerPlugin/Settings');
            if (response.ok) {
                const settings = await response.json();
                Object.assign(currentSettings, settings);
                updateUI();
            }
        } catch (error) {
            console.error('Fehler beim Laden der Einstellungen:', error);
        }
    }
    
    async function saveSettings() {
        try {
            const response = await fetch('/JellyfinUpscalerPlugin/Settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentSettings)
            });
            
            if (response.ok) {
                showNotification('✅ Einstellungen gespeichert', 'success');
                updateStatus();
            } else {
                throw new Error('Server-Fehler');
            }
        } catch (error) {
            showNotification('❌ Fehler beim Speichern', 'error');
            console.error('Fehler beim Speichern:', error);
        }
    }
    
    // Create the quick settings UI
    function createQuickSettings() {
        const container = document.createElement('div');
        container.className = 'quick-settings-container';
        
        container.innerHTML = `
            <button class="quick-settings-btn" id="quick-settings-toggle">
                <span>⚙️</span>
                <span>Quick Settings</span>
                <span class="av1-badge">AV1</span>
            </button>
            
            <div class="quick-settings-menu" id="quick-settings-menu">
                <div class="settings-header">
                    <h3 class="settings-title">
                        🚀 AI Upscaler v1.3.5
                        <span class="av1-badge">AV1 Ready</span>
                    </h3>
                    <button class="settings-close" id="settings-close">×</button>
                </div>
                
                <div class="settings-group">
                    <div class="settings-group-title">🎬 Profil & Qualität</div>
                    
                    <div class="settings-row">
                        <div class="settings-label">
                            <span>Profil:</span>
                        </div>
                        <div class="settings-control">
                            <select class="settings-select" id="profile-select">
                                <option value="default">🎯 Standard</option>
                                <option value="anime">🌸 Anime (Waifu2x)</option>
                                <option value="movies">🎬 Filme (ESRGAN)</option>
                                <option value="tv">📺 TV Shows</option>
                                <option value="av1-optimized">🔥 AV1 Optimiert</option>  
                            </select>
                        </div>
                    </div>
                    
                    <div class="settings-row">
                        <div class="settings-label">
                            <span>Auflösung:</span>
                        </div>
                        <div class="settings-control">
                            <select class="settings-select" id="resolution-select">
                                <option value="720p">🎥 720p (HD)</option>
                                <option value="1080p">🎬 1080p (Full HD)</option>
                                <option value="1440p">📺 1440p (2K)</option>
                                <option value="4k">🔥 4K (Ultra HD)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="settings-row">
                        <div class="settings-label">
                            <span>Schärfe:</span>
                            <span id="sharpness-value">50%</span>
                        </div>
                        <div class="settings-control">
                            <input type="range" class="settings-slider" id="sharpness-slider" 
                                   min="0" max="100" value="50">
                        </div>
                    </div>
                </div>
                
                <div class="settings-group">
                    <div class="settings-group-title">🔥 AV1 & Transcoding</div>
                    
                    <div class="settings-row">
                        <div class="settings-label">
                            <span>AV1 Transcoding:</span>
                        </div>
                        <div class="settings-control">
                            <select class="settings-select" id="av1-transcode">
                                <option value="auto">🤖 Auto (Direct Play bevorzugt)</option>
                                <option value="force-h264">📹 Zu H.264 transkodieren</option>
                                <option value="force-hevc">🎯 Zu HEVC transkodieren</option>
                                <option value="force-av1">🔥 Zu AV1 transkodieren</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="settings-row">
                        <div class="settings-label">
                            <span>HDR Modus:</span>
                        </div>
                        <div class="settings-control">
                            <select class="settings-select" id="hdr-mode">
                                <option value="auto">🌟 Auto</option>
                                <option value="hdr10">✨ HDR10</option>
                                <option value="dolby-vision">💎 Dolby Vision</option>
                                <option value="sdr">📺 SDR</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="settings-row">
                        <div class="settings-label">
                            <span>Audio Modus:</span>
                        </div>
                        <div class="settings-control">
                            <select class="settings-select" id="audio-mode">
                                <option value="passthrough">🎵 Passthrough</option>
                                <option value="stereo">🔊 Stereo</option>
                                <option value="5.1">🎧 5.1 Surround</option>
                                <option value="7.1">🎭 7.1 Surround</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="settings-group">
                    <div class="settings-group-title">⚡ Schnell-Presets</div>
                    <div class="preset-buttons">
                        <button class="preset-btn" data-preset="gaming">
                            🎮 Gaming
                        </button>
                        <button class="preset-btn" data-preset="apple">
                            🍎 Apple TV
                        </button>
                        <button class="preset-btn" data-preset="mobile">
                            📱 Mobile
                        </button>
                        <button class="preset-btn" data-preset="server">
                            🖥️ Server
                        </button>
                    </div>
                </div>
                
                <div class="settings-row">
                    <div class="settings-label">
                        <span>AI-Upscaling aktiviert:</span>
                    </div>
                    <div class="settings-control">
                        <div class="settings-toggle" id="upscaling-toggle">
                            <div class="settings-toggle-knob"></div>
                        </div>
                    </div>
                </div>
                
                <div class="status-display" id="status-display">
                    <div class="status-icon">✅</div>
                    <div class="status-text">Bereit für AI-Upscaling mit AV1-Unterstützung</div>
                </div>
            </div>
        `;
        
        return container;
    }
    
    // Event handlers
    function setupEventHandlers(container) {
        const toggleBtn = container.querySelector('#quick-settings-toggle');
        const menu = container.querySelector('#quick-settings-menu');
        const closeBtn = container.querySelector('#settings-close');
        const upscalingToggle = container.querySelector('#upscaling-toggle');
        const sharpnessSlider = container.querySelector('#sharpness-slider');
        const sharpnessValue = container.querySelector('#sharpness-value');
        
        // Toggle menu
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('visible');
        });
        
        // Close menu
        closeBtn.addEventListener('click', () => {
            menu.classList.remove('visible');
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                menu.classList.remove('visible');
            }
        });
        
        // Main toggle
        upscalingToggle.addEventListener('click', () => {
            currentSettings.enabled = !currentSettings.enabled;
            upscalingToggle.classList.toggle('active', currentSettings.enabled);
            toggleBtn.classList.toggle('active', currentSettings.enabled);
            updateStatus();
            saveSettings();
        });
        
        // Sharpness slider
        sharpnessSlider.addEventListener('input', (e) => {
            currentSettings.sharpness = parseInt(e.target.value);
            sharpnessValue.textContent = currentSettings.sharpness + '%';
            saveSettings();
        });
        
        // Select controls
        ['profile-select', 'resolution-select', 'av1-transcode', 'hdr-mode', 'audio-mode'].forEach(id => {
            const element = container.querySelector('#' + id);
            element.addEventListener('change', (e) => {
                const key = id.replace('-select', '').replace('-', '');
                currentSettings[key] = e.target.value;
                updateStatus();
                saveSettings();
            });
        });
        
        // Preset buttons
        container.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset;
                applyPreset(preset);
                
                // Update active state
                container.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
    
    // Apply presets
    function applyPreset(preset) {
        const presets = {
            gaming: {
                profile: 'av1-optimized',
                resolution: '4k',
                sharpness: 75,
                av1Transcode: 'force-av1',
                hdrMode: 'hdr10',
                audioMode: '7.1'
            },
            apple: {
                profile: 'movies',
                resolution: '4k',
                sharpness: 60,
                av1Transcode: 'auto',
                hdrMode: 'dolby-vision',
                audioMode: '5.1'
            },
            mobile: {
                profile: 'default',
                resolution: '1080p',
                sharpness: 40,
                av1Transcode: 'force-h264',
                hdrMode: 'sdr',
                audioMode: 'stereo'
            },
            server: {
                profile: 'tv',
                resolution: '1440p',
                sharpness: 50,
                av1Transcode: 'force-hevc',
                hdrMode: 'auto',
                audioMode: 'passthrough'
            }
        };
        
        if (presets[preset]) {
            Object.assign(currentSettings, presets[preset]);
            updateUI();
            updateStatus();
            saveSettings();
            showNotification(`🎯 ${preset.charAt(0).toUpperCase() + preset.slice(1)}-Preset angewendet`, 'success');
        }
    }
    
    // Update UI elements
    function updateUI() {
        const container = quickSettingsMenu;
        if (!container) return;
        
        container.querySelector('#profile-select').value = currentSettings.profile;
        container.querySelector('#resolution-select').value = currentSettings.resolution;
        container.querySelector('#sharpness-slider').value = currentSettings.sharpness;
        container.querySelector('#sharpness-value').textContent = currentSettings.sharpness + '%';
        container.querySelector('#av1-transcode').value = currentSettings.av1Transcode;
        container.querySelector('#hdr-mode').value = currentSettings.hdrMode;
        container.querySelector('#audio-mode').value = currentSettings.audioMode;
        
        const toggle = container.querySelector('#upscaling-toggle');
        const toggleBtn = container.querySelector('#quick-settings-toggle');
        toggle.classList.toggle('active', currentSettings.enabled);
        toggleBtn.classList.toggle('active', currentSettings.enabled);
    }
    
    // Update status display
    function updateStatus() {
        const statusDisplay = quickSettingsMenu?.querySelector('#status-display');
        if (!statusDisplay) return;
        
        const statusIcon = statusDisplay.querySelector('.status-icon');
        const statusText = statusDisplay.querySelector('.status-text');
        
        if (currentSettings.enabled) {
            statusDisplay.className = 'status-display';
            statusIcon.textContent = '✨';
            
            const codecIndicator = getCodecIndicator(currentSettings.av1Transcode);
            statusText.innerHTML = `
                AI-Upscaling aktiv: ${currentSettings.profile} → ${currentSettings.resolution}
                <br>
                <span class="codec-indicator ${codecIndicator.class}">${codecIndicator.text}</span>
                HDR: ${currentSettings.hdrMode.toUpperCase()}
            `;
        } else {
            statusDisplay.className = 'status-display warning';
            statusIcon.textContent = '⏸️';
            statusText.textContent = 'AI-Upscaling pausiert - Klicken Sie den Schalter zum Aktivieren';
        }
    }
    
    // Get codec indicator
    function getCodecIndicator(transcode) {
        const indicators = {
            'auto': { class: 'codec-av1', text: '🤖 AUTO' },
            'force-h264': { class: 'codec-h264', text: '📹 H.264' },
            'force-hevc': { class: 'codec-hevc', text: '🎯 HEVC' },
            'force-av1': { class: 'codec-av1', text: '🔥 AV1' }
        };
        return indicators[transcode] || indicators.auto;
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00C851' : type === 'error' ? '#dc3545' : '#667eea'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10001;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Inject CSS
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = quickSettingsCSS;
        document.head.appendChild(style);
    }
    
    // Initialize when video player is ready
    function initializeQuickSettings() {
        // Check if we're on a video page
        if (!window.location.pathname.includes('/video') && !document.querySelector('.videoPlayerContainer')) {
            return;
        }
        
        // Don't add multiple instances
        if (document.querySelector('.quick-settings-container')) {
            return;
        }
        
        console.log('🎬 Video-Player erkannt, Quick Settings werden initialisiert...');
        
        injectCSS();
        quickSettingsMenu = createQuickSettings();
        setupEventHandlers(quickSettingsMenu);
        document.body.appendChild(quickSettingsMenu);
        
        loadSettings();
        
        console.log('✅ Quick Settings v1.3.5 mit AV1-Unterstützung erfolgreich geladen');
    }
    
    // Watch for video player
    function watchForVideoPlayer() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    // Check if video player was added
                    const hasVideoPlayer = Array.from(mutation.addedNodes).some(node => 
                        node.nodeType === 1 && (
                            node.classList?.contains('videoPlayerContainer') ||
                            node.querySelector?.('.videoPlayerContainer')
                        )
                    );
                    
                    if (hasVideoPlayer) {
                        initializeJellyfinIntegration();
                        setTimeout(initializeQuickSettings, 1000);
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also try to initialize immediately if player exists
        if (document.querySelector('.videoPlayerContainer')) {
            initializeJellyfinIntegration();
            setTimeout(initializeQuickSettings, 500);
        }
    }
    
    /**
     * REAL JELLYFIN API INTEGRATION
     * Connect to actual Jellyfin playback manager and hardware detection
     */
    function initializeJellyfinIntegration() {
        try {
            // Get Jellyfin API client
            if (window.ApiClient) {
                apiClient = window.ApiClient;
                console.log('✅ Jellyfin API Client connected');
            }
            
            // Get playback manager
            if (window.playbackManager) {
                playbackManager = window.playbackManager;
                console.log('✅ Jellyfin Playback Manager connected');
                
                // Hook into playback events
                bindPlaybackEvents();
            }
            
            // Detect hardware capabilities
            detectHardwareCapabilities();
            
        } catch (error) {
            console.warn('⚠️ Jellyfin integration failed, using standalone mode:', error);
        }
    }
    
    /**
     * Bind to Jellyfin playback events
     */
    function bindPlaybackEvents() {
        if (!playbackManager) return;
        
        // Monitor playback start
        Events.on(playbackManager, 'playbackstart', (e, player) => {
            currentPlayer = player;
            mediaInfo = playbackManager.currentMediaInfo;
            
            console.log('🎬 Playback started:', mediaInfo);
            
            // Auto-detect optimal settings
            autoDetectOptimalSettings();
            
            // Apply upscaling if enabled
            if (currentSettings.enabled) {
                applyUpscalingToStream();
            }
        });
        
        // Monitor playback stop
        Events.on(playbackManager, 'playbackstop', () => {
            console.log('⏹️ Playback stopped');
            currentPlayer = null;
            mediaInfo = null;
        });
        
        // Monitor quality changes
        Events.on(playbackManager, 'qualitychange', (e, data) => {
            console.log('📊 Quality changed:', data);
            
            if (currentSettings.enabled) {
                // Reapply upscaling for new quality
                setTimeout(applyUpscalingToStream, 1000);
            }
        });
    }
    
    /**
     * Detect actual hardware capabilities via API
     */
    async function detectHardwareCapabilities() {
        try {
            console.log('🔍 Detecting hardware capabilities...');
            
            // Call our plugin's hardware detection API
            const response = await fetch(apiClient.serverAddress() + '/api/upscaler/hardware', {
                headers: {
                    'Authorization': `MediaBrowser Client="${apiClient.appName()}", Device="${apiClient.deviceName()}", DeviceId="${apiClient.deviceId()}", Version="${apiClient.appVersion()}", Token="${apiClient.accessToken()}"`
                }
            });
            
            if (response.ok) {
                hardwareProfile = await response.json();
                console.log('✅ Hardware profile loaded:', hardwareProfile);
                
                // Update UI based on capabilities
                updateHardwareUI();
            } else {
                console.warn('⚠️ Hardware detection API failed, using fallback');
                useFallbackHardwareProfile();
            }
        } catch (error) {
            console.warn('⚠️ Hardware detection failed:', error);
            useFallbackHardwareProfile();
        }
    }
    
    /**
     * Auto-detect optimal settings based on current media
     */
    function autoDetectOptimalSettings() {
        if (!mediaInfo) return;
        
        const mediaSource = mediaInfo.MediaSources?.[0];
        if (!mediaSource) return;
        
        console.log('🎯 Auto-detecting optimal settings for:', mediaSource);
        
        // Detect content type
        const isAnime = mediaInfo.Name?.toLowerCase().includes('anime') || 
                       mediaInfo.Genres?.some(g => g.toLowerCase().includes('anime'));
        const isMovie = mediaInfo.Type === 'Movie';
        const isLowRes = mediaSource.Width < 1280;
        
        // Apply content-specific optimizations
        if (isAnime) {
            currentSettings.sharpness = 65;
            currentSettings.profile = 'anime';
        } else if (isMovie) {
            currentSettings.sharpness = 55;
            currentSettings.profile = 'movies';
        }
        
        // Resolution-based optimization
        if (isLowRes && hardwareProfile.supportsAV1) {
            currentSettings.resolution = '1440p';
            currentSettings.av1Transcode = 'force-av1';
        }
        
        // Mobile optimization
        if (isMobileDevice()) {
            currentSettings.resolution = '1080p';
            currentSettings.av1Transcode = 'force-h264';
            currentSettings.batteryMode = true;
        }
        
        updateUI();
        console.log('🎯 Optimal settings applied:', currentSettings);
    }
    
    /**
     * Apply upscaling to current video stream
     */
    async function applyUpscalingToStream() {
        if (!currentPlayer || !mediaInfo) return;
        
        try {
            console.log('🚀 Applying upscaling to stream...');
            
            const upscaleRequest = {
                mediaSourceId: mediaInfo.MediaSourceId,
                itemId: mediaInfo.Id,
                settings: currentSettings,
                hardwareProfile: hardwareProfile
            };
            
            // Call plugin's upscaling API
            const response = await fetch(apiClient.serverAddress() + '/api/upscaler/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `MediaBrowser Client="${apiClient.appName()}", Device="${apiClient.deviceName()}", DeviceId="${apiClient.deviceId()}", Version="${apiClient.appVersion()}", Token="${apiClient.accessToken()}"`
                },
                body: JSON.stringify(upscaleRequest)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Upscaling applied successfully:', result);
                
                showNotification(`🚀 AI-Upscaling aktiviert (${result.method})`, 'success');
                
                // Update player if needed
                if (result.newStreamUrl) {
                    updatePlayerStream(result.newStreamUrl);
                }
            } else {
                throw new Error(`API error: ${response.status}`);
            }
            
        } catch (error) {
            console.error('❌ Failed to apply upscaling:', error);
            showNotification('❌ Upscaling-Fehler: ' + error.message, 'error');
        }
    }
    
    /**
     * Update hardware-dependent UI elements
     */
    function updateHardwareUI() {
        const menu = quickSettingsMenu;
        if (!menu) return;
        
        // Show AV1 options only if supported
        const av1Select = menu.querySelector('#av1-transcode');
        if (av1Select) {
            const av1Option = av1Select.querySelector('option[value="force-av1"]');
            if (av1Option) {
                av1Option.style.display = hardwareProfile.supportsAV1 ? 'block' : 'none';
                av1Option.textContent = hardwareProfile.supportsAV1 ? 
                    `🔥 AV1 (${hardwareProfile.encoder})` : '🔥 AV1 (nicht verfügbar)';
            }
        }
        
        // Update hardware info display
        const hardwareInfo = menu.querySelector('.hardware-info');
        if (hardwareInfo) {
            hardwareInfo.innerHTML = `
                <strong>Hardware:</strong> ${hardwareProfile.gpuVendor} ${hardwareProfile.gpuModel}<br>
                <strong>AV1:</strong> ${hardwareProfile.supportsAV1 ? '✅ Unterstützt' : '❌ Nicht verfügbar'}<br>
                <strong>Max. Auflösung:</strong> ${hardwareProfile.maxResolution}
            `;
        }
    }
    
    /**
     * Fallback hardware profile for unknown systems
     */
    function useFallbackHardwareProfile() {
        hardwareProfile = {
            supportsAV1: false,
            gpuVendor: 'Unknown',
            gpuModel: 'Generic GPU',
            maxResolution: '1080p',
            encoder: 'software'
        };
        
        console.log('📱 Using fallback hardware profile');
    }
    
    /**
     * Detect if running on mobile device
     */
    function isMobileDevice() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth < 768;
    }
    
    /**
     * Update player with new stream URL
     */
    function updatePlayerStream(newStreamUrl) {
        if (currentPlayer && currentPlayer.setSource) {
            currentPlayer.setSource(newStreamUrl);
            console.log('🔄 Player stream updated');
        }
    }
    
    // Start watching when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', watchForVideoPlayer);
    } else {
        watchForVideoPlayer();
    }
    
    // Also try on page changes (for SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initializeQuickSettings, 1000);
        }
    }).observe(document, { subtree: true, childList: true });
    
})();