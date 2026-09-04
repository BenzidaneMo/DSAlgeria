import { generateBubbleSortSteps } from "./sorting/bubbleSort";
import { generateInsertionSortSteps } from "./sorting/insertionSort";
import { generateSelectionSortSteps } from "./sorting/selectionSort";

const EMPTY_GENERATOR = () => [];

export const ALGORITHM_GENERATORS = Object.freeze({
  "bubble-sort": generateBubbleSortSteps,
  "selection-sort": generateSelectionSortSteps,
  "insertion-sort": generateInsertionSortSteps,
  "merge-sort": EMPTY_GENERATOR,
  "quick-sort": EMPTY_GENERATOR,
  "linear-search": EMPTY_GENERATOR,
  "binary-search": EMPTY_GENERATOR,
  "ternary-search": EMPTY_GENERATOR,
  "breadth-first-search": EMPTY_GENERATOR,
  "depth-first-search": EMPTY_GENERATOR,
  dijkstra: EMPTY_GENERATOR,
  factorial: EMPTY_GENERATOR,
  fibonacci: EMPTY_GENERATOR,
  "tower-of-hanoi": EMPTY_GENERATOR,
});

export function generateStepsForAlgorithm(algorithm) {
  return algorithm ? ALGORITHM_GENERATORS[algorithm.id]?.(algorithm.input) ?? [] : [];
}