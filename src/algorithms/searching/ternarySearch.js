import { createStep, STEP_OPERATIONS } from "../../engine/stepTypes";

export const TERNARY_SEARCH_METADATA = Object.freeze({
  name: "البحث الثلاثي",
  englishName: "Ternary Search",
  description: "يبحث في مصفوفة مرتبة بتقسيم مجال البحث إلى ثلاثة أجزاء، ثم يستبعد الجزء الذي لا يمكن أن يحتوي على القيمة المطلوبة.",
  requirement: "يجب أن تكون المصفوفة مرتبة تصاعديًا قبل بدء البحث.",
  requiresSortedInput: true,
  requiresTarget: true,
  complexity: { best: "O(1)", average: "O(log₃ n)", worst: "O(log₃ n)", space: "O(1)" },
  sourceCode: `def ternary_search(a, target):
    left = 0
    right = len(a) - 1

    while left <= right:
        mid1 = left + (right - left) // 3
        mid2 = right - (right - left) // 3
        if a[mid1] == target:
            return mid1
        if a[mid2] == target:
            return mid2
        if target < a[mid1]:
            right = mid1 - 1
        elif target > a[mid2]:
            left = mid2 + 1
        else:
            left = mid1 + 1
            right = mid2 - 1

    return -1`,
});

function rangeIndices(start, end) {
  if (start > end) return [];
  return Array.from({ length: end - start + 1 }, (_, offset) => start + offset);
}

/** @param {{sortedArray?: number[], isSorted?: boolean, sortedBy?: string|null, target?: number}} input */
export function generateTernarySearchSteps(input = {}) {
  const values = input.sortedArray;
  const target = input.target;
  const unavailable = !Array.isArray(values) || values.some((value) => typeof value !== "number" || Number.isNaN(value));

  if (unavailable) {
    return [createStep({
      operation: STEP_OPERATIONS.NOT_FOUND,
      array: [],
      codeLine: 2,
      message: "البحث الثلاثي يتطلب مصفوفة مرتبة",
      metadata: { target, validInput: false, phase: "missing-sorted-array", result: null },
    })];
  }
  if (typeof target !== "number" || Number.isNaN(target)) {
    throw new TypeError("Ternary Search target must be a number");
  }

  const steps = [];
  const sorted = input.isSorted && values.every((value, index) => index === 0 || values[index - 1] <= value);
  const eliminatedIndices = [];

  function add(operation, details = {}) {
    const left = details.left ?? null;
    const right = details.right ?? null;
    steps.push(createStep({
      operation,
      array: values,
      indices: details.indices ?? [],
      codeLine: details.codeLine ?? null,
      message: details.message ?? null,
      metadata: {
        target,
        sortedBy: input.sortedBy ?? null,
        left,
        mid1: details.mid1 ?? null,
        mid2: details.mid2 ?? null,
        right,
        currentIndex: details.mid1 ?? details.mid2 ?? null,
        currentValue: Number.isInteger(details.mid1) ? values[details.mid1] : Number.isInteger(details.mid2) ? values[details.mid2] : null,
        currentSubarray: Number.isInteger(left) && Number.isInteger(right) && left <= right ? { start: left, end: right } : null,
        eliminatedIndices: [...eliminatedIndices],
        eliminatedRanges: details.eliminatedRanges ?? [],
        phase: details.phase ?? null,
        ...details.metadata,
      },
      comparison: details.comparison,
    }));
  }

  if (!sorted) {
    add(STEP_OPERATIONS.NOT_FOUND, {
      codeLine: 2,
      phase: "invalid-input",
      message: "البحث الثلاثي يتطلب مصفوفة مرتبة",
      metadata: { validInput: false, result: null },
    });
    return steps;
  }

  let left = 0;
  let right = values.length - 1;

  while (left <= right) {
    const third = Math.floor((right - left) / 3);
    const mid1 = left + third;
    const mid2 = right - third;
    const firstResult = values[mid1] === target ? "equal" : values[mid1] < target ? "less" : "greater";
    const secondResult = values[mid2] === target ? "equal" : values[mid2] < target ? "less" : "greater";

    add(STEP_OPERATIONS.COMPARE, {
      indices: [left, mid1, mid2, right],
      left,
      mid1,
      mid2,
      right,
      codeLine: 7,
      phase: "compare",
      message: `نقارن الهدف ${target} مع القيمتين ${values[mid1]} و${values[mid2]}`,
      comparison: { left: values[mid1], right: target, outOfOrder: firstResult !== "equal" },
      metadata: { comparisonResult: { mid1: firstResult, mid2: secondResult } },
    });

    if (firstResult === "equal") {
      add(STEP_OPERATIONS.FOUND, { indices: [mid1], left, mid1, mid2, right, codeLine: 8, phase: "found", message: `تم العثور على الهدف ${target} في الموضع ${mid1}`, metadata: { foundIndex: mid1 } });
      return steps;
    }
    if (secondResult === "equal") {
      add(STEP_OPERATIONS.FOUND, { indices: [mid2], left, mid1, mid2, right, codeLine: 9, phase: "found", message: `تم العثور على الهدف ${target} في الموضع ${mid2}`, metadata: { foundIndex: mid2 } });
      return steps;
    }

    let eliminatedRanges;
    const previousLeft = left;
    const previousRight = right;
    if (target < values[mid1]) {
      eliminatedRanges = [{ start: mid1, end: previousRight }];
      left = previousLeft;
      right = mid1 - 1;
      add(STEP_OPERATIONS.UPDATE, {
        left, mid1, mid2, right, codeLine: 11, phase: "eliminate-right",
        message: "الهدف أصغر من قيمة mid1، نستبعد الثلثين الأوسط والأيمن ونحتفظ بالثلث الأيسر",
        metadata: { comparisonResult: "target-less-than-mid1", eliminatedRanges, eliminatedIndices: [...eliminatedIndices, ...eliminatedRanges.flatMap((range) => rangeIndices(range.start, range.end))] },
      });
    } else if (target > values[mid2]) {
      eliminatedRanges = [{ start: previousLeft, end: mid2 }];
      left = mid2 + 1;
      right = previousRight;
      add(STEP_OPERATIONS.UPDATE, {
        left, mid1, mid2, right, codeLine: 13, phase: "eliminate-left",
        message: "الهدف أكبر من قيمة mid2، نستبعد الثلثين الأيسر والأوسط ونحتفظ بالثلث الأيمن",
        metadata: { comparisonResult: "target-greater-than-mid2", eliminatedRanges, eliminatedIndices: [...eliminatedIndices, ...eliminatedRanges.flatMap((range) => rangeIndices(range.start, range.end))] },
      });
    } else {
      eliminatedRanges = [
        { start: previousLeft, end: mid1 },
        { start: mid2, end: previousRight },
      ];
      left = mid1 + 1;
      right = mid2 - 1;
      add(STEP_OPERATIONS.UPDATE, {
        left, mid1, mid2, right, codeLine: 16, phase: "eliminate-outer",
        message: "الهدف بين قيمتي mid1 وmid2، نستبعد الجزأين الخارجيين ونحتفظ بالثلث الأوسط",
        metadata: { comparisonResult: "target-between-pivots", eliminatedRanges, eliminatedIndices: [...eliminatedIndices, ...eliminatedRanges.flatMap((range) => rangeIndices(range.start, range.end))] },
      });
    }

    eliminatedRanges.forEach((range) => eliminatedIndices.push(...rangeIndices(range.start, range.end)));
  }

  add(STEP_OPERATIONS.NOT_FOUND, {
    left,
    right,
    codeLine: 18,
    phase: "not-found",
    message: `لم نعثر على الهدف ${target} بعد استبعاد المجالات غير الممكنة`,
    metadata: { result: -1 },
  });
  return steps;
}
