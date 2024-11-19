<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jellyfin Upscaler</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
        }
        h1, h2, h3 {
            color: #333;
        }
        h1 {
            font-size: 2.5em;
            text-transform: uppercase;
            text-align: center;
        }
        h2 {
            font-size: 2em;
            margin-top: 30px;
        }
        h3 {
            font-size: 1.5em;
            margin-top: 20px;
        }
        ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        li {
            margin-bottom: 5px;
        }
        code {
            background-color: #f4f4f4;
            padding: 3px 6px;
            border-radius: 4px;
            font-family: monospace;
        }
    </style>
</head>
<body>

    <h1>Jellyfin Upscaler</h1>

    <p><strong>Enhance your video playback experience!</strong></p>
    <p>Jellyfin Upscaler is a powerful plugin that improves video quality by applying real-time upscaling. It dynamically adapts to your hardware's capabilities and works seamlessly within Jellyfin.</p>

    <h2>Features</h2>
    <ul>
        <li>🖥️ <strong>Real-Time Upscaling:</strong> Sharpen your video playback quality.</li>
        <li>⚙️ <strong>Hardware-Accelerated:</strong> Supports NVIDIA RTX, Apple Metal, Vulkan, and more.</li>
        <li>🔄 <strong>Automatic Fallback:</strong> Switches to software upscaling when no hardware support is detected.</li>
        <li>🌟 <strong>Fully Integrated:</strong> No need for external players—everything works within Jellyfin.</li>
    </ul>

    <h2>Installation Guide</h2>

    <h3>Step 1: Add the Repository to Jellyfin</h3>
    <ol>
        <li>Open Jellyfin and go to <strong>Dashboard > Plugins > Repositories</strong>.</li>
        <li>Click on <strong>Add Repository</strong> and fill in the details:
            <ul>
                <li><strong>Name:</strong> Jellyfin Upscaler</li>
                <li><strong>URL:</strong> <code>https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerRepo/main/repo.json</code></li>
            </ul>
        </li>
        <li>Click <strong>Save</strong> to confirm.</li>
    </ol>

    <h3>Step 2: Install the Plugin</h3>
    <ol>
        <li>Navigate to <strong>Dashboard > Plugins > Catalog</strong>.</li>
        <li>Find <strong>Jellyfin Upscaler</strong> in the plugin list.</li>
        <li>Click <strong>Install</strong> and follow the instructions.</li>
    </ol>

    <h3>Step 3: Enable and Configure</h3>
    <ol>
        <li>Restart Jellyfin if required.</li>
        <li>Go to <strong>Dashboard > Plugins > Installed Plugins</strong> and ensure <strong>Jellyfin Upscaler</strong> is enabled.</li>
        <li>Configure the settings (if necessary) to suit your device's hardware capabilities.</li>
    </ol>

    <h2>Supported Devices</h2>
    <ul>
        <li><strong>NVIDIA RTX GPUs:</strong> Utilizes CUDA for efficient upscaling.</li>
        <li><strong>Apple Devices (macOS, iOS):</strong> Powered by Apple Metal for optimal performance.</li>
        <li><strong>Android Devices:</strong> Leverages Vulkan for hardware acceleration.</li>
        <li><strong>Smart TVs and Web Browsers:</strong> Uses software-based upscaling as a fallback.</li>
    </ul>

    <h2>Troubleshooting</h2>
    <ul>
        <li><strong>Plugin Not Appearing in Catalog:</strong> Ensure the repository URL is added correctly in <strong>Dashboard > Plugins > Repositories</strong>.</li>
        <li><strong>Upscaling Not Working:</strong> Verify that your device supports the necessary hardware APIs (e.g., NVIDIA CUDA, Apple Metal, Vulkan).</li>
        <li><strong>Logs:</strong> Check the Jellyfin logs under <strong>Dashboard > Logs</strong> for any plugin-related errors.</li>
    </ul>

    <h2>License</h2>
    <p>This project is licensed under the MIT License. See the <a href="LICENSE">LICENSE</a> file for details.</p>

    <h2>Contributing</h2>
    <p>We welcome contributions! If you would like to improve this plugin or report an issue, feel free to open an issue or submit a pull request on our <a href="https://github.com/Kuschel-code/JellyfinUpscalerRepo">GitHub Repository</a>.</p>

</body>
</html>
