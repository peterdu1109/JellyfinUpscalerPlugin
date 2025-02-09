import * as tf from "@tensorflow/tfjs";

async function runBenchmarkTest() {
    console.log("Starting Enhanced Benchmark Test...");

    const testImages = [
        "test_image1.jpg",
        "test_image2.jpg",
        "test_image3.jpg"
    ];

    let totalDuration = 0;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 128;
    canvas.height = 128;

    try {
        // Load the AI model
        const model = await tf.loadGraphModel('./models/ESRGAN/model.json');

        for (let imageUrl of testImages) {
            const testImage = new Image();
            testImage.src = imageUrl;

            // Wait for the image to load
            await new Promise((resolve, reject) => {
                testImage.onload = resolve;
                testImage.onerror = () => reject(`Failed to load image: ${imageUrl}`);
            });

            // Prepare the input tensor
            ctx.drawImage(testImage, 0, 0, canvas.width, canvas.height);
            const inputTensor = tf.browser.fromPixels(canvas);

            // Measure the processing time
            const start = performance.now();
            const outputTensor = model.execute(inputTensor);
            await tf.browser.toPixels(outputTensor, canvas);
            const end = performance.now();

            const duration = end - start;
            console.log(`Processed ${imageUrl} in ${duration.toFixed(2)} ms.`);
            totalDuration += duration;
        }

        const averageDuration = totalDuration / testImages.length;
        console.log(`Average processing time per frame: ${averageDuration.toFixed(2)} ms.`);

        // Analyze the result
        if (averageDuration < 500) {
            alert("Benchmark Result: Your device is suitable for AI-Upscaling.");
            saveBenchmarkResult(true);
        } else {
            alert("Benchmark Result: Your device is not suitable for AI-Upscaling.");
            saveBenchmarkResult(false);
        }
    } catch (error) {
        console.error("Error during benchmark test:", error);
        alert("Benchmark Test Failed: Check console for details.");
    }
}

function saveBenchmarkResult(isSuitable) {
    localStorage.setItem("aiUpscalingEnabled", isSuitable ? "true" : "false");
    console.log(`Benchmark result saved: AI-Upscaling enabled = ${isSuitable}`);
}
