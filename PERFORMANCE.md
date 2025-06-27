# Performance Optimization Guide

## Overview

The Jellyfin Upscaler Plugin can be resource-intensive, especially when using AI models. This guide provides comprehensive optimization strategies for different hardware configurations and use cases.

## Hardware-Specific Optimizations

### NVIDIA GPUs

#### RTX 4000 Series (Optimal Performance)
```javascript
// Recommended settings for RTX 4080/4090
const nvidiaRTX4000Settings = {
    selectedProfile: "Movies",
    customSettings: {
        maxFPSForAI: "120 FPS",
        minResolutionForAI: "480p",
        maxResolutionForAI: "4320p", // 8K support
        sharpness: 3,
        saturation: 1.3,
        contrast: 1.2,
        denoising: 2
    }
};
```

#### RTX 3000 Series (High Performance)
```javascript
// Recommended settings for RTX 3070/3080/3090
const nvidiaRTX3000Settings = {
    selectedProfile: "Custom",
    customSettings: {
        maxFPSForAI: "60 FPS",
        minResolutionForAI: "720p",
        maxResolutionForAI: "2160p", // 4K limit
        sharpness: 2,
        saturation: 1.2,
        contrast: 1.1,
        denoising: 1
    }
};
```

#### RTX 2000/GTX 1600 Series (Balanced)
```javascript
// Recommended settings for RTX 2060/GTX 1660
const nvidiaRTX2000Settings = {
    selectedProfile: "TV Shows",
    customSettings: {
        maxFPSForAI: "30 FPS",
        minResolutionForAI: "1080p",
        maxResolutionForAI: "1080p", // 1080p limit
        defaultShaderBelowMinResolution: "Bicubic",
        defaultShaderAboveMaxResolution: "Lanczos",
        sharpness: 1,
        saturation: 1.0,
        contrast: 1.0,
        denoising: 0
    }
};
```

### AMD GPUs

#### RX 7000 Series (High Performance)
```javascript
const amdRX7000Settings = {
    selectedProfile: "Movies",
    customSettings: {
        maxFPSForAI: "60 FPS",
        minResolutionForAI: "720p",
        maxResolutionForAI: "2160p",
        sharpness: 2,
        saturation: 1.1,
        contrast: 1.1,
        denoising: 1
    }
};
```

#### RX 6000/5000 Series (Balanced)
```javascript
const amdRX6000Settings = {
    selectedProfile: "Default",
    customSettings: {
        maxFPSForAI: "30 FPS",
        minResolutionForAI: "1080p",
        maxResolutionForAI: "1440p",
        defaultShaderBelowMinResolution: "Bicubic",
        sharpness: 1,
        saturation: 1.0,
        contrast: 1.0,
        denoising: 0
    }
};
```

### Intel GPUs (Arc Series)

#### Arc A770/A750 (Moderate Performance)
```javascript
const intelArcSettings = {
    selectedProfile: "TV Shows",
    customSettings: {
        maxFPSForAI: "30 FPS",
        minResolutionForAI: "1080p",
        maxResolutionForAI: "1080p",
        defaultShaderBelowMinResolution: "Bilinear",
        defaultShaderAboveMaxResolution: "Bicubic",
        sharpness: 1,
        saturation: 1.0,
        contrast: 1.0,
        denoising: 0
    }
};
```

## CPU Optimization

### High-End CPUs (i7/i9, Ryzen 7/9)
- **Thread allocation**: Reserve 2-4 cores for Jellyfin
- **Process priority**: Set Jellyfin to "High" priority
- **Power management**: Use "High Performance" power plan

### Mid-Range CPUs (i5, Ryzen 5)
- **Background processes**: Minimize other applications
- **Thermal throttling**: Ensure adequate cooling
- **Memory allocation**: 16GB RAM recommended

### Budget CPUs (i3, Ryzen 3)
- **Traditional shaders only**: Disable AI upscaling
- **Lower resolution limits**: Max 1080p processing
- **Reduced quality settings**: Minimal enhancement

## Memory Management

### System RAM Optimization
```javascript
// Memory-conscious settings
const lowMemorySettings = {
    customSettings: {
        // Reduce memory usage
        maxFPSForAI: "30 FPS",
        minResolutionForAI: "1080p",
        maxResolutionForAI: "1080p",
        
        // Lighter processing
        sharpness: 1,
        denoising: 0,
        
        // Traditional shaders for high-res content
        defaultShaderAboveMaxResolution: "Bilinear"
    }
};
```

### VRAM Management
```javascript
// Monitor VRAM usage
function monitorVRAM() {
    if (tf && tf.memory) {
        const memInfo = tf.memory();
        console.log('VRAM Usage:', {
            numTensors: memInfo.numTensors,
            numBytes: memInfo.numBytes,
            numBytesInGPU: memInfo.numBytesInGPU
        });
        
        // Cleanup if VRAM usage is high
        if (memInfo.numBytesInGPU > 6 * 1024 * 1024 * 1024) { // 6GB threshold
            tf.dispose();
            console.log('VRAM cleanup performed');
        }
    }
}

// Run VRAM monitoring every 60 seconds
setInterval(monitorVRAM, 60000);
```

## Network Optimization

### Local Network Performance
```javascript
// Optimize for local playback
const localPlaybackSettings = {
    selectedProfile: "Movies", // Use best quality for local content
    customSettings: {
        maxFPSForAI: "60 FPS",
        minResolutionForAI: "480p",
        maxResolutionForAI: "2160p",
        sharpness: 3,
        saturation: 1.2,
        contrast: 1.1,
        denoising: 2
    }
};
```

### Remote Streaming Optimization
```javascript
// Optimize for remote clients
const remoteStreamingSettings = {
    selectedProfile: "TV Shows", // Lighter processing
    customSettings: {
        maxFPSForAI: "30 FPS",
        minResolutionForAI: "1080p",
        maxResolutionForAI: "1080p",
        sharpness: 1,
        saturation: 1.0,
        contrast: 1.0,
        denoising: 0
    }
};
```

## Adaptive Performance System

### Dynamic Quality Adjustment
```javascript
class AdaptivePerformanceManager {
    constructor() {
        this.performanceMetrics = {
            frameProcessingTime: [],
            memoryUsage: [],
            cpuUsage: []
        };
        this.currentQualityLevel = 'high';
    }

    measurePerformance(processingTime, memoryUsage) {
        this.performanceMetrics.frameProcessingTime.push(processingTime);
        this.performanceMetrics.memoryUsage.push(memoryUsage);
        
        // Keep only last 100 measurements
        if (this.performanceMetrics.frameProcessingTime.length > 100) {
            this.performanceMetrics.frameProcessingTime.shift();
            this.performanceMetrics.memoryUsage.shift();
        }
        
        this.adjustQuality();
    }

    adjustQuality() {
        const avgProcessingTime = this.getAverage(this.performanceMetrics.frameProcessingTime);
        const avgMemoryUsage = this.getAverage(this.performanceMetrics.memoryUsage);
        
        // Performance thresholds
        const highPerformanceThreshold = 100; // ms
        const mediumPerformanceThreshold = 300; // ms
        const memoryThreshold = 0.8; // 80% of available memory
        
        if (avgProcessingTime > mediumPerformanceThreshold || avgMemoryUsage > memoryThreshold) {
            this.downgradeQuality();
        } else if (avgProcessingTime < highPerformanceThreshold && avgMemoryUsage < 0.5) {
            this.upgradeQuality();
        }
    }

    downgradeQuality() {
        const currentSettings = window.jellyfinUpscaler.settings;
        
        switch (this.currentQualityLevel) {
            case 'high':
                // Reduce to medium quality
                currentSettings.customSettings.maxFPSForAI = "30 FPS";
                currentSettings.customSettings.sharpness = Math.max(1, currentSettings.customSettings.sharpness - 1);
                currentSettings.customSettings.denoising = Math.max(0, currentSettings.customSettings.denoising - 1);
                this.currentQualityLevel = 'medium';
                break;
                
            case 'medium':
                // Reduce to low quality
                currentSettings.selectedProfile = "TV Shows";
                currentSettings.customSettings.maxFPSForAI = "30 FPS";
                currentSettings.customSettings.sharpness = 0;
                currentSettings.customSettings.denoising = 0;
                this.currentQualityLevel = 'low';
                break;
                
            case 'low':
                // Already at minimum quality
                console.log('Already at minimum quality level');
                break;
        }
        
        window.jellyfinUpscaler.saveSettings();
        console.log(`Quality downgraded to: ${this.currentQualityLevel}`);
    }

    upgradeQuality() {
        // Only upgrade if we've been stable for a while
        if (this.performanceMetrics.frameProcessingTime.length < 50) return;
        
        const currentSettings = window.jellyfinUpscaler.settings;
        
        switch (this.currentQualityLevel) {
            case 'low':
                // Upgrade to medium quality
                currentSettings.selectedProfile = "Default";
                currentSettings.customSettings.maxFPSForAI = "30 FPS";
                currentSettings.customSettings.sharpness = 1;
                currentSettings.customSettings.denoising = 1;
                this.currentQualityLevel = 'medium';
                break;
                
            case 'medium':
                // Upgrade to high quality
                currentSettings.selectedProfile = "Movies";
                currentSettings.customSettings.maxFPSForAI = "60 FPS";
                currentSettings.customSettings.sharpness = 2;
                currentSettings.customSettings.denoising = 2;
                this.currentQualityLevel = 'high';
                break;
                
            case 'high':
                // Already at maximum quality
                console.log('Already at maximum quality level');
                break;
        }
        
        window.jellyfinUpscaler.saveSettings();
        console.log(`Quality upgraded to: ${this.currentQualityLevel}`);
    }

    getAverage(array) {
        return array.reduce((sum, value) => sum + value, 0) / array.length;
    }
}

// Initialize adaptive performance manager
const adaptiveManager = new AdaptivePerformanceManager();
```

## Benchmarking and Monitoring

### Performance Monitoring Dashboard
```javascript
class PerformanceMonitor {
    constructor() {
        this.isMonitoring = false;
        this.metricsInterval = null;
        this.metrics = {
            fps: 0,
            frameTime: 0,
            memoryUsage: 0,
            gpuUsage: 0
        };
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.metricsInterval = setInterval(() => {
            this.updateMetrics();
            this.displayMetrics();
        }, 1000);
    }

    stopMonitoring() {
        if (!this.isMonitoring) return;
        
        this.isMonitoring = false;
        clearInterval(this.metricsInterval);
        this.hideMetrics();
    }

    updateMetrics() {
        // Update FPS
        this.metrics.fps = this.calculateFPS();
        
        // Update memory usage
        if (tf && tf.memory) {
            const memInfo = tf.memory();
            this.metrics.memoryUsage = memInfo.numBytesInGPU / (1024 * 1024 * 1024); // GB
        }
        
        // Update frame processing time
        this.metrics.frameTime = this.getAverageFrameTime();
    }

    displayMetrics() {
        let metricsDiv = document.getElementById('upscaler-metrics');
        if (!metricsDiv) {
            metricsDiv = document.createElement('div');
            metricsDiv.id = 'upscaler-metrics';
            metricsDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 9999;
            `;
            document.body.appendChild(metricsDiv);
        }
        
        metricsDiv.innerHTML = `
            <div>Upscaler Performance</div>
            <div>FPS: ${this.metrics.fps.toFixed(1)}</div>
            <div>Frame Time: ${this.metrics.frameTime.toFixed(1)}ms</div>
            <div>VRAM: ${this.metrics.memoryUsage.toFixed(2)}GB</div>
            <div>Profile: ${window.jellyfinUpscaler?.settings?.selectedProfile || 'N/A'}</div>
        `;
    }

    hideMetrics() {
        const metricsDiv = document.getElementById('upscaler-metrics');
        if (metricsDiv) {
            metricsDiv.remove();
        }
    }

    calculateFPS() {
        // Implementation depends on video element access
        return 30; // Placeholder
    }

    getAverageFrameTime() {
        // Implementation depends on performance measurement
        return 100; // Placeholder
    }
}

// Global performance monitor
window.performanceMonitor = new PerformanceMonitor();
```

## Troubleshooting Performance Issues

### Common Performance Problems

1. **High Frame Processing Time (>500ms)**
   - Reduce resolution limits
   - Switch to traditional shaders
   - Lower quality settings

2. **Memory Exhaustion**
   - Reduce batch size
   - Clear tensor memory regularly
   - Lower resolution processing

3. **GPU Utilization Issues**
   - Update GPU drivers
   - Check GPU temperature
   - Verify CUDA/OpenCL installation

4. **CPU Bottlenecks**
   - Reduce parallel processing
   - Lower thread count
   - Optimize system processes

### Performance Testing Script
```javascript
async function runPerformanceTest() {
    console.log('Starting performance test...');
    
    const testSizes = [
        { width: 1280, height: 720, name: '720p' },
        { width: 1920, height: 1080, name: '1080p' },
        { width: 2560, height: 1440, name: '1440p' },
        { width: 3840, height: 2160, name: '4K' }
    ];
    
    const results = {};
    
    for (const size of testSizes) {
        console.log(`Testing ${size.name}...`);
        
        const startTime = performance.now();
        
        // Simulate processing
        const canvas = document.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;
        const ctx = canvas.getContext('2d');
        
        // Fill with test pattern
        ctx.fillStyle = 'rgb(128, 128, 128)';
        ctx.fillRect(0, 0, size.width, size.height);
        
        // Measure processing time
        const processingTime = performance.now() - startTime;
        
        results[size.name] = {
            processingTime: processingTime,
            resolution: `${size.width}x${size.height}`,
            suitable: processingTime < 200 // 200ms threshold
        };
    }
    
    console.log('Performance test results:', results);
    return results;
}
```

## Best Practices Summary

1. **Start with conservative settings** and gradually increase quality
2. **Monitor system resources** during playback
3. **Use adaptive quality** for varying content types
4. **Regular maintenance**: Clear cache, update drivers
5. **Hardware-specific tuning**: Optimize for your GPU/CPU combination
6. **Network considerations**: Adjust for local vs remote playback
7. **Content-aware settings**: Different profiles for different content types

---

*This performance guide should be used alongside the main installation guide for optimal results.*