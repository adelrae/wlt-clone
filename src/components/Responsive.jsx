import { addEffect } from "@react-three/fiber";
import { useEffect } from "react";
import { useResponsive } from "../contexts/Responsive";

const Responsive = () => {
  const { isMobile, setIsMobile } = useResponsive();

  useEffect(() => {
    const frame = addEffect(() => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    });

    return () => {
      frame();
    };
  }, [isMobile, setIsMobile]);
};

export default Responsive;
