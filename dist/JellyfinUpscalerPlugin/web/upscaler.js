// Jellyfin Upscaler Plugin - Client-Side Integration
// Version: 1.1.0
// Description: Real-time video upscaling with AI and traditional shaders

(function(globalScope) {
    'use strict';
    
    // Plugin configuration
    const PLUGIN_CONFIG = {
        id: 'f87f700e-679d-43e6-9c7c-b3a410dc3f12',
        name: 'Jellyfin Upscaler',
        version: '1.1.0'
    };

    // Default settings
    const DEFAULT_SETTINGS = {
        selectedProfile: 'Default',
        maxFPSForAI: '60 FPS',
        minResolutionForAI: '720p',
        maxResolutionForAI: '2160p',
        sharpness: 2,
        saturation: 1.0,
        contrast: 1.0,
        denoising: 1,
        enableBenchmarkTest: false,
        adaptiveQuality: true,
        performanceMonitoring: false
    };

    // Main JellyfinUpscaler class
    class JellyfinUpscaler {
        constructor(config = {}) {
            this.config = Object.assign({}, DEFAULT_SETTINGS, config);
            this.isActive = false;
            this.videoElements = new WeakMap();
            this.performanceMetrics = {
                fps: 0,
                frameTime: 0,
                memoryUsage: 0
            };
            
            console.log('🚀 JellyfinUpscaler initialized with config:', this.config);
        }

        async initialize() {
            try {
                // Check browser capabilities
                if (!this.checkBrowserSupport()) {
                    console.warn('⚠️ Browser does not support required features');
                    return false;
                }

                // Load TensorFlow.js if needed for AI upscaling
                if (this.needsAI()) {
                    await this.loadTensorFlow();
                }

                // Initialize shader system
                await this.initializeShaders();

                // Start watching for video elements
                this.startVideoWatcher();

                // Initialize performance monitoring
                if (this.config.performanceMonitoring) {
                    this.startPerformanceMonitor();
                }

                this.isActive = true;
                console.log('✅ JellyfinUpscaler fully initialized');
                return true;

            } catch (error) {
                console.error('❌ Failed to initialize JellyfinUpscaler:', error);
                return false;
            }
        }

        checkBrowserSupport() {
            // Check for required APIs
            const required = [
                'requestAnimationFrame',
                'MediaSource',
                'HTMLCanvasElement'
            ];

            return required.every(api => api in window || api in HTMLCanvasElement.prototype);
        }

        needsAI() {
            return ['Default', 'Anime', 'Movies'].includes(this.config.selectedProfile);
        }

        async loadTensorFlow() {
            if (typeof tf !== 'undefined') {
                console.log('✅ TensorFlow.js already loaded');
                return;
            }

            try {
                // Try to load TensorFlow.js dynamically
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js';
                document.head.appendChild(script);

                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                });

                console.log('✅ TensorFlow.js loaded successfully');
            } catch (error) {
                console.warn('⚠️ Could not load TensorFlow.js, falling back to traditional shaders');
                this.config.selectedProfile = 'TV Shows'; // Fallback to shader-only
            }
        }

        async initializeShaders() {
            this.shaders = {
                bicubic: await this.loadShader('bicubic'),
                bilinear: await this.loadShader('bilinear'),
                lanczos: await this.loadShader('lanczos')
            };

            console.log('✅ Shaders loaded:', Object.keys(this.shaders));
        }

        async loadShader(type) {
            try {
                const response = await fetch(`/web/configurationpages/upscaler/shaders/${type}.glsl`);
                if (!response.ok) {
                    throw new Error(`Shader not found: ${type}`);
                }
                return await response.text();
            } catch (error) {
                console.warn(`⚠️ Could not load ${type} shader, using fallback`);
                return this.getFallbackShader();
            }
        }

        getFallbackShader() {
            return `
                precision mediump float;
                varying vec2 vTexCoord;
                uniform sampler2D uTexture;
                
                void main() {
                    gl_FragColor = texture2D(uTexture, vTexCoord);
                }
            `;
        }

        startVideoWatcher() {
            // Watch for video elements being added to the DOM
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const videos = node.tagName === 'VIDEO' ? [node] : node.querySelectorAll('video');
                            videos.forEach(video => this.enhanceVideo(video));
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Enhance existing videos
            document.querySelectorAll('video').forEach(video => this.enhanceVideo(video));

            console.log('👁️ Video watcher started');
        }

        enhanceVideo(videoElement) {
            if (this.videoElements.has(videoElement)) {
                return; // Already enhanced
            }

            console.log('🎬 Enhancing video element:', videoElement);

            // Mark as enhanced
            this.videoElements.set(videoElement, {
                enhanced: true,
                profile: this.config.selectedProfile,
                startTime: Date.now()
            });

            // Add enhancement overlay
            this.addEnhancementOverlay(videoElement);

            // Setup event listeners
            this.setupVideoEventListeners(videoElement);
        }

        addEnhancementOverlay(videoElement) {
            // Create canvas overlay for enhancement
            const canvas = document.createElement('canvas');
            canvas.className = 'upscaler-overlay';
            canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            `;

            // Insert canvas into video container
            const container = videoElement.parentElement;
            if (container) {
                container.style.position = 'relative';
                container.appendChild(canvas);

                // Setup WebGL context
                this.setupWebGLContext(canvas, videoElement);
            }
        }

        setupWebGLContext(canvas, videoElement) {
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (!gl) {
                console.warn('⚠️ WebGL not supported, enhancement disabled');
                return;
            }

            // Store context for later use
            const videoData = this.videoElements.get(videoElement);
            videoData.gl = gl;
            videoData.canvas = canvas;

            console.log('✅ WebGL context created for video');
        }

        setupVideoEventListeners(videoElement) {
            videoElement.addEventListener('loadedmetadata', () => {
                this.onVideoLoaded(videoElement);
            });

            videoElement.addEventListener('play', () => {
                this.startEnhancement(videoElement);
            });

            videoElement.addEventListener('pause', () => {
                this.pauseEnhancement(videoElement);
            });

            videoElement.addEventListener('ended', () => {
                this.stopEnhancement(videoElement);
            });
        }

        onVideoLoaded(videoElement) {
            const videoData = this.videoElements.get(videoElement);
            if (!videoData) return;

            // Analyze video characteristics
            const analysis = this.analyzeVideo(videoElement);
            videoData.analysis = analysis;

            // Adjust settings based on analysis
            this.adjustSettingsForVideo(videoElement, analysis);

            console.log('📊 Video analysis complete:', analysis);
        }

        analyzeVideo(videoElement) {
            const width = videoElement.videoWidth;
            const height = videoElement.videoHeight;
            const duration = videoElement.duration;

            return {
                resolution: this.categorizeResolution(width, height),
                aspectRatio: width / height,
                duration: duration,
                isLiveStream: !isFinite(duration),
                framerate: this.estimateFramerate(videoElement)
            };
        }

        categorizeResolution(width, height) {
            if (height <= 480) return '480p';
            if (height <= 720) return '720p';
            if (height <= 1080) return '1080p';
            if (height <= 1440) return '1440p';
            if (height <= 2160) return '4K';
            return '8K+';
        }

        estimateFramerate(videoElement) {
            // Try to get framerate from video metadata
            if (videoElement.webkitVideoDecodedByteCount !== undefined) {
                // Chrome/Safari specific
                return 30; // Default estimation
            }
            return 24; // Common fallback
        }

        adjustSettingsForVideo(videoElement, analysis) {
            const videoData = this.videoElements.get(videoElement);
            
            // Adjust based on resolution
            if (this.shouldUseAI(analysis)) {
                videoData.enhancementType = 'ai';
                videoData.model = this.selectAIModel(analysis);
            } else {
                videoData.enhancementType = 'shader';
                videoData.shader = this.selectShader(analysis);
            }

            console.log(`🎯 Enhancement type: ${videoData.enhancementType}`);
        }

        shouldUseAI(analysis) {
            const minRes = this.config.minResolutionForAI;
            const maxRes = this.config.maxResolutionForAI;
            
            const resOrder = ['480p', '720p', '1080p', '1440p', '4K', '8K+'];
            const currentIndex = resOrder.indexOf(analysis.resolution);
            const minIndex = resOrder.indexOf(minRes);
            const maxIndex = resOrder.indexOf(maxRes);

            return currentIndex >= minIndex && currentIndex <= maxIndex;
        }

        selectAIModel(analysis) {
            switch (this.config.selectedProfile) {
                case 'Anime':
                    return 'waifu2x';
                case 'Movies':
                    return 'esrgan';
                default:
                    return analysis.resolution === '480p' ? 'waifu2x' : 'esrgan';
            }
        }

        selectShader(analysis) {
            switch (this.config.selectedProfile) {
                case 'TV Shows':
                    return 'bilinear';
                default:
                    return analysis.resolution === '480p' ? 'bicubic' : 'lanczos';
            }
        }

        startEnhancement(videoElement) {
            const videoData = this.videoElements.get(videoElement);
            if (!videoData || videoData.enhancing) return;

            videoData.enhancing = true;
            videoData.animationFrame = requestAnimationFrame(() => {
                this.processFrame(videoElement);
            });

            console.log('▶️ Enhancement started');
        }

        processFrame(videoElement) {
            const videoData = this.videoElements.get(videoElement);
            if (!videoData || !videoData.enhancing) return;

            try {
                // Measure performance
                const startTime = performance.now();

                // Apply enhancement based on type
                if (videoData.enhancementType === 'ai') {
                    this.processFrameWithAI(videoElement, videoData);
                } else {
                    this.processFrameWithShader(videoElement, videoData);
                }

                // Update performance metrics
                const endTime = performance.now();
                this.updatePerformanceMetrics(endTime - startTime);

                // Schedule next frame
                videoData.animationFrame = requestAnimationFrame(() => {
                    this.processFrame(videoElement);
                });

            } catch (error) {
                console.error('❌ Frame processing error:', error);
                this.pauseEnhancement(videoElement);
            }
        }

        processFrameWithShader(videoElement, videoData) {
            const { gl, canvas } = videoData;
            if (!gl || !canvas) return;

            // Update canvas size
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);

            // Render with shader enhancement
            // This is a simplified version - full implementation would involve
            // creating shader programs, textures, and rendering pipelines
            const ctx = canvas.getContext('2d');
            ctx.filter = this.getCanvasFilter(videoData.shader);
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        }

        getCanvasFilter(shaderType) {
            switch (shaderType) {
                case 'bicubic':
                    return 'contrast(110%) saturate(110%)';
                case 'lanczos':
                    return 'contrast(105%) saturate(105%) brightness(102%)';
                default:
                    return 'none';
            }
        }

        processFrameWithAI(videoElement, videoData) {
            // AI processing would be implemented here
            // For now, we'll use a shader fallback
            this.processFrameWithShader(videoElement, videoData);
        }

        pauseEnhancement(videoElement) {
            const videoData = this.videoElements.get(videoElement);
            if (!videoData) return;

            videoData.enhancing = false;
            if (videoData.animationFrame) {
                cancelAnimationFrame(videoData.animationFrame);
                delete videoData.animationFrame;
            }

            console.log('⏸️ Enhancement paused');
        }

        stopEnhancement(videoElement) {
            this.pauseEnhancement(videoElement);
            console.log('⏹️ Enhancement stopped');
        }

        updatePerformanceMetrics(frameTime) {
            this.performanceMetrics.frameTime = frameTime;
            this.performanceMetrics.fps = Math.round(1000 / frameTime);
            
            if (performance.memory) {
                this.performanceMetrics.memoryUsage = Math.round(
                    performance.memory.usedJSHeapSize / 1024 / 1024
                );
            }
        }

        startPerformanceMonitor() {
            setInterval(() => {
                if (this.config.performanceMonitoring) {
                    console.log('📊 Performance:', this.performanceMetrics);
                }
            }, 5000);
        }

        // Public API methods
        getPerformanceMetrics() {
            return this.performanceMetrics;
        }

        updateConfig(newConfig) {
            this.config = Object.assign(this.config, newConfig);
            console.log('⚙️ Configuration updated:', this.config);
        }

        destroy() {
            this.isActive = false;
            // Cleanup resources
            this.videoElements.clear();
            console.log('🗑️ JellyfinUpscaler destroyed');
        }
    }

    // Initialize when page loads
    function initializePlugin() {
        console.log('🔧 Initializing Jellyfin Upscaler Plugin...');
        
        // Wait for Jellyfin to be ready
        const waitForJellyfin = () => {
            if (typeof ApiClient !== 'undefined') {
                loadConfiguration();
            } else {
                setTimeout(waitForJellyfin, 100);
            }
        };

        waitForJellyfin();
    }

    function loadConfiguration() {
        const pluginId = PLUGIN_CONFIG.id;
        
        if (ApiClient.getPluginConfiguration) {
            ApiClient.getPluginConfiguration(pluginId)
                .then(config => {
                    console.log('✅ Configuration loaded:', config);
                    startUpscaler(config);
                })
                .catch(error => {
                    console.warn('⚠️ Could not load configuration:', error);
                    startUpscaler(DEFAULT_SETTINGS);
                });
        } else {
            startUpscaler(DEFAULT_SETTINGS);
        }
    }

    function startUpscaler(config) {
        const upscaler = new JellyfinUpscaler(config);
        upscaler.initialize().then(success => {
            if (success) {
                // Expose globally for debugging
                globalScope.JellyfinUpscaler = upscaler;
                console.log('🚀 Jellyfin Upscaler Plugin ready!');
            }
        });
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePlugin);
    } else {
        initializePlugin();
    }

})(window);