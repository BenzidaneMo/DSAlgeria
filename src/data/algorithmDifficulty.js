export const DIFFICULTY = Object.freeze({
  EASY: "سهل",
  MEDIUM: "متوسط",
  ADVANCED: "متقدم",
});

export const DIFFICULTY_STYLES = Object.freeze({
  [DIFFICULTY.EASY]: "border-accent-green/40 bg-accent-green/10 text-accent-green",
  [DIFFICULTY.MEDIUM]: "border-accent-yellow/40 bg-accent-yellow/10 text-accent-yellow",
  [DIFFICULTY.ADVANCED]: "border-accent-red/40 bg-accent-red/10 text-accent-red",
});

/**
 * Difficulty is graded for the target audience — Algerian high-school
 * students — not by raw implementation complexity. This is a starting
 * point and can be revisited as more algorithms are added.
 */
export const ALGORITHM_DIFFICULTY = Object.freeze({
  "bubble-sort": DIFFICULTY.EASY,
  "selection-sort": DIFFICULTY.EASY,
  "insertion-sort": DIFFICULTY.EASY,
  "linear-search": DIFFICULTY.EASY,
  "factorial": DIFFICULTY.EASY,

  "binary-search": DIFFICULTY.MEDIUM,
  "ternary-search": DIFFICULTY.MEDIUM,
  "quick-sort": DIFFICULTY.MEDIUM,
  "merge-sort": DIFFICULTY.MEDIUM,
  "fibonacci": DIFFICULTY.MEDIUM,

  "heap-sort": DIFFICULTY.ADVANCED,
  "dijkstra": DIFFICULTY.ADVANCED,
  "breadth-first-search": DIFFICULTY.ADVANCED,
  "depth-first-search": DIFFICULTY.ADVANCED,
  "tower-of-hanoi": DIFFICULTY.ADVANCED,
});
