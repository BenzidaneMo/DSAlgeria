import { createStep, STEP_TYPES } from "../../engine/stepTypes";

export const QUICK_SORT_METADATA = Object.freeze({
  name: "الترتيب السريع",
  englishName: "Quick Sort",
  description: "نختار عنصراً محورياً ونقسم المصفوفة حوله، ثم نرتب الجزأين الناتجين بشكل متكرر.",
  education: {
    coreIdea: "الفكرة الأساسية هي اختيار عنصر نسميه 'المحور'، ثم إعادة ترتيب بقية العناصر بحيث توضع كل القيم الأصغر منه على يساره وكل القيم الأكبر على يمينه، وبذلك يستقر المحور في موضعه النهائي الصحيح، ثم نكرر نفس الفكرة على كل جزء بشكل منفصل.",
    howItWorks: [
      "نختار آخر عنصر في الجزء الحالي ليكون المحور.",
      "نمر على بقية العناصر ونقارن كل واحد منها بالمحور.",
      "كل عنصر أصغر من أو يساوي المحور نضعه في الجهة اليسرى.",
      "بعد الانتهاء، نضع المحور في الحد الفاصل بين الجزأين، وبذلك يستقر في موضعه النهائي.",
      "نكرر نفس الخطوات على الجزء الأيسر والجزء الأيمن كل على حدة حتى تكتمل القائمة.",
    ],
    example: "لترتيب [5, 3, 8, 2] نختار 2 محوراً (آخر عنصر). لا توجد قيم أصغر منه في بقية العناصر، فيبقى 2 في مكانه كأصغر عنصر بعد التبديل مع 5 → [2, 3, 8, 5]، وتتكوّن قائمة يسرى فارغة وقائمة يمنى [3, 8, 5]. نكرر نفس الفكرة عليها حتى تكتمل القائمة بالكامل إلى [2, 3, 5, 8].",
  },
  producesSortedOutput: true,
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

  // FIX #1: clone `array` and `finalizedIndices` on every step so each
  // snapshot is truly immutable. Previously all steps shared the same
  // array/finalizedIndices references, which were mutated in place during
  // the recursion — scrubbing back to an earlier step would incorrectly
  // show a later (or final) state of the array instead of that step's
  // actual state.
  function addStep(step) {
    steps.push(createStep({
      array: [...array],
      finalizedIndices: [...finalizedIndices],
      ...step,
    }));
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
          // FIX #3: capture both pre-swap values before mutating, so the
          // narration message reflects what is actually being swapped
          // rather than reading the array after the swap already happened.
          const leftValue = array[leftPointer];
          const rightValue = array[rightPointer];
          array[leftPointer] = rightValue;
          array[rightPointer] = leftValue;
          addStep({
            operation: STEP_TYPES.SWAP,
            indices: [leftPointer, rightPointer],
            codeLine: 10,
            message: `نبدّل ${leftValue} مع ${rightValue} ليبقى الأصغر قبل المحور`,
            swap: { from: leftPointer, to: rightPointer },
            metadata: { phase: "partition-swap", currentSubarray, pivotIndex, leftPointer, rightPointer, depth },
          });
        }
        leftPointer += 1;
      }

      // FIX #2: message previously labeled leftPointer as "المؤشر الأيمن"
      // (right pointer) and rightPointer+1 as "المؤشر الأيسر" (left
      // pointer) — the labels were swapped relative to the variable names.
      // leftPointer is the left/boundary pointer; rightPointer is the
      // right/scanning pointer.
      addStep({
        operation: STEP_TYPES.UPDATE,
        indices: [leftPointer, rightPointer],
        codeLine: 11,
        message: `نواصل البحث: المؤشر الأيسر ${leftPointer} والمؤشر الأيمن ${rightPointer + 1}`,
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
      // FIX #4: sourceCode only has 15 lines; the final recursive call is
      // line 15. codeLine 16 pointed past the end of the source, so the
      // code-highlight would show nothing (or crash) on this step.
      codeLine: 15,
      message: `اكتمل ترتيب الجزء من ${low} إلى ${high}`,
      metadata: { phase: "return", currentSubarray, pivotIndex: leftPointer, depth },
    });
  }

  quickSort(0, array.length - 1, 0);
  steps.push(createStep({
    operation: STEP_TYPES.COMPLETE,
    array: [...array],
    finalizedIndices: array.map((_, index) => index),
    codeLine: null,
    message: "اكتمل الترتيب السريع بنجاح",
  }));

  return steps;
}