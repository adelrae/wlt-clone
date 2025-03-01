uniform float uTime;
varying vec2 vUv;

#include ../includes/cnoise.glsl

void main() {
    vec3 pos = position;

    float wave = cnoise(vec3(pos.yx * 2.0, uTime * 0.2));
    pos.z += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    // Varyings
    vUv = uv;
}