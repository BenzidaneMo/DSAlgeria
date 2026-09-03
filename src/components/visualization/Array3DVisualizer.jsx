import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const BLOCK_WIDTH = 0.9;
const BLOCK_DEPTH = 0.9;
const BLOCK_GAP = 0.28;
const PLATFORM_HEIGHT = 0.16;
const HEIGHT_MIN = 0.35;
const HEIGHT_MAX = 3.8;

function getBlockHeight(value, minimum, maximum) {
  if (minimum === maximum) {
    return 1.8;
  }

  return HEIGHT_MIN + ((value - minimum) / (maximum - minimum)) * (HEIGHT_MAX - HEIGHT_MIN);
}

function getBlockColor({ isCompared, isSwapping, isFinalized }) {
  if (isSwapping) {
    return "#ce9178";
  }
  if (isCompared) {
    return "#569cd6";
  }
  if (isFinalized) {
    return "#6a9955";
  }
  return "#3c6385";
}

function ArrayBlock({ value, index, height, position, color, swapPair, swapPositions }) {
  const groupRef = useRef();
  const targetPosition = useRef(new THREE.Vector3(...position));
  const animationStart = useRef(null);

  useEffect(() => {
    targetPosition.current.set(...position);
    if (swapPair?.includes(index)) {
      const otherIndex = swapPair.find((pairIndex) => pairIndex !== index);
      groupRef.current.position.x = swapPositions[otherIndex];
      animationStart.current = performance.now();
    } else {
      animationStart.current = null;
    }
  }, [index, position, swapPair, swapPositions]);

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    const startTime = animationStart.current;
    if (startTime === null) {
      groupRef.current.position.lerp(targetPosition.current, 0.22);
      return;
    }

    const progress = Math.min((performance.now() - startTime) / 520, 1);
    const eased = 1 - ((1 - progress) ** 3);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosition.current.x, eased);
    groupRef.current.position.y = targetPosition.current.y;
    groupRef.current.position.z = targetPosition.current.z;
    if (progress === 1) {
      animationStart.current = null;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, height / 2 + PLATFORM_HEIGHT, 0]} castShadow receiveShadow>
        <boxGeometry args={[BLOCK_WIDTH, height, BLOCK_DEPTH]} />
        <meshStandardMaterial color={color} roughness={0.72} metalness={0.08} />
      </mesh>
      <Text position={[0, height + PLATFORM_HEIGHT + 0.18, 0]} fontSize={0.2} color="#d4d4d4" anchorX="center" anchorY="middle">
        {String(value)}
      </Text>
    </group>
  );
}

function ArrayScene({ array, currentStep }) {
  const values = array.length > 0 ? array : [0];
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const activeIndices = currentStep?.indices ?? [];
  const finalizedIndices = currentStep?.finalizedIndices ?? [];
  const swapPair = currentStep?.type === "swap" ? currentStep.indices : [];
  const totalWidth = values.length * (BLOCK_WIDTH + BLOCK_GAP) - BLOCK_GAP;
  const swapPositions = Object.fromEntries(values.map((_, index) => [index, (index - (values.length - 1) / 2) * (BLOCK_WIDTH + BLOCK_GAP)]));

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 3, -3]} intensity={1.1} color="#569cd6" />
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[Math.max(totalWidth + 2.4, 5), PLATFORM_HEIGHT, 2.3]} />
        <meshStandardMaterial color="#181818" roughness={0.9} metalness={0.05} />
      </mesh>
      {values.map((value, index) => {
        const height = getBlockHeight(value, minimum, maximum);
        const x = (index - (values.length - 1) / 2) * (BLOCK_WIDTH + BLOCK_GAP);
        return (
          <ArrayBlock
            key={index}
            value={value}
            index={index}
            height={height}
            position={[x, 0, 0]}
            color={getBlockColor({ isCompared: activeIndices.includes(index), isSwapping: swapPair.includes(index), isFinalized: finalizedIndices.includes(index) })}
            swapPair={swapPair}
            swapPositions={swapPositions}
          />
        );
      })}
      <gridHelper args={[Math.max(totalWidth + 2.4, 5), 12, "#303031", "#252526"]} position={[0, 0.01, 0]} rotation={[0, 0, 0]} />
    </>
  );
}

export default function Array3DVisualizer({ array = [], currentStep }) {
  const sceneArray = currentStep?.array?.length ? currentStep.array : array;

  return (
    <div className="h-full w-full overflow-hidden bg-[#15191d]" aria-label="التصور ثلاثي الأبعاد للمصفوفة">
      <Canvas shadows camera={{ position: [0, 5.5, 7.5], fov: 42 }} dpr={[1, 1.5]}>
        <color attach="background" args={["#15191d"]} />
        <fog attach="fog" args={["#15191d", 9, 18]} />
        <ArrayScene array={sceneArray} currentStep={currentStep} />
        <OrbitControls enablePan={false} minDistance={4} maxDistance={13} maxPolarAngle={Math.PI / 2.1} />
      </Canvas>
    </div>
  );
}