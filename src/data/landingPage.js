import { BookOpen, Box, Eye, ListChecks, MousePointerClick, ScanSearch, SlidersHorizontal } from "lucide-react";
import { ALGORITHM_CATEGORIES } from "./algorithms";

export const algorithmPreviewArrayValues = [10, 15, 21, 35, 42, 58, 70, 91];

export const features = [
  { icon: BookOpen, title: "شرح مبسط", detail: "شرح الخوارزميات باللغة العربية بطريقة مناسبة للطلاب.", color: "text-accent-blue" },
  { icon: ScanSearch, title: "تصور تفاعلي", detail: "شاهد الخوارزمية وهي تنفذ خطوة بخطوة.", color: "text-accent-yellow" },
  { icon: SlidersHorizontal, title: "جرّب بنفسك", detail: "غيّر البيانات وتحكم في عملية التنفيذ.", color: "text-accent-green" },
  { icon: Box, title: "تصور ثلاثي الأبعاد", detail: "شاهد الخوارزميات بطريقة بصرية ثلاثية الأبعاد.", color: "text-accent-purple" },
];

export const howItWorksSteps = [
  { icon: ListChecks, title: "اختر الخوارزمية", detail: "تصفّح قائمة الخوارزميات المصنّفة واختر ما تريد تعلّمه.", color: "text-accent-blue" },
  { icon: Eye, title: "شاهد طريقة عملها", detail: "تابع التنفيذ خطوة بخطوة عبر تصور بصري وشرح مبسط.", color: "text-accent-yellow" },
  { icon: MousePointerClick, title: "جرّبها بنفسك", detail: "غيّر البيانات وتحكم في السرعة لتختبر فهمك بنفسك.", color: "text-accent-green" },
];

export const learningFlow = ["اختيار", "فهم", "مشاهدة", "تجربة"];

const previewAlgorithmIds = new Set([
  "bubble-sort", "selection-sort", "insertion-sort", "quick-sort", "merge-sort",
  "linear-search", "binary-search", "ternary-search",
]);

export const previewCategories = ALGORITHM_CATEGORIES
  .map((category) => ({ ...category, algorithms: category.algorithms.filter((algorithm) => previewAlgorithmIds.has(algorithm.id)) }))
  .filter((category) => category.algorithms.length > 0);

// Placeholder content — not real users. Replace with genuine testimonials when available.
export const demoTestimonials = [
  { quote: "التصور خطوة بخطوة سهّل عليّ فهم الفرز الفقاعي أكثر من أي شرح نظري.", role: "طالب سنة أولى، إعلام آلي" },
  { quote: "جربت تغيير المصفوفة بنفسي وفهمت الفرق بين البحث الخطي والثنائي مباشرة.", role: "طالبة سنة ثانية، هندسة" },
  { quote: "الشرح بالعربية مع الكود جنبًا إلى جنب جعل المراجعة قبل الامتحان أسرع.", role: "طالب، سنة أولى، إعلام آلي" },
];
