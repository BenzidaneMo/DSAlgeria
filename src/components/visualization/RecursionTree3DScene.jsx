import { Line, Text } from "@react-three/drei";
import Array3DAnimation from "./Array3DAnimation";
import Array3DPlatform from "./Array3DPlatform";

const X_UNIT = 1.55;
const Y_UNIT = 1.35;
const BOX_SIZE = 0.85;

function getNodeColor(node, isCurrent) {
  if (node.status === "pending") return "#2b3c4d";
  if (node.status === "base") return "#c586c0";
  if (isCurrent) return "#569cd6";
  if (node.status === "done") return "#6a9955";
  return "#3c6385";
}

export function getTreeFootprint(nodes = []) {
  if (nodes.length === 0) {
    return { width: 5, depth: 4, height: 2 };
  }

  const maxX = Math.max(...nodes.map((node) => node.x));
  const maxDepth = Math.max(...nodes.map((node) => node.depth));
  return { width: (maxX + 2) * X_UNIT, depth: 4, height: (maxDepth + 1) * Y_UNIT };
}

/**
 * 3D counterpart to RecursionTree: lays the same branching call tree out as
 * a vertical wall of boxes (root on top, children below, spread on the X
 * axis) instead of forcing the array bar-chart visualization onto it.
 */
export default function RecursionTree3DScene({ nodes = [], currentNodeId }) {
  if (nodes.length === 0) {
    return (
      <>
        <ambientLight intensity={0.7} />
        <Array3DPlatform width={5} />
      </>
    );
  }

  const byId = new Map(nodes.map((node) => [node.id, node]));
  const maxX = Math.max(...nodes.map((node) => node.x));
  const maxDepth = Math.max(...nodes.map((node) => node.depth));
  const centerOffset = (maxX * X_UNIT) / 2;
  const topY = (maxDepth * Y_UNIT) / 2 + BOX_SIZE / 2 + 0.16;

  function toPosition(node) {
    return [node.x * X_UNIT - centerOffset, topY - node.depth * Y_UNIT];
  }

  const floorY = topY - maxDepth * Y_UNIT - BOX_SIZE / 2 - 0.5;

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 3, -3]} intensity={1.1} color="#569cd6" />
      <group position={[0, floorY, 0]}>
        <Array3DPlatform width={(maxX + 3) * X_UNIT} />
      </group>
      {nodes.map((node) => {
        if (!node.parentId) return null;
        const parent = byId.get(node.parentId);
        if (!parent) return null;
        const [ax, ay] = toPosition(parent);
        const [bx, by] = toPosition(node);
        return (
          <Line
            key={`edge-${node.id}`}
            points={[[ax, ay - BOX_SIZE / 2, 0], [bx, by + BOX_SIZE / 2, 0]]}
            color="#3c3c3c"
            lineWidth={1.4}
          />
        );
      })}
      {nodes.map((node, index) => {
        const isCurrent = node.id === currentNodeId;
        const color = getNodeColor(node, isCurrent);
        const opacity = node.status === "pending" ? 0.35 : 1;
        const [x, y] = toPosition(node);

        return (
          <Array3DAnimation key={node.id} targetX={x} targetY={y} stepIndex={index}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
              <meshStandardMaterial color={color} roughness={0.72} metalness={0.08} transparent opacity={opacity} />
            </mesh>
            <Text position={[0, BOX_SIZE / 2 + 0.24, 0]} fontSize={0.2} color="#d4d4d4" anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor="#15191d">
              {`f(${node.n})`}
            </Text>
            {node.result !== null && (
              <Text position={[0, -(BOX_SIZE / 2) - 0.2, 0]} fontSize={0.18} color="#6a9955" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#15191d">
                {`= ${node.result}`}
              </Text>
            )}
          </Array3DAnimation>
        );
      })}
    </>
  );
}
