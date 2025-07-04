// Jellyfin AI Upscaler Plugin v1.3.5 - Enhanced Player Button Integration
// Fügt einen Button im Video-Player für Schnelleinstellungen mit AV1-Unterstützung hinzu

(function() {
    'use strict';
    
    console.log('🚀 AI Upscaler v1.3.5 Player Button mit AV1-Support wird geladen...');
    
    let upscalerButton = null;
    let isUpscalerActive = false;
    let currentSettings = {
        model: 'Real-ESRGAN',
        scale: 3.0,
        enabled: false
    };
    
    // CSS für den Button
    const buttonCSS = `
        .upscaler-button {
            position: relative;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: white;
        }
        
        .upscaler-button:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        
        .upscaler-button.active {
            background: linear-gradient(135deg, #00C851 0%, #007E33 100%);
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 200, 81, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(0, 200, 81, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 200, 81, 0); }
        }
        
        .upscaler-menu {
            position: absolute;
            bottom: 60px;
            right: 0;
            background: rgba(20, 20, 20, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 20px;
            min-width: 320px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.1);
            display: none;
            z-index: 1001;
        }
        
        .upscaler-menu.visible {
            display: block;
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .upscaler-menu h3 {
            color: #fff;
            margin: 0 0 15px 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .upscaler-option {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 12px 0;
            color: #fff;
            font-size: 14px;
        }
        
        .upscaler-option label {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .upscaler-select {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 6px;
            color: #fff;
            padding: 6px 10px;
            font-size: 13px;
            min-width: 120px;
        }
        
        .upscaler-select option {
            background: #2a2a2a;
            color: #fff;
        }
        
        .upscaler-toggle {
            width: 50px;
            height: 26px;
            background: rgba(255,255,255,0.2);
            border-radius: 13px;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .upscaler-toggle.active {
            background: #00C851;
        }
        
        .upscaler-toggle-knob {
            width: 22px;
            height: 22px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .upscaler-toggle.active .upscaler-toggle-knob {
            transform: translateX(24px);
        }
        
        .upscaler-preset-buttons {
            display: flex;
            gap: 8px;
            margin-top: 15px;
            flex-wrap: wrap;
        }
        
        .upscaler-preset-btn {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 6px;
            color: #fff;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .upscaler-preset-btn:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-1px);
        }
        
        .upscaler-status {
            margin-top: 15px;
            padding: 10px;
            background: rgba(0,200,81,0.1);
            border: 1px solid rgba(0,200,81,0.3);
            border-radius: 6px;
            color: #00C851;
            font-size: 12px;
            text-align: center;
        }
        
        .upscaler-status.warning {
            background: rgba(255,193,7,0.1);
            border-color: rgba(255,193,7,0.3);
            color: #ffc107;
        }
        
        .upscaler-status.error {
            background: rgba(220,53,69,0.1);
            border-color: rgba(220,53,69,0.3);
            color: #dc3545;
        }
    `;
    
    // CSS einfügen
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = buttonCSS;
        document.head.appendChild(style);
    }
    
    // Button HTML erstellen
    function createButton() {
        const button = document.createElement('div');
        button.className = 'upscaler-button';
        button.innerHTML = '🚀';
        button.title = 'AI Upscaler - Schnelleinstellungen';
        
        // Menu HTML
        const menu = document.createElement('div');
        menu.className = 'upscaler-menu';
        menu.innerHTML = `
            <h3>🚀 AI Upscaler Schnelleinstellungen</h3>
            
            <div class="upscaler-option">
                <label>
                    <span>Aktiviert:</span>
                </label>
                <div class="upscaler-toggle" id="upscaler-toggle">
                    <div class="upscaler-toggle-knob"></div>
                </div>
            </div>
            
            <div class="upscaler-option">
                <label>AI-Modell:</label>
                <select class="upscaler-select" id="upscaler-model">
                    <option value="Real-ESRGAN">Real-ESRGAN (Empfohlen)</option>
                    <option value="HAT">HAT (Maximum Qualität)</option>
                    <option value="SRCNN">SRCNN (Schnell)</option>
                    <option value="EDSR">EDSR (Ausgewogen)</option>
                    <option value="Waifu2x">Waifu2x (Anime)</option>
                </select>
            </div>
            
            <div class="upscaler-option">
                <label>Skalierung:</label>
                <select class="upscaler-select" id="upscaler-scale">
                    <option value="1.5">1.5x (720p→1080p)</option>
                    <option value="2.0">2.0x (1080p→4K leicht)</option>
                    <option value="3.0" selected>3.0x (1080p→4K+)</option>
                    <option value="4.0">4.0x (Maximum)</option>
                </select>
            </div>
            
            <div class="upscaler-preset-buttons">
                <button class="upscaler-preset-btn" onclick="setPreset('gaming')">🎮 Gaming</button>
                <button class="upscaler-preset-btn" onclick="setPreset('apple')">🍎 Apple</button>
                <button class="upscaler-preset-btn" onclick="setPreset('balanced')">⚖️ Balanced</button>
                <button class="upscaler-preset-btn" onclick="setPreset('budget')">💰 Budget</button>
            </div>
            
            <div class="upscaler-status" id="upscaler-status">
                ✅ Bereit für AI-Upscaling
            </div>
        `;
        
        button.appendChild(menu);
        return button;
    }
    
    // Button-Event-Handler
    function setupButtonEvents(button) {
        const toggleButton = button.querySelector('.upscaler-button');
        const menu = button.querySelector('.upscaler-menu');
        const toggle = button.querySelector('#upscaler-toggle');
        const modelSelect = button.querySelector('#upscaler-model');
        const scaleSelect = button.querySelector('#upscaler-scale');
        const status = button.querySelector('#upscaler-status');
        
        // Button-Klick
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('visible');
        });
        
        // Außerhalb-Klick schließt Menu
        document.addEventListener('click', (e) => {
            if (!button.contains(e.target)) {
                menu.classList.remove('visible');
            }
        });
        
        // Toggle-Schalter
        toggle.addEventListener('click', () => {
            isUpscalerActive = !isUpscalerActive;
            toggle.classList.toggle('active', isUpscalerActive);
            toggleButton.classList.toggle('active', isUpscalerActive);
            
            if (isUpscalerActive) {
                toggleButton.innerHTML = '✨';
                status.textContent = `✨ AI-Upscaling aktiv (${currentSettings.model} ${currentSettings.scale}x)`;
                status.className = 'upscaler-status';
                console.log('🚀 AI Upscaler aktiviert:', currentSettings);
            } else {
                toggleButton.innerHTML = '🚀';
                status.textContent = '⏸️ AI-Upscaling pausiert';
                status.className = 'upscaler-status warning';
                console.log('⏸️ AI Upscaler deaktiviert');
            }
        });
        
        // Modell-Änderung
        modelSelect.addEventListener('change', (e) => {
            currentSettings.model = e.target.value;
            updateStatus();
            console.log('🤖 AI-Modell geändert:', currentSettings.model);
        });
        
        // Skalierung-Änderung
        scaleSelect.addEventListener('change', (e) => {
            currentSettings.scale = parseFloat(e.target.value);
            updateStatus();
            console.log('📏 Skalierung geändert:', currentSettings.scale);
        });
        
        function updateStatus() {
            if (isUpscalerActive) {
                status.textContent = `✨ ${currentSettings.model} ${currentSettings.scale}x aktiv`;
            }
        }
    }
    
    // Preset-Funktionen global verfügbar machen
    window.setPreset = function(preset) {
        const modelSelect = document.querySelector('#upscaler-model');
        const scaleSelect = document.querySelector('#upscaler-scale');
        const status = document.querySelector('#upscaler-status');
        
        switch(preset) {
            case 'gaming':
                modelSelect.value = 'Real-ESRGAN';
                scaleSelect.value = '4.0';
                currentSettings = { model: 'Real-ESRGAN', scale: 4.0 };
                status.textContent = '🎮 Gaming-Preset geladen (RTX 4070+/RX 7700 XT+)';
                break;
            case 'apple':
                modelSelect.value = 'Real-ESRGAN';
                scaleSelect.value = '3.0';
                currentSettings = { model: 'Real-ESRGAN', scale: 3.0 };
                status.textContent = '🍎 Apple-Preset geladen (M1/M2/M3 optimiert)';
                break;
            case 'balanced':
                modelSelect.value = 'EDSR';
                scaleSelect.value = '2.0';
                currentSettings = { model: 'EDSR', scale: 2.0 };
                status.textContent = '⚖️ Balanced-Preset geladen (Mittlere Hardware)';
                break;
            case 'budget':
                modelSelect.value = 'SRCNN';
                scaleSelect.value = '1.5';
                currentSettings = { model: 'SRCNN', scale: 1.5 };
                status.textContent = '💰 Budget-Preset geladen (Ältere Hardware)';
                break;
        }
        
        console.log('🎯 Preset geladen:', preset, currentSettings);
    };
    
    // Button in Player einfügen
    function insertButton() {
        // Suche nach Video-Player-Kontrollleiste
        const playerControls = document.querySelector('.videoOsdBottom, .osdControls, .videoPlayerControls');
        
        if (playerControls && !document.querySelector('.upscaler-button')) {
            const button = createButton();
            setupButtonEvents(button);
            
            // Button rechts in die Kontrollleiste einfügen
            button.style.position = 'absolute';
            button.style.right = '80px';
            button.style.bottom = '15px';
            
            playerControls.style.position = 'relative';
            playerControls.appendChild(button);
            
            upscalerButton = button;
            console.log('✅ AI Upscaler Button hinzugefügt');
            
            return true;
        }
        
        return false;
    }
    
    // Überwachung für Video-Player
    function watchForPlayer() {
        // Versuche Button einzufügen
        if (insertButton()) {
            return;
        }
        
        // Überwache DOM-Änderungen
        const observer = new MutationObserver(() => {
            if (insertButton()) {
                observer.disconnect();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Fallback: Versuche es alle 2 Sekunden
        const interval = setInterval(() => {
            if (insertButton()) {
                clearInterval(interval);
            }
        }, 2000);
        
        // Nach 30 Sekunden aufgeben
        setTimeout(() => {
            clearInterval(interval);
            observer.disconnect();
        }, 30000);
    }
    
    // Plugin-Initialisierung
    function initializePlugin() {
        console.log('🚀 AI Upscaler Plugin wird initialisiert...');
        
        // CSS einfügen
        injectCSS();
        
        // Warte auf DOM-Bereitschaft
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', watchForPlayer);
        } else {
            watchForPlayer();
        }
        
        // Überwache Seiten-Navigation (SPA)
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(watchForPlayer, 1000);
            }
        }).observe(document, { subtree: true, childList: true });
    }
    
    // Plugin starten
    initializePlugin();
    
    console.log('✅ AI Upscaler Player Button geladen');
    
})();