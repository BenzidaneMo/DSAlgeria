import { createStep, STEP_TYPES } from "../../engine/stepTypes";

export const INSERTION_SORT_METADATA = Object.freeze({
  name: "الترتيب بالإدراج",
  englishName: "Insertion Sort",
  description: "نأخذ كل عنصر جديد ونُدرجه في موضعه الصحيح داخل الجزء المرتب، مع إزاحة العناصر الأكبر.",
  complexity: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  sourceCode: `def insertion_sort(a):
    n = len(a)

    for index in range(1, n):
        selected = a[index]
        position = index - 1

        while position >= 0 and a[position] > selected:
            a[position + 1] = a[position]
            position -= 1

        a[position + 1] = selected`,
});

/**
 * Generates immutable snapshots for insertion, comparison, shifting, and placement.
 * @param {number[]} input
 * @returns {import("../../engine/stepTypes").AlgorithmStep[]}
 */
export function generateInsertionSortSteps(input = []) {
  if (!Array.isArray(input) || input.some((value) => typeof value !== "number" || Number.isNaN(value))) {
    throw new TypeError("Insertion Sort input must be an array of numbers");
  }

  const array = [...input];
  const steps = [];
  const finalizedIndices = input.length > 0 ? [0] : [];

  // FIX: clone `array` and `finalizedIndices` on every step so each
  // snapshot is truly immutable. Previously all steps shared the same
  // array/finalizedIndices references, which were mutated in place
  // (including `finalizedIndices.length = 0` + repopulate at the end of
  // every outer-loop iteration). That meant every already-pushed step —
  // not just future ones — silently updated to reflect later state, so by
  // the end nearly every step showed finalizedIndices as the fully-sorted
  // range regardless of where in the algorithm that step actually was.
  function addStep(step) {
    steps.push(createStep({
      array: [...array],
      finalizedIndices: [...finalizedIndices],
      ...step,
    }));
  }

  for (let index = 1; index < array.length; index += 1) {
    const selectedValue = array[index];
    let position = index - 1;

    addStep({
      operation: STEP_TYPES.SELECT,
      indices: [index],
      codeLine: 5,
      message: `نختار العنصر ${selectedValue} لإدراجه في الجزء المرتب`,
      metadata: { phase: "select", selectedValue, selectedIndex: index, position },
    });

    while (position >= 0) {
      const comparedValue = array[position];
      const shouldShift = comparedValue > selectedValue;

      addStep({
        operation: STEP_TYPES.COMPARE,
        indices: [position, position + 1],
        codeLine: 8,
        message: `نقارن ${comparedValue} مع العنصر المختار ${selectedValue}`,
        comparison: { left: comparedValue, right: selectedValue, outOfOrder: shouldShift },
        metadata: { phase: "search", selectedValue, selectedIndex: index, position, shouldShift },
      });

      if (!shouldShift) {
        break;
      }

      array[position + 1] = array[position];
      addStep({
        operation: STEP_TYPES.SHIFT,
        indices: [position, position + 1],
        codeLine: 9,
        message: `نزيح العنصر ${comparedValue} خانة إلى اليمين ونواصل البحث`,
        metadata: { phase: "shift", selectedValue, from: position, to: position + 1, nextPosition: position - 1 },
      });
      position -= 1;
    }

    array[position + 1] = selectedValue;
    addStep({
      operation: STEP_TYPES.INSERT,
      indices: [position + 1],
      codeLine: 12,
      message: `ندرج العنصر ${selectedValue} في الموضع ${position + 1}`,
      metadata: { phase: "insert", selectedValue, insertedIndex: position + 1 },
    });

    finalizedIndices.length = 0;
    for (let sortedIndex = 0; sortedIndex <= index; sortedIndex += 1) {
      finalizedIndices.push(sortedIndex);
    }
    addStep({
      operation: STEP_TYPES.UPDATE,
      indices: [...finalizedIndices],
      codeLine: null,
      message: `اكتمل الجزء المرتب حتى الموضع ${index}`,
      metadata: { phase: "sorted", sortedThrough: index },
    });
  }

  steps.push(createStep({
    operation: STEP_TYPES.COMPLETE,
    array: [...array],
    finalizedIndices: array.map((_, index) => index),
    codeLine: null,
    message: "اكتمل الترتيب بالإدراج بنجاح",
  }));

  return steps;
}