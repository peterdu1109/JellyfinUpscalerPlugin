precision highp float;
varying vec2 vTexCoord;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;

#define LANCZOS_RADIUS 2.0
#define PI 3.14159265359

// Lanczos kernel function
float lanczos(float x) {
    if (abs(x) < 0.0001) return 1.0;
    if (abs(x) >= LANCZOS_RADIUS) return 0.0;
    
    float pix = PI * x;
    return LANCZOS_RADIUS * sin(pix) * sin(pix / LANCZOS_RADIUS) / (pix * pix);
}

vec4 lanczosSample(sampler2D tex, vec2 coord, vec2 texSize) {
    vec2 texelSize = 1.0 / texSize;
    vec2 samplePos = coord * texSize;
    vec2 centerPos = floor(samplePos - 0.5) + 0.5;
    vec2 f = samplePos - centerPos;
    
    vec4 color = vec4(0.0);
    float weightSum = 0.0;
    
    // Sample in a 4x4 grid around the center
    for (int x = -1; x <= 2; x++) {
        for (int y = -1; y <= 2; y++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 sampleCoord = (centerPos + offset) * texelSize;
            
            // Calculate Lanczos weights
            float wx = lanczos(f.x - float(x));
            float wy = lanczos(f.y - float(y));
            float weight = wx * wy;
            
            // Accumulate color and weight
            color += texture2D(tex, sampleCoord) * weight;
            weightSum += weight;
        }
    }
    
    // Normalize by total weight
    return weightSum > 0.0 ? color / weightSum : texture2D(tex, coord);
}

void main() {
    gl_FragColor = lanczosSample(uTexture, vTexCoord, uTextureSize);
}
