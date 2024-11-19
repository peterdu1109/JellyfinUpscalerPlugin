export function checkHardwareSupport() {
    if (navigator.gpu) {
        return "WebGPU unterstützt";
    } else if (navigator.userAgent.includes("NVIDIA")) {
        return "NVIDIA RTX erkannt";
    } else if (navigator.userAgent.includes("Apple")) {
        return "Apple Metal verfügbar";
    } else {
        return "Nur Software-Upscaling verfügbar";
    }
}
