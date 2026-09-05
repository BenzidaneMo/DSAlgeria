import { createStep, STEP_OPERATIONS } from "../../engine/stepTypes";

export const LINEAR_SEARCH_METADATA = Object.freeze({
  name: "البحث الخطي",
  englishName: "Linear Search",
  description: "نفحص عناصر المصفوفة واحدًا تلو الآخر من البداية حتى نجد القيمة المطلوبة أو نصل إلى النهاية.",
  requiresTarget: true,
  complexity: { best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)" },
  sourceCode: `def linear_search(a, target):
    for index in range(len(a)):
        current = a[index]
        if current == target:
            return index
        move to the next element
    return -1`,
});

/** @param {{array?: number[], target?: number}|number[]} input */
export function generateLinearSearchSteps(input = []) {
  const values = Array.isArray(input) ? input : input.array;
  const target = Array.isArray(input) ? input[0] : input.target;

  if (!Array.isArray(values) || values.some((value) => typeof value !== "number" || Number.isNaN(value))) {
    throw new TypeError("Linear Search input must contain an array of numbers");
  }
  if (typeof target !== "number" || Number.isNaN(target)) {
    throw new TypeError("Linear Search target must be a number");
  }

  const steps = [];
  function add(operation, index, message, details = {}) {
    steps.push(createStep({
      operation,
      array: values,
      indices: index === null ? [] : [index],
      codeLine: details.codeLine ?? null,
      message,
      metadata: { target, currentIndex: index, currentValue: index === null ? null : values[index], ...details.metadata },
      comparison: details.comparison,
      finalizedIndices: details.finalizedIndices,
    }));
  }

  for (let index = 0; index < values.length; index += 1) {
    const currentValue = values[index];
    const matches = currentValue === target;
    add(STEP_OPERATIONS.COMPARE, index, `نقارن القيمة ${currentValue} مع الهدف ${target}`, {
      codeLine: 4,
      comparison: { left: currentValue, right: target, outOfOrder: false },
      metadata: { phase: "compare", matches },
    });

    if (matches) {
      add(STEP_OPERATIONS.FOUND, index, `تم العثور على الهدف ${target} في الموضع ${index}`, {
        codeLine: 5,
        metadata: { phase: "found", foundIndex: index },
      });
      return steps;
    }

    if (index < values.length - 1) {
      add(STEP_OPERATIONS.UPDATE, index + 1, `لا تطابق القيمة الهدف، ننتقل إلى الموضع ${index + 1}`, {
        codeLine: 6,
        metadata: { phase: "next", previousIndex: index, nextIndex: index + 1 },
      });
    }
  }

  add(STEP_OPERATIONS.NOT_FOUND, null, `لم نعثر على الهدف ${target} في المصفوفة`, {
    codeLine: 7,
    metadata: { phase: "not-found", result: -1 },
  });
  return steps;
}
