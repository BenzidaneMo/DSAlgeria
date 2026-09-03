import { createStep, STEP_TYPES } from "../../engine/stepTypes";

/**
 * Temporary contract example. The actual sorting traversal will be added later.
 * @returns {import("../../engine/stepTypes").AlgorithmStep[]}
 */
export function generateBubbleSortSteps() {
  return [createStep({ type: STEP_TYPES.COMPLETE, codeLine: null })];
}