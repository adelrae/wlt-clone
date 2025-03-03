import { useGSAP } from "@gsap/react";
import { addEffect } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const Loading = ({ progress }) => {
  const [isMobile, setIsMobile] = useState(false);
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
        <div
          ref={progressRef}
          className="loader-progress"
          style={
            isMobile
              ? { textAlign: "center" }
              : { transform: `translateX(${progress - 8}%)` }
          }
        >
          {progress}%
        </div>
        <div
          ref={progressBarRef}
          className="loader-progressbar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Loading;
