import { Sparkles } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { Perf } from "r3f-perf";

import Room from "./Room";
import Background from "./Background";
import CameraRig from "./CameraRig";
import TextSections from "./TextSections";
import Camera from "./Camera";

const Experience = () => {
  return useMemo(() => (
    <>
      <Room position={[-6, -4, 0]} />
      <Camera />
      <TextSections />

      {/* Environment */}
      <CameraRig />
      <Background />
      <Sparkles
        color={"yellow"}
        count={40}
        scale={[6, 6.8, 4]}
        size={2}
        speed={1}
        position-z={30}
      />
      <Perf position="top-left" />
    </>
  ));
};

export default Experience;
