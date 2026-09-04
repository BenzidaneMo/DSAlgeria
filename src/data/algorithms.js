import { BUBBLE_SORT_METADATA } from "../algorithms/sorting/bubbleSort";
import { INSERTION_SORT_METADATA } from "../algorithms/sorting/insertionSort";
import { MERGE_SORT_METADATA } from "../algorithms/sorting/mergeSort";
import { QUICK_SORT_METADATA } from "../algorithms/sorting/quickSort";
import { SELECTION_SORT_METADATA } from "../algorithms/sorting/selectionSort";

export const ALGORITHM_CATEGORIES = [
  {
    id: "sorting",
    name: "خوارزميات الترتيب",
    algorithms: [
      { id: "bubble-sort", ...BUBBLE_SORT_METADATA },
      { id: "selection-sort", ...SELECTION_SORT_METADATA },
      { id: "insertion-sort", ...INSERTION_SORT_METADATA },
      { id: "merge-sort", ...MERGE_SORT_METADATA },
      { id: "quick-sort", ...QUICK_SORT_METADATA },
    ],
  },
  {
    id: "searching",
    name: "خوارزميات البحث",
    algorithms: [
      { id: "linear-search", name: "البحث الخطي", englishName: "Linear Search" },
      { id: "binary-search", name: "البحث الثنائي", englishName: "Binary Search" },
      { id: "ternary-search", name: "البحث الثلاثي", englishName: "Ternary Search" },
    ],
  },
  {
    id: "graphs",
    name: "الخوارزميات على الرسوم البيانية",
    algorithms: [
      { id: "breadth-first-search", name: "البحث بعرض الرسم", englishName: "BFS" },
      { id: "depth-first-search", name: "البحث بعمق الرسم", englishName: "DFS" },
      { id: "dijkstra", name: "خوارزمية ديكسترا", englishName: "Dijkstra" },
    ],
  },
  {
    id: "recursion",
    name: "الاستدعاء الذاتي",
    algorithms: [
      { id: "factorial", name: "العامل", englishName: "Factorial" },
      { id: "fibonacci", name: "متتالية فيبوناتشي", englishName: "Fibonacci" },
      { id: "tower-of-hanoi", name: "أبراج هانوي", englishName: "Tower of Hanoi" },
    ],
  },
];