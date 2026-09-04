import { createStep, STEP_OPERATIONS } from "../../engine/stepTypes";

export const MERGE_SORT_METADATA = Object.freeze({
  name: "الترتيب بالدمج",
  englishName: "Merge Sort",
  description: "نقسم المصفوفة إلى أجزاء أصغر، ثم ندمج الأجزاء المرتبة تدريجيا للحصول على مصفوفة مرتبة.",
  complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  sourceCode: `def merge_sort(a, left, right):
    if left >= right:
        return

    middle = (left + right) // 2
    merge_sort(a, left, middle)
    merge_sort(a, middle + 1, right)
    merge(a, left, middle, right)


def merge(a, left, middle, right):
    # compare and copy from left/right into the merged section
    pass`,
});

function rangeIndices(start, end) {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, offset) => start + offset);
}

function subarrayContext(start, end, depth, left, right) {
  return {
    currentSubarray: { start, end },
    depth,
    leftSubarray: [...left],
    rightSubarray: [...right],
  };
}

/** @param {number[]} input */
export function generateMergeSortSteps(input = []) {
  if (!Array.isArray(input) || input.some((value) => typeof value !== "number" || Number.isNaN(value))) {
    throw new TypeError("Merge Sort input must be an array of numbers");
  }

  const array = [...input];
  const steps = [];

  function add(operation, details) {
    steps.push(createStep({ operation, array, ...details }));
  }

  function sort(left, right, depth) {
    add(STEP_OPERATIONS.RECURSIVE_CALL, {
      indices: rangeIndices(left, right),
      codeLine: 1,
      message: `استدعاء ذاتي للجزء من ${left} إلى ${right}`,
      metadata: { currentSubarray: { start: left, end: right }, depth },
    });

    if (left >= right) {
      add(STEP_OPERATIONS.RETURN, {
        indices: [left],
        codeLine: 3,
        message: `عودة من الجزء ${left}`,
        metadata: { currentSubarray: { start: left, end: right }, depth },
      });
      return;
    }

    const middle = Math.floor((left + right) / 2);
    const leftValues = array.slice(left, middle + 1);
    const rightValues = array.slice(middle + 1, right + 1);
    add(STEP_OPERATIONS.SPLIT, {
      indices: [left, middle, right],
      codeLine: 5,
      message: `تقسيم الجزء إلى يسار [${left}..${middle}] ويمين [${middle + 1}..${right}]`,
      metadata: subarrayContext(left, right, depth, leftValues, rightValues),
    });

    sort(left, middle, depth + 1);
    sort(middle + 1, right, depth + 1);
    merge(left, middle, right, depth);

    add(STEP_OPERATIONS.RETURN, {
      indices: rangeIndices(left, right),
      codeLine: 9,
      message: `عودة الجزء المرتب من ${left} إلى ${right}`,
      metadata: { currentSubarray: { start: left, end: right }, depth, merged: true },
    });
  }

  function merge(left, middle, right, depth) {
    const leftValues = array.slice(left, middle + 1);
    const rightValues = array.slice(middle + 1, right + 1);
    let leftIndex = 0;
    let rightIndex = 0;
    let target = left;
    const mergedValues = [];

    add(STEP_OPERATIONS.MERGE, {
      indices: rangeIndices(left, right),
      codeLine: 10,
      message: `دمج الجزأين ${left}..${middle} و ${middle + 1}..${right}`,
      metadata: subarrayContext(left, right, depth, leftValues, rightValues),
    });

    while (leftIndex < leftValues.length && rightIndex < rightValues.length) {
      const leftValue = leftValues[leftIndex];
      const rightValue = rightValues[rightIndex];
      add(STEP_OPERATIONS.COMPARE, {
        indices: [left + leftIndex, middle + 1 + rightIndex],
        codeLine: 11,
        message: `مقارنة ${leftValue} من اليسار مع ${rightValue} من اليمين`,
        comparison: { left: leftValue, right: rightValue, outOfOrder: leftValue > rightValue },
        metadata: subarrayContext(left, right, depth, leftValues, rightValues),
      });

      const value = leftValue <= rightValue ? leftValues[leftIndex++] : rightValues[rightIndex++];
      array[target] = value;
      mergedValues.push(value);
      add(STEP_OPERATIONS.SELECT, {
        indices: [target],
        codeLine: 12,
        message: `اختيار العنصر ${value} للجزء المدمج`,
        metadata: { ...subarrayContext(left, right, depth, leftValues, rightValues), selectedValue: value, targetIndex: target },
      });
      target += 1;
    }

    while (leftIndex < leftValues.length) {
      const value = leftValues[leftIndex++];
      array[target] = value;
      mergedValues.push(value);
      add(STEP_OPERATIONS.UPDATE, {
        indices: [target],
        codeLine: 13,
        message: `نسخ العنصر المتبقي ${value} من اليسار`,
        metadata: { ...subarrayContext(left, right, depth, leftValues, rightValues), copiedFrom: "left", selectedValue: value, targetIndex: target },
      });
      target += 1;
    }

    while (rightIndex < rightValues.length) {
      const value = rightValues[rightIndex++];
      array[target] = value;
      mergedValues.push(value);
      add(STEP_OPERATIONS.UPDATE, {
        indices: [target],
        codeLine: 14,
        message: `نسخ العنصر المتبقي ${value} من اليمين`,
        metadata: { ...subarrayContext(left, right, depth, leftValues, rightValues), copiedFrom: "right", selectedValue: value, targetIndex: target },
      });
      target += 1;
    }

    add(STEP_OPERATIONS.MERGE, {
      indices: rangeIndices(left, right),
      finalizedIndices: rangeIndices(left, right),
      codeLine: 15,
      message: `اكتمل دمج الجزء ${left} إلى ${right}`,
      metadata: { currentSubarray: { start: left, end: right }, depth, mergedValues },
    });
  }

  if (array.length > 0) {
    sort(0, array.length - 1, 0);
  }

  steps.push(createStep({
    operation: STEP_OPERATIONS.COMPLETE,
    array,
    finalizedIndices: array.map((_, index) => index),
    codeLine: null,
    message: "اكتمل الترتيب بالدمج بنجاح",
    metadata: { completed: true },
  }));

  return steps;
}
