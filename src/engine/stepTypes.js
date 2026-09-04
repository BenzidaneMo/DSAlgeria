/**
 * A generated step describes one algorithm event. Consumers should use
 * `operation`, `indices`, `array`, and `metadata`; `type` remains as a
 * backwards-compatible alias for existing integrations.
 *
 * @typedef {Object} AlgorithmStep
 * @property {StepOperation} operation
 * @property {StepOperation} type
 * @property {number[]} indices
 * @property {number[]} array
 * @property {number[]} finalizedIndices
 * @property {number|null} codeLine
 * @property {string|null} message
 * @property {Object|null} metadata
 * @property {{left: number, right: number, outOfOrder: boolean}|null} comparison
 * @property {{from: number, to: number}|null} swap
 */

/** @typedef {"compare"|"swap"|"select"|"shift"|"insert"|"split"|"merge"|"found"|"notFound"|"visit"|"update"|"partition"|"recursiveCall"|"return"|"complete"|"custom"} StepOperation */

/** @param {AlgorithmStep} step */
export function createStep(step = {}) {
  const operation = step.operation ?? step.type ?? STEP_OPERATIONS.CUSTOM;

  return Object.freeze({
    operation,
    // Keep the old property available while algorithms migrate to operation.
    type: step.type ?? operation,
    indices: step.indices ? [...step.indices] : [],
    array: step.array ? [...step.array] : [],
    finalizedIndices: step.finalizedIndices ? [...step.finalizedIndices] : [],
    codeLine: step.codeLine ?? null,
    message: step.message ?? null,
    metadata: step.metadata ?? step.payload ?? null,
    comparison: step.comparison ?? null,
    swap: step.swap ?? null,
    payload: step.payload ?? step.metadata ?? null,
  });
}

export function createCompleteStep(step = {}) {
  return createStep({ ...step, operation: STEP_OPERATIONS.COMPLETE, type: STEP_OPERATIONS.COMPLETE, codeLine: step.codeLine ?? null });
}

export const STEP_OPERATIONS = Object.freeze({
  COMPARE: "compare",
  SWAP: "swap",
  SELECT: "select",
  SHIFT: "shift",
  INSERT: "insert",
  SPLIT: "split",
  MERGE: "merge",
  FOUND: "found",
  NOT_FOUND: "notFound",
  VISIT: "visit",
  UPDATE: "update",
  PARTITION: "partition",
  RECURSIVE_CALL: "recursiveCall",
  RETURN: "return",
  REMOVE: "remove",
  COMPLETE: "complete",
  CUSTOM: "custom",
});

// STEP_TYPES is retained for existing algorithm modules.
export const STEP_TYPES = STEP_OPERATIONS;

/** @param {AlgorithmStep|null|undefined} step */
export function getStepOperation(step) {
  return step?.operation ?? step?.type ?? null;
}

/** @param {AlgorithmStep|null|undefined} step */
export function getStepVisualState(step) {
  const operation = getStepOperation(step);
  const indices = step?.indices ?? [];

  return {
    activeIndices: indices,
    comparedIndices: operation === STEP_OPERATIONS.COMPARE ? indices : [],
    swappedIndices: operation === STEP_OPERATIONS.SWAP ? indices : [],
    shiftedIndices: operation === STEP_OPERATIONS.SHIFT ? indices : [],
    sortedIndices: step?.finalizedIndices ?? [],
    partitionIndices: getRangeIndices(step?.metadata?.currentSubarray),
    pivotIndex: Number.isInteger(step?.metadata?.pivotIndex) ? step.metadata.pivotIndex : null,
    pointerIndices: [step?.metadata?.leftPointer, step?.metadata?.rightPointer].filter(Number.isInteger),
    currentIndex: Number.isInteger(step?.metadata?.currentIndex) ? step.metadata.currentIndex : null,
    targetValue: step?.metadata?.target ?? null,
    foundIndices: operation === STEP_OPERATIONS.FOUND ? indices : [],
    operation,
  };
}

function getRangeIndices(range) {
  if (!range || !Number.isInteger(range.start) || !Number.isInteger(range.end) || range.end < range.start) {
    return [];
  }

  return Array.from({ length: range.end - range.start + 1 }, (_, offset) => range.start + offset);
}