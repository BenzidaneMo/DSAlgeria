import { BUBBLE_SORT_METADATA } from "../algorithms/sorting/bubbleSort";

export const ALGORITHM_CATEGORIES = [
  {
    id: "sorting",
    name: "خوارزميات الترتيب",
    algorithms: [
      { id: "bubble-sort", ...BUBBLE_SORT_METADATA },
      { id: "selection-sort", name: "ترتيب الاختيار", englishName: "Selection Sort" },
      { id: "insertion-sort", name: "ترتيب الإدراج", englishName: "Insertion Sort" },
      { id: "merge-sort", name: "ترتيب الدمج", englishName: "Merge Sort" },
      { id: "quick-sort", name: "الترتيب السريع", englishName: "Quick Sort" },
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