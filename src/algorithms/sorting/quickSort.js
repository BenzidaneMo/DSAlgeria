import { createStep, STEP_TYPES } from "../../engine/stepTypes";

export const QUICK_SORT_METADATA = Object.freeze({
  name: "الترتيب السريع",
  englishName: "Quick Sort",
  description: "نختار عنصراً محورياً ونقسم المصفوفة حوله، ثم نرتب الجزأين الناتجين بشكل متكرر.",
  complexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
  },
  sourceCode: `def quick_sort(a, low, high):
    if low >= high:
        return

    pivot = a[high]
    left = low

    for right in range(low, high):
        if a[right] <= pivot:
            a[left], a[right] = a[right], a[left]
            left += 1

    a[left], a[high] = a[high], a[left]
    quick_sort(a, low, left - 1)
    quick_sort(a, left + 1, high)`,
});

/**
 * Generates immutable snapshots for recursive partitioning and pivot placement.
 * @param {number[]} input
 * @returns {import("../../engine/stepTypes").AlgorithmStep[]}
 */
export function generateQuickSortSteps(input = []) {
  if (!Array.isArray(input) || input.some((value) => typeof value !== "number" || Number.isNaN(value))) {
    throw new TypeError("Quick Sort input must be an array of numbers");
  }

  const array = [...input];
  const steps = [];
  const finalizedIndices = [];

  function addStep(step) {
    steps.push(createStep({ array, finalizedIndices, ...step }));
  }

  function markCompleted(index) {
    if (index >= 0 && !finalizedIndices.includes(index)) {
      finalizedIndices.push(index);
      finalizedIndices.sort((left, right) => left - right);
    }
  }

  function quickSort(low, high, depth) {
    const currentSubarray = { start: low, end: high };
    addStep({
      operation: STEP_TYPES.RECURSIVE_CALL,
      indices: low <= high ? [low, high] : [],
      codeLine: 1,
      message: low <= high
        ? `استدعاء الخوارزمية لترتيب الجزء من الموضع ${low} إلى ${high}`
        : "استدعاء الخوارزمية لجزء فارغ، نعود مباشرة",
      metadata: { phase: "recursive-call", currentSubarray, depth },
    });

    if (low >= high) {
      if (low === high) {
        markCompleted(low);
      }
      addStep({
        operation: STEP_TYPES.RETURN,
        indices: low === high ? [low] : [],
        codeLine: 3,
        message: "الجزء مرتب مسبقاً، ننهي العملية",
        metadata: { phase: "return", currentSubarray, depth },
      });
      return;
    }

    const pivotIndex = high;
    const pivotValue = array[pivotIndex];
    let leftPointer = low;

    addStep({
      operation: STEP_TYPES.PARTITION,
      indices: [low, high],
      codeLine: 5,
      message: `نبدأ تقسيم الجزء الحالي، والمحور هو ${pivotValue}`,
      metadata: { phase: "partition-start", currentSubarray, pivotIndex, leftPointer, rightPointer: low, depth },
    });

    for (let rightPointer = low; rightPointer < high; rightPointer += 1) {
      const comparedValue = array[rightPointer];
      const belongsLeft = comparedValue <= pivotValue;

      addStep({
        operation: STEP_TYPES.COMPARE,
        indices: [rightPointer, pivotIndex],
        codeLine: 9,
        message: `نقارن ${comparedValue} مع المحور ${pivotValue}`,
        comparison: { left: comparedValue, right: pivotValue, outOfOrder: !belongsLeft },
        metadata: { phase: "partition-compare", currentSubarray, pivotIndex, leftPointer, rightPointer, depth },
      });

      if (belongsLeft) {
        if (leftPointer !== rightPointer) {
          const leftValue = array[leftPointer];
          array[leftPointer] = array[rightPointer];
          array[rightPointer] = leftValue;
          addStep({
            operation: STEP_TYPES.SWAP,
            indices: [leftPointer, rightPointer],
            codeLine: 10,
            message: `نبدّل ${array[rightPointer]} مع ${array[leftPointer]} ليبقى الأصغر قبل المحور`,
            swap: { from: leftPointer, to: rightPointer },
            metadata: { phase: "partition-swap", currentSubarray, pivotIndex, leftPointer, rightPointer, depth },
          });
        }
        leftPointer += 1;
      }

      addStep({
        operation: STEP_TYPES.UPDATE,
        indices: [leftPointer, rightPointer],
        codeLine: 11,
        message: `نواصل البحث: المؤشر الأيمن ${leftPointer} والمؤشر الأيسر ${rightPointer + 1}`,
        metadata: { phase: "pointer-update", currentSubarray, pivotIndex, leftPointer, rightPointer: rightPointer + 1, depth },
      });
    }

    if (leftPointer !== pivotIndex) {
      const leftValue = array[leftPointer];
      array[leftPointer] = array[pivotIndex];
      array[pivotIndex] = leftValue;
      addStep({
        operation: STEP_TYPES.SWAP,
        indices: [leftPointer, pivotIndex],
        codeLine: 13,
        message: `نضع المحور ${pivotValue} في موضعه النهائي ${leftPointer}`,
        swap: { from: leftPointer, to: pivotIndex },
        metadata: { phase: "pivot-swap", currentSubarray, pivotIndex, leftPointer, rightPointer: high, depth },
      });
    }

    markCompleted(leftPointer);
    addStep({
      operation: STEP_TYPES.PARTITION,
      indices: [low, high],
      codeLine: 13,
      message: `اكتمل التقسيم، والمحور ${pivotValue} ثبت في الموضع ${leftPointer}`,
      metadata: { phase: "partition-complete", currentSubarray, pivotIndex: leftPointer, leftPointer, rightPointer: high, depth },
    });

    quickSort(low, leftPointer - 1, depth + 1);
    quickSort(leftPointer + 1, high, depth + 1);

    addStep({
      operation: STEP_TYPES.RETURN,
      indices: [low, high],
      codeLine: 16,
      message: `اكتمل ترتيب الجزء من ${low} إلى ${high}`,
      metadata: { phase: "return", currentSubarray, pivotIndex: leftPointer, depth },
    });
  }

  quickSort(0, array.length - 1, 0);
  steps.push(createStep({
    operation: STEP_TYPES.COMPLETE,
    array,
    finalizedIndices: array.map((_, index) => index),
    codeLine: null,
    message: "اكتمل الترتيب السريع بنجاح",
  }));

  return steps;
}