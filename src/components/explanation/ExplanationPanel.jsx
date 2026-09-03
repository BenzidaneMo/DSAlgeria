import { BookOpen, Braces, Clock3 } from "lucide-react";

export default function ExplanationPanel({ selectedAlgorithm, currentStep }) {
  const complexity = selectedAlgorithm?.complexity;

  return (
    <section className="min-h-0 col-span-2 overflow-auto border-e border-border bg-bg-panel p-4" aria-labelledby="explanation-heading">
      <div className="mb-4 flex items-center gap-2 border-b border-border-subtle pb-3">
        <BookOpen className="h-4 w-4 text-accent-yellow" strokeWidth={1.8} />
        <h2 id="explanation-heading" className="text-xs font-semibold text-text-primary">شرح الخوارزمية</h2>
      </div>

      {selectedAlgorithm ? (
        <>
          <div className="border-b border-border-subtle pb-4">
            <h1 className="text-base font-semibold text-text-primary">{selectedAlgorithm.name}</h1>
            <p className="mt-1 font-mono text-[11px] text-accent-blue">{selectedAlgorithm.englishName}</p>
            <p className="mt-3 text-xs leading-6 text-text-secondary">{selectedAlgorithm.description}</p>
          </div>

          {complexity && (
            <div className="border-b border-border-subtle py-4">
              <div className="mb-3 flex items-center gap-2">
                <Clock3 className="h-3.5 w-3.5 text-accent-yellow" strokeWidth={1.8} />
                <h3 className="text-xs font-semibold text-text-primary">التعقيد</h3>
              </div>
              <dl className="grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
                <div className="flex items-center justify-between gap-2"><dt className="text-text-muted">أفضل حالة</dt><dd className="font-mono text-text-secondary">{complexity.best}</dd></div>
                <div className="flex items-center justify-between gap-2"><dt className="text-text-muted">الحالة المتوسطة</dt><dd className="font-mono text-text-secondary">{complexity.average}</dd></div>
                <div className="flex items-center justify-between gap-2"><dt className="text-text-muted">أسوأ حالة</dt><dd className="font-mono text-text-secondary">{complexity.worst}</dd></div>
                <div className="flex items-center justify-between gap-2"><dt className="text-text-muted">الذاكرة</dt><dd className="font-mono text-text-secondary">{complexity.space}</dd></div>
              </dl>
            </div>
          )}

        </>
      ) : (
        <p className="text-xs leading-6 text-text-muted">اختر خوارزمية لعرض شرحها ومتابعة خطواتها هنا.</p>
      )}
    </section>
  );
}