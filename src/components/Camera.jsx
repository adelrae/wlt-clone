import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useScroll } from "@react-three/drei";
import { useRef } from "react";

import { shape, cameraPath } from "../utils/cameraPath";
import { useCamera } from "../contexts/Camera";

const CURVE_AHEAD_CAMERA = 0.008;

const Camera = () => {
  const shapes = useRef(shape());
  const scroll = useScroll();
  const cameraGroup = useRef();
  const lastScroll = useRef(0);

  const { setCameraPosition, setLerpedScrollOffset } = useCamera();

  useFrame((state, delta) => {
    const scrollOffset = Math.max(0, scroll?.offset);

    let friction = 10;
    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scrollOffset,
      delta * friction
    );
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

    lastScroll.current = lerpedScrollOffset;

    const curPoint = cameraPath.getPoint(lerpedScrollOffset);

    // Follow the camera path
    cameraGroup.current?.position.lerp(curPoint, delta * 20);

    // Make the camera look ahead on the camera path
    const lookAtPoint = cameraPath.getPoint(
      Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
    );

    const currentLookAt = cameraGroup.current?.getWorldDirection(
      new THREE.Vector3()
    );

    const targetLookAt = new THREE.Vector3()
      .subVectors(curPoint, lookAtPoint)
      .normalize();

    const lookAt = currentLookAt?.lerp(targetLookAt, delta * 20);
    cameraGroup.current?.lookAt(
      cameraGroup.current?.position.clone().add(lookAt)
    );

    // handling functions
    setCameraPosition(cameraGroup.current?.position);
    setLerpedScrollOffset(lerpedScrollOffset);
  });

  return (
    <>
      {/* Camera */}
      <group ref={cameraGroup} position={[0, 0, 38]}>
        <PerspectiveCamera makeDefault position={[0, 0, 0]} fov={30} />
      </group>

      {/* cameraPath */}
      <group>
        <mesh>
          <extrudeGeometry
            args={[
              shapes.current,
              {
                steps: 512,
                bevelEnabled: true,
                extrudePath: cameraPath,
              },
            ]}
          />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>
    </>
  );
};

export default Camera;
