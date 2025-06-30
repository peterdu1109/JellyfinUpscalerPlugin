// Jellyfin Web Client Plugin Entry Point
// This file is loaded by Jellyfin Web Client to initialize the plugin

define(['pluginManager'], function (pluginManager) {
    'use strict';

    console.log('🚀 Jellyfin Upscaler Plugin v1.1.1 loading...');

    // Plugin configuration
    const pluginConfig = {
        name: 'Jellyfin Upscaler',
        type: 'javascript',
        id: 'f87f700e-679d-43e6-9c7c-b3a410dc3f12',
        version: '1.1.1'
    };

    // Load the main upscaler functionality
    function loadUpscaler() {
        return new Promise((resolve, reject) => {
            require(['./web/upscaler'], function(upscaler) {
                console.log('✅ Upscaler module loaded');
                resolve(upscaler);
            }, function(error) {
                console.error('❌ Failed to load upscaler module:', error);
                reject(error);
            });
        });
    }

    // Plugin initialization
    function initialize() {
        console.log('🔧 Initializing Jellyfin Upscaler Plugin...');
        
        loadUpscaler().then(function(upscaler) {
            // Initialize the upscaler
            if (upscaler && upscaler.initialize) {
                upscaler.initialize();
                console.log('✅ Jellyfin Upscaler Plugin initialized successfully');
            }
        }).catch(function(error) {
            console.error('❌ Plugin initialization failed:', error);
        });
    }

    // Register plugin with Jellyfin
    return {
        name: pluginConfig.name,
        type: pluginConfig.type,
        id: pluginConfig.id,
        version: pluginConfig.version,
        
        init: function() {
            initialize();
        },
        
        destroy: function() {
            console.log('🗑️ Jellyfin Upscaler Plugin destroyed');
        }
    };
});