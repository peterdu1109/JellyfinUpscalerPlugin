JELLYFIN UPSCALER
ENHANCE YOUR VIDEO PLAYBACK EXPERIENCE!
Jellyfin Upscaler is a powerful plugin that improves video quality by applying real-time upscaling. It dynamically adapts to your hardware's capabilities and works seamlessly within Jellyfin.

FEATURES
🖥️ Real-Time Upscaling: Sharpen your video playback quality.
⚙️ Hardware-Accelerated: Supports NVIDIA RTX, Apple Metal, Vulkan, and more.
🔄 Automatic Fallback: Switches to software upscaling when no hardware support is detected.
🌟 Fully Integrated: No need for external players—everything works within Jellyfin.
INSTALLATION GUIDE
STEP 1: ADD THE REPOSITORY TO JELLYFIN
Open Jellyfin and go to Dashboard > Plugins > Repositories.
Click on Add Repository and fill in the details:

Name: Jellyfin Upscaler
URL:
bash
Copy Code 

https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerRepo/main/repo.json

Click Save to confirm.

STEP 2: INSTALL THE PLUGIN
Navigate to Dashboard > Plugins > Catalog.
Find Jellyfin Upscaler in the plugin list.
Click Install and follow the instructions.
STEP 3: ENABLE AND CONFIGURE
Restart Jellyfin if required.
Go to Dashboard > Plugins > Installed Plugins and ensure Jellyfin Upscaler is enabled.
Configure the settings (if necessary) to suit your device's hardware capabilities.
SUPPORTED DEVICES
This plugin is compatible with a wide range of devices:

NVIDIA RTX GPUs: Utilizes CUDA for efficient upscaling.
Apple Devices (macOS, iOS): Powered by Apple Metal for optimal performance.
Android Devices: Leverages Vulkan for hardware acceleration.
Smart TVs and Web Browsers: Uses software-based upscaling as a fallback.
TROUBLESHOOTING
If you encounter issues, follow these steps:

Plugin Not Appearing in Catalog:
Ensure the repository URL is added correctly in Dashboard > Plugins > Repositories.

Upscaling Not Working:
Verify that your device supports the necessary hardware APIs (e.g., NVIDIA CUDA, Apple Metal, Vulkan).

Logs:
Check the Jellyfin logs under Dashboard > Logs for any plugin-related errors.

LICENSE
This project is licensed under the MIT License. See the LICENSE file for details.

CONTRIBUTING
We welcome contributions! If you would like to improve this plugin or report an issue, feel free to open an issue or submit a pull request on our GitHub Repository.

