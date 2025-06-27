precision highp float;
varying vec2 vTexCoord;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;

// Bicubic interpolation function
vec4 cubic(float x) {
    float x2 = x * x;
    float x3 = x2 * x;
    vec4 w;
    w.x = -0.5 * x3 + x2 - 0.5 * x;
    w.y = 1.5 * x3 - 2.5 * x2 + 1.0;
    w.z = -1.5 * x3 + 2.0 * x2 + 0.5 * x;
    w.w = 0.5 * x3 - 0.5 * x2;
    return w;
}

vec4 bicubicSample(sampler2D tex, vec2 coord, vec2 texSize) {
    vec2 texelSize = 1.0 / texSize;
    coord *= texSize;
    
    vec2 fxy = fract(coord);
    coord -= fxy;
    
    vec4 xcubic = cubic(fxy.x);
    vec4 ycubic = cubic(fxy.y);
    
    vec4 c = vec4(coord.x - 0.5, coord.x + 1.5, coord.y - 0.5, coord.y + 1.5);
    vec4 s = vec4(xcubic.x + xcubic.y, xcubic.z + xcubic.w, ycubic.x + ycubic.y, ycubic.z + ycubic.w);
    vec4 offset = c + vec4(xcubic.y, xcubic.w, ycubic.y, ycubic.w) / s;
    
    vec4 sample0 = texture2D(tex, vec2(offset.x, offset.z) * texelSize);
    vec4 sample1 = texture2D(tex, vec2(offset.y, offset.z) * texelSize);
    vec4 sample2 = texture2D(tex, vec2(offset.x, offset.w) * texelSize);
    vec4 sample3 = texture2D(tex, vec2(offset.y, offset.w) * texelSize);
    
    float sx = s.x / (s.x + s.y);
    float sy = s.z / (s.z + s.w);
    
    return mix(
        mix(sample3, sample2, sx),
        mix(sample1, sample0, sx),
        sy
    );
}

void main() {
    gl_FragColor = bicubicSample(uTexture, vTexCoord, uTextureSize);
}
