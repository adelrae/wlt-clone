import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import { ScrollControls } from "@react-three/drei";
import Cursor from "./components/Cursor";
import Loading from "./components/Loading";
import { useResponsive } from "./contexts/Responsive";

const Scene = () => {
  const { isMobile } = useResponsive();

  return (
    <>
      <Loading />
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
      {!isMobile && <Cursor />}
    </>
  );
};

export default Scene;
