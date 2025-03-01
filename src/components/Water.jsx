import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

import waterVertexShader from "../shaders/water/vertex.glsl";
import waterFragmentShader from "../shaders/water/fragment.glsl";
import { extend, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";

const WaterMaterial = shaderMaterial(
  {
    uWaterTexture: null,
    uTime: 0,
  },
  waterVertexShader,
  waterFragmentShader
);

extend({ WaterMaterial });

const Water = () => {
  const waterRef = useRef();

  const waterTexture = useLoader(
    THREE.TextureLoader,
    "/model-textures/waterNormal1.png"
  );

  useFrame((state) => {
    waterRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  useEffect(() => {
    if (waterRef.current) {
      waterRef.current.uniforms.uWaterTexture.value = waterTexture;
    }
  }, []);

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-16.5} position-z={20}>
      <planeGeometry args={[35, 210, 32, 32]} />
      <waterMaterial ref={waterRef} />
    </mesh>
  );
};

export default Water;
