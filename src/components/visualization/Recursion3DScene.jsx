import { Text } from "@react-three/drei";
import Array3DAnimation from "./Array3DAnimation";
import Array3DPlatform from "./Array3DPlatform";

const FRAME_HEIGHT = 0.9;
const FRAME_GAP = 0.35;
const FRAME_SIZE = 1.6;

function getFrameColor(frame, isCurrent) {
  if (frame.status === "pending") return "#2b3c4d";
  if (frame.status === "base") return "#c586c0";
  if (isCurrent && (frame.status === "calling" || frame.status === "returning")) return "#569cd6";
  if (frame.status === "done") return "#6a9955";
  return "#3c6385";
}

export function getRecursionTowerHeight(frameCount) {
  return Math.max(frameCount, 1) * (FRAME_HEIGHT + FRAME_GAP);
}

export default function Recursion3DScene({ callStack = [], currentDepth }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 3, -3]} intensity={1.1} color="#569cd6" />
      <Array3DPlatform width={FRAME_SIZE + 2} depth={FRAME_SIZE + 2} />
      {callStack.map((frame, index) => {
        const y = FRAME_HEIGHT / 2 + 0.16 + index * (FRAME_HEIGHT + FRAME_GAP);
        const isCurrent = frame.depth === currentDepth;
        const color = getFrameColor(frame, isCurrent);
        const opacity = frame.status === "pending" ? 0.35 : 1;

        return (
          <Array3DAnimation key={frame.depth} targetX={0} targetY={y} stepIndex={index}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[FRAME_SIZE, FRAME_HEIGHT, FRAME_SIZE]} />
              <meshStandardMaterial color={color} roughness={0.72} metalness={0.08} transparent opacity={opacity} />
            </mesh>
            <Text position={[0, FRAME_HEIGHT / 2 + 0.26, 0]} fontSize={0.22} color="#d4d4d4" anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor="#15191d">
              {`factorial(${frame.n})`}
            </Text>
            {frame.result !== null && (
              <Text position={[0, -(FRAME_HEIGHT / 2) - 0.22, 0]} fontSize={0.2} color="#6a9955" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#15191d">
                {`= ${frame.result}`}
              </Text>
            )}
          </Array3DAnimation>
        );
      })}
    </>
  );
}
