import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import { ScrollControls, useProgress } from "@react-three/drei";
import Cursor from "./components/Cursor";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";

const Scene = () => {
  const { progress } = useProgress();

  return (
    <>
      <Loading progress={progress} />
      <Canvas
        gl={{
          alpha: false,
          antialias: false,
          toneMapping: THREE.NoToneMapping,
        }}
        dpr={[1, 2]}
      >
        <ScrollControls pages={4} damping={0.25}>
          <Experience />
        </ScrollControls>
      </Canvas>
      <Cursor />
    </>
  );
};

export default Scene;
