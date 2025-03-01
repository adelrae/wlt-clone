import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import { ScrollControls, useProgress } from "@react-three/drei";
import Cursor from "./components/Cursor";

const Scene = () => {
  const { progress } = useProgress();

  return (
    <>
      <Canvas
        gl={{
          alpha: false,
          antialias: false,
          toneMapping: THREE.NoToneMapping,
        }}
        dpr={[1, 2]}
      >
        <ScrollControls pages={4} damping={0.1}>
          <Experience />
        </ScrollControls>
      </Canvas>
      <Cursor />
    </>
  );
};

export default Scene;
