import Array3DAnimation from "./Array3DAnimation";
import Array3DLabels from "./Array3DLabels";

function getBlockColor({ isCompared, isSwapping, isShifting, isSorted, isFound, isActive, isPivot, isInPartition, isPointer }) {
  if (isFound) {
    return "#6a9955";
  }
  if (isSwapping) {
    return "#ce9178";
  }
  if (isPivot) {
    return "#c586c0";
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
  if (isPointer) {
    return "#4fc1ff";
  }
  if (isInPartition) {
    return "#604d60";
  }
  return "#2b3c4d";
}

export default function Array3DBlock({ value, index, height, width = 0.9, depth = width, x, state, swapStartX, stepIndex, labelSize = 0.2 }) {
  const isCompared = state.comparedIndices.includes(index) || state.activeIndices.includes(index);
  const isSwapping = state.swappedIndices.includes(index);
  const isShifting = state.shiftedIndices.includes(index);
  const isEliminated = state.eliminatedIndices.includes(index);
  const isInSearchRange = state.currentSearchRange
    ? index >= state.currentSearchRange.start && index <= state.currentSearchRange.end
    : true;
  const isFound = state.foundIndices.includes(index);
  const isSorted = state.sortedIndices.includes(index);
  const isActive = state.activeIndices.includes(index);
  const isPivot = state.pivotIndex === index && !isSorted;
  const isInPartition = state.partitionIndices.includes(index) && !isSorted;
  const isPointer = state.pointerIndices.includes(index);
  const pointerLabel = state.searchPointers.left === index
    ? "left"
    : state.searchPointers.mid1 === index
      ? "mid1"
      : state.searchPointers.mid2 === index
        ? "mid2"
        : state.searchPointers.middle === index
          ? "middle"
          : state.searchPointers.right === index
            ? "right"
            : null;
  const color = getBlockColor({ isCompared, isSwapping, isShifting, isSorted, isFound, isActive, isPivot, isInPartition, isPointer });

  return (
    <Array3DAnimation targetX={x} targetY={isActive ? 0.1 : 0} isSwapping={isSwapping} swapStartX={swapStartX} stepIndex={stepIndex}>
      <group scale={isEliminated || !isInSearchRange ? 0.82 : 1}>

      <mesh position={[0, height / 2 + 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.72} metalness={0.08} />
      </mesh>
      <Array3DLabels value={value} height={height} fontSize={labelSize} color={isFound || isActive || isSorted ? color : "#d4d4d4"} pointerLabel={pointerLabel} />
      </group>
    </Array3DAnimation>
  );
}