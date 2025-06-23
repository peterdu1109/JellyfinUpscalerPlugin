import * as tf from "@tensorflow/tfjs";

async function runBenchmarkTest() {
    console.log("Starting Enhanced Benchmark Test...");

    const testImages = [
        "test_image1.jpg",
        "test_image2.jpg",
        "test_image3.jpg"
    ];

    let totalDuration = 0;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 128;
    canvas.height = 128;

    try {
        // Load the AI model
        const model = await tf.loadGraphModel('./shaders/ESRGAN/model.json');

        for (let imageUrl of testImages) {
            const testImage = new Image();
            testImage.src = imageUrl;

            // Wait for the image to load
            await new Promise((resolve, reject) => {
                testImage.onload = resolve;
                testImage.onerror = () => reject(`Failed to load image: ${imageUrl}`);
            });

            // Prepare the input tensor
            ctx.drawImage(testImage, 0, 0, canvas.width, canvas.height);
            const inputTensor = tf.browser.fromPixels(canvas);

            // Measure the processing time
            const start = performance.now();
            const outputTensor = model.execute(inputTensor);
            await tf.browser.toPixels(outputTensor, canvas);
            const end = performance.now();

            const duration = end - start;
            console.log(`Processed ${imageUrl} in ${duration.toFixed(2)} ms.`);
            totalDuration += duration;
        }

        const averageDuration = totalDuration / testImages.length;
        console.log(`Average processing time per frame: ${averageDuration.toFixed(2)} ms.`);

        // Analyze the result
        if (averageDuration < 500) {
            alert("Benchmark Result: Your device is suitable for AI-Upscaling.");
            saveBenchmarkResult(true);
        } else {
            alert("Benchmark Result: Your device is not suitable for AI-Upscaling.");
            saveBenchmarkResult(false);
        }
    } catch (error) {
        console.error("Error during benchmark test:", error);
        alert("Benchmark Test Failed: Check console for details.");
    }
}

function saveBenchmarkResult(isSuitable) {
    localStorage.setItem("aiUpscalingEnabled", isSuitable ? "true" : "false");
    console.log(`Benchmark result saved: AI-Upscaling enabled = ${isSuitable}`);
}

// Main upscaling class
class JellyfinUpscaler {
    constructor() {
        this.settings = this.loadSettings();
        this.models = {};
        this.isInitialized = false;
    }

    loadSettings() {
        const defaultSettings = {
            selectedProfile: 'Default',
            enableBenchmark: true,
            customSettings: {
                enableFPSRule: false,
                maxFPSForAI: 'Unlimited',
                minResolutionForAI: '1080p',
                maxResolutionForAI: '4320p',
                defaultShaderBelowMinResolution: 'Bicubic',
                defaultShaderAboveMaxResolution: 'Lanczos',
                sharpness: 2,
                saturation: 1,
                contrast: 1.0,
                denoising: 1
            }
        };

        const savedSettings = localStorage.getItem('jellyfinUpscalerSettings');
        return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('jellyfinUpscalerSettings', JSON.stringify(this.settings));
    }

    async initialize() {
        try {
            console.log('Initializing Jellyfin Upscaler...');
            
            // Load models based on profile
            await this.loadModels();
            
            // Apply settings to video player
            this.applyVideoEnhancements();
            
            this.isInitialized = true;
            console.log('Jellyfin Upscaler initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Jellyfin Upscaler:', error);
        }
    }

    async loadModels() {
        const profile = this.settings.selectedProfile;
        
        try {
            if (profile === 'Anime' || profile === 'Default') {
                this.models.waifu2x = await tf.loadGraphModel('./shaders/Waifu2x/model.json');
                console.log('Waifu2x model loaded');
            }
            
            if (profile === 'Movies' || profile === 'Default') {
                this.models.esrgan = await tf.loadGraphModel('./shaders/ESRGAN/model.json');
                console.log('ESRGAN model loaded');
            }
        } catch (error) {
            console.warn('Could not load AI models, falling back to traditional shaders:', error);
        }
    }

    getOptimalModel(videoInfo) {
        const { width, height, fps, contentType } = videoInfo;
        const profile = this.settings.selectedProfile;
        
        // Check if AI upscaling is enabled and suitable
        const aiEnabled = localStorage.getItem("aiUpscalingEnabled") === "true";
        if (!aiEnabled) {
            return this.getTraditionalShader(width, height);
        }

        // Profile-specific model selection
        switch (profile) {
            case 'Anime':
                return this.models.waifu2x ? 'waifu2x' : this.getTraditionalShader(width, height);
            case 'Movies':
                return this.models.esrgan ? 'esrgan' : this.getTraditionalShader(width, height);
            case 'Default':
                // Auto-detect based on content
                if (contentType && contentType.includes('anime')) {
                    return this.models.waifu2x ? 'waifu2x' : this.getTraditionalShader(width, height);
                } else {
                    return this.models.esrgan ? 'esrgan' : this.getTraditionalShader(width, height);
                }
            case 'TV Shows':
                return this.getTraditionalShader(width, height);
            case 'Custom':
                return this.getCustomModel(width, height, fps);
            default:
                return this.getTraditionalShader(width, height);
        }
    }

    getTraditionalShader(width, height) {
        const settings = this.settings.customSettings;
        const minRes = this.parseResolution(settings.minResolutionForAI);
        const maxRes = this.parseResolution(settings.maxResolutionForAI);
        const currentRes = width * height;

        if (currentRes < minRes) {
            return settings.defaultShaderBelowMinResolution.toLowerCase();
        } else if (currentRes > maxRes) {
            return settings.defaultShaderAboveMaxResolution.toLowerCase();
        } else {
            return 'bicubic'; // Default shader
        }
    }

    getCustomModel(width, height, fps) {
        const settings = this.settings.customSettings;
        
        // Check FPS rules
        if (settings.enableFPSRule) {
            const maxFPS = this.parseMaxFPS(settings.maxFPSForAI);
            if (maxFPS > 0 && fps > maxFPS) {
                return this.getTraditionalShader(width, height);
            }
        }

        // Check resolution rules
        const minRes = this.parseResolution(settings.minResolutionForAI);
        const maxRes = this.parseResolution(settings.maxResolutionForAI);
        const currentRes = width * height;

        if (currentRes >= minRes && currentRes <= maxRes) {
            // Use AI model if available
            return this.models.esrgan ? 'esrgan' : this.getTraditionalShader(width, height);
        } else {
            return this.getTraditionalShader(width, height);
        }
    }

    parseResolution(resolutionString) {
        const resolutions = {
            '480p': 640 * 480,
            '720p': 1280 * 720,
            '1080p': 1920 * 1080,
            '1440p': 2560 * 1440,
            '2160p': 3840 * 2160,
            '4320p': 7680 * 4320
        };
        return resolutions[resolutionString] || resolutions['1080p'];
    }

    parseMaxFPS(fpsString) {
        const fpsMap = {
            'Unlimited': 0,
            '30 FPS': 30,
            '60 FPS': 60,
            '120 FPS': 120
        };
        return fpsMap[fpsString] || 0;
    }

    applyVideoEnhancements() {
        // Hook into Jellyfin's video player
        const videoElement = document.querySelector('video');
        if (videoElement) {
            this.enhanceVideoElement(videoElement);
        }

        // Monitor for new video elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'VIDEO') {
                        this.enhanceVideoElement(node);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    enhanceVideoElement(videoElement) {
        console.log('Enhancing video element:', videoElement);
        
        // Get video information
        const videoInfo = {
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
            fps: this.estimateFPS(videoElement),
            contentType: this.detectContentType(videoElement)
        };

        // Apply appropriate enhancement
        const model = this.getOptimalModel(videoInfo);
        this.applyEnhancement(videoElement, model);
    }

    estimateFPS(videoElement) {
        // Simple FPS estimation - can be improved
        return 24; // Default assumption
    }

    detectContentType(videoElement) {
        // Detect if content is anime based on various factors
        const src = videoElement.src || '';
        const title = document.title.toLowerCase();
        
        if (src.includes('anime') || title.includes('anime')) {
            return 'anime';
        }
        return 'movie';
    }

    applyEnhancement(videoElement, model) {
        const settings = this.settings.customSettings;
        
        // Apply CSS filters for basic enhancements
        let filterString = '';
        
        if (settings.sharpness > 0) {
            // Note: CSS doesn't have direct sharpness, but we can simulate with contrast
            filterString += `contrast(${1 + settings.sharpness * 0.1}) `;
        }
        
        if (settings.saturation !== 1) {
            filterString += `saturate(${settings.saturation}) `;
        }
        
        if (settings.contrast !== 1.0) {
            filterString += `contrast(${settings.contrast}) `;
        }
        
        videoElement.style.filter = filterString.trim();
        
        // For WebGL shaders, we would need a more complex implementation
        console.log(`Applied ${model} enhancement to video with settings:`, settings);
    }
}

// Initialize the upscaler when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const upscaler = new JellyfinUpscaler();
    upscaler.initialize();
    
    // Make it globally available
    window.jellyfinUpscaler = upscaler;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JellyfinUpscaler;
}
