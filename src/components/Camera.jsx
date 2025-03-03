import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useScroll } from "@react-three/drei";
import { useRef } from "react";
import { CAMERA_START_POSITION, CAMERA_PATH } from "../utils/config";
import { useCamera } from "../contexts/Camera";

// Define constants
const ROTATION_THRESHOLD = 1; // Start tilting and rotating at t=0.9
const MAX_TILT_ANGLE = -Math.PI / 4.3; // Negative 45 degrees for downward tilt

const Camera = () => {
  const scroll = useScroll();
  const cameraGroup = useRef();
  const lastScroll = useRef(0);

  const { setCameraPosition, setLerpedScrollOffset } = useCamera();

  useFrame((state, delta) => {
    const scrollOffset = Math.max(0, scroll?.offset);
    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scrollOffset,
      delta * 10
    );
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);
    lastScroll.current = lerpedScrollOffset;

    // Follow the path downward
    const pathT = lerpedScrollOffset / ROTATION_THRESHOLD;
    const curPoint = CAMERA_PATH.getPoint(Math.min(pathT, 1));
    cameraGroup.current?.position.lerp(curPoint, delta * 20);

    // Apply downward tilt
    const tiltProgress = THREE.MathUtils.smoothstep(
      lerpedScrollOffset,
      0.7,
      ROTATION_THRESHOLD
    );
    const tiltAngle = tiltProgress * MAX_TILT_ANGLE;
    cameraGroup.current.rotation.set(tiltAngle, 0, 0);

    // Update
    setCameraPosition(cameraGroup.current?.position);
    setLerpedScrollOffset(lerpedScrollOffset);
  });

  return (
    <>
      <group ref={cameraGroup} position={[0, 0, CAMERA_START_POSITION]}>
        <PerspectiveCamera makeDefault fov={30} />
      </group>
    </>
  );
};

export default Camera;
