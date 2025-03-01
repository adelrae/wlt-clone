import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useScroll } from "@react-three/drei";
import { useRef } from "react";
import { CAMERA_START_POSITION, CAMERA_PATH } from "../utils/config";
import { useCamera } from "../contexts/Camera";

const Camera = () => {
  const scroll = useScroll();
  const cameraGroup = useRef();
  const lastScroll = useRef(0);

  const { setCameraPosition, setLerpedScrollOffset } = useCamera();

  useFrame((state, delta) => {
    const scrollOffset = Math.max(0, scroll?.offset);

    // Smooth the scroll offset
    let friction = 10;
    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scrollOffset,
      delta * friction
    );
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);
    lastScroll.current = lerpedScrollOffset;

    // Get the current position on the CatmullRomCurve3 path
    const curPoint = CAMERA_PATH.getPoint(lerpedScrollOffset);

    // Smoothly move the camera to the current point
    cameraGroup.current?.position.lerp(curPoint, delta * 20);

    // Update context
    setCameraPosition(cameraGroup.current?.position);
    setLerpedScrollOffset(lerpedScrollOffset);
  });

  return (
    <group ref={cameraGroup} position={[0, 0, CAMERA_START_POSITION]}>
      <PerspectiveCamera makeDefault fov={30} />
    </group>
  );
};

export default Camera;
