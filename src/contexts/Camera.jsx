import * as THREE from "three";
import { createContext, useContext, useState } from "react";

const Context = createContext();

export const CameraProvider = ({ children }) => {
  const [cameraPosition, setCameraPosition] = useState(
    new THREE.Vector3(-5, 0, 17)
  );
  const [lerpedScrollOffset, setLerpedScrollOffset] = useState(0);

  return (
    <Context.Provider
      value={{
        cameraPosition,
        setCameraPosition,
        lerpedScrollOffset,
        setLerpedScrollOffset,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCamera = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("useCamera must be used within a CameraProvider");
  }

  return context;
};
