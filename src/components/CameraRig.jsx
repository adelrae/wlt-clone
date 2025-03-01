import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const DISTANCE = 200;
const SPEED = 2;

export default function CameraRig() {
  useFrame((state, delta) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      (state.pointer.x * state.viewport.width) / DISTANCE,
      delta * SPEED
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      (state.pointer.y * state.viewport.height) / DISTANCE,
      delta * SPEED
    );
  });
}
