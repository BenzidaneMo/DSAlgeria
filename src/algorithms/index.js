import { generateTernarySearchSteps } from "./searching/ternarySearch";
import { generateBinarySearchSteps } from "./searching/binarySearch";
import { generateLinearSearchSteps } from "./searching/linearSearch";
import { generateBubbleSortSteps } from "./sorting/bubbleSort";
import { generateInsertionSortSteps } from "./sorting/insertionSort";
import { generateMergeSortSteps } from "./sorting/mergeSort";
import { generateQuickSortSteps } from "./sorting/quickSort";
import { generateSelectionSortSteps } from "./sorting/selectionSort";

const EMPTY_GENERATOR = () => [];

export const ALGORITHM_GENERATORS = Object.freeze({
  "bubble-sort": generateBubbleSortSteps,
  "selection-sort": generateSelectionSortSteps,
  "insertion-sort": generateInsertionSortSteps,
  "merge-sort": generateMergeSortSteps,
  "quick-sort": generateQuickSortSteps,
  "linear-search": generateLinearSearchSteps,
  "binary-search": generateBinarySearchSteps,
  "ternary-search": generateTernarySearchSteps,
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