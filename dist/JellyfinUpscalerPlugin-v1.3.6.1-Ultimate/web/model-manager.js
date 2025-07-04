/**
 * Model Manager for AI Upscaler Plugin v1.3.4
 * UI-based model download, management, and prioritization system
 */

class ModelManager {
    constructor() {
        this.models = new Map();
        this.downloadQueue = [];
        this.isDownloading = false;
        this.downloadProgress = new Map();
        this.modelPriority = [];
        this.totalCacheSize = 0;
        this.maxCacheSize = 10240; // MB
        
        // Available models configuration
        this.availableModels = [
            {
                id: 'realesrgan-v3',
                name: 'Real-ESRGAN v3.0',
                description: 'High-quality general upscaling',
                size: 47.2,
                category: 'general',
                recommended: true,
                url: 'https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesrgan-ncnn-vulkan-v0.2.5.0.zip',
                requirements: {
                    ram: 4,
                    gpu: false
                }
            },
            {
                id: 'esrgan-pro-v4',
                name: 'ESRGAN Pro v4.0',
                description: 'Professional photo upscaling',
                size: 156.8,
                category: 'photo',
                recommended: false,
                url: 'https://example.com/esrgan-pro-v4.zip',
                requirements: {
                    ram: 8,
                    gpu: true
                }
            },
            {
                id: 'swinir-ultra',
                name: 'SwinIR Ultra',
                description: 'Ultra-high quality for animations',
                size: 89.4,
                category: 'animation',
                recommended: false,
                url: 'https://example.com/swinir-ultra.zip',
                requirements: {
                    ram: 6,
                    gpu: true
                }
            },
            {
                id: 'srcnn-light',
                name: 'SRCNN Light',
                description: 'Fast processing for weak hardware',
                size: 12.1,
                category: 'light',
                recommended: true,
                url: 'https://example.com/srcnn-light.zip',
                requirements: {
                    ram: 2,
                    gpu: false
                }
            },
            {
                id: 'waifu2x-anime',
                name: 'Waifu2x Anime',
                description: 'Specialized for anime/cartoon content',
                size: 34.7,
                category: 'anime',
                recommended: false,
                url: 'https://example.com/waifu2x-anime.zip',
                requirements: {
                    ram: 4,
                    gpu: false
                }
            },
            {
                id: 'hat-next-gen',
                name: 'HAT Next-Gen',
                description: 'Latest hybrid attention transformer',
                size: 203.5,
                category: 'premium',
                recommended: false,
                url: 'https://example.com/hat-next-gen.zip',
                requirements: {
                    ram: 16,
                    gpu: true
                }
            }
        ];
    }

    /**
     * Initialize Model Manager
     */
    async initialize() {
        console.log('🤖 Model Manager initializing...');
        
        try {
            await this.loadInstalledModels();
            this.setupEventListeners();
            this.updateUI();
            this.checkAutoDownload();
            
            console.log('✅ Model Manager initialized successfully');
        } catch (error) {
            console.error('❌ Model Manager initialization failed:', error);
        }
    }

    /**
     * Load currently installed models
     */
    async loadInstalledModels() {
        try {
            // Simulate loading from server
            const installedModels = [
                'realesrgan-v3',
                'srcnn-light'
            ];
            
            installedModels.forEach(modelId => {
                const model = this.availableModels.find(m => m.id === modelId);
                if (model) {
                    this.models.set(modelId, {
                        ...model,
                        installed: true,
                        installDate: new Date(),
                        lastUsed: new Date()
                    });
                    this.totalCacheSize += model.size;
                }
            });
            
            console.log(`📦 Loaded ${this.models.size} installed models`);
        } catch (error) {
            console.error('Failed to load installed models:', error);
        }
    }

    /**
     * Check if auto-download is enabled and download recommended models
     */
    async checkAutoDownload() {
        const autoDownload = document.getElementById('chkAutoDownload')?.checked;
        
        if (autoDownload) {
            console.log('🔄 Auto-download enabled, checking recommended models...');
            
            const recommendedModels = this.availableModels.filter(m => 
                m.recommended && !this.models.has(m.id)
            );
            
            for (const model of recommendedModels) {
                if (this.canInstallModel(model)) {
                    await this.downloadModel(model.id, true);
                }
            }
        }
    }

    /**
     * Check if a model can be installed based on system requirements
     */
    canInstallModel(model) {
        const hardwareInfo = window.LightModeManager?.getHardwareInfo() || {};
        const ram = hardwareInfo.ram || 8;
        const hasGPU = hardwareInfo.gpu !== null;
        
        // Check cache size
        if (this.totalCacheSize + model.size > this.maxCacheSize) {
            console.warn(`❌ Not enough cache space for ${model.name}`);
            return false;
        }
        
        // Check requirements
        if (model.requirements.ram > ram) {
            console.warn(`❌ Insufficient RAM for ${model.name} (requires ${model.requirements.ram}GB)`);
            return false;
        }
        
        if (model.requirements.gpu && !hasGPU) {
            console.warn(`❌ GPU required for ${model.name}`);
            return false;
        }
        
        return true;
    }

    /**
     * Download a model
     */
    async downloadModel(modelId, isAutoDownload = false) {
        const model = this.availableModels.find(m => m.id === modelId);
        if (!model) {
            console.error(`Model ${modelId} not found`);
            return false;
        }

        if (this.models.has(modelId)) {
            console.log(`Model ${modelId} already installed`);
            return true;
        }

        if (!this.canInstallModel(model)) {
            return false;
        }

        // Add to download queue
        this.downloadQueue.push(model);
        this.updateDownloadButton(modelId, 'Queued...');
        
        if (!this.isDownloading) {
            await this.processDownloadQueue();
        }
        
        return true;
    }

    /**
     * Process download queue
     */
    async processDownloadQueue() {
        if (this.isDownloading || this.downloadQueue.length === 0) {
            return;
        }
        
        this.isDownloading = true;
        
        while (this.downloadQueue.length > 0) {
            const model = this.downloadQueue.shift();
            await this.performDownload(model);
        }
        
        this.isDownloading = false;
    }

    /**
     * Perform actual model download
     */
    async performDownload(model) {
        console.log(`⬇️ Downloading ${model.name}...`);
        
        try {
            this.updateDownloadButton(model.id, 'Downloading...', true);
            this.downloadProgress.set(model.id, 0);
            
            // Simulate download progress
            for (let progress = 0; progress <= 100; progress += 10) {
                await new Promise(resolve => setTimeout(resolve, 200));
                this.downloadProgress.set(model.id, progress);
                this.updateDownloadProgress(model.id, progress);
            }
            
            // Mark as installed
            this.models.set(model.id, {
                ...model,
                installed: true,
                installDate: new Date(),
                lastUsed: null
            });
            
            this.totalCacheSize += model.size;
            
            // Update UI
            this.updateModelItem(model.id);
            this.showDownloadSuccess(model.name);
            
            console.log(`✅ Successfully downloaded ${model.name}`);
            
        } catch (error) {
            console.error(`❌ Failed to download ${model.name}:`, error);
            this.showDownloadError(model.name);
            this.updateDownloadButton(model.id, 'Download');
        }
    }

    /**
     * Delete a model
     */
    async deleteModel(modelId) {
        if (!this.models.has(modelId)) {
            console.log(`Model ${modelId} not installed`);
            return false;
        }
        
        const model = this.models.get(modelId);
        
        // Show confirmation dialog
        const confirmed = await this.showDeleteConfirmation(model.name);
        if (!confirmed) {
            return false;
        }
        
        try {
            // Remove from installed models
            this.models.delete(modelId);
            this.totalCacheSize -= model.size;
            
            // Update UI
            this.updateModelItem(modelId);
            this.showDeleteSuccess(model.name);
            
            console.log(`🗑️ Successfully deleted ${model.name}`);
            return true;
            
        } catch (error) {
            console.error(`❌ Failed to delete ${model.name}:`, error);
            this.showDeleteError(model.name);
            return false;
        }
    }

    /**
     * Prioritize models based on usage
     */
    updateModelPriority() {
        const sortedModels = Array.from(this.models.values())
            .sort((a, b) => {
                // Sort by last used date
                if (!a.lastUsed && !b.lastUsed) return 0;
                if (!a.lastUsed) return 1;
                if (!b.lastUsed) return -1;
                return b.lastUsed.getTime() - a.lastUsed.getTime();
            });
        
        this.modelPriority = sortedModels.map(m => m.id);
    }

    /**
     * Clean up old models if cache is full
     */
    async cleanupCache() {
        if (this.totalCacheSize <= this.maxCacheSize) {
            return;
        }
        
        console.log('🧹 Cache cleanup required...');
        
        this.updateModelPriority();
        
        // Remove least recently used models
        for (let i = this.modelPriority.length - 1; i >= 0; i--) {
            const modelId = this.modelPriority[i];
            const model = this.models.get(modelId);
            
            if (model && !model.recommended) {
                await this.deleteModel(modelId);
                
                if (this.totalCacheSize <= this.maxCacheSize) {
                    break;
                }
            }
        }
    }

    /**
     * Update UI elements
     */
    updateUI() {
        const modelManager = document.getElementById('modelManager');
        if (!modelManager) return;
        
        // Clear existing items
        const existingItems = modelManager.querySelectorAll('.model-item');
        existingItems.forEach(item => item.remove());
        
        // Add header
        let html = '<h4 style="margin-top: 0; color: #2c3e50;">📦 Available AI Models</h4>';
        
        // Add cache info
        html += `
            <div style="
                background: linear-gradient(135deg, #e8f5e8, #f0fff4);
                border: 1px solid #27ae60;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 16px;
                font-size: 14px;
            ">
                <strong>Cache Usage:</strong> ${this.totalCacheSize.toFixed(1)} MB / ${this.maxCacheSize} MB
                <div style="
                    background: #ecf0f1;
                    border-radius: 4px;
                    height: 6px;
                    margin-top: 8px;
                    overflow: hidden;
                ">
                    <div style="
                        background: linear-gradient(90deg, #27ae60, #2ecc71);
                        height: 100%;
                        width: ${(this.totalCacheSize / this.maxCacheSize * 100).toFixed(1)}%;
                        transition: width 0.3s ease;
                    "></div>
                </div>
            </div>
        `;
        
        modelManager.innerHTML = html;
        
        // Add model items
        this.availableModels.forEach(model => {
            const modelItem = this.createModelItem(model);
            modelManager.appendChild(modelItem);
        });
    }

    /**
     * Create model item element
     */
    createModelItem(model) {
        const isInstalled = this.models.has(model.id);
        const canInstall = this.canInstallModel(model);
        
        const item = document.createElement('div');
        item.className = `model-item ${isInstalled ? 'downloaded' : ''}`;
        item.dataset.modelId = model.id;
        
        const categoryColor = {
            general: '#3498db',
            photo: '#9b59b6',
            animation: '#e74c3c',
            light: '#27ae60',
            anime: '#f39c12',
            premium: '#2c3e50'
        };
        
        item.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <strong>${model.name}</strong>
                    ${model.recommended ? '<span style="background: #27ae60; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">RECOMMENDED</span>' : ''}
                    <span style="background: ${categoryColor[model.category] || '#95a5a6'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${model.category.toUpperCase()}</span>
                </div>
                <small style="display: block; color: #7f8c8d; margin-bottom: 2px;">${model.description}</small>
                <small style="color: #95a5a6;">
                    Size: ${model.size} MB • 
                    RAM: ${model.requirements.ram}GB${model.requirements.gpu ? ' • GPU Required' : ''}
                </small>
            </div>
            <div class="model-actions">
                ${isInstalled ? 
                    `<button class="btn btn-success" disabled>✓ Downloaded</button>
                     <button class="btn btn-danger" onclick="modelManager.deleteModel('${model.id}')">Delete</button>` :
                    `<button class="btn btn-primary" 
                        onclick="modelManager.downloadModel('${model.id}')"
                        ${!canInstall ? 'disabled title="Requirements not met"' : ''}
                     >Download</button>`
                }
            </div>
        `;
        
        return item;
    }

    /**
     * Update download button state
     */
    updateDownloadButton(modelId, text, disabled = false) {
        const item = document.querySelector(`[data-model-id="${modelId}"]`);
        if (!item) return;
        
        const button = item.querySelector('.btn-primary');
        if (button) {
            button.textContent = text;
            button.disabled = disabled;
        }
    }

    /**
     * Update download progress
     */
    updateDownloadProgress(modelId, progress) {
        this.updateDownloadButton(modelId, `${progress}%`, true);
    }

    /**
     * Update model item after installation/deletion
     */
    updateModelItem(modelId) {
        const item = document.querySelector(`[data-model-id="${modelId}"]`);
        if (!item) return;
        
        const model = this.availableModels.find(m => m.id === modelId);
        const newItem = this.createModelItem(model);
        
        item.parentNode.replaceChild(newItem, item);
        
        // Update cache display
        this.updateCacheDisplay();
    }

    /**
     * Update cache display
     */
    updateCacheDisplay() {
        const cacheDisplay = document.querySelector('#modelManager .cache-info');
        if (cacheDisplay) {
            cacheDisplay.innerHTML = `
                <strong>Cache Usage:</strong> ${this.totalCacheSize.toFixed(1)} MB / ${this.maxCacheSize} MB
            `;
        }
    }

    /**
     * Show download success notification
     */
    showDownloadSuccess(modelName) {
        this.showNotification(`✅ ${modelName} downloaded successfully!`, 'success');
    }

    /**
     * Show download error notification
     */
    showDownloadError(modelName) {
        this.showNotification(`❌ Failed to download ${modelName}`, 'error');
    }

    /**
     * Show delete success notification
     */
    showDeleteSuccess(modelName) {
        this.showNotification(`🗑️ ${modelName} deleted successfully!`, 'success');
    }

    /**
     * Show delete error notification
     */
    showDeleteError(modelName) {
        this.showNotification(`❌ Failed to delete ${modelName}`, 'error');
    }

    /**
     * Show confirmation dialog for model deletion
     */
    async showDeleteConfirmation(modelName) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10003;
                ">
                    <div style="
                        background: white;
                        border-radius: 16px;
                        padding: 24px;
                        max-width: 400px;
                        text-align: center;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    ">
                        <div style="font-size: 48px; margin-bottom: 16px;">🗑️</div>
                        <h3 style="margin: 0 0 16px 0; color: #2c3e50;">Delete Model</h3>
                        <p style="margin: 0 0 24px 0; color: #7f8c8d;">
                            Are you sure you want to delete <strong>${modelName}</strong>?<br>
                            This action cannot be undone.
                        </p>
                        <div style="display: flex; gap: 12px; justify-content: center;">
                            <button id="cancelDelete" class="btn" style="
                                background: #95a5a6;
                                color: white;
                                padding: 12px 24px;
                                border: none;
                                border-radius: 8px;
                                cursor: pointer;
                            ">Cancel</button>
                            <button id="confirmDelete" class="btn" style="
                                background: linear-gradient(135deg, #e74c3c, #c0392b);
                                color: white;
                                padding: 12px 24px;
                                border: none;
                                border-radius: 8px;
                                cursor: pointer;
                            ">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            dialog.querySelector('#confirmDelete').onclick = () => {
                document.body.removeChild(dialog);
                resolve(true);
            };
            
            dialog.querySelector('#cancelDelete').onclick = () => {
                document.body.removeChild(dialog);
                resolve(false);
            };
            
            dialog.onclick = (e) => {
                if (e.target === dialog) {
                    document.body.removeChild(dialog);
                    resolve(false);
                }
            };
        });
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const colors = {
            success: { bg: '#27ae60', text: 'white' },
            error: { bg: '#e74c3c', text: 'white' },
            info: { bg: '#3498db', text: 'white' },
            warning: { bg: '#f39c12', text: 'white' }
        };
        
        const color = colors[type] || colors.info;
        
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${color.bg};
                color: ${color.text};
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                z-index: 10001;
                animation: slideInRight 0.3s ease, fadeOut 0.3s ease 3s forwards;
                max-width: 300px;
            ">
                ${message}
            </div>
            <style>
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    to { opacity: 0; transform: translateX(100%); }
                }
            </style>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3500);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Cache size change
        document.addEventListener('change', (event) => {
            if (event.target.id === 'maxModelCache') {
                this.maxCacheSize = parseInt(event.target.value);
                this.updateCacheDisplay();
                
                // Clean up if necessary
                if (this.totalCacheSize > this.maxCacheSize) {
                    this.cleanupCache();
                }
            }
        });
        
        // Auto-download toggle
        document.addEventListener('change', (event) => {
            if (event.target.id === 'chkAutoDownload') {
                if (event.target.checked) {
                    this.checkAutoDownload();
                }
            }
        });
    }

    /**
     * Get installed models
     */
    getInstalledModels() {
        return Array.from(this.models.values()).filter(m => m.installed);
    }

    /**
     * Get model by ID
     */
    getModel(modelId) {
        return this.models.get(modelId);
    }

    /**
     * Check if model is installed
     */
    isModelInstalled(modelId) {
        return this.models.has(modelId);
    }

    /**
     * Destroy the manager
     */
    destroy() {
        // Clear download queue
        this.downloadQueue = [];
        this.isDownloading = false;
        
        console.log('🤖 Model Manager destroyed');
    }
}

// Export for global use
window.ModelManager = ModelManager;

// Initialize global instance
window.modelManager = new ModelManager();