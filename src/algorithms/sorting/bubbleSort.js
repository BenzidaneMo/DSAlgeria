import { createStep, STEP_TYPES } from "../../engine/stepTypes";

export const BUBBLE_SORT_METADATA = Object.freeze({
  name: "الترتيب الفقاعي",
  englishName: "Bubble Sort",
  description: "نمر على العناصر المتجاورة ونبدلها إذا كانت بالترتيب الخاطئ، حتى تصبح القائمة مرتبة.",
  complexity: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  sourceCode: `def bubble_sort(a):
    n = len(a)

    for p in range(n - 1):
        swapped = False

        for i in range(n - 1 - p):
            if a[i] > a[i + 1]:
                a[i], a[i + 1] = a[i + 1], a[i]
                swapped = True

        if not swapped:
            break`,
});

/**
 * Generates immutable snapshots for each comparison and swap.
 * @param {number[]} input
 * @returns {import("../../engine/stepTypes").AlgorithmStep[]}
 */
export function generateBubbleSortSteps(input = []) {
  if (!Array.isArray(input) || input.some((value) => typeof value !== "number" || Number.isNaN(value))) {
    throw new TypeError("Bubble Sort input must be an array of numbers");
  }

  const array = [...input];
  const steps = [];

  for (let pass = 0; pass < array.length - 1; pass += 1) {
    let swapped = false;

    for (let index = 0; index < array.length - 1 - pass; index += 1) {
      const left = array[index];
      const right = array[index + 1];
      const outOfOrder = left > right;

      steps.push(createStep({
        type: STEP_TYPES.COMPARE,
        array,
        indices: [index, index + 1],
        codeLine: 8,
        message: `نقارن بين العنصرين ${left} و ${right}`,
        comparison: { left, right, outOfOrder },
      }));

      if (outOfOrder) {
        [array[index], array[index + 1]] = [array[index + 1], array[index]];
        swapped = true;
        steps.push(createStep({
          type: STEP_TYPES.SWAP,
          array,
          indices: [index, index + 1],
          codeLine: 9,
          message: `بما أن ${left} أكبر من ${right}، نقوم بتبديل العنصرين`,
          swap: { from: index, to: index + 1 },
        }));
      }
    }

    if (!swapped) {
      break;
    }
  }

  steps.push(createStep({
    type: STEP_TYPES.COMPLETE,
    array,
    codeLine: null,
    message: "اكتمل الترتيب بنجاح",
  }));

  return steps;
}