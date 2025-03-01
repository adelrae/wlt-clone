import * as THREE from "three";
import { useLoader, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

const Background = () => {
  const { camera } = useThree();
  const texture = useLoader(THREE.TextureLoader, "/sky_hdri7.webp");
  const textures = useLoader(THREE.TextureLoader, []);

  texture.offset.y = -0.09; // Move the texture UP
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <mesh position-z={-800} rotation={[-0.3, Math.PI, 0]}>
        <sphereGeometry args={[600, 8, 8]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>

      {/* <Environment
        resolution={32}
        files={[
          "/Standard-Cube-Map/px.png",
          "/Standard-Cube-Map/nx.png",
          "/Standard-Cube-Map/py.png",
          "/Standard-Cube-Map/ny.png",
          "/Standard-Cube-Map/pz.png",
          "/Standard-Cube-Map/nz.png",
        ]}
        background
      /> */}
    </>
  );
};

export default Background;
