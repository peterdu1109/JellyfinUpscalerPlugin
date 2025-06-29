// ==UserScript==
// @name         Jellyfin Upscaler Plugin v1.1.2
// @namespace    jellyfin-upscaler
// @version      1.1.2
// @description  Real-time video upscaling for Jellyfin
// @author       Kuschel-code
// @match        http://*/web/*
// @match        https://*/web/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('🚀 Jellyfin Upscaler Plugin v1.1.2 - UserScript Loading...');
    
    // Wait for Jellyfin to load
    function waitForJellyfin() {
        if (typeof ApiClient !== 'undefined' && document.querySelector('.view')) {
            initializeUpscaler();
        } else {
            setTimeout(waitForJellyfin, 1000);
        }
    }
    
    function initializeUpscaler() {
        console.log('✅ Jellyfin detected, initializing upscaler...');
        
        // Load main upscaler code
        const script = document.createElement('script');
        script.src = '/web/JellyfinUpscalerPlugin_1.1.2/web/upscaler.js';
        script.onload = function() {
            console.log('✅ Upscaler loaded successfully');
        };
        script.onerror = function() {
            console.log('⚠️ Failed to load upscaler, using fallback');
            loadFallbackUpscaler();
        };
        document.head.appendChild(script);
    }
    
    function loadFallbackUpscaler() {
        // Minimal upscaler implementation
        console.log('🔧 Loading fallback upscaler...');
        
        // Basic video enhancement
        const style = document.createElement('style');
        style.textContent = `
            video {
                filter: contrast(1.1) saturate(1.1) sharpen(0.1);
                image-rendering: optimizeQuality;
            }
        `;
        document.head.appendChild(style);
        
        console.log('✅ Fallback upscaler active');
    }
    
    // Start initialization
    waitForJellyfin();
    
})();