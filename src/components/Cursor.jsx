import * as THREE from "three";
import { addEffect } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const lerp = (x, y, a) => x * (1 - a) + y * a;

const Cursor = () => {
  const cursorRef = useRef();

  const mousePositions = useRef({
    x: 0,
    y: 0,
  });
  const lerpedCursor = useRef({
    x: 0,
    y: 0,
  });

  // Get cursor position
  const getCursorPosition = (e) => {
    const { clientX, clientY } = e;
    mousePositions.current = {
      x: clientX,
      y: clientY,
    };
  };

  // Move cursor
  const moveMouse = (x, y) => {
    gsap.set(cursorRef.current, {
      x,
      y,
      xPercent: -50,
      yPercent: -50,
    });
  };

  useEffect(() => {
    const animate = addEffect(() => {
      const { x, y } = lerpedCursor.current;

      lerpedCursor.current = {
        x: THREE.MathUtils.lerp(x, mousePositions.current.x, 0.1),
        y: THREE.MathUtils.lerp(y, mousePositions.current.y, 0.1),
      };
      moveMouse(lerpedCursor.current.x, lerpedCursor.current.y);
    });

    return () => {
      animate();
    };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", getCursorPosition);

    return () => window.addEventListener("mousemove", getCursorPosition);
  });

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      <img
        style={{
          width: "50px",
          height: "50px",
          pointerEvents: "none",
        }}
        src="/particles.png"
        alt=""
      />
    </div>
  );
};

export default Cursor;
