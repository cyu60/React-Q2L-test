import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Suspense, useEffect } from "react";
import {
  useGLTF,
  useAnimations,
  useFBX,
  PivotControls,
} from "@react-three/drei";
import { useControls, button } from "leva";
import React, { useState, useRef } from "react";

function MovingObject() {
  // Initial state for the object's position
  const [position, setPosition] = useState([0, 0, 0]);
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    // Calculate the new x, y, and z positions
    const x = Math.cos(time);
    const y = Math.sin(time);
    const z = position[2];
    setPosition([x, y, z]);
    meshRef.current.position.set(x, y, z);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereBufferGeometry attach="geometry" args={[0.1, 32, 32]} />
      <meshStandardMaterial attach="material" color="orange" />
    </mesh>
  );
}

export default function Experience() {
  // const model = useLoader(GLTFLoader, "./hamburger.glb")
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
      <DistilledModel></DistilledModel>
      {/* <MovingObject></MovingObject> */}
      {/* <Suspense fallback={<Placeholder />}>
        <Model></Model>
      </Suspense> */}
      {/* <Fox></Fox> */}

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}

function Fox() {
  const fox = useGLTF("./Fox/glTF/Fox.gltf");
  const animations = useAnimations(fox.animations, fox.scene);
  const { animationName } = useControls({
    animationName: { options: animations.names },
  });

  useEffect(() => {
    const action = animations.actions[animationName];
    action.reset().fadeIn(0.5).play();

    return () => {
      action.fadeOut(0.5);
    };
  }, [animationName]);
  return (
    <primitive
      object={fox.scene}
      scale={0.02}
      position={[-2.5, 0, 2.5]}
      rotation-y={0.3}
    />
  );
}

function Placeholder() {
  return (
    <mesh position-y={0.5} scale={[2, 3, 2]}>
      <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
      <meshBasicMaterial wireframe color="red" />
    </mesh>
  );
}
function Model() {
  const model = useLoader(
    GLTFLoader,
    "./FlightHelmet/glTF/FlightHelmet.gltf",
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("./draco/");
      loader.setDRACOLoader(dracoLoader);
    }
  );
  console.log(model);
  return <primitive object={model.scene} scale={5} position-y={-1} />;
  // return model;
}

function DistilledModel() {
  // const [position, setPosition] = useState(1);
  // Initial state for the object's position
  const [position, setPosition] = useState([0, 0, 0]);
  const [animation, setAnimation] = useState(false);
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (animation) {
      const time = clock.getElapsedTime();
      // Calculate the new x, y, and z positions
      const x = Math.cos(time);
      const y = Math.sin(time);
      const z = position[2];
      setPosition([x, y, z]);
      meshRef.current.position.set(x, y, z);
    }
  });

  const controls = useControls({
    position: position[2],
    StartAnimation: button(() => {
      setAnimation(!animation);
      // setPosition(position + 1);
    }),
  });
  // const model = useFBX("./pipetmanL.fbx");
  const model = useFBX("./pipette_new.fbx");
  // const model = useFBX("./Pipette/pipetmanL.fbx");

  // console.log(model);
  if (!model) {
    // Return a placeholder or loading component while the model is being loaded
    return null;
  }

  return (
    <mesh ref={meshRef} position={position}>
      {/* <sphereBufferGeometry attach="geometry" args={[0.1, 32, 32]} />
    <meshStandardMaterial attach="material" color="orange" /> */}
      <PivotControls anchor={[1, 1, 1]}>
        <primitive object={model} scale={0.1} position-y={controls.position} />
      </PivotControls>
    </mesh>

    // <primitive object={model.scene} scale={0.005} position-y={-1} />
  );
  // return <primitive object={model.scene} scale={5} position-y={-1} />;
}
// <ErrorBoundary>
// {/* <primitive object={model.scene} scale={0.005} position-y={-1} /> */}
// </ErrorBoundary>
// return model;
// GLTFLoader,
//   "./FlightHelmet/glTF/FlightHelmet.gltf",
//   (loader) => {
//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath("./draco/");
//     loader.setDRACOLoader(dracoLoader);
//   }
