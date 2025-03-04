import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Scene from "./Scene";
import { CameraProvider } from "./contexts/Camera";
import { ResponsiveProvider } from "./contexts/Responsive";
import Responsive from "./components/Responsive";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ResponsiveProvider>
      <CameraProvider>
        <Scene />
        <Responsive />
      </CameraProvider>
    </ResponsiveProvider>
  </StrictMode>
);
