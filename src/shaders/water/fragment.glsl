uniform sampler2D uWaterTexture;
uniform float uTime;
varying vec2 vUv;

#include ../includes/cnoise.glsl

void main() {
    vec2 waveUV = vUv;
    waveUV.x += sin(uTime + vUv.y * 5.0) * 0.05;
    waveUV.y += cos(uTime + vUv.x * 5.0) * 0.05;
    
    vec3 normalColor = texture2D(uWaterTexture, waveUV).rgb;

    // vec3 baseColor = vec3(0.1, 0.4, 0.2) + sin(cnoise(vec3(waveUV * 6.0, uTime * 0.03)) * uTime * 0.03) * normalColor * 0.5;
    vec3 baseColor = vec3(0.1, 0.4, 0.2) + sin(cnoise(vec3(waveUV * 3.0, uTime * 0.08))) * normalColor * 0.5;

    vec3 finalColor = mix(baseColor, vec3(1.0), normalColor.r);

    gl_FragColor = vec4(finalColor, 1.0);
}
