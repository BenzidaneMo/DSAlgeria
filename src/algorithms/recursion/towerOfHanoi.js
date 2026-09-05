import { createStep, STEP_OPERATIONS } from "../../engine/stepTypes";

const MAX_N = 6;
const TOWER_IDS = ["A", "B", "C"];
const TOWER_NAMES = Object.freeze({
  A: "العمود الأول (المصدر)",
  B: "العمود المساعد",
  C: "العمود الأخير (الهدف)",
});

export const TOWER_OF_HANOI_METADATA = Object.freeze({
  name: "أبراج هانوي",
  englishName: "Tower of Hanoi",
  description: "لغز تكراري (استدعاء ذاتي) هدفه نقل كومة من الأقراص من العمود الأول إلى العمود الأخير باستخدام عمود مساعد، بحيث يتم نقل قرص واحد فقط في كل مرة، ودون وضع قرص أكبر فوق قرص أصغر. يتم حل المسألة بتقسيمها: أولاً ننقل جميع الأقراص العلوية (n - 1) إلى العمود المساعد، ثم ننقل أكبر قرص إلى الهدف مباشرة، ثم ننقل الأقراص العلوية من العمود المساعد إلى الهدف.",
  requirement: `اختر عدد الأقراص n من الحقل الجانبي (من 1 إلى ${MAX_N}).`,
  requiresCount: true,
  countLabel: "عدد الأقراص n",
  countMax: MAX_N,
  visualizationKind: "hanoi",
  rules: [
    "نقل قرص واحد فقط في كل مرة.",
    "لا يمكن وضع قرص أكبر فوق قرص أصغر.",
    "نقل جميع الأقراص من العمود الأول إلى العمود الأخير.",
  ],
  complexity: { best: "O(2^n)", average: "O(2^n)", worst: "O(2^n)", space: "O(n)" },
  sourceCode: `def tower_of_hanoi(n, source, auxiliary, target):
    if n == 1:
        move(source, target)
        return

    tower_of_hanoi(n - 1, source, target, auxiliary)
    move(source, target)
    tower_of_hanoi(n - 1, auxiliary, source, target)`,
});

function normalizeCount(input) {
  const raw = typeof input === "number" ? input : input?.n;
  if (!Number.isFinite(raw)) {
    throw new TypeError("Tower of Hanoi input must contain a finite number n");
  }
  return Math.min(MAX_N, Math.max(1, Math.round(raw)));
}

/**
 * Generates deterministic, step-by-step snapshots of the recursive Tower of
 * Hanoi solution: every disk move is produced by walking the same
 * decomposition the source code describes (move n - 1 disks out of the way,
 * move the largest disk, move the n - 1 disks back onto it), with the full
 * tower state snapshotted after every move so the visualization never needs
 * to replay moves itself.
 * @param {{n?: number}|number} input
 * @returns {import("../../engine/stepTypes").AlgorithmStep[]}
 */
export function generateTowerOfHanoiSteps(input = {}) {
  const n = normalizeCount(input);
  const towers = {
    A: Array.from({ length: n }, (_, index) => n - index),
    B: [],
    C: [],
  };

  const snapshot = () => ({ A: [...towers.A], B: [...towers.B], C: [...towers.C] });
  const steps = [];

  function move(source, target) {
    const disk = towers[source][towers[source].length - 1];
    towers[source] = towers[source].slice(0, -1);
    towers[target] = [...towers[target], disk];

    steps.push(createStep({
      operation: STEP_OPERATIONS.MOVE,
      codeLine: 3,
      metadata: {
        towers: snapshot(), disk, from: source, to: target, auxiliary: null, diskCount: null, phase: "move",
      },
      message: `نقل القرص ${disk} من ${TOWER_NAMES[source]} إلى ${TOWER_NAMES[target]}.`,
    }));
  }

  function solve(count, source, auxiliary, target) {
    if (count === 1) {
      move(source, target);
      return;
    }

    steps.push(createStep({
      operation: STEP_OPERATIONS.RECURSIVE_CALL,
      codeLine: 6,
      metadata: {
        towers: snapshot(), disk: null, from: source, to: auxiliary, auxiliary: target, diskCount: count - 1, phase: "calling",
      },
      message: `نقل القرصين العلويين (${count - 1} من الأقراص) من ${TOWER_NAMES[source]} إلى ${TOWER_NAMES[auxiliary]} مؤقتًا، باستخدام ${TOWER_NAMES[target]}.`,
    }));
    solve(count - 1, source, target, auxiliary);

    move(source, target);

    steps.push(createStep({
      operation: STEP_OPERATIONS.RECURSIVE_CALL,
      codeLine: 8,
      metadata: {
        towers: snapshot(), disk: null, from: auxiliary, to: target, auxiliary: source, diskCount: count - 1, phase: "calling",
      },
      message: `الآن ننقل الأقراص (${count - 1}) من ${TOWER_NAMES[auxiliary]} إلى ${TOWER_NAMES[target]}، باستخدام ${TOWER_NAMES[source]}.`,
    }));
    solve(count - 1, auxiliary, source, target);

    steps.push(createStep({
      operation: STEP_OPERATIONS.RETURN,
      codeLine: null,
      metadata: {
        towers: snapshot(), disk: null, from: source, to: target, auxiliary, diskCount: count, phase: "returning",
      },
      message: `إرجاع التنفيذ: اكتمل نقل ${count} من الأقراص من ${TOWER_NAMES[source]} إلى ${TOWER_NAMES[target]}.`,
    }));
  }

  solve(n, TOWER_IDS[0], TOWER_IDS[1], TOWER_IDS[2]);

  steps.push(createStep({
    operation: STEP_OPERATIONS.COMPLETE,
    codeLine: null,
    metadata: { towers: snapshot(), disk: null, from: null, to: null, auxiliary: null, diskCount: n, phase: "complete" },
    message: `تم نقل جميع الأقراص الـ ${n} من ${TOWER_NAMES.A} إلى ${TOWER_NAMES.C} بنجاح!`,
  }));

  return steps;
}
