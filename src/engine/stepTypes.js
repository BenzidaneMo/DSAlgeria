/**
 * @typedef {Object} AlgorithmStep
 * @property {"compare"|"swap"|"visit"|"insert"|"remove"|"complete"|"custom"} type
 * @property {number[]} [indices]
 * @property {number|null} codeLine
 * @property {string} [operation]
 * @property {Object} [payload]
 */

/** @param {AlgorithmStep} step */
export function createStep(step) {
  return Object.freeze({
    type: step.type,
    indices: step.indices ? [...step.indices] : [],
    codeLine: step.codeLine ?? null,
    operation: step.operation ?? step.type,
    payload: step.payload ?? null,
  });
}

export function createCompleteStep() {
  return createStep({ type: "complete", codeLine: null });
}

export const STEP_TYPES = Object.freeze({
  COMPARE: "compare",
  SWAP: "swap",
  VISIT: "visit",
  INSERT: "insert",
  REMOVE: "remove",
  COMPLETE: "complete",
  CUSTOM: "custom",
});