import * as THREE from "three";
import { useLoader, useThree } from "@react-three/fiber";

const Background = () => {
  const { camera } = useThree();
  const texture = useLoader(THREE.TextureLoader, "/sky_hdri7.webp");

  texture.offset.y = -0.09; // Move the texture UP

  return (
    <>
      <mesh position-z={-800} position-y={-100}>
        <sphereGeometry args={[600, 8, 8]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
    </>
  );
};

export default Background;
