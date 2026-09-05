import { createStep, STEP_OPERATIONS } from "../../engine/stepTypes";

const MAX_N = 8;

export const FACTORIAL_METADATA = Object.freeze({
  name: "المضروب",
  englishName: "Factorial",
  description: "دالة تكرارية (استدعاء ذاتي) تحسب حاصل ضرب الأعداد الصحيحة من 1 حتى n، وذلك باستدعاء نفسها لقيم أصغر من n حتى تصل إلى حالة أساسية بسيطة، ثم تعود خطوة بخطوة لتُنتج النتيجة النهائية.",
  requirement: `اختر قيمة n من الحقل الجانبي (من 0 إلى ${MAX_N}).`,
  education: {
    coreIdea: "الفكرة الأساسية في الاستدعاء الذاتي (Recursion) هي حل مسألة كبيرة بالاعتماد على حل نفس المسألة بحجم أصغر: لحساب مضروب العدد n نحتاج فقط لحساب مضروب العدد n - 1 ثم ضربه في n، وهكذا حتى نصل إلى حالة أساسية بسيطة جداً نعرف حلها مباشرة (وهي أن مضروب 1 أو 0 يساوي 1).",
    howItWorks: [
      "إذا كان n أصغر من أو يساوي 1 (الحالة الأساسية)، نُرجع القيمة 1 مباشرة دون أي استدعاء إضافي.",
      "إذا كان n أكبر من 1، نستدعي الدالة نفسها لحساب مضروب العدد n - 1.",
      "ننتظر حتى يعود هذا الاستدعاء بنتيجته.",
      "نضرب تلك النتيجة في n للحصول على مضروب n.",
      "تتكرر هذه الاستدعاءات وتتراكم حتى نصل إلى الحالة الأساسية، ثم تبدأ النتائج بالعودة والضرب تدريجياً من الأسفل إلى الأعلى.",
    ],
    example: "لحساب مضروب 4: نستدعي مضروب 3، الذي يستدعي مضروب 2، الذي يستدعي مضروب 1 (الحالة الأساسية) فيُرجع 1. ثم تعود النتائج للأعلى: مضروب 2 = 2×1 = 2، ومضروب 3 = 3×2 = 6، وأخيراً مضروب 4 = 4×6 = 24.",
  },
  requiresCount: true,
  countLabel: "القيمة n",
  countMax: MAX_N,
  visualizationKind: "recursion",
  complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)" },
  sourceCode: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
});

function normalizeCount(input) {
  const raw = typeof input === "number" ? input : input?.n;
  if (!Number.isFinite(raw)) {
    throw new TypeError("Factorial input must contain a finite number n");
  }
  return Math.min(MAX_N, Math.max(0, Math.round(raw)));
}

/**
 * Generates deterministic, step-by-step snapshots of the factorial recursion:
 * first the descending chain of recursive calls down to the base case, then
 * the ascending chain of multiplications as each call returns.
 * @param {{n?: number}|number} input
 * @returns {import("../../engine/stepTypes").AlgorithmStep[]}
 */
export function generateFactorialSteps(input = {}) {
  const n = normalizeCount(input);
  const frameCount = Math.max(n, 1);

  const frames = Array.from({ length: frameCount }, (_, depth) => ({
    depth,
    n: n - depth,
    status: "pending",
    result: null,
  }));

  const snapshotFrames = () => frames.map((frame) => ({ ...frame }));
  const steps = [];
  let baseDepth = frameCount - 1;

  for (let depth = 0; depth < frameCount; depth += 1) {
    for (let markDepth = 0; markDepth < depth; markDepth += 1) {
      frames[markDepth].status = "waiting";
    }

    const isBaseCase = frames[depth].n <= 1;
    frames[depth].status = isBaseCase ? "base" : "calling";

    if (isBaseCase) {
      frames[depth].result = 1;
      baseDepth = depth;
    }

    steps.push(createStep({
      operation: isBaseCase ? STEP_OPERATIONS.RETURN : STEP_OPERATIONS.RECURSIVE_CALL,
      codeLine: isBaseCase ? 3 : 4,
      metadata: {
        n: frames[depth].n,
        depth,
        callStack: snapshotFrames(),
        isBaseCase,
        phase: isBaseCase ? "base" : "calling",
        expression: null,
        result: isBaseCase ? 1 : null,
      },
      message: isBaseCase
        ? `الحالة الأساسية: n = ${frames[depth].n} ≤ 1، نُرجع القيمة 1 مباشرة دون مزيد من الاستدعاءات الذاتية.`
        : `استدعاء ذاتي factorial(${frames[depth].n})؛ بما أن ${frames[depth].n} أكبر من 1 فإننا نحتاج أولاً حساب factorial(${frames[depth].n - 1}).`,
    }));

    if (isBaseCase) {
      break;
    }
  }

  for (let depth = baseDepth - 1; depth >= 0; depth -= 1) {
    const childResult = frames[depth + 1].result;
    const currentN = frames[depth].n;
    const newResult = currentN * childResult;

    frames[depth].result = newResult;
    frames[depth].status = "done";

    steps.push(createStep({
      operation: STEP_OPERATIONS.RETURN,
      codeLine: 4,
      metadata: {
        n: currentN,
        depth,
        callStack: snapshotFrames(),
        isBaseCase: false,
        phase: "returning",
        expression: `${childResult} × ${currentN} = ${newResult}`,
        result: newResult,
      },
      message: `نعود من الاستدعاء factorial(${currentN})؛ نضرب ${currentN} في القيمة المُرجعة ${childResult} لنحصل على ${newResult}.`,
    }));
  }

  const finalResult = frames[0].result;

  steps.push(createStep({
    operation: STEP_OPERATIONS.COMPLETE,
    codeLine: null,
    metadata: {
      n,
      depth: null,
      callStack: snapshotFrames(),
      isBaseCase: false,
      phase: "complete",
      expression: null,
      result: finalResult,
    },
    message: `النتيجة النهائية: factorial(${n}) = ${finalResult}`,
  }));

  return steps;
}
