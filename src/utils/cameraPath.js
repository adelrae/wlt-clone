import * as THREE from "three";

export const pathPoints = [
  new THREE.Vector3(0, 0, 36),
  new THREE.Vector3(0, 0, -400),
];

export const shape = () => {
  const shape = new THREE.Shape();
  shape.moveTo(-0.1, -0.18);
  shape.lineTo(0.1, -0.18);

  return shape;
};

export const cameraPath = new THREE.CatmullRomCurve3(
  pathPoints,
  false,
  "centripetal",
  1
);
