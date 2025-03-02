import * as THREE from "three";

export const CAMERA_START_POSITION = 40;

export const PATH_POINTS = [
  new THREE.Vector3(0, 0, CAMERA_START_POSITION),
  new THREE.Vector3(0, 0, -490),
];

export const PATH_SHAPE = () => {
  const shape = new THREE.Shape();
  shape.moveTo(-0.1, -0.18);
  shape.lineTo(0.1, -0.18);

  return shape;
};

export const CAMERA_PATH = new THREE.CatmullRomCurve3(
  PATH_POINTS,
  false,
  "centripetal",
  1
);
