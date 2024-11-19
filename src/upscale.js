import { checkHardwareSupport } from "../backend/hardwareCheck";

function applyUpscaling(videoElement) {
    const support = checkHardwareSupport();
    if (support === "NVIDIA RTX erkannt") {
        // NVIDIA Upscaling aktivieren
        console.log("NVIDIA Upscaling aktiv");
    } else if (support === "Apple Metal verfügbar") {
        // Apple Metal Shader aktivieren
        console.log("Apple Metal Upscaling aktiv");
    } else {
        console.log("Software-Upscaling aktiv");
    }
}

// Verbinde mit dem Jellyfin-Player
const videoElement = document.querySelector("video");
if (videoElement) {
    applyUpscaling(videoElement);
