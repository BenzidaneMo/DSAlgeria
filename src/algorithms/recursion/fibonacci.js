import { createStep, STEP_OPERATIONS } from "../../engine/stepTypes";

const MAX_N = 7;

export const FIBONACCI_METADATA = Object.freeze({
  name: "متتالية فيبوناتشي",
  englishName: "Fibonacci",
  description: "دالة تكرارية (استدعاء ذاتي) تحسب حد فيبوناتشي رقم n عبر استدعاء نفسها مرتين: مرة لحساب fibonacci(n-1) ومرة لحساب fibonacci(n-2)، ثم جمع الناتجين. هذا التفرع يُنتج شجرة استدعاءات، وتلاحظ فيها أن نفس القيم تُحسب أكثر من مرة.",
  requirement: `اختر قيمة n من الحقل الجانبي (من 0 إلى ${MAX_N}).`,
  requiresCount: true,
  countLabel: "القيمة n",
  countMax: MAX_N,
  visualizationKind: "recursion",
  complexity: { best: "O(2^n)", average: "O(2^n)", worst: "O(2^n)", space: "O(n)" },
  sourceCode: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`,
});

function normalizeCount(input) {
  const raw = typeof input === "number" ? input : input?.n;
  if (!Number.isFinite(raw)) {
    throw new TypeError("Fibonacci input must contain a finite number n");
  }
  return Math.min(MAX_N, Math.max(0, Math.round(raw)));
}

function buildTree(n, depth, id, parentId) {
  const node = { id, parentId, n, depth, status: "pending", result: null, x: 0, left: null, right: null };

  if (n > 1) {
    node.left = buildTree(n - 1, depth + 1, `${id}0`, id);
    node.right = buildTree(n - 2, depth + 1, `${id}1`, id);
  }

  return node;
}

function assignX(node, cursor) {
  if (!node.left && !node.right) {
    node.x = cursor.value;
    cursor.value += 1;
    return node.x;
  }

  const leftX = assignX(node.left, cursor);
  const rightX = assignX(node.right, cursor);
  node.x = (leftX + rightX) / 2;
  return node.x;
}

function flatten(node, out) {
  out.push(node);
  if (node.left) flatten(node.left, out);
  if (node.right) flatten(node.right, out);
  return out;
}

/**
 * Generates deterministic, step-by-step snapshots of the recursive Fibonacci
 * call tree: every node of the tree is precomputed up front (fixed layout,
 * no shifting), and each step marks how one node's status changes as the
 * recursion enters, resolves a base case, or combines both child results.
 * @param {{n?: number}|number} input
 * @returns {import("../../engine/stepTypes").AlgorithmStep[]}
 */
export function generateFibonacciSteps(input = {}) {
  const n = normalizeCount(input);
  const root = buildTree(n, 0, "0", null);
  assignX(root, { value: 0 });
  const nodeList = flatten(root, []);

  const snapshot = () => nodeList.map(({ left: _left, right: _right, ...rest }) => ({ ...rest }));
  const steps = [];

  function visit(node) {
    if (node.n <= 1) {
      node.status = "base";
      node.result = node.n;
      steps.push(createStep({
        operation: STEP_OPERATIONS.RETURN,
        codeLine: 3,
        metadata: {
          n: node.n, nodeId: node.id, depth: node.depth, callTree: snapshot(),
          isBaseCase: true, phase: "base", expression: null, result: node.n,
        },
        message: `الوصول إلى الحالة الأساسية: n = ${node.n} ≤ 1، نُرجع القيمة ${node.n} مباشرة.`,
      }));
      node.status = "done";
      return node.result;
    }

    node.status = "calling";
    steps.push(createStep({
      operation: STEP_OPERATIONS.RECURSIVE_CALL,
      codeLine: 4,
      metadata: {
        n: node.n, nodeId: node.id, depth: node.depth, callTree: snapshot(),
        isBaseCase: false, phase: "calling", expression: null, result: null,
      },
      message: `استدعاء fibonacci(${node.n})؛ بما أن ${node.n} أكبر من 1 فإننا نحسب fibonacci(${node.n - 1}) أولاً ثم fibonacci(${node.n - 2}).`,
    }));

    const leftResult = visit(node.left);

    steps.push(createStep({
      operation: STEP_OPERATIONS.RECURSIVE_CALL,
      codeLine: 4,
      metadata: {
        n: node.n, nodeId: node.id, depth: node.depth, callTree: snapshot(),
        isBaseCase: false, phase: "calling", expression: null, result: null,
      },
      message: `عدنا إلى fibonacci(${node.n}) بعد أن حسبنا fibonacci(${node.n - 1}) = ${leftResult}؛ الآن نحسب fibonacci(${node.n - 2}).`,
    }));

    const rightResult = visit(node.right);

    const result = leftResult + rightResult;
    node.result = result;
    node.status = "done";

    steps.push(createStep({
      operation: STEP_OPERATIONS.RETURN,
      codeLine: 4,
      metadata: {
        n: node.n, nodeId: node.id, depth: node.depth, callTree: snapshot(),
        isBaseCase: false, phase: "returning",
        expression: `fibonacci(${node.n - 1}) + fibonacci(${node.n - 2}) = ${leftResult} + ${rightResult} = ${result}`,
        result,
      },
      message: `حساب fibonacci(${node.n}) = fibonacci(${node.n - 1}) + fibonacci(${node.n - 2}) = ${leftResult} + ${rightResult} = ${result}`,
    }));

    return result;
  }

  const finalResult = visit(root);

  steps.push(createStep({
    operation: STEP_OPERATIONS.COMPLETE,
    codeLine: null,
    metadata: {
      n, nodeId: null, depth: null, callTree: snapshot(),
      isBaseCase: false, phase: "complete", expression: null, result: finalResult,
    },
    message: `النتيجة النهائية: fibonacci(${n}) = ${finalResult}`,
  }));

  return steps;
}
