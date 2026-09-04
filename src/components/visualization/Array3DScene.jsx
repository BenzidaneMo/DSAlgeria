import Array3DBlock from "./Array3DBlock";
import Array3DPlatform from "./Array3DPlatform";

const BLOCK_WIDTH = 0.9;
const BLOCK_GAP = 0.28;
const PLATFORM_DEPTH = 2.3;
const HEIGHT_MIN = 0.35;
const HEIGHT_MAX = 3.8;

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
  const totalWidth = sceneValues.length * (BLOCK_WIDTH + BLOCK_GAP) - BLOCK_GAP;
  const positions = sceneValues.map((_, index) => (index - (sceneValues.length - 1) / 2) * (BLOCK_WIDTH + BLOCK_GAP));

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
          x={positions[index]}
          state={visualizationState}
          swapStartX={visualizationState.swappedIndices.length === 2 ? positions[visualizationState.swappedIndices.find((pairIndex) => pairIndex !== index)] : positions[index]}
          stepIndex={stepIndex}
        />
      ))}
    </>
  );
}