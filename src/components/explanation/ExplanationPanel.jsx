import { BookOpen, Clock3, FlaskConical, Lightbulb, Route } from "lucide-react";
import DifficultyBadge from "../algorithms/DifficultyBadge";

export default function ExplanationPanel({ selectedAlgorithm, currentStep }) {
  const complexity = selectedAlgorithm?.complexity;
  const metadata = currentStep?.metadata;
  const searchDetails = metadata?.target !== null && metadata?.target !== undefined;
  const towerDetails = metadata?.towers != null;
  const education = selectedAlgorithm?.education;

  return (
    <section className="min-h-0 col-span-2 overflow-auto border-e border-border bg-bg-panel p-4" aria-labelledby="explanation-heading">
      <div className="mb-4 flex items-center gap-2 border-b border-border-subtle pb-3">
        <BookOpen className="h-4 w-4 text-accent-yellow" strokeWidth={1.8} />
        <h2 id="explanation-heading" className="text-xs font-semibold text-text-primary">شرح الخوارزمية</h2>
      </div>

      {selectedAlgorithm ? (
        <>
          <div className="border-b border-border-subtle pb-4">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-base font-semibold text-text-primary">{selectedAlgorithm.name}</h1>
              <DifficultyBadge level={selectedAlgorithm.difficulty} className="shrink-0" />
            </div>
            <p className="mt-1 font-mono text-[11px] text-accent-blue">{selectedAlgorithm.englishName}</p>
            <h3 className="mt-3 text-[10px] font-semibold text-text-muted">وصف مبسط</h3>
            <p className="mt-1 text-xs leading-6 text-text-secondary">{selectedAlgorithm.description}</p>
          </div>
          
          {selectedAlgorithm.requirement && <p className="mt-3 border-s-2 border-accent-yellow px-3 py-2 text-[11px] leading-5 text-accent-yellow">{selectedAlgorithm.requirement}</p>}

          {education?.coreIdea && (
            <div className="border-b border-border-subtle py-4">
              <div className="mb-2 flex items-center gap-2">
                <Lightbulb className="h-3.5 w-3.5 text-accent-yellow" strokeWidth={1.8} />
                <h3 className="text-xs font-semibold text-text-primary">الفكرة الأساسية</h3>
              </div>
              <p className="text-xs leading-6 text-text-secondary">{education.coreIdea}</p>
            </div>
          )}

          {education?.howItWorks?.length > 0 && (
            <div className="border-b border-border-subtle py-4">
              <div className="mb-2 flex items-center gap-2">
                <Route className="h-3.5 w-3.5 text-accent-blue" strokeWidth={1.8} />
                <h3 className="text-xs font-semibold text-text-primary">كيف تعمل؟</h3>
              </div>
              <ol className="list-decimal space-y-1.5 ps-4 text-xs leading-6 text-text-secondary">
                {education.howItWorks.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
          )}

          {education?.example && (
            <div className="border-b border-border-subtle py-4">
              <div className="mb-2 flex items-center gap-2">
                <FlaskConical className="h-3.5 w-3.5 text-accent-green" strokeWidth={1.8} />
                <h3 className="text-xs font-semibold text-text-primary">مثال</h3>
              </div>
              <p className="border-s-2 border-accent-green/50 bg-bg-inset px-3 py-2 font-mono text-[11px] leading-6 text-text-secondary" dir="rtl">{education.example}</p>
            </div>
          )}


          {selectedAlgorithm.rules?.length > 0 && (
            <div className="mt-3 border-s-2 border-accent-purple bg-bg-inset px-3 py-2">
              <h3 className="text-[10px] font-semibold text-accent-purple">القواعد</h3>
              <ol className="mt-1 list-decimal space-y-1 ps-4 text-[11px] leading-5 text-text-secondary">
                {selectedAlgorithm.rules.map((rule) => <li key={rule}>{rule}</li>)}
              </ol>
            </div>
          )}

          {towerDetails && metadata.disk !== null && (
            <div className="mt-4 border-b border-border-subtle pb-4 text-xs">
              <div className="flex items-center justify-between"><span className="text-text-muted">القرص المنقول</span><strong className="font-mono text-accent-yellow">{metadata.disk}</strong></div>
              <div className="mt-2 flex items-center justify-between"><span className="text-text-muted">العمود المصدر → الهدف</span><strong className="font-mono text-accent-blue">{metadata.from} → {metadata.to}</strong></div>
            </div>
          )}

          {searchDetails && (
            <div className="mt-4 border-b border-border-subtle pb-4 text-xs">
              <div className="flex items-center justify-between"><span className="text-text-muted">القيمة الهدف</span><strong className="font-mono text-accent-yellow">{metadata.target}</strong></div>
              {metadata.currentIndex !== null && <div className="mt-2 flex items-center justify-between"><span className="text-text-muted">العنصر الحالي</span><strong className="font-mono text-accent-blue">{metadata.currentValue} · الموضع {metadata.currentIndex}</strong></div>}
            </div>
          )}

          {complexity && (
            <div className="border-b border-border-subtle py-4">
              <div className="mb-3 flex items-center gap-2">
                <Clock3 className="h-3.5 w-3.5 text-accent-yellow" strokeWidth={1.8} />
                <h3 className="text-xs font-semibold text-text-primary">التعقيد</h3>
              </div>
              <dl className="grid grid-cols-1 gap-x-3 gap-y-2 text-[11px] xl:grid-cols-2">
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