// AI Upscaler Plugin - Auto-Inject Script
// Wird automatisch in alle Jellyfin-Seiten geladen

(function() {
    'use strict';
    
    console.log('🚀 AI Upscaler Auto-Inject wird geladen...');
    
    // Player-Button CSS
    const buttonCSS = `
        .ai-upscaler-btn {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 9999 !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: none !important;
            border-radius: 12px !important;
            color: white !important;
            padding: 12px 20px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            min-width: 180px !important;
        }
        
        .ai-upscaler-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 25px rgba(0,0,0,0.4) !important;
        }
        
        .ai-upscaler-btn.active {
            background: linear-gradient(135deg, #00C851 0%, #007E33 100%) !important;
            animation: pulse-green 2s infinite !important;
        }
        
        @keyframes pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(0, 200, 81, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(0, 200, 81, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 200, 81, 0); }
        }
        
        .ai-upscaler-panel {
            position: fixed !important;
            top: 80px !important;
            right: 20px !important;
            width: 350px !important;
            background: rgba(20, 20, 20, 0.95) !important;
            backdrop-filter: blur(15px) !important;
            border-radius: 16px !important;
            padding: 24px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            display: none !important;
            z-index: 10000 !important;
            max-height: 80vh !important;
            overflow-y: auto !important;
        }
        
        .ai-upscaler-panel.visible {
            display: block !important;
            animation: slideInRight 0.4s ease !important;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .ai-upscaler-panel h3 {
            color: #fff !important;
            margin: 0 0 20px 0 !important;
            font-size: 18px !important;
            font-weight: 700 !important;
            text-align: center !important;
            background: linear-gradient(135deg, #667eea, #764ba2) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
        }
        
        .ai-option {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            margin: 16px 0 !important;
            color: #fff !important;
            font-size: 14px !important;
        }
        
        .ai-option label {
            font-weight: 500 !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }
        
        .ai-select {
            background: rgba(255,255,255,0.1) !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            border-radius: 8px !important;
            color: #fff !important;
            padding: 8px 12px !important;
            font-size: 13px !important;
            min-width: 140px !important;
            transition: all 0.3s ease !important;
        }
        
        .ai-select:focus {
            border-color: #667eea !important;
            outline: none !important;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
        }
        
        .ai-select option {
            background: #2a2a2a !important;
            color: #fff !important;
            padding: 8px !important;
        }
        
        .ai-toggle {
            width: 60px !important;
            height: 30px !important;
            background: rgba(255,255,255,0.2) !important;
            border-radius: 15px !important;
            position: relative !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            border: 2px solid transparent !important;
        }
        
        .ai-toggle.active {
            background: linear-gradient(135deg, #00C851, #007E33) !important;
            border-color: #00C851 !important;
        }
        
        .ai-toggle-knob {
            width: 26px !important;
            height: 26px !important;
            background: white !important;
            border-radius: 50% !important;
            position: absolute !important;
            top: 2px !important;
            left: 2px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        }
        
        .ai-toggle.active .ai-toggle-knob {
            transform: translateX(30px) !important;
            background: #fff !important;
        }
        
        .ai-presets {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
            margin: 20px 0 !important;
        }
        
        .ai-preset-btn {
            background: rgba(255,255,255,0.1) !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            border-radius: 8px !important;
            color: #fff !important;
            padding: 10px 12px !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            text-align: center !important;
        }
        
        .ai-preset-btn:hover {
            background: rgba(255,255,255,0.2) !important;
            transform: translateY(-1px) !important;
            border-color: #667eea !important;
        }
        
        .ai-status {
            margin-top: 16px !important;
            padding: 12px 16px !important;
            background: rgba(0,200,81,0.15) !important;
            border: 1px solid rgba(0,200,81,0.4) !important;
            border-radius: 8px !important;
            color: #00ff66 !important;
            font-size: 12px !important;
            text-align: center !important;
            font-weight: 600 !important;
        }
        
        .ai-status.warning {
            background: rgba(255,193,7,0.15) !important;
            border-color: rgba(255,193,7,0.4) !important;
            color: #ffeb3b !important;
        }
        
        .ai-status.error {
            background: rgba(220,53,69,0.15) !important;
            border-color: rgba(220,53,69,0.4) !important;
            color: #ff5252 !important;
        }
        
        .ai-close-btn {
            position: absolute !important;
            top: 12px !important;
            right: 12px !important;
            background: rgba(255,255,255,0.1) !important;
            border: none !important;
            border-radius: 50% !important;
            width: 24px !important;
            height: 24px !important;
            color: #fff !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 16px !important;
            transition: all 0.3s ease !important;
        }
        
        .ai-close-btn:hover {
            background: rgba(255,255,255,0.2) !important;
        }
    `;
    
    let upscalerButton = null;
    let upscalerPanel = null;
    let isActive = false;
    let currentSettings = {
        model: 'Real-ESRGAN',
        scale: 3.0,
        enabled: false
    };
    
    // CSS einfügen
    function injectCSS() {
        if (document.querySelector('#ai-upscaler-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'ai-upscaler-styles';
        style.textContent = buttonCSS;
        document.head.appendChild(style);
    }
    
    // Button HTML erstellen
    function createButton() {
        if (document.querySelector('.ai-upscaler-btn')) return;
        
        const button = document.createElement('button');
        button.className = 'ai-upscaler-btn';
        button.innerHTML = '🚀 <span>AI Upscaler</span>';
        button.title = 'AI Upscaler - Schnelleinstellungen';
        
        document.body.appendChild(button);
        return button;
    }
    
    // Panel HTML erstellen
    function createPanel() {
        if (document.querySelector('.ai-upscaler-panel')) return;
        
        const panel = document.createElement('div');
        panel.className = 'ai-upscaler-panel';
        panel.innerHTML = `
            <button class="ai-close-btn">×</button>
            <h3>🚀 AI Upscaler Einstellungen</h3>
            
            <div class="ai-option">
                <label>
                    <span>🔥 Aktiviert:</span>
                </label>
                <div class="ai-toggle" id="ai-main-toggle">
                    <div class="ai-toggle-knob"></div>
                </div>
            </div>
            
            <div class="ai-option">
                <label>🤖 AI-Modell:</label>
                <select class="ai-select" id="ai-model-select">
                    <option value="Real-ESRGAN">Real-ESRGAN (Empfohlen)</option>
                    <option value="HAT">HAT (Max Qualität)</option>
                    <option value="SRCNN">SRCNN (Schnell)</option>
                    <option value="EDSR">EDSR (Ausgewogen)</option>
                    <option value="Waifu2x">Waifu2x (Anime)</option>
                    <option value="SwinIR">SwinIR (Transformer)</option>
                    <option value="VDSR">VDSR (Deep)</option>
                    <option value="RDN">RDN (Dense)</option>
                </select>
            </div>
            
            <div class="ai-option">
                <label>📏 Skalierung:</label>
                <select class="ai-select" id="ai-scale-select">
                    <option value="1.5">1.5x (720p→1080p)</option>
                    <option value="2.0">2.0x (Leicht)</option>
                    <option value="3.0" selected>3.0x (Standard)</option>
                    <option value="4.0">4.0x (Maximum)</option>
                </select>
            </div>
            
            <div class="ai-presets">
                <button class="ai-preset-btn" onclick="setAIPreset('gaming')">🎮 Gaming</button>
                <button class="ai-preset-btn" onclick="setAIPreset('apple')">🍎 Apple</button>
                <button class="ai-preset-btn" onclick="setAIPreset('balanced')">⚖️ Balanced</button>
                <button class="ai-preset-btn" onclick="setAIPreset('budget')">💰 Budget</button>
            </div>
            
            <div class="ai-status" id="ai-status">
                ⭐ Bereit für AI-Upscaling
            </div>
        `;
        
        document.body.appendChild(panel);
        return panel;
    }
    
    // Event-Handler einrichten
    function setupEvents() {
        const button = document.querySelector('.ai-upscaler-btn');
        const panel = document.querySelector('.ai-upscaler-panel');
        const closeBtn = panel.querySelector('.ai-close-btn');
        const toggle = panel.querySelector('#ai-main-toggle');
        const modelSelect = panel.querySelector('#ai-model-select');
        const scaleSelect = panel.querySelector('#ai-scale-select');
        const status = panel.querySelector('#ai-status');
        
        // Button-Klick
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('visible');
        });
        
        // Close-Button
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.remove('visible');
        });
        
        // Außerhalb-Klick schließt Panel
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !button.contains(e.target)) {
                panel.classList.remove('visible');
            }
        });
        
        // Toggle-Schalter
        toggle.addEventListener('click', () => {
            isActive = !isActive;
            toggle.classList.toggle('active', isActive);
            button.classList.toggle('active', isActive);
            
            if (isActive) {
                button.innerHTML = '✨ <span>AI Aktiv</span>';
                status.textContent = `✨ ${currentSettings.model} ${currentSettings.scale}x aktiv`;
                status.className = 'ai-status';
                console.log('🚀 AI Upscaler aktiviert:', currentSettings);
                
                // Notification anzeigen
                showNotification('🚀 AI Upscaler aktiviert!', 'success');
            } else {
                button.innerHTML = '🚀 <span>AI Upscaler</span>';
                status.textContent = '⏸️ AI-Upscaling pausiert';
                status.className = 'ai-status warning';
                console.log('⏸️ AI Upscaler deaktiviert');
                
                showNotification('⏸️ AI Upscaler pausiert', 'warning');
            }
        });
        
        // Modell-Änderung
        modelSelect.addEventListener('change', (e) => {
            currentSettings.model = e.target.value;
            updateStatus();
            console.log('🤖 AI-Modell geändert:', currentSettings.model);
            showNotification(`🤖 Modell: ${currentSettings.model}`, 'info');
        });
        
        // Skalierung-Änderung
        scaleSelect.addEventListener('change', (e) => {
            currentSettings.scale = parseFloat(e.target.value);
            updateStatus();
            console.log('📏 Skalierung geändert:', currentSettings.scale);
            showNotification(`📏 Skalierung: ${currentSettings.scale}x`, 'info');
        });
        
        function updateStatus() {
            if (isActive) {
                status.textContent = `✨ ${currentSettings.model} ${currentSettings.scale}x aktiv`;
            }
        }
    }
    
    // Preset-Funktionen global verfügbar machen
    window.setAIPreset = function(preset) {
        const modelSelect = document.querySelector('#ai-model-select');
        const scaleSelect = document.querySelector('#ai-scale-select');
        const status = document.querySelector('#ai-status');
        
        switch(preset) {
            case 'gaming':
                modelSelect.value = 'Real-ESRGAN';
                scaleSelect.value = '4.0';
                currentSettings = { model: 'Real-ESRGAN', scale: 4.0 };
                status.textContent = '🎮 Gaming-Preset (RTX 4070+/RX 7700 XT+)';
                showNotification('🎮 Gaming-Preset geladen!', 'success');
                break;
            case 'apple':
                modelSelect.value = 'Real-ESRGAN';
                scaleSelect.value = '3.0';
                currentSettings = { model: 'Real-ESRGAN', scale: 3.0 };
                status.textContent = '🍎 Apple-Preset (M1/M2/M3 optimiert)';
                showNotification('🍎 Apple-Preset geladen!', 'success');
                break;
            case 'balanced':
                modelSelect.value = 'EDSR';
                scaleSelect.value = '2.0';
                currentSettings = { model: 'EDSR', scale: 2.0 };
                status.textContent = '⚖️ Balanced-Preset (Mittlere Hardware)';
                showNotification('⚖️ Balanced-Preset geladen!', 'success');
                break;
            case 'budget':
                modelSelect.value = 'SRCNN';
                scaleSelect.value = '1.5';
                currentSettings = { model: 'SRCNN', scale: 1.5 };
                status.textContent = '💰 Budget-Preset (Ältere Hardware)';
                showNotification('💰 Budget-Preset geladen!', 'success');
                break;
        }
        
        console.log('🎯 Preset geladen:', preset, currentSettings);
    };
    
    // Notification-System
    function showNotification(message, type = 'info') {
        // Entferne alte Notifications
        document.querySelectorAll('.ai-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'ai-notification';
        
        const colors = {
            success: 'linear-gradient(135deg, #00C851, #007E33)',
            warning: 'linear-gradient(135deg, #ffb300, #ff8f00)',
            error: 'linear-gradient(135deg, #ff5252, #d32f2f)',
            info: 'linear-gradient(135deg, #2196f3, #1976d2)'
        };
        
        notification.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: ${colors[type]} !important;
            color: white !important;
            padding: 12px 24px !important;
            border-radius: 25px !important;
            z-index: 10001 !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
            animation: slideDown 0.4s ease !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animation CSS
        if (!document.querySelector('#ai-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'ai-notification-styles';
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            notification.style.animation = 'slideDown 0.4s ease reverse';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
    
    // Plugin initialisieren
    function initializePlugin() {
        console.log('🚀 AI Upscaler Plugin initialisiert');
        
        // CSS einfügen
        injectCSS();
        
        // UI erstellen
        const button = createButton();
        const panel = createPanel();
        
        if (button && panel) {
            setupEvents();
            console.log('✅ AI Upscaler UI bereit');
            
            // Willkommens-Nachricht
            setTimeout(() => {
                showNotification('🚀 AI Upscaler Plugin geladen!', 'success');
            }, 1000);
        }
    }
    
    // Warte auf DOM-Bereitschaft
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePlugin);
    } else {
        setTimeout(initializePlugin, 500);
    }
    
    // Überwache Seiten-Navigation (SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                if (!document.querySelector('.ai-upscaler-btn')) {
                    initializePlugin();
                }
            }, 1000);
        }
    }).observe(document, { subtree: true, childList: true });
    
})();