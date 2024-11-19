Jellyfin Upscaler
Enhance video playback quality in Jellyfin with real-time upscaling on supported devices.
This plugin dynamically adjusts video resolution based on the hardware capabilities of your device, supporting NVIDIA GPUs, Apple Metal, Vulkan, and software-based solutions.

Features
Real-time video upscaling for sharper playback.
Compatible with NVIDIA RTX, Apple Metal, and Vulkan-based hardware.
Automatic fallback to software upscaling if hardware support is unavailable.
Fully integrated with Jellyfin—no external player needed.
Installation Guide
1. Add Repository to Jellyfin
Open Jellyfin and navigate to Dashboard > Plugins > Repositories.
Click Add Repository and enter the following details:
Name: Jellyfin Upscaler
URL:
bash
Code kopieren
https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerRepo/main/repo.json
Save the changes.
2. Install the Plugin
Go to Dashboard > Plugins > Catalog.
Find Jellyfin Upscaler in the list.
Click Install and follow the instructions.
3. Enable and Configure
Restart Jellyfin if necessary.
Go to Dashboard > Plugins > Installed Plugins and ensure Jellyfin Upscaler is enabled.
Optional: Adjust settings based on your device's hardware capabilities.
Supported Devices
NVIDIA RTX GPUs: Utilizes NVIDIA's CUDA technology for high-quality upscaling.
Apple Devices (macOS, iOS): Leverages Metal for optimized performance.
Android Devices: Vulkan API for efficient upscaling.
Smart TVs and Browsers: Falls back to software-based upscaling when hardware support is unavailable.
License
This project is licensed under the MIT License. See the LICENSE file for details.

Troubleshooting
Plugin does not appear in the catalog:
Ensure the repository URL is correctly added in Dashboard > Plugins > Repositories.
Upscaling not working:
Verify your device supports the necessary hardware APIs (e.g., NVIDIA CUDA, Apple Metal, Vulkan).
Logs:
Check Jellyfin logs in Dashboard > Logs for any errors related to the plugin.
Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request on the GitHub repository.

