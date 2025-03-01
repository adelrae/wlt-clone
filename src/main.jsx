import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Scene from "./Scene";
import { CameraProvider } from "./contexts/Camera";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CameraProvider>
      <Scene />
    </CameraProvider>
  </StrictMode>
);
