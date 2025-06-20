precision highp float;
varying vec2 vTexCoord;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;

// Enhanced bilinear interpolation with anti-aliasing
vec4 bilinearSample(sampler2D tex, vec2 coord, vec2 texSize) {
    vec2 texelSize = 1.0 / texSize;
    vec2 samplePos = coord * texSize - 0.5;
    vec2 f = fract(samplePos);
    vec2 centeredPos = floor(samplePos) + 0.5;
    
    // Sample the four nearest texels
    vec4 tl = texture2D(tex, (centeredPos + vec2(-0.5, -0.5)) * texelSize); // top-left
    vec4 tr = texture2D(tex, (centeredPos + vec2( 0.5, -0.5)) * texelSize); // top-right
    vec4 bl = texture2D(tex, (centeredPos + vec2(-0.5,  0.5)) * texelSize); // bottom-left
    vec4 br = texture2D(tex, (centeredPos + vec2( 0.5,  0.5)) * texelSize); // bottom-right
    
    // Interpolate
    vec4 top = mix(tl, tr, f.x);
    vec4 bottom = mix(bl, br, f.x);
    return mix(top, bottom, f.y);
}

void main() {
    gl_FragColor = bilinearSample(uTexture, vTexCoord, uTextureSize);
}
