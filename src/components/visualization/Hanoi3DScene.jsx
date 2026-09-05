import { Text } from "@react-three/drei";
import Array3DAnimation from "./Array3DAnimation";
import Array3DPlatform from "./Array3DPlatform";

const TOWER_IDS = ["A", "B", "C"];
const TOWER_X = { A: -2.4, B: 0, C: 2.4 };
const PEG_HEIGHT = 2.2;
const PEG_RADIUS = 0.06;
const DISK_HEIGHT = 0.28;
const DISK_GAP = 0.04;
const MIN_DISK_RADIUS = 0.35;
const MAX_DISK_RADIUS = 1.05;

const DISK_COLORS = ["#569cd6", "#4ec9b0", "#c586c0", "#ce9178", "#dcdcaa", "#6a9955", "#f44747"];

function diskRadius(disk, totalDisks) {
  if (totalDisks <= 1) return MAX_DISK_RADIUS;
  const ratio = (disk - 1) / (totalDisks - 1);
  return MIN_DISK_RADIUS + ratio * (MAX_DISK_RADIUS - MIN_DISK_RADIUS);
}

export function getHanoiFootprint() {
  return { width: 7 };
}

/**
 * 3D Tower of Hanoi: three fixed pegs with disks as stacked cylinders,
 * repositioned (not rebuilt) between towers so Array3DAnimation can lerp
 * each move smoothly, mirroring the recursion visualizers' approach.
 */
export default function Hanoi3DScene({ towers, currentDisk, from, to, auxiliary }) {
  if (!towers) {
    return (
      <>
        <ambientLight intensity={0.7} />
        <Array3DPlatform width={7} depth={3} />
      </>
    );
  }

  const totalDisks = TOWER_IDS.reduce((sum, towerId) => sum + towers[towerId].length, 0);
  const positions = {};
  TOWER_IDS.forEach((towerId) => {
    towers[towerId].forEach((disk, heightIndex) => {
      positions[disk] = { towerId, heightIndex };
    });
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 3, -3]} intensity={1.1} color="#569cd6" />
      <Array3DPlatform width={7} depth={3} />

      {TOWER_IDS.map((towerId) => {
        const pegColor = from === towerId
          ? "#569cd6"
          : to === towerId
            ? "#6a9955"
            : auxiliary === towerId
              ? "#c586c0"
              : "#5a5a5c";

        return (
          <group key={towerId}>
            <mesh position={[TOWER_X[towerId], PEG_HEIGHT / 2 + 0.08, 0]} castShadow>
              <cylinderGeometry args={[PEG_RADIUS, PEG_RADIUS, PEG_HEIGHT, 16]} />
              <meshStandardMaterial color={pegColor} roughness={0.5} metalness={0.15} />
            </mesh>
            <Text position={[TOWER_X[towerId], -0.28, 0]} fontSize={0.24} color="#d4d4d4" anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor="#15191d">
              {towerId}
            </Text>
          </group>
        );
      })}

      {Array.from({ length: totalDisks }, (_, index) => totalDisks - index).map((disk, index) => {
        const position = positions[disk];
        if (!position) return null;
        const radius = diskRadius(disk, totalDisks);
        const y = 0.08 + position.heightIndex * (DISK_HEIGHT + DISK_GAP) + DISK_HEIGHT / 2;
        const x = TOWER_X[position.towerId];
        const isCurrent = disk === currentDisk;

        return (
          <Array3DAnimation key={disk} targetX={x} targetY={y} stepIndex={index}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[radius, radius, DISK_HEIGHT, 24]} />
              <meshStandardMaterial
                color={DISK_COLORS[(disk - 1) % DISK_COLORS.length]}
                roughness={0.55}
                metalness={0.1}
                emissive={isCurrent ? "#ffffff" : "#000000"}
                emissiveIntensity={isCurrent ? 0.18 : 0}
              />
            </mesh>
          </Array3DAnimation>
        );
      })}
    </>
  );
}
