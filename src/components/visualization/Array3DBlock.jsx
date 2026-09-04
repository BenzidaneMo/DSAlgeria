import Array3DAnimation from "./Array3DAnimation";
import Array3DLabels from "./Array3DLabels";

function getBlockColor({ isCompared, isSwapping, isShifting, isSorted, isActive }) {
  if (isSwapping) {
    return "#ce9178";
  }
  if (isCompared) {
    return "#569cd6";
  }
  if (isShifting) {
    return "#dcdcaa";
  }
  if (isSorted) {
    return "#6a9955";
  }
  if (isActive) {
    return "#3c6385";
  }
  return "#2b3c4d";
}

export default function Array3DBlock({ value, index, height, width = 0.9, depth = width, x, state, swapStartX, stepIndex, labelSize = 0.2 }) {
  const isCompared = state.comparedIndices.includes(index) || state.activeIndices.includes(index);
  const isSwapping = state.swappedIndices.includes(index);
  const isShifting = state.shiftedIndices.includes(index);
  const isSorted = state.sortedIndices.includes(index);
  const isActive = state.activeIndices.includes(index);
  const color = getBlockColor({ isCompared, isSwapping, isShifting, isSorted, isActive });

  return (
    <Array3DAnimation targetX={x} targetY={isActive ? 0.1 : 0} isSwapping={isSwapping} swapStartX={swapStartX} stepIndex={stepIndex}>
      <mesh position={[0, height / 2 + 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.72} metalness={0.08} />
      </mesh>
      <Array3DLabels value={value} height={height} fontSize={labelSize} color={isActive || isSorted ? color : "#d4d4d4"} />
    </Array3DAnimation>
  );
}