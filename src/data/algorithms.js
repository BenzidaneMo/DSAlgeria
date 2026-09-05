import { BUBBLE_SORT_METADATA } from "../algorithms/sorting/bubbleSort";
import { BINARY_SEARCH_METADATA } from "../algorithms/searching/binarySearch";
import { TERNARY_SEARCH_METADATA } from "../algorithms/searching/ternarySearch";
import { LINEAR_SEARCH_METADATA } from "../algorithms/searching/linearSearch";
import { INSERTION_SORT_METADATA } from "../algorithms/sorting/insertionSort";
import { MERGE_SORT_METADATA } from "../algorithms/sorting/mergeSort";
import { QUICK_SORT_METADATA } from "../algorithms/sorting/quickSort";
import { SELECTION_SORT_METADATA } from "../algorithms/sorting/selectionSort";
import { FACTORIAL_METADATA } from "../algorithms/recursion/factorial";
import { FIBONACCI_METADATA } from "../algorithms/recursion/fibonacci";
import { TOWER_OF_HANOI_METADATA } from "../algorithms/recursion/towerOfHanoi";
import { ALGORITHM_DIFFICULTY } from "./algorithmDifficulty";

function withDifficulty(algorithm) {
  return { ...algorithm, difficulty: ALGORITHM_DIFFICULTY[algorithm.id] };
}

export const ALGORITHM_CATEGORIES = [
  {
    id: "sorting",
    name: "خوارزميات الترتيب",
    algorithms: [
      withDifficulty({ id: "bubble-sort", ...BUBBLE_SORT_METADATA }),
      withDifficulty({ id: "selection-sort", ...SELECTION_SORT_METADATA }),
      withDifficulty({ id: "insertion-sort", ...INSERTION_SORT_METADATA }),
      withDifficulty({ id: "merge-sort", ...MERGE_SORT_METADATA }),
      withDifficulty({ id: "quick-sort", ...QUICK_SORT_METADATA }),
    ],
  },
  {
    id: "searching",
    name: "خوارزميات البحث",
    algorithms: [
      withDifficulty({ id: "linear-search", ...LINEAR_SEARCH_METADATA }),
      withDifficulty({ id: "binary-search", ...BINARY_SEARCH_METADATA }),
      withDifficulty({ id: "ternary-search", ...TERNARY_SEARCH_METADATA }),
    ],
  },
  {
    id: "graphs",
    name: "الخوارزميات على الرسوم البيانية",
    // Not yet implemented (steps/visualization pending) — hidden from the
    // current release's selector; kept here for a future advanced section.
    hidden: true,
    algorithms: [
      withDifficulty({ id: "breadth-first-search", name: "البحث بعرض الرسم", englishName: "BFS" }),
      withDifficulty({ id: "depth-first-search", name: "البحث بعمق الرسم", englishName: "DFS" }),
      withDifficulty({ id: "dijkstra", name: "خوارزمية ديكسترا", englishName: "Dijkstra" }),
    ],
  },
  {
    id: "recursion",
    name: "الاستدعاء الذاتي",
    algorithms: [
      withDifficulty({ id: "factorial", ...FACTORIAL_METADATA }),
      withDifficulty({ id: "fibonacci", ...FIBONACCI_METADATA }),
      withDifficulty({ id: "tower-of-hanoi", ...TOWER_OF_HANOI_METADATA }),
    ],
  },
];