import Array3DBlock from "./Array3DBlock";
import Array3DPlatform from "./Array3DPlatform";

const PLATFORM_DEPTH = 2.3;
const HEIGHT_MIN = 0.35;
const HEIGHT_MAX = 3.8;
const MAX_ARRAY_WIDTH = 12;
const DEFAULT_BLOCK_WIDTH = 0.9;
const DEFAULT_BLOCK_GAP = 0.28;

export function getArray3DLayout(length) {
  const count = Math.max(length, 1);
  const blockWidth = Math.min(DEFAULT_BLOCK_WIDTH, Math.max(0.42, MAX_ARRAY_WIDTH / count * 0.82));
  const gap = count === 1 ? 0 : Math.min(DEFAULT_BLOCK_GAP, Math.max(0.08, (MAX_ARRAY_WIDTH - blockWidth * count) / (count - 1)));
  const width = blockWidth * count + gap * Math.max(count - 1, 0);
  return { blockWidth, gap, width, labelSize: Math.max(0.12, Math.min(0.2, blockWidth * 0.24)) };
}

function getBlockHeight(value, minimum, maximum) {
  if (minimum === maximum) {
    return 1.8;
  }

  return HEIGHT_MIN + ((value - minimum) / (maximum - minimum)) * (HEIGHT_MAX - HEIGHT_MIN);
}

export default function Array3DScene({ values = [], visualizationState, stepIndex }) {
  const sceneValues = values.length > 0 ? values : [0];
  const minimum = Math.min(...sceneValues);
  const maximum = Math.max(...sceneValues);
  const layout = getArray3DLayout(sceneValues.length);
  const totalWidth = layout.width;
  const positions = sceneValues.map((_, index) => (index - (sceneValues.length - 1) / 2) * (layout.blockWidth + layout.gap));

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 3, -3]} intensity={1.1} color="#569cd6" />
      <Array3DPlatform width={totalWidth} depth={PLATFORM_DEPTH} />
      {sceneValues.map((value, index) => (
        <Array3DBlock
          key={index}
          value={value}
          index={index}
          height={getBlockHeight(value, minimum, maximum)}
          width={layout.blockWidth}
          depth={layout.blockWidth}
          x={positions[index]}
          state={visualizationState}
          swapStartX={visualizationState.swappedIndices.length === 2 ? positions[visualizationState.swappedIndices.find((pairIndex) => pairIndex !== index)] : positions[index]}
          stepIndex={stepIndex}
          labelSize={layout.labelSize}
        />
      ))}
    </>
  );
}