// AI Upscaler Plugin - Video Player Integration
(function() {
    'use strict';
    
    console.log('AI Upscaler Plugin: Video Player Integration loaded');
    
    var config = {
        EnablePlugin: true,
        ShowPlayerButton: true,
        Model: 'realesrgan',
        ScaleFactor: 3,
        QualityLevel: 'medium'
    };
    
    // Load configuration from storage
    function loadConfig() {
        try {
            var stored = localStorage.getItem('aiUpscalerConfig');
            if (stored) {
                config = Object.assign(config, JSON.parse(stored));
            }
        } catch (e) {
            console.log('AI Upscaler: Using default config');
        }
    }
    
    // Add AI button to video player
    function addAIButton() {
        if (!config.EnablePlugin || !config.ShowPlayerButton) return;
        
        // Check if button already exists
        if (document.getElementById('aiUpscalerButton')) return;
        
        // Find video player controls
        var controlsContainer = document.querySelector('.videoPlayerContainer .videoControls, .osdControls, .videoOsdBottom');
        if (!controlsContainer) return;
        
        // Create AI button
        var aiButton = document.createElement('button');
        aiButton.id = 'aiUpscalerButton';
        aiButton.className = 'paper-icon-button-light';
        aiButton.innerHTML = '🎮';
        aiButton.title = 'AI Upscaler Quick Settings';
        aiButton.style.cssText = [
            'background: #00a4dc !important',
            'color: white !important',
            'border: none !important',
            'padding: 8px 12px !important',
            'border-radius: 4px !important',
            'margin: 0 5px !important',
            'cursor: pointer !important',
            'font-weight: bold !important',
            'font-size: 14px !important',
            'z-index: 1000 !important'
        ].join(';');
        
        // Add click event
        aiButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleQuickMenu();
        });
        
        // Insert button into controls
        try {
            controlsContainer.appendChild(aiButton);
            console.log('AI Upscaler: Button added to video player');
        } catch (error) {
            console.error('AI Upscaler: Error adding button:', error);
        }
    }
    
    // Toggle quick settings menu
    function toggleQuickMenu() {
        var menu = document.getElementById('aiQuickMenu');
        if (menu) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        } else {
            createQuickMenu();
        }
    }
    
    // Create quick settings menu
    function createQuickMenu() {
        // Remove existing menu
        var existingMenu = document.getElementById('aiQuickMenu');
        if (existingMenu) {
            existingMenu.parentNode.removeChild(existingMenu);
        }
        
        var menu = document.createElement('div');
        menu.id = 'aiQuickMenu';
        menu.style.cssText = [
            'position: fixed',
            'top: 50%',
            'left: 50%',
            'transform: translate(-50%, -50%)',
            'background: rgba(0, 0, 0, 0.95)',
            'color: white',
            'padding: 25px',
            'border-radius: 10px',
            'z-index: 10000',
            'min-width: 350px',
            'max-width: 400px',
            'box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5)',
            'border: 2px solid #00a4dc',
            'font-family: system-ui, sans-serif'
        ].join(';');
        
        menu.innerHTML = [
            '<div style="text-align: center; margin-bottom: 20px;">',
                '<h3 style="margin: 0 0 10px 0; color: #00a4dc; font-size: 1.5em;">🎮 AI Upscaler</h3>',
                '<p style="margin: 0; opacity: 0.8;">Quick Settings</p>',
            '</div>',
            '<div style="margin-bottom: 15px;">',
                '<label style="display: block; margin-bottom: 5px; font-weight: bold;">AI Model:</label>',
                '<select id="quickModel" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #00a4dc; background: rgba(255,255,255,0.1); color: white;">',
                    '<option value="realesrgan"' + (config.Model === 'realesrgan' ? ' selected' : '') + '>Real-ESRGAN (Best)</option>',
                    '<option value="srcnn-light"' + (config.Model === 'srcnn-light' ? ' selected' : '') + '>SRCNN Light (Fast)</option>',
                    '<option value="waifu2x"' + (config.Model === 'waifu2x' ? ' selected' : '') + '>Waifu2x (Anime)</option>',
                    '<option value="esrgan-pro"' + (config.Model === 'esrgan-pro' ? ' selected' : '') + '>ESRGAN Pro (Movies)</option>',
                '</select>',
            '</div>',
            '<div style="margin-bottom: 15px;">',
                '<label style="display: block; margin-bottom: 5px; font-weight: bold;">Scale Factor:</label>',
                '<select id="quickScale" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #00a4dc; background: rgba(255,255,255,0.1); color: white;">',
                    '<option value="2"' + (config.ScaleFactor === 2 ? ' selected' : '') + '>2x Upscaling</option>',
                    '<option value="3"' + (config.ScaleFactor === 3 ? ' selected' : '') + '>3x Upscaling</option>',
                    '<option value="4"' + (config.ScaleFactor === 4 ? ' selected' : '') + '>4x Upscaling</option>',
                '</select>',
            '</div>',
            '<div style="margin-bottom: 20px;">',
                '<label style="display: block; margin-bottom: 5px; font-weight: bold;">Quality:</label>',
                '<select id="quickQuality" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #00a4dc; background: rgba(255,255,255,0.1); color: white;">',
                    '<option value="low"' + (config.QualityLevel === 'low' ? ' selected' : '') + '>Low (Fastest)</option>',
                    '<option value="medium"' + (config.QualityLevel === 'medium' ? ' selected' : '') + '>Medium (Balanced)</option>',
                    '<option value="high"' + (config.QualityLevel === 'high' ? ' selected' : '') + '>High (Best Quality)</option>',
                '</select>',
            '</div>',
            '<div style="text-align: center;">',
                '<button id="applyUpscaling" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 6px; margin: 0 10px; cursor: pointer; font-weight: bold;">🚀 Start Upscaling</button>',
                '<button id="closeMenu" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 6px; margin: 0 10px; cursor: pointer; font-weight: bold;">❌ Close</button>',
            '</div>'
        ].join('');
        
        document.body.appendChild(menu);
        
        // Add event listeners
        document.getElementById('applyUpscaling').addEventListener('click', function() {
            applyUpscaling();
        });
        
        document.getElementById('closeMenu').addEventListener('click', function() {
            closeQuickMenu();
        });
        
        // Close on outside click
        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target) && e.target.id !== 'aiUpscalerButton') {
                closeQuickMenu();
            }
        });
    }
    
    // Close quick menu
    function closeQuickMenu() {
        var menu = document.getElementById('aiQuickMenu');
        if (menu && menu.parentNode) {
            menu.parentNode.removeChild(menu);
        }
    }
    
    // Apply upscaling settings
    function applyUpscaling() {
        try {
            // Update config with selected values
            config.Model = document.getElementById('quickModel').value;
            config.ScaleFactor = parseInt(document.getElementById('quickScale').value);
            config.QualityLevel = document.getElementById('quickQuality').value;
            
            // Save to localStorage
            localStorage.setItem('aiUpscalerConfig', JSON.stringify(config));
            
            // Show notification
            showNotification('🚀 AI Upscaling activated! Model: ' + config.Model + ' | Scale: ' + config.ScaleFactor + 'x | Quality: ' + config.QualityLevel);
            
            // Close menu
            closeQuickMenu();
            
            console.log('AI Upscaler: Settings applied', config);
        } catch (error) {
            console.error('AI Upscaler: Error applying settings:', error);
            showNotification('❌ Error applying upscaling settings');
        }
    }
    
    // Show notification
    function showNotification(message) {
        // Remove existing notification
        var existing = document.getElementById('aiNotification');
        if (existing) {
            existing.parentNode.removeChild(existing);
        }
        
        var notification = document.createElement('div');
        notification.id = 'aiNotification';
        notification.style.cssText = [
            'position: fixed',
            'top: 20px',
            'right: 20px',
            'background: #00a4dc',
            'color: white',
            'padding: 15px 20px',
            'border-radius: 8px',
            'z-index: 10001',
            'font-weight: bold',
            'max-width: 300px',
            'box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3)',
            'opacity: 0',
            'transform: translateY(-10px)',
            'transition: all 0.3s ease'
        ].join(';');
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(function() {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(function() {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-10px)';
                setTimeout(function() {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
    }
    
    // Initialize plugin
    function init() {
        loadConfig();
        
        // Add button immediately if video player is present
        addAIButton();
        
        // Set up observers for dynamic content
        var retryCount = 0;
        var maxRetries = 20;
        var checkInterval = setInterval(function() {
            if (retryCount >= maxRetries) {
                clearInterval(checkInterval);
                return;
            }
            
            addAIButton();
            retryCount++;
        }, 1000);
        
        // Observer for navigation changes
        if (window.MutationObserver) {
            var observer = new MutationObserver(function(mutations) {
                var shouldCheck = false;
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        shouldCheck = true;
                    }
                });
                
                if (shouldCheck) {
                    setTimeout(addAIButton, 500);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        // Listen for navigation events
        if (window.Emby && Emby.Page) {
            Emby.Page.addEventListener('viewshow', function() {
                setTimeout(addAIButton, 1000);
            });
        }
        
        console.log('AI Upscaler Plugin: Initialization complete');
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also start immediately in case we're already loaded
    setTimeout(init, 100);
})();