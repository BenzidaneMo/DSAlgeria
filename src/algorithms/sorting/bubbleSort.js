import { createStep, STEP_TYPES } from "../../engine/stepTypes";

/**
 * Temporary contract example. The actual sorting traversal will be added later.
 * @returns {import("../../engine/stepTypes").AlgorithmStep[]}
 */
export function generateBubbleSortSteps() {
  return [
    createStep({ type: STEP_TYPES.COMPARE, indices: [1, 2], codeLine: 6 }),
    createStep({ type: STEP_TYPES.SWAP, indices: [1, 2], codeLine: 7 }),
    createStep({ type: STEP_TYPES.COMPLETE, codeLine: null }),
  ];
}