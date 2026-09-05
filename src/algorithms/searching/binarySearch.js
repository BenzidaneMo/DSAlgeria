import { createStep, STEP_OPERATIONS } from "../../engine/stepTypes";

export const BINARY_SEARCH_METADATA = Object.freeze({
  name: "البحث الثنائي",
  englishName: "Binary Search",
  description: "يبحث في مصفوفة مرتبة بقسم مجال البحث إلى نصفين بعد كل مقارنة، ثم يستبعد النصف الذي لا يمكن أن يحتوي على الهدف.",
  requirement: "يجب أن تكون المصفوفة مرتبة تصاعديًا قبل بدء البحث.",
  education: {
    coreIdea: "الفكرة الأساسية هي الاستفادة من كون القائمة مرتبة: نقارن الهدف بالعنصر الأوسط، فإما نجده مباشرة، أو نعرف أنه لا يمكن أن يكون إلا في النصف الأيسر أو النصف الأيمن، فنستبعد النصف الآخر بالكامل ونكرر العملية على النصف المتبقي فقط.",
    howItWorks: [
      "نحدد بداية ونهاية مجال البحث (يشمل القائمة كاملة في البداية).",
      "نحسب موضع العنصر الأوسط في هذا المجال.",
      "إذا كانت قيمته تساوي الهدف، نكون قد وجدناه.",
      "إذا كانت قيمة الوسط أصغر من الهدف، نستبعد النصف الأيسر ونبحث في النصف الأيمن فقط.",
      "إذا كانت قيمة الوسط أكبر من الهدف، نستبعد النصف الأيمن ونبحث في النصف الأيسر فقط.",
      "نكرر هذه الخطوات حتى نجد الهدف أو يصبح مجال البحث فارغاً.",
    ],
    example: "للبحث عن القيمة 8 في القائمة المرتبة [2, 3, 5, 8, 9]: العنصر الأوسط هو 5. بما أن 8 أكبر من 5، نستبعد النصف الأيسر [2, 3, 5] بالكامل ونواصل البحث في النصف الأيمن [8, 9] فقط، فنصل إلى الهدف في خطوة واحدة إضافية بدل فحص القائمة عنصراً عنصراً.",
  },
  requiresSortedInput: true,
  requiresTarget: true,
  complexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(1)" },
  sourceCode: `def binary_search(a, target):
    left = 0
    right = len(a) - 1

    while left <= right:
        middle = (left + right) // 2
        if a[middle] == target:
            return middle
        if a[middle] < target:
            left = middle + 1
        else:
            right = middle - 1

    return -1`,
});

function rangeIndices(start, end) {
  if (start > end) return [];
  return Array.from({ length: end - start + 1 }, (_, offset) => start + offset);
}

/** @param {{sortedArray?: number[], isSorted?: boolean, sortedBy?: string|null, target?: number}} input */
export function generateBinarySearchSteps(input = {}) {
  const values = input.sortedArray;
  const target = input.target;

  if (!Array.isArray(values) || values.some((value) => typeof value !== "number" || Number.isNaN(value))) {
    return [createStep({ operation: STEP_OPERATIONS.NOT_FOUND, array: [], codeLine: 2, message: "Binary Search requires a sorted array.", metadata: { target, validInput: false, phase: "missing-sorted-array", result: null } })];
  }
  if (typeof target !== "number" || Number.isNaN(target)) {
    throw new TypeError("Binary Search target must be a number");
  }

  const steps = [];
  const sorted = input.isSorted && values.every((value, index) => index === 0 || values[index - 1] <= value);
  function add(operation, details = {}) {
    steps.push(createStep({
      operation,
      array: values,
      indices: details.indices ?? [],
      codeLine: details.codeLine ?? null,
      message: details.message ?? null,
      metadata: {
        target,
        currentIndex: details.middle ?? null,
        currentValue: Number.isInteger(details.middle) ? values[details.middle] : null,
        left: details.left ?? null,
        middle: details.middle ?? null,
        right: details.right ?? null,
        currentSubarray: details.left !== null && details.left !== undefined && details.right !== null && details.right !== undefined
          ? { start: details.left, end: details.right }
          : null,
        eliminatedIndices: details.eliminatedIndices ?? [],
        sortedBy: input.sortedBy ?? null,
        phase: details.phase ?? null,
        ...details.metadata,      },
      comparison: details.comparison,
    }));
  }

  if (!sorted) {
    add(STEP_OPERATIONS.NOT_FOUND, {
      codeLine: 2,
      phase: "invalid-input",
      message: "Binary Search requires a sorted array.",
      metadata: { validInput: false, result: null },
    });
    return steps;
  }

  let left = 0;
  let right = values.length - 1;
  const eliminatedIndices = [];

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const currentValue = values[middle];
    const comparisonResult = currentValue === target ? "equal" : currentValue < target ? "less" : "greater";

    add(STEP_OPERATIONS.COMPARE, {
      indices: [left, middle, right],
      left,
      middle,
      right,
      phase: "compare",
      codeLine: 6,
      message: `نقارن القيمة ${currentValue} في المنتصف مع الهدف ${target}`,
      comparison: { left: currentValue, right: target, outOfOrder: comparisonResult !== "equal" },
      metadata: { comparisonResult },
    });

    if (comparisonResult === "equal") {
      add(STEP_OPERATIONS.FOUND, {
        indices: [middle],
        left,
        middle,
        right,
        phase: "found",
        codeLine: 7,
        message: `تم العثور على الهدف ${target} في الموضع ${middle}`,
        metadata: { foundIndex: middle },
      });
      return steps;
    }

    if (comparisonResult === "less") {
      const removed = rangeIndices(left, middle);
      eliminatedIndices.push(...removed);
      left = middle + 1;
      add(STEP_OPERATIONS.UPDATE, {
        indices: [left, middle, right].filter((index) => index >= 0 && index < values.length),
        left,
        middle,
        right,
        phase: "eliminate-left",
        codeLine: 10,
        message: `القيمة الوسطى أصغر من الهدف، نستبعد النصف الأيسر وننتقل إلى الموضع ${left}`,
        metadata: { eliminatedIndices: [...eliminatedIndices], eliminatedRange: removed.length ? { start: removed[0], end: removed.at(-1) } : null },
      });
    } else {
      const removed = rangeIndices(middle, right);
      eliminatedIndices.push(...removed);
      right = middle - 1;
      add(STEP_OPERATIONS.UPDATE, {
        indices: [left, middle, right].filter((index) => index >= 0 && index < values.length),
        left,
        middle,
        right,
        phase: "eliminate-right",
        codeLine: 12,
        message: `القيمة الوسطى أكبر من الهدف، نستبعد النصف الأيمن وننتقل إلى الموضع ${right}`,
        metadata: { eliminatedIndices: [...eliminatedIndices], eliminatedRange: removed.length ? { start: removed[0], end: removed.at(-1) } : null },
      });
    }
  }

  add(STEP_OPERATIONS.NOT_FOUND, {
    left,
    middle: null,
    right,
    phase: "not-found",
    codeLine: 14,
    message: `لم نعثر على الهدف ${target} بعد استبعاد جميع المجالات الممكنة`,
    metadata: { eliminatedIndices: [...eliminatedIndices], result: -1 },
  });
  return steps;
}
