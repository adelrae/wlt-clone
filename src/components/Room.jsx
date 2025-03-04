import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import {
  useGLTF,
  useAnimations,
  shaderMaterial,
  useScroll,
} from "@react-three/drei";
import { extend, useFrame, useLoader } from "@react-three/fiber";
import godrayVertexShader from "../shaders/godray/vertex.glsl";
import godrayFragmentShader from "../shaders/godray/fragment.glsl";
import { useCamera } from "../contexts/Camera";
import Water from "./Water";
import { useResponsive } from "../contexts/Responsive";

// VARIABLES
const roomInitialPositionX = -6;
const roomInitialRotationY = 0.3;

// Define all texture paths in one place
const TEXTURE_PATHS = [
  "/model-textures/entrance_main-com-mobile.jpg",
  "/model-textures/entrance_ray-min-mobile.png",
  "/model-textures/room1_floor-resize-copy.webp",
  "/model-textures/room1_furniture1-resize.webp",
  "/model-textures/room1_furniture2-adjusted-copy.webp",
  "/model-textures/room1_wall-resize-copy.webp",
  "/model-textures/room1_window-resize-copy.webp",
  "/model-textures/room2_blocks-resize(1).webp",
  "/model-textures/room2_floor-resize(1).webp",
  "/model-textures/room2_products-topaz-resize(1).webp",
  "/model-textures/room2_wall-topaz-compressed.webp",
  "/model-textures/room3_deer-den(1).webp",
  "/model-textures/room3_floor-resize(1).webp",
  "/model-textures/room3_plants1_com1.webp",
  "/model-textures/room3_plants2_com1.webp",
  "/model-textures/room3_rocks-den.webp",
  "/model-textures/room4_floor-resize(1).webp",
  "/model-textures/room4_items-topaz(1).webp",
  "/model-textures/room4_platforms-den(1).webp",
  "/model-textures/room4_roof-topaz(1).webp",
];

// Shaders
const GodrayMaterial = shaderMaterial(
  {
    uTime: 0,
  },
  godrayVertexShader,
  godrayFragmentShader
);

extend({ GodrayMaterial });

export default function Room(props) {
  // Model
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/room.glb");
  const { actions, names, mixer } = useAnimations(animations, group);

  const godrayRef = useRef();
  const windowsRef = useRef([]);

  const computerMeshRef = useRef();
  const mobileMeshRef = useRef();

  const { cameraPosition, lerpedScrollOffset } = useCamera();
  const { isMobile } = useResponsive();

  // Animation
  const firstAnimationRef = useRef();
  const playedOnce = useRef(false);
  const hasStartedOtherAnimations = useRef(false);
  const scroll = useScroll();

  const [
    entranceWall,
    entranceWallRay,
    room1floor,
    room1furniture1,
    room1furniture2,
    room1wall,
    room1window,
    room2blocks,
    room2floor,
    room2products,
    room2wall,
    room3deer,
    room3floor,
    room3plants1,
    room3plants2,
    room3rocks,
    room4floor,
    room4items,
    room4platforms,
    room4roof,
  ] = useLoader(THREE.TextureLoader, TEXTURE_PATHS);

  useEffect(() => {
    if (actions && names.length > 0) {
      firstAnimationRef.current = actions[names[0]];

      // Set animation to not loop
      firstAnimationRef.current.setLoop(THREE.LoopOnce);
      firstAnimationRef.current.clampWhenFinished = true;

      // Play once to enable control, then pause immediately
      firstAnimationRef.current.reset();
      firstAnimationRef.current.play();
    }
  }, [actions, names]);

  useEffect(() => {
    [
      entranceWall,
      entranceWallRay,
      room1floor,
      room1furniture1,
      room1furniture2,
      room1wall,
      room1window,
      room2blocks,
      room2floor,
      room2products,
      room2wall,
      room3deer,
      room3floor,
      room3plants1,
      room3plants2,
      room3rocks,
      room4floor,
      room4items,
      room4platforms,
      room4roof,
    ].forEach((texture) => {
      texture.flipY = false;
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    });
  }, []);

  useEffect(() => {
    const config = {
      crossOrigin: "anonymous",
      loop: true,
      muted: true,
    };

    if (isMobile) {
      computerMeshRef.current.material.color.set(new THREE.Color("#fff"));
      mobileMeshRef.current.material.color.set(new THREE.Color("#fff"));
    } else {
      // Computer Texure
      const computerVideo = document.createElement("video");
      computerVideo.src = "/model-textures/desktop-video.mp4";
      computerVideo.crossOrigin = config.crossOrigin;
      computerVideo.loop = config.loop;
      computerVideo.muted = config.muted;
      computerVideo.play();

      const computerVideoTexture = new THREE.VideoTexture(computerVideo);
      computerVideoTexture.minFilter = THREE.LinearFilter;
      computerVideoTexture.magFilter = THREE.LinearFilter;
      computerVideoTexture.format = THREE.RGBAFormat;

      // Mobile Texure
      const mobileVideo = document.createElement("video");
      mobileVideo.src = "/model-textures/mobile-video.mp4";
      mobileVideo.crossOrigin = config.crossOrigin;
      mobileVideo.loop = config.loop;
      mobileVideo.muted = config.muted;
      mobileVideo.play();

      const mobileVideoTexture = new THREE.VideoTexture(mobileVideo);
      mobileVideoTexture.minFilter = THREE.LinearFilter;
      mobileVideoTexture.magFilter = THREE.LinearFilter;
      mobileVideoTexture.format = THREE.RGBAFormat;

      // Attaching textures
      if (computerMeshRef.current) {
        computerMeshRef.current.material.map = computerVideoTexture;
        computerMeshRef.current.material.needsUpdate = true;
      }
      if (mobileMeshRef.current) {
        mobileMeshRef.current.material.map = mobileVideoTexture;
        mobileMeshRef.current.material.needsUpdate = true;
      }

      // Cleanup
      return () => {
        computerVideo.pause();
        computerVideo.remove();
        computerVideoTexture.dispose();
        mobileVideo.pause();
        mobileVideo.remove();
        mobileVideoTexture.dispose();
      };
    }
  }, [isMobile]);

  useFrame((state, delta) => {
    const cameraPos = cameraPosition;

    // Godray / Window
    if (godrayRef.current) {
      godrayRef.current.material.uniforms.uTime.value =
        state.clock.getElapsedTime();
    }
    if (windowsRef.current) {
      // Adjust the fade range: Start fading earlier
      const fadeStart = 14; // Start fading when 5 units away
      const fadeEnd = 4; // Fully faded when 1 unit away

      windowsRef.current.forEach((window) => {
        // Windows
        const windowPos = window.position;

        // Calculate distance
        const distance = cameraPos?.distanceTo(windowPos);

        // Map distance to opacity (smoothstep for smooth transition)
        const opacity = THREE.MathUtils.smoothstep(
          distance,
          fadeEnd,
          fadeStart
        );

        window.material.opacity = opacity; // Apply opacity
      });
    }

    // Rooms animations
    if (actions && names.length > 0) {
      const animationDuration = firstAnimationRef.current.getClip().duration;
      let time;

      if (windowsRef.current) {
        const lastWindow = windowsRef.current[windowsRef.current.length - 1];
        let distanceToLastWindow = cameraPos?.distanceTo(lastWindow.position);
        const hasPassedLastWindow = cameraPos?.z < lastWindow.position.z;

        if (distanceToLastWindow < 15) {
          // First animation
          time = animationDuration - 0.416;
          firstAnimationRef.current.time = time;

          // Remaining aniimations
          if (!hasStartedOtherAnimations.current) {
            Object.keys(actions).forEach((key, index) => {
              if (index > 0) {
                actions[key].reset(); // Reset to start from beginning
                actions[key].play(); // Play the animation
              }
            });
            hasStartedOtherAnimations.current = true;
          }
        }

        if (!hasPassedLastWindow) {
          time = (scroll.offset * animationDuration) / 0.9;
          firstAnimationRef.current.time = time;
        }

        // If the camera has passed the window, make the distance negative
        if (hasPassedLastWindow) {
          distanceToLastWindow *= -1;
        }
      }
    }

    // Reset the room's position
    if (group.current) {
      const scaledScroll = Math.min(lerpedScrollOffset / 0.1, 1);

      group.current.position.x = THREE.MathUtils.lerp(
        roomInitialPositionX,
        0,
        scaledScroll
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        roomInitialRotationY,
        0,
        scaledScroll
      );
    }

    // Attach textures at start
    if (!playedOnce.current && firstAnimationRef.current) {
      const time = firstAnimationRef.current.getClip().duration - 0.416;
      firstAnimationRef.current.time = time;
      mixer.setTime(time);

      firstAnimationRef.current.reset();
      firstAnimationRef.current.play();

      setTimeout(() => {
        firstAnimationRef.current.time = 0;
        playedOnce.current = true;
      }, 50);
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="entrance_wall"
          castShadow
          receiveShadow
          geometry={nodes.entrance_wall.geometry}
          //   material={nodes.entrance_wall.material}
          position={[3.295, 0.322, 28.416]}
        >
          <meshBasicMaterial map={entranceWall} />
        </mesh>
        <group
          name="Sphere001"
          position={[2.896, 66.135, -292.125]}
          scale={16.039}
        />
        <group
          name="OfficeChair_LP"
          position={[9.729, -2.154, -29.002]}
          rotation={[Math.PI / 2, 0, 0.483]}
          scale={0.045}
        />
        <mesh
          name="Cube001_room1_furniture2"
          castShadow
          receiveShadow
          geometry={nodes.Cube001_room1_furniture2.geometry}
          // material={nodes.Cube001_room1_furniture2.material}
          position={[7.505, 0.909, -24.57]}
          rotation={[0, -0.477, 0]}
        >
          <meshBasicMaterial map={room1furniture2} />
        </mesh>
        <mesh
          name="Cube006_room1_furniture1"
          castShadow
          receiveShadow
          geometry={nodes.Cube006_room1_furniture1.geometry}
          // material={nodes.Cube006_room1_furniture1.material}
          position={[0, -0.825, -15.285]}
          scale={[2.824, 0.524, 1.768]}
        >
          <meshBasicMaterial map={room1furniture1} />
        </mesh>
        <group
          name="Cylinder016"
          position={[747.498, 10.046, -28.699]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          name="lamp_room1_furniture2"
          castShadow
          receiveShadow
          geometry={nodes.lamp_room1_furniture2.geometry}
          // material={nodes.lamp_room1_furniture2.material}
          position={[-0.875, -1.886, -29.951]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial map={room1furniture2} />
        </mesh>
        <group
          name="Cylinder034"
          position={[2451.771, 319.992, -18.848]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          name="Cube016_room1_wall"
          castShadow
          receiveShadow
          geometry={nodes.Cube016_room1_wall.geometry}
          // material={nodes.Cube016_room1_wall.material}
          position={[14.932, 4.88, 4.536]}
          scale={17.488}
        >
          <meshBasicMaterial map={room1wall} />
        </mesh>
        <mesh
          name="cssdesignawards_room1_furniture2_bloom"
          castShadow
          receiveShadow
          geometry={nodes.cssdesignawards_room1_furniture2_bloom.geometry}
          // material={nodes.cssdesignawards_room1_furniture2_bloom.material}
          position={[-1.346, 0.184, -14.829]}
          rotation={[Math.PI / 2, 0, 0.611]}
          scale={142.492}
        >
          <meshBasicMaterial map={room1furniture2} />
        </mesh>
        <mesh
          name="hello_world_room1_floor"
          castShadow
          receiveShadow
          geometry={nodes.hello_world_room1_floor.geometry}
          //   material={nodes.hello_world_room1_floor.material}
          position={[-8.987, 6.96, -35.337]}
          rotation={[1.571, 0, 0]}
          scale={121.723}
        >
          <meshBasicMaterial map={room1floor} />
        </mesh>
        <group
          name="camera_empty"
          position={[-9.92, 4.63, 37.565]}
          rotation={[1.543, -0.021, 0.64]}
        />
        <mesh
          name="Cube021"
          castShadow
          receiveShadow
          geometry={nodes.Cube021.geometry}
          material={nodes.Cube021.material}
          position={[22.711, 4.88, -9.811]}
          scale={17.488}
        />
        <mesh
          name="Cylinder030_room1_window"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder030_room1_window.geometry}
          // material={nodes.Cylinder030_room1_window.material}
          position={[-0.522, 8.067, -16.613]}
          scale={0.04}
        >
          <meshBasicMaterial map={room1window} />
        </mesh>
        <mesh
          name="Cylinder030_white_mat"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder030_white_mat.geometry}
          // material={nodes.Cylinder030_white_mat.material}
          position={[-0.522, 8.067, -16.613]}
          scale={0.04}
        >
          <meshBasicMaterial color={"#FFDDB5"} />
        </mesh>
        <mesh
          ref={(el) => (windowsRef.current[2] = el)}
          name="room_entrance_3_bloom"
          castShadow
          receiveShadow
          geometry={nodes.room_entrance_3_bloom.geometry}
          // material={nodes.room_entrance_3_bloom.material}
          position={[0, 4.019, -165.855]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[2.36, 1.113, 2.337]}
        >
          <meshBasicMaterial color={"#FFFFBC"} transparent={true} />
        </mesh>
        <mesh
          ref={(el) => (windowsRef.current[1] = el)}
          name="room_entrance_2_bloom"
          castShadow
          receiveShadow
          geometry={nodes.room_entrance_2_bloom.geometry}
          // material={nodes.room_entrance_2_bloom.material}
          position={[0.08, 4.069, -35.497]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.77, 1, 1.63]}
        >
          <meshBasicMaterial color={"#FFFFBC"} transparent={true} />
        </mesh>
        <mesh
          ref={(el) => (windowsRef.current[0] = el)}
          name="room_entrance_1_bloom"
          castShadow
          receiveShadow
          geometry={nodes.room_entrance_1_bloom.geometry}
          // material={nodes.room_entrance_1_bloom.material}
          position={[0.08, 4.069, 22.502]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[1.191, 1.547, 2.522]}
        >
          <meshBasicMaterial color={"#FFFFBC"} transparent={true} />
        </mesh>
        <mesh
          ref={godrayRef}
          name="entrance_godray"
          castShadow
          receiveShadow
          geometry={nodes.entrance_godray.geometry}
          // material={nodes.entrance_godray.material}
          position={[-0.057, 4.068, 25.754]}
          scale={0.993}
        >
          <godrayMaterial transparent={true} />
        </mesh>
        <group
          name="cameraBezierCircle"
          position={[-0.605, 4.28, -580.266]}
          scale={226.27}
        />
        <group
          name="cameraBezierCircle001"
          position={[-0.605, 4.28, -580.266]}
          scale={226.27}
        />
        <group
          name="camera_empty002"
          position={[-9.92, 4.63, 37.565]}
          rotation={[1.543, -0.021, 0.64]}
        />
        {/* <mesh
          name="room_entrance-3_cover"
          castShadow
          receiveShadow
          geometry={nodes["room_entrance-3_cover"].geometry}
          material={nodes["room_entrance-3_cover"].material}
          position={[0, 4.019, -166.032]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[2.36, 1.113, 2.337]}
        /> */}
        {/* <mesh
          name="room_entrance-2_cover"
          castShadow
          receiveShadow
          geometry={nodes["room_entrance-2_cover"].geometry}
          material={nodes["room_entrance-2_cover"].material}
          position={[0.08, 4.069, -35.592]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.77, 1, 1.63]}
        /> */}
        {/* <mesh
          name="room_entrance_1_cover"
          castShadow
          receiveShadow
          geometry={nodes.room_entrance_1_cover.geometry}
          material={nodes.room_entrance_1_cover.material}
          position={[0.08, 4.069, 22.351]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[1.191, 1.547, 2.522]}
        /> */}
        <group
          name="Plane_copy_low"
          position={[20.7, -1.474, -116.414]}
          rotation={[0, -0.744, 0]}
          scale={3.268}
        />
        <group name="room2_empty" position={[-0.226, -623.018, -122.643]}>
          <mesh
            name="Box055_room2_products"
            castShadow
            receiveShadow
            geometry={nodes.Box055_room2_products.geometry}
            // material={nodes.Box055_room2_products.material}
            position={[-21.768, -5.706, 6.512]}
            rotation={[2.595, -1.334, 2.66]}
            scale={0.061}
          >
            <meshBasicMaterial map={room2products} />
          </mesh>
          <mesh
            name="cologne_room2_products"
            castShadow
            receiveShadow
            geometry={nodes.cologne_room2_products.geometry}
            // material={nodes.cologne_room2_products.material}
            position={[14.508, -4.358, -27.446]}
            rotation={[-0.031, 0.971, -0.114]}
            scale={1.46}
          >
            <meshBasicMaterial map={room2products} />
          </mesh>
          <mesh
            name="Cube034_room2_blocks"
            castShadow
            receiveShadow
            geometry={nodes.Cube034_room2_blocks.geometry}
            // material={nodes.Cube034_room2_blocks.material}
            position={[14.848, -13.318, -32.906]}
          >
            <meshBasicMaterial map={room2blocks} />
          </mesh>
          <mesh
            name="Cylinder009_room2_wall"
            castShadow
            receiveShadow
            geometry={nodes.Cylinder009_room2_wall.geometry}
            // material={nodes.Cylinder009_room2_wall.material}
            position={[15.037, -6.424, -30.011]}
          >
            <meshBasicMaterial map={room2wall} />
          </mesh>
          <mesh
            name="Cylinder009_room2_wall001"
            castShadow
            receiveShadow
            geometry={nodes.Cylinder009_room2_wall001.geometry}
            // material={nodes.Cylinder009_room2_wall001.material}
            position={[15.037, -6.424, -30.011]}
          >
            <meshBasicMaterial map={room2wall} />
          </mesh>
          <mesh
            name="Cylinder019_room2_floor"
            castShadow
            receiveShadow
            geometry={nodes.Cylinder019_room2_floor.geometry}
            // material={nodes.Cylinder019_room2_floor.material}
            position={[-1.721, -13.454, 14.964]}
          >
            <meshBasicMaterial map={room2floor} />
          </mesh>
          <mesh
            name="defaultMaterial_room2_products"
            castShadow
            receiveShadow
            geometry={nodes.defaultMaterial_room2_products.geometry}
            // material={nodes.defaultMaterial_room2_products.material}
            position={[21.7, 1.187, 12.812]}
            rotation={[-0.152, -0.688, 0.184]}
            scale={2.482}
          >
            <meshBasicMaterial map={room2products} />
          </mesh>
          <mesh
            name="Headphones_room2_products"
            castShadow
            receiveShadow
            geometry={nodes.Headphones_room2_products.geometry}
            // material={nodes.Headphones_room2_products.material}
            position={[-1.629, -11.068, 13.781]}
            rotation={[1.328, 0.132, -1.101]}
            scale={0.061}
          >
            <meshBasicMaterial map={room2products} />
          </mesh>
          <mesh
            name="luggage_room2_products"
            castShadow
            receiveShadow
            geometry={nodes.luggage_room2_products.geometry}
            // material={nodes.luggage_room2_products.material}
            position={[-5.494, -1.335, -26.829]}
            rotation={[2.797, -0.417, 2.997]}
          >
            <meshBasicMaterial map={room2products} />
          </mesh>
          <mesh
            name="shirt_room2_products"
            castShadow
            receiveShadow
            geometry={nodes.shirt_room2_products.geometry}
            // material={nodes.shirt_room2_products.material}
            position={[-12.51, -4.632, -6.808]}
            rotation={[0.261, -0.363, 0.041]}
            scale={0.122}
          >
            <meshBasicMaterial map={room2products} />
          </mesh>
        </group>
        <group name="room2_empty2" position={[-0.226, -623.018, -122.643]}>
          <mesh
            name="Cube034_room2_blocks001"
            castShadow
            receiveShadow
            geometry={nodes.Cube034_room2_blocks001.geometry}
            // material={nodes.Cube034_room2_blocks001.material}
            position={[14.848, -13.318, -32.906]}
          >
            <meshBasicMaterial map={room2blocks} />
          </mesh>
          <mesh
            name="Cylinder009_room2_wall002"
            castShadow
            receiveShadow
            geometry={nodes.Cylinder009_room2_wall002.geometry}
            // material={nodes.Cylinder009_room2_wall002.material}
            position={[15.037, -6.424, -30.011]}
          >
            <meshBasicMaterial map={room2wall} />
          </mesh>
          <mesh
            name="Plane005_room2_floor"
            castShadow
            receiveShadow
            geometry={nodes.Plane005_room2_floor.geometry}
            // material={nodes.Plane005_room2_floor.material}
            position={[1.009, -14.6, 4.029]}
            scale={[1.488, 1, 1]}
          >
            <meshBasicMaterial map={room2floor} />
          </mesh>
        </group>
        <group name="room3_empty001" position={[-0.226, -622.841, -282.032]}>
          <mesh
            name="_679b_Var1_LOD0_room3_plants2_com"
            castShadow
            receiveShadow
            geometry={nodes._679b_Var1_LOD0_room3_plants2_com.geometry}
            // material={nodes._679b_Var1_LOD0_room3_plants2_com.material}
            morphTargetDictionary={
              nodes._679b_Var1_LOD0_room3_plants2_com.morphTargetDictionary
            }
            morphTargetInfluences={
              nodes._679b_Var1_LOD0_room3_plants2_com.morphTargetInfluences
            }
            position={[-15.69, -11.915, 28.895]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.092}
          >
            <meshBasicMaterial
              map={room3plants2}
              alphaTest={0.5}
              transparent={true}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh
            name="B072_MI_MZRa_Monstera_room3_plants1_com"
            castShadow
            receiveShadow
            geometry={nodes.B072_MI_MZRa_Monstera_room3_plants1_com.geometry}
            // material={nodes.B072_MI_MZRa_Monstera_room3_plants1_com.material}
            morphTargetDictionary={
              nodes.B072_MI_MZRa_Monstera_room3_plants1_com
                .morphTargetDictionary
            }
            morphTargetInfluences={
              nodes.B072_MI_MZRa_Monstera_room3_plants1_com
                .morphTargetInfluences
            }
            position={[-14.71, -12.059, 69.36]}
            rotation={[-Math.PI, 0.838, -Math.PI]}
            scale={0.176}
          >
            <meshBasicMaterial
              map={room3plants1}
              alphaTest={1}
              // transparent={true}
              // depthWrite={true}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh
            name="Cube036_room3_floor002"
            castShadow
            receiveShadow
            geometry={nodes.Cube036_room3_floor002.geometry}
            // material={nodes.Cube036_room3_floor002.material}
            position={[26.676, 6.276, -3.429]}
          >
            <meshBasicMaterial map={room3floor} />
          </mesh>
          <group name="deer_Armature003" position={[12.938, -4.083, 16.922]}>
            <skinnedMesh
              name="deer_room3_deer003"
              geometry={nodes.deer_room3_deer003.geometry}
              // material={nodes.deer_room3_deer003.material}
              skeleton={nodes.deer_room3_deer003.skeleton}
            >
              <meshBasicMaterial map={room3deer} />
            </skinnedMesh>
            <primitive object={nodes.Body} />
          </group>
          <mesh
            name="Rock_04_low_Rock_mat_0_room3_rocks001"
            castShadow
            receiveShadow
            geometry={nodes.Rock_04_low_Rock_mat_0_room3_rocks001.geometry}
            // material={nodes.Rock_04_low_Rock_mat_0_room3_rocks001.material}
            position={[16.643, -8.138, -18.133]}
            scale={2.062}
          >
            <meshBasicMaterial map={room3rocks} />
          </mesh>
          <Water />
        </group>
        <group name="room3_empty002" position={[-0.226, -622.841, -282.032]} />
        <group name="room4_empty" position={[-0.226, -637.251, -585.347]}>
          <mesh
            name="Cube051_room4_roof"
            castShadow
            receiveShadow
            geometry={nodes.Cube051_room4_roof.geometry}
            // material={nodes.Cube051_room4_roof.material}
            position={[-162.841, 28.114, -124.879]}
          >
            <meshBasicMaterial map={room4roof} />
          </mesh>
        </group>
        <group name="room4_empty001" position={[-0.226, -637.251, -585.347]}>
          <mesh
            name="Circle_room4_items"
            castShadow
            receiveShadow
            geometry={nodes.Circle_room4_items.geometry}
            // material={nodes.Circle_room4_items.material}
            position={[3.279, 21.05, -14.481]}
            rotation={[3.039, 0.647, 2.362]}
          >
            <meshBasicMaterial map={room4items} />
          </mesh>
          <mesh
            name="Cube062_room4_platforms"
            castShadow
            receiveShadow
            geometry={nodes.Cube062_room4_platforms.geometry}
            // material={nodes.Cube062_room4_platforms.material}
            position={[-18.138, -44.594, 38.866]}
            rotation={[0, 0.576, 0]}
            scale={3.362}
          >
            <meshBasicMaterial map={room4platforms} />
          </mesh>
          <mesh
            name="Cylinder054_room4_items"
            castShadow
            receiveShadow
            geometry={nodes.Cylinder054_room4_items.geometry}
            // material={nodes.Cylinder054_room4_items.material}
            position={[-29.544, -7.241, 6.637]}
            rotation={[-0.43, -1.296, -0.029]}
            scale={5.478}
          >
            <meshBasicMaterial map={room4items} />
          </mesh>
          <mesh
            name="Cylinder055_room4_items"
            castShadow
            receiveShadow
            geometry={nodes.Cylinder055_room4_items.geometry}
            // material={nodes.Cylinder055_room4_items.material}
            position={[-16.993, -8.122, -2.332]}
            rotation={[-2.681, 0.315, 2.989]}
            scale={3.991}
          >
            <meshBasicMaterial map={room4items} />
          </mesh>
          <mesh
            name="Cylinder057_room4_items"
            castShadow
            receiveShadow
            geometry={nodes.Cylinder057_room4_items.geometry}
            // material={nodes.Cylinder057_room4_items.material}
            position={[-27.411, -0.749, 5.609]}
            rotation={[2.92, 0.949, 1.207]}
            scale={[2.074, 2.57, 2.074]}
          >
            <meshBasicMaterial map={room4items} />
          </mesh>
          <mesh
            name="Cylinder058_room4_items"
            castShadow
            receiveShadow
            geometry={nodes.Cylinder058_room4_items.geometry}
            // material={nodes.Cylinder058_room4_items.material}
            position={[-27.884, 2.591, -13.557]}
            rotation={[-0.246, 0.551, 0.184]}
            scale={1.026}
          >
            <meshBasicMaterial map={room4items} />
          </mesh>
          <mesh
            name="imac27_room4_items"
            castShadow
            receiveShadow
            geometry={nodes.imac27_room4_items.geometry}
            // material={nodes.imac27_room4_items.material}
            position={[3.407, -3.418, 10.523]}
            rotation={[Math.PI, -Math.PI / 9, Math.PI]}
            scale={0.054}
          >
            <meshBasicMaterial map={room4items} />
          </mesh>
          <mesh
            ref={computerMeshRef}
            name="monitor_screen"
            castShadow
            receiveShadow
            geometry={nodes.monitor_screen.geometry}
            // material={nodes.monitor_screen.material}
            position={[3.407, -3.418, 10.523]}
            rotation={[Math.PI, -Math.PI / 9, Math.PI]}
          >
            <meshBasicMaterial />
          </mesh>
          <mesh
            ref={mobileMeshRef}
            name="phone_screen"
            castShadow
            receiveShadow
            geometry={nodes.phone_screen.geometry}
            // material={nodes.phone_screen.material}
            position={[-4.156, 0.784, 30.27]}
            rotation={[-1.82, -0.362, 0.949]}
            scale={0.173}
          >
            <meshBasicMaterial />
          </mesh>
          <mesh
            name="Plane007_room4_floor"
            castShadow
            receiveShadow
            geometry={nodes.Plane007_room4_floor.geometry}
            // material={nodes.Plane007_room4_floor.material}
            position={[0.592, -3.633, -43.56]}
            scale={207.295}
          >
            <meshBasicMaterial map={room4floor} />
          </mesh>
          <mesh
            name="Sphere004_room4_items"
            castShadow
            receiveShadow
            geometry={nodes.Sphere004_room4_items.geometry}
            // material={nodes.Sphere004_room4_items.material}
            position={[-18.948, 8.381, 3.631]}
            rotation={[0, -1.222, 0.768]}
            scale={2.087}
          >
            <meshBasicMaterial map={room4items} />
          </mesh>
          <mesh
            name="Sphere007_room4_items"
            castShadow
            receiveShadow
            geometry={nodes.Sphere007_room4_items.geometry}
            // material={nodes.Sphere007_room4_items.material}
            position={[-29.402, 11.851, -14.866]}
            rotation={[2.887, -0.599, 2.847]}
            scale={0.754}
          >
            <meshBasicMaterial map={room4items} />
          </mesh>
          <mesh
            name="URF-Height_room4_items"
            castShadow
            receiveShadow
            geometry={nodes["URF-Height_room4_items"].geometry}
            // material={nodes["URF-Height_room4_items"].material}
            position={[23.206, -0.787, 25.604]}
            scale={2.794}
          >
            <meshBasicMaterial map={room4items} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/room.glb");
