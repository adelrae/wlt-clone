import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { textSections } from "../content/resources";
import { useCamera } from "../contexts/Camera";
import { Text } from "@react-three/drei";

const TextSections = () => {
  const textSectionsRef = useRef([]);
  const { cameraPosition } = useCamera();

  useFrame((state, delta) => {
    textSectionsRef.current?.forEach((textSection) => {
      const distance = cameraPosition?.distanceTo(textSection.position);
      if (!textSection.initialPosition) {
        textSection.initialPosition = textSection.position.clone();
      }
      const isNear = distance < 35;
      const targetOpacity = isNear ? 1 : 0;
      const targetY = isNear
        ? textSection.initialPosition.y
        : textSection.initialPosition.y - 2;
      const targetScaleY = isNear ? 1 : 0.5;

      textSection.material.opacity = THREE.MathUtils.lerp(
        textSection.material.opacity,
        targetOpacity,
        delta * 4
      );
      textSection.scale.y = THREE.MathUtils.lerp(
        textSection.scale.y,
        targetScaleY,
        delta * 4
      );
      textSection.position.y = THREE.MathUtils.lerp(
        textSection.position.y,
        targetY,
        delta * 4
      );
    });
  });

  return (
    <>
      <group position-z={30}>
        <Text
          font="/fonts/fonnts.com-Neulis_Sans_Medium.ttf"
          position={[-1.75, -1.25, 0]}
          fontSize={0.55}
          maxWidth={5}
          lineHeight={1}
        >
          Elevate Your Digital Presence
        </Text>
        <Text
          font="/fonts/fonnts.com-Neulis_Sans_Regular.ttf"
          position={[-3.45, -0.4, 0]}
          color={"#D15606"}
          fontSize={0.1}
          letterSpacing={0.2}
        >
          Hi, WE ARE WLT DESIGN
        </Text>
        <Text
          font="/fonts/fonnts.com-Neulis_Sans_Regular.ttf"
          position={[2.4, -1.2, 0]}
          color={"#ffffff"}
          fontSize={0.125}
          maxWidth={2.3}
          lineHeight={1.5}
        >
          We make great digital experiences. Scroll to find out how we do it.
        </Text>
      </group>

      <group>
        {textSections.map((section, index) => (
          <Text
            ref={(el) => (textSectionsRef.current[index] = el)}
            font={
              section.isTitle
                ? "/fonts/fonnts.com-Neulis_Sans_Medium.ttf"
                : "/fonts/fonnts.com-Neulis_Sans_Regular.ttf"
            }
            fontSize={section.isTitle ? 1.3 : 0.35}
            maxWidth={section.maxWidth}
            lineHeight={section.isTitle ? 1 : 1.5}
            position={section.position}
            key={index}
          >
            {section.text}
            <meshBasicMaterial color={"#fff"} opacity={0} />
          </Text>
        ))}
      </group>
    </>
  );
};

export default TextSections;
