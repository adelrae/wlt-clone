import { useGSAP } from "@gsap/react";
import { useProgress } from "@react-three/drei";
import { addEffect } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const Loading = () => {
  const { progress } = useProgress();
  const [isMobile, setIsMobile] = useState(true);
  const loaderRef = useRef();
  const progressRef = useRef();
  const progressBarRef = useRef();

  const tl = gsap.timeline();

  useEffect(() => {
    if (progress === 100) {
      tl.to(progressRef.current, {
        opacity: 0,
        duration: 0.5,
      });

      tl.to(progressBarRef.current, {
        opacity: 0,
        duration: 0.5,
      });

      tl.to(loaderRef.current, {
        translateY: "-100%",
      });
    }

    return () => gsap.killTweensOf(progressRef.current);
  }, [progress]);

  return (
    <div ref={loaderRef} className="loader-wrapper">
      <div className="loader">
        <div ref={progressRef} className="loader-progress">
          {progress.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

export default Loading;
