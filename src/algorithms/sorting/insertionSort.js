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

  for (let index = 1; index < array.length; index += 1) {
    const selectedValue = array[index];
    let position = index - 1;

    steps.push(createStep({
      operation: STEP_TYPES.SELECT,
      array,
      finalizedIndices,
      indices: [index],
      codeLine: 5,
      message: `نختار العنصر ${selectedValue} لإدراجه في الجزء المرتب`,
      metadata: { phase: "select", selectedValue, selectedIndex: index, position },
    }));

    while (position >= 0) {
      const comparedValue = array[position];
      const shouldShift = comparedValue > selectedValue;

      steps.push(createStep({
        operation: STEP_TYPES.COMPARE,
        array,
        finalizedIndices,
        indices: [position, position + 1],
        codeLine: 8,
        message: `نقارن ${comparedValue} مع العنصر المختار ${selectedValue}`,
        comparison: { left: comparedValue, right: selectedValue, outOfOrder: shouldShift },
        metadata: { phase: "search", selectedValue, selectedIndex: index, position, shouldShift },
      }));

      if (!shouldShift) {
        break;
      }

      array[position + 1] = array[position];
      steps.push(createStep({
        operation: STEP_TYPES.SHIFT,
        array,
        finalizedIndices,
        indices: [position, position + 1],
        codeLine: 9,
        message: `نزيح العنصر ${comparedValue} خانة إلى اليمين ونواصل البحث`,
        metadata: { phase: "shift", selectedValue, from: position, to: position + 1, nextPosition: position - 1 },
      }));
      position -= 1;
    }

    array[position + 1] = selectedValue;
    steps.push(createStep({
      operation: STEP_TYPES.INSERT,
      array,
      finalizedIndices,
      indices: [position + 1],
      codeLine: 12,
      message: `ندرج العنصر ${selectedValue} في الموضع ${position + 1}`,
      metadata: { phase: "insert", selectedValue, insertedIndex: position + 1 },
    }));

    finalizedIndices.length = 0;
    for (let sortedIndex = 0; sortedIndex <= index; sortedIndex += 1) {
      finalizedIndices.push(sortedIndex);
    }
    steps.push(createStep({
      operation: STEP_TYPES.UPDATE,
      array,
      finalizedIndices,
      indices: finalizedIndices,
      codeLine: null,
      message: `اكتمل الجزء المرتب حتى الموضع ${index}`,
      metadata: { phase: "sorted", sortedThrough: index },
    }));
  }

  steps.push(createStep({
    operation: STEP_TYPES.COMPLETE,
    array,
    finalizedIndices: array.map((_, index) => index),
    codeLine: null,
    message: "اكتمل الترتيب بالإدراج بنجاح",
  }));

  return steps;
}