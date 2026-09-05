import { createStep, STEP_TYPES } from "../../engine/stepTypes";

export const SELECTION_SORT_METADATA = Object.freeze({
  name: "الترتيب بالاختيار",
  englishName: "Selection Sort",
  description: "نبحث عن أصغر عنصر في الجزء غير المرتب ونضعه في موضعه الصحيح في كل دورة.",
  producesSortedOutput: true,
  complexity: {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  sourceCode: `def selection_sort(a):
    n = len(a)

    for position in range(n - 1):
        minimum = position

        for index in range(position + 1, n):
            if a[index] < a[minimum]:
                minimum = index

        if minimum != position:
            a[position], a[minimum] = a[minimum], a[position]`,
});

/**
 * Generates immutable snapshots for selection, minimum search, and placement.
 * @param {number[]} input
 * @returns {import("../../engine/stepTypes").AlgorithmStep[]}
 */
export function generateSelectionSortSteps(input = []) {
  if (!Array.isArray(input) || input.some((value) => typeof value !== "number" || Number.isNaN(value))) {
    throw new TypeError("Selection Sort input must be an array of numbers");
  }

  const array = [...input];
  const steps = [];
  const finalizedIndices = [];

  // FIX: clone `array` and `finalizedIndices` on every step so each
  // snapshot is truly immutable. Previously all steps shared the same
  // array/finalizedIndices references, which were mutated in place
  // (swaps on `array`, `finalizedIndices.push(position)` at the end of
  // every outer-loop iteration) — so every already-pushed step silently
  // reflected later state instead of its own moment in the algorithm.
  function addStep(step) {
    steps.push(createStep({
      array: [...array],
      finalizedIndices: [...finalizedIndices],
      ...step,
    }));
  }

  for (let position = 0; position < array.length - 1; position += 1) {
    let minimumIndex = position;

    addStep({
      operation: STEP_TYPES.SELECT,
      indices: [position],
      codeLine: 5,
      message: `نختار الموضع ${position} لملئه بأصغر عنصر من الجزء غير المرتب`,
      metadata: { phase: "position", position, minimumIndex },
    });

    for (let index = position + 1; index < array.length; index += 1) {
      const minimumValue = array[minimumIndex];
      const candidateValue = array[index];
      const isNewMinimum = candidateValue < minimumValue;

      addStep({
        operation: STEP_TYPES.COMPARE,
        indices: [minimumIndex, index],
        codeLine: 8,
        message: `نقارن ${candidateValue} مع أصغر قيمة حالية ${minimumValue}`,
        comparison: { left: minimumValue, right: candidateValue, outOfOrder: isNewMinimum },
        metadata: { phase: "minimum-search", position, minimumIndex, candidateIndex: index },
      });

      if (isNewMinimum) {
        minimumIndex = index;
        addStep({
          operation: STEP_TYPES.UPDATE,
          indices: [minimumIndex],
          codeLine: 9,
          message: `نحدّث أصغر عنصر إلى القيمة ${array[minimumIndex]}`,
          metadata: { phase: "minimum-update", position, minimumIndex, minimumValue: array[minimumIndex] },
        });
      }
    }

    if (minimumIndex !== position) {
      const positionValue = array[position];
      const minimumValue = array[minimumIndex];
      [array[position], array[minimumIndex]] = [array[minimumIndex], array[position]];
      addStep({
        operation: STEP_TYPES.SWAP,
        indices: [position, minimumIndex],
        codeLine: 12,
        message: `نبدّل ${positionValue} مع أصغر قيمة ${minimumValue}`,
        swap: { from: position, to: minimumIndex },
        metadata: { phase: "place-minimum", position, minimumIndex },
      });
    }

    finalizedIndices.push(position);
    addStep({
      operation: STEP_TYPES.SELECT,
      indices: [position],
      codeLine: null,
      message: `تم تثبيت العنصر في الموضع ${position}`,
      metadata: { phase: "sorted", sortedIndex: position },
    });
  }

  steps.push(createStep({
    operation: STEP_TYPES.COMPLETE,
    array: [...array],
    finalizedIndices: array.map((_, index) => index),
    codeLine: null,
    message: "اكتمل الترتيب بالاختيار بنجاح",
  }));

  return steps;
}