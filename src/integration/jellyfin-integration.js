/**
 * Jellyfin Integration Layer for AI Upscaler Plugin
 * Provides seamless integration with Jellyfin's native systems
 */

class JellyfinIntegration {
    constructor() {
        this.apiClient = window.ApiClient;
        this.currentUser = null;
        this.serverInfo = null;
        this.init();
    }

    async init() {
        await this.detectJellyfinEnvironment();
        await this.loadUserSettings();
        this.setupEventListeners();
        this.integrateWithVideoPlayer();
    }

    // 🔍 JELLYFIN ENVIRONMENT DETECTION
    async detectJellyfinEnvironment() {
        try {
            // Get Jellyfin server info
            this.serverInfo = await this.apiClient.getSystemInfo();
            
            // Get current user
            this.currentUser = await this.apiClient.getCurrentUser();
            
            // Detect Jellyfin version
            this.jellyfinVersion = this.serverInfo.Version;
            this.isCompatible = this.checkCompatibility();
            
            console.log('Jellyfin Environment:', {
                version: this.jellyfinVersion,
                compatible: this.isCompatible,
                user: this.currentUser?.Name
            });
            
        } catch (error) {
            console.warn('Failed to detect Jellyfin environment:', error);
            this.fallbackMode = true;
        }
    }

    checkCompatibility() {
        const minVersion = '10.10.3';
        const currentVersion = this.jellyfinVersion;
        
        return this.compareVersions(currentVersion, minVersion) >= 0;
    }

    compareVersions(version1, version2) {
        const v1parts = version1.split('.').map(Number);
        const v2parts = version2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
            const v1part = v1parts[i] || 0;
            const v2part = v2parts[i] || 0;
            
            if (v1part > v2part) return 1;
            if (v1part < v2part) return -1;
        }
        return 0;
    }

    // 🌐 LANGUAGE INTEGRATION
    detectJellyfinLanguage() {
        // Method 1: From user settings
        if (this.currentUser?.Configuration?.DisplayLanguage) {
            return this.currentUser.Configuration.DisplayLanguage.substring(0, 2);
        }
        
        // Method 2: From HTML document
        const htmlLang = document.documentElement.lang;
        if (htmlLang) {
            return htmlLang.substring(0, 2);
        }
        
        // Method 3: From Jellyfin's globalization
        if (window.Globalize && window.Globalize.culture) {
            return window.Globalize.culture().name.substring(0, 2);
        }
        
        // Method 4: From browser
        return navigator.language.substring(0, 2) || 'en';
    }

    async syncLanguageWithJellyfin() {
        const jellyfinLang = this.detectJellyfinLanguage();
        const supportedLanguages = ['en', 'de', 'fr', 'es', 'ja', 'ko', 'it', 'pt'];
        
        if (supportedLanguages.includes(jellyfinLang)) {
            await window.upscalerSettings?.changeLanguage(jellyfinLang);
        }
    }

    // 📊 USER PREFERENCES INTEGRATION
    async loadUserSettings() {
        try {
            // Get user-specific upscaler settings from Jellyfin
            const userConfig = await this.apiClient.getConfiguration();
            const pluginConfig = userConfig.PluginConfigurations?.find(
                p => p.Name === 'JellyfinUpscaler'
            );
            
            if (pluginConfig) {
                this.mergeUserSettings(pluginConfig.Configuration);
            }
            
        } catch (error) {
            console.warn('Failed to load user settings from Jellyfin:', error);
        }
    }

    async saveUserSettings(settings) {
        try {
            // Save settings to Jellyfin user configuration
            const userConfig = await this.apiClient.getConfiguration();
            
            let pluginConfig = userConfig.PluginConfigurations?.find(
                p => p.Name === 'JellyfinUpscaler'
            );
            
            if (!pluginConfig) {
                pluginConfig = {
                    Name: 'JellyfinUpscaler',
                    Configuration: {}
                };
                userConfig.PluginConfigurations = userConfig.PluginConfigurations || [];
                userConfig.PluginConfigurations.push(pluginConfig);
            }
            
            pluginConfig.Configuration = { ...pluginConfig.Configuration, ...settings };
            
            await this.apiClient.updateConfiguration(userConfig);
            
        } catch (error) {
            console.warn('Failed to save settings to Jellyfin:', error);
            // Fallback to localStorage
            localStorage.setItem('jellyfin-upscaler-settings', JSON.stringify(settings));
        }
    }

    // 🎬 VIDEO PLAYER INTEGRATION
    integrateWithVideoPlayer() {
        // Wait for video player to be ready
        this.waitForVideoPlayer().then(() => {
            this.addUpscalerControls();
            this.hookIntoVideoEvents();
        });
    }

    async waitForVideoPlayer() {
        return new Promise((resolve) => {
            const checkPlayer = () => {
                const videoElement = document.querySelector('video');
                const playerContainer = document.querySelector('.videoPlayerContainer');
                
                if (videoElement && playerContainer) {
                    resolve({ video: videoElement, container: playerContainer });
                } else {
                    setTimeout(checkPlayer, 100);
                }
            };
            checkPlayer();
        });
    }

    addUpscalerControls() {
        const controlsContainer = document.querySelector('.videoOsdBottom, .mediaButton');
        if (!controlsContainer) return;

        // Create upscaler button
        const upscalerButton = this.createUpscalerButton();
        
        // Insert button in appropriate position
        this.insertControlButton(controlsContainer, upscalerButton);
        
        // Create settings panel
        this.createSettingsPanel();
    }

    createUpscalerButton() {
        const button = document.createElement('button');
        button.className = 'paper-icon-button-light upscaler-control-button';
        button.title = 'AI Upscaler Settings';
        button.innerHTML = `
            <svg viewBox="0 0 24 24" style="width: 24px; height: 24px;">
                <path fill="currentColor" d="M12 2L13.09 8.26L19 7L14.74 12L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12L5 7L10.91 8.26L12 2Z"/>
            </svg>
            <span class="upscaler-button-text">🔥 AI Pro</span>
        `;
        
        button.addEventListener('click', () => {
            this.toggleSettingsPanel();
        });
        
        return button;
    }

    insertControlButton(container, button) {
        // Find appropriate position among other media buttons
        const mediaButtons = container.querySelectorAll('.mediaButton, .paper-icon-button-light');
        
        if (mediaButtons.length > 0) {
            // Insert before last button (usually fullscreen)
            const lastButton = mediaButtons[mediaButtons.length - 1];
            lastButton.parentNode.insertBefore(button, lastButton);
        } else {
            container.appendChild(button);
        }
    }

    createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'upscaler-settings-panel';
        panel.className = 'upscaler-settings-overlay';
        panel.style.display = 'none';
        
        panel.innerHTML = `
            <div class="upscaler-settings-content">
                <div class="upscaler-settings-header">
                    <h3>🔥 AI Video Upscaler</h3>
                    <button class="close-button">×</button>
                </div>
                <div id="upscaler-settings-container">
                    <!-- Settings content will be injected here -->
                </div>
            </div>
        `;
        
        // Add event listeners
        panel.querySelector('.close-button').addEventListener('click', () => {
            this.hideSettingsPanel();
        });
        
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                this.hideSettingsPanel();
            }
        });
        
        document.body.appendChild(panel);
    }

    // 🎮 VIDEO EVENT INTEGRATION
    hookIntoVideoEvents() {
        const video = document.querySelector('video');
        if (!video) return;

        // Listen for video events
        video.addEventListener('loadedmetadata', () => {
            this.onVideoLoaded(video);
        });

        video.addEventListener('play', () => {
            this.onVideoPlay(video);
        });

        video.addEventListener('pause', () => {
            this.onVideoPause(video);
        });

        video.addEventListener('ended', () => {
            this.onVideoEnded(video);
        });

        // Listen for quality changes
        this.observeVideoQuality(video);
    }

    onVideoLoaded(video) {
        const videoInfo = {
            resolution: `${video.videoWidth}x${video.videoHeight}`,
            duration: video.duration,
            currentSrc: video.currentSrc
        };
        
        console.log('Video loaded:', videoInfo);
        
        // Auto-detect content type and apply appropriate profile
        this.autoDetectAndApplyProfile(videoInfo);
    }

    onVideoPlay(video) {
        // Start performance monitoring
        this.startPerformanceMonitoring();
        
        // Apply upscaling if enabled
        if (this.isUpscalingEnabled()) {
            this.applyUpscaling(video);
        }
    }

    onVideoPause(video) {
        // Pause performance monitoring
        this.pausePerformanceMonitoring();
    }

    onVideoEnded(video) {
        // Stop performance monitoring
        this.stopPerformanceMonitoring();
        
        // Clean up upscaling resources
        this.cleanupUpscaling();
    }

    // 🤖 CONTENT DETECTION & AUTO-CONFIGURATION
    autoDetectAndApplyProfile(videoInfo) {
        // Get current media item info from Jellyfin
        const currentItem = this.getCurrentMediaItem();
        
        if (currentItem) {
            const contentType = this.detectContentType(currentItem, videoInfo);
            const profile = this.getOptimalProfile(contentType, videoInfo);
            
            this.applyProfile(profile);
        }
    }

    getCurrentMediaItem() {
        // Get current item from Jellyfin's playback manager
        if (window.playbackManager && window.playbackManager.currentItem) {
            return window.playbackManager.currentItem();
        }
        
        // Fallback: try to get from URL or other methods
        return this.extractMediaItemFromContext();
    }

    detectContentType(mediaItem, videoInfo) {
        // Check media item properties
        if (mediaItem.Type === 'Movie') {
            return 'movie';
        }
        
        if (mediaItem.Type === 'Episode') {
            // Check if it's anime based on genres or tags
            const genres = mediaItem.Genres || [];
            const tags = mediaItem.Tags || [];
            
            if (genres.includes('Anime') || tags.includes('anime')) {
                return 'anime';
            }
            return 'tv_show';
        }
        
        // Analyze video characteristics
        const aspectRatio = videoInfo.resolution ? 
            videoInfo.resolution.split('x').map(Number) : [16, 9];
        
        if (aspectRatio[0] / aspectRatio[1] > 2.0) {
            return 'movie'; // Widescreen format
        }
        
        return 'tv_show'; // Default
    }

    getOptimalProfile(contentType, videoInfo) {
        const profiles = {
            movie: {
                ai_method: 'real_esrgan',
                scale_factor: 2.5,
                hdr_enhancement: true,
                quality_priority: 'high'
            },
            anime: {
                ai_method: 'waifu2x',
                scale_factor: 2.0,
                saturation_boost: true,
                line_art_preserve: true
            },
            tv_show: {
                ai_method: 'fsr21',
                scale_factor: 2.0,
                performance_priority: 'balanced'
            }
        };
        
        return profiles[contentType] || profiles.tv_show;
    }

    // 📊 PERFORMANCE MONITORING INTEGRATION
    startPerformanceMonitoring() {
        if (this.performanceMonitor) return;
        
        this.performanceMonitor = setInterval(() => {
            this.collectPerformanceMetrics();
        }, 1000);
    }

    collectPerformanceMetrics() {
        const metrics = {
            timestamp: Date.now(),
            video: this.getVideoMetrics(),
            system: this.getSystemMetrics(),
            upscaling: this.getUpscalingMetrics()
        };
        
        this.updatePerformanceDisplay(metrics);
        this.checkPerformanceThresholds(metrics);
    }

    getVideoMetrics() {
        const video = document.querySelector('video');
        if (!video) return {};
        
        return {
            currentTime: video.currentTime,
            readyState: video.readyState,
            buffered: video.buffered.length > 0 ? 
                     video.buffered.end(video.buffered.length - 1) : 0,
            fps: this.calculateFPS(video)
        };
    }

    getSystemMetrics() {
        // Use Performance API to get system metrics
        const performance = window.performance;
        
        return {
            memory: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null,
            timing: performance.timing,
            navigation: performance.navigation
        };
    }

    getUpscalingMetrics() {
        // Get metrics from upscaling engine
        return {
            method: this.currentUpscalingMethod,
            scale_factor: this.currentScaleFactor,
            processing_time: this.lastProcessingTime,
            gpu_usage: this.estimatedGpuUsage
        };
    }

    // 🔄 JELLYFIN THEME INTEGRATION
    integrateWithJellyfinTheme() {
        // Listen for theme changes
        const observer = new MutationObserver(() => {
            this.adaptToTheme();
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'data-theme']
        });
        
        // Initial adaptation
        this.adaptToTheme();
    }

    adaptToTheme() {
        const isDarkTheme = document.documentElement.classList.contains('dark') ||
                           document.documentElement.dataset.theme === 'dark';
        
        const upscalerElements = document.querySelectorAll('.upscaler-settings-panel, .upscaler-control-button');
        
        upscalerElements.forEach(element => {
            if (isDarkTheme) {
                element.classList.add('dark-theme');
                element.classList.remove('light-theme');
            } else {
                element.classList.add('light-theme');
                element.classList.remove('dark-theme');
            }
        });
        
        // Update CSS custom properties to match Jellyfin theme
        this.updateThemeVariables(isDarkTheme);
    }

    updateThemeVariables(isDark) {
        const root = document.documentElement;
        
        if (isDark) {
            root.style.setProperty('--upscaler-bg-color', '#181818');
            root.style.setProperty('--upscaler-text-color', '#ffffff');
            root.style.setProperty('--upscaler-accent-color', '#00a4dc');
        } else {
            root.style.setProperty('--upscaler-bg-color', '#ffffff');
            root.style.setProperty('--upscaler-text-color', '#000000');
            root.style.setProperty('--upscaler-accent-color', '#0066cc');
        }
    }

    // 🎛️ SETTINGS PANEL MANAGEMENT
    toggleSettingsPanel() {
        const panel = document.getElementById('upscaler-settings-panel');
        if (!panel) return;
        
        if (panel.style.display === 'none') {
            this.showSettingsPanel();
        } else {
            this.hideSettingsPanel();
        }
    }

    showSettingsPanel() {
        const panel = document.getElementById('upscaler-settings-panel');
        if (!panel) return;
        
        panel.style.display = 'flex';
        panel.classList.add('show');
        
        // Pause video when settings are opened
        const video = document.querySelector('video');
        if (video && !video.paused) {
            video.pause();
            this.videoPausedBySettings = true;
        }
        
        // Initialize settings content if not already done
        if (!window.upscalerSettings) {
            window.upscalerSettings = new AdvancedUpscalerSettings();
        }
    }

    hideSettingsPanel() {
        const panel = document.getElementById('upscaler-settings-panel');
        if (!panel) return;
        
        panel.classList.remove('show');
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);
        
        // Resume video if it was paused by settings
        if (this.videoPausedBySettings) {
            const video = document.querySelector('video');
            if (video) {
                video.play();
            }
            this.videoPausedBySettings = false;
        }
    }

    // 🔌 EVENT LISTENERS SETUP
    setupEventListeners() {
        // Listen for Jellyfin navigation events
        window.addEventListener('popstate', () => {
            this.onNavigationChange();
        });
        
        // Listen for language changes
        document.addEventListener('languagechange', () => {
            this.syncLanguageWithJellyfin();
        });
        
        // Listen for user changes (multi-user setups)
        if (this.apiClient) {
            this.apiClient.addEventListener('userchange', () => {
                this.onUserChange();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    handleKeyboardShortcuts(event) {
        // Ctrl+Shift+U: Toggle upscaler settings
        if (event.ctrlKey && event.shiftKey && event.key === 'U') {
            event.preventDefault();
            this.toggleSettingsPanel();
        }
        
        // Ctrl+Shift+P: Toggle performance monitor
        if (event.ctrlKey && event.shiftKey && event.key === 'P') {
            event.preventDefault();
            this.togglePerformanceMonitor();
        }
    }

    // 🔄 CLEANUP
    cleanup() {
        // Remove event listeners
        if (this.performanceMonitor) {
            clearInterval(this.performanceMonitor);
        }
        
        // Remove DOM elements
        const panel = document.getElementById('upscaler-settings-panel');
        if (panel) {
            panel.remove();
        }
        
        const button = document.querySelector('.upscaler-control-button');
        if (button) {
            button.remove();
        }
    }
}

// Initialize integration when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for Jellyfin to fully initialize
    setTimeout(() => {
        window.jellyfinUpscalerIntegration = new JellyfinIntegration();
    }, 1000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.jellyfinUpscalerIntegration) {
        window.jellyfinUpscalerIntegration.cleanup();
    }
});