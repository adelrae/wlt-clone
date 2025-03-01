uniform float uTime;
varying vec2 vUv;

void main() {
    // Distance from the left side (adjust to control fade direction)
    float gradient = smoothstep(0.0, 1.0, vUv.x * 3.7); 

    // Soft fade using a radial falloff
    float radial = 1.0 - length(vUv - vec2(0.0, 0.5)) * 1.7; 
    radial = clamp(radial, 0.0, 1.0);

    // Final alpha blending
    float pulse = 0.7 + 0.3 * sin(uTime * 2.0);
    float alpha = pow(gradient * radial, 1.7) * pulse; 

    // Yellowish color
    vec3 color = vec3(1.0, 0.85, 0.4);

    // Output color with transparency
    gl_FragColor = vec4(color, alpha);
}