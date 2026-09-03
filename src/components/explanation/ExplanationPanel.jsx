import { BookOpen } from "lucide-react";

export default function ExplanationPanel({ selectedAlgorithm, currentStep }) {
  return (
    <section className="min-h-0 overflow-auto border-e border-border bg-bg-panel p-4" aria-labelledby="explanation-heading">
      <div className="mb-4 flex items-center gap-2 border-b border-border-subtle pb-3">
        <BookOpen className="h-4 w-4 text-accent-yellow" strokeWidth={1.8} />
        <h2 id="explanation-heading" className="text-xs font-semibold text-text-primary">شرح الخوارزمية</h2>
      </div>
      <p className="text-xs leading-6 text-text-muted">{currentStep?.message ?? selectedAlgorithm?.description ?? "اختر خوارزمية لعرض شرحها ومتابعة خطواتها هنا."}</p>
    </section>
  );
}