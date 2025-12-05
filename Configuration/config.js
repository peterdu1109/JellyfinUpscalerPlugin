define(['loading', 'dialogHelper', 'formDialogStyle', 'emby-checkbox', 'emby-select', 'emby-input'], function (loading, dialogHelper) {
    'use strict';

    var pluginId = "f87f700e-679d-43e6-9c7c-b3a410dc3f22";

    function getElement(page, selector) {
        var elem = page.querySelector(selector);
        return elem;
    }

    function loadConfiguration(page) {
        console.log('[UpscalerPlugin] Loading configuration...');
        loading.show();

        var statusBox = page.querySelector('#js-status');
        if (statusBox) {
            statusBox.innerHTML = "✅ JAVASCRIPT ACTIF - Chargement...";
            statusBox.className = "debug-box success";
            statusBox.style.backgroundColor = "#ccffcc";
            statusBox.style.color = "#006600";
        }

        ApiClient.getPluginConfiguration(pluginId).then(function (config) {
            console.log('[UpscalerPlugin] Config loaded:', config);

            var chkEnabled = getElement(page, '#chkEnabled');
            if (chkEnabled) chkEnabled.checked = config.Enabled !== false;

            var selectModel = getElement(page, '#selectModel');
            if (selectModel) selectModel.value = config.Model || 'realesrgan';

            var selectScale = getElement(page, '#selectScale');
            if (selectScale) selectScale.value = config.Scale || 2;

            var chkHardwareAccel = getElement(page, '#chkHardwareAccel');
            if (chkHardwareAccel) chkHardwareAccel.checked = config.EnableHardwareAcceleration !== false;

            var txtCacheSize = getElement(page, '#txtCacheSize');
            if (txtCacheSize) txtCacheSize.value = config.CacheSizeMB || 1024;

            var txtMaxStreams = getElement(page, '#txtMaxStreams');
            if (txtMaxStreams) txtMaxStreams.value = config.MaxConcurrentStreams || 2;

            var chkEnableCache = getElement(page, '#chkEnableCache');
            if (chkEnableCache) chkEnableCache.checked = config.EnableCache !== false;

            var chkAutoBenchmark = getElement(page, '#chkAutoBenchmark');
            if (chkAutoBenchmark) chkAutoBenchmark.checked = config.EnableAutoBenchmarking !== false;

            var chkAutoFallback = getElement(page, '#chkAutoFallback');
            if (chkAutoFallback) chkAutoFallback.checked = config.EnableAutoFallback !== false;

            loading.hide();
            if (statusBox) statusBox.innerHTML = "✅ CONFIGURATION CHARGÉE";

        }).catch(function (err) {
            console.error('[UpscalerPlugin] Error loading config:', err);
            loading.hide();
            if (statusBox) {
                statusBox.innerHTML = "❌ ERREUR CHARGEMENT: " + err;
                statusBox.className = "debug-box";
            }
        });
    }

    function saveConfiguration(page) {
        console.log('[UpscalerPlugin] Saving configuration...');
        loading.show();

        var statusBox = page.querySelector('#js-status');
        if (statusBox) statusBox.innerHTML = "💾 Sauvegarde en cours...";

        ApiClient.getPluginConfiguration(pluginId).then(function (config) {

            var chkEnabled = getElement(page, '#chkEnabled');
            if (chkEnabled) config.Enabled = chkEnabled.checked;

            var selectModel = getElement(page, '#selectModel');
            if (selectModel) config.Model = selectModel.value;

            var selectScale = getElement(page, '#selectScale');
            if (selectScale) config.Scale = parseInt(selectScale.value);

            var chkHardwareAccel = getElement(page, '#chkHardwareAccel');
            if (chkHardwareAccel) config.EnableHardwareAcceleration = chkHardwareAccel.checked;

            var txtCacheSize = getElement(page, '#txtCacheSize');
            if (txtCacheSize) config.CacheSizeMB = parseInt(txtCacheSize.value);

            var txtMaxStreams = getElement(page, '#txtMaxStreams');
            if (txtMaxStreams) config.MaxConcurrentStreams = parseInt(txtMaxStreams.value);

            var chkEnableCache = getElement(page, '#chkEnableCache');
            if (chkEnableCache) config.EnableCache = chkEnableCache.checked;

            var chkAutoBenchmark = getElement(page, '#chkAutoBenchmark');
            if (chkAutoBenchmark) config.EnableAutoBenchmarking = chkAutoBenchmark.checked;

            var chkAutoFallback = getElement(page, '#chkAutoFallback');
            if (chkAutoFallback) config.EnableAutoFallback = chkAutoFallback.checked;

            ApiClient.updatePluginConfiguration(pluginId, config).then(function (result) {
                console.log('[UpscalerPlugin] Save success');
                Dashboard.processPluginConfigurationUpdateResult(result);
                loading.hide();

                if (statusBox) statusBox.innerHTML = "✅ SAUVEGARDE RÉUSSIE";

                require(['toast'], function (toast) {
                    toast('✅ Configuration enregistrée !');
                });
            }).catch(function (err) {
                console.error('[UpscalerPlugin] Error saving:', err);
                loading.hide();
                if (statusBox) statusBox.innerHTML = "❌ ERREUR SAUVEGARDE: " + err;

                require(['toast'], function (toast) {
                    toast('❌ Erreur: ' + err);
                });
            });
        });
    }

    return function (view, params) {
        console.log('[UpscalerPlugin] Controller initialized');

        view.addEventListener('viewshow', function () {
            console.log('[UpscalerPlugin] viewshow event');
            loadConfiguration(view);
        });

        var form = view.querySelector('.pluginConfigurationForm');
        if (form) {
            form.addEventListener('submit', function (e) {
                console.log('[UpscalerPlugin] submit event');
                e.preventDefault();
                saveConfiguration(view);
                return false;
            });
        }
    };
});