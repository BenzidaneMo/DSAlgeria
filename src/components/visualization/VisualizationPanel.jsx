import { BarChart3 } from "lucide-react";
import ExecutionLog from "./ExecutionLog";
import SourceCodePanel from "./SourceCodePanel";

const OPERATION_LABELS = {
  compare: "مقارنة",
  swap: "تبديل",
  complete: "اكتمل الترتيب",
};

function getBarHeight(value, minimum, maximum) {
  if (minimum === maximum) {
    return 52;
  }

  return 18 + ((value - minimum) / (maximum - minimum)) * 72;
}

export default function VisualizationPanel({ selectedAlgorithm, currentStep, steps = [], currentStepIndex = -1, executionLog = [], array = [] }) {
  const currentArray = currentStep?.array?.length ? currentStep.array : array;
  const values = currentArray.length > 0 ? currentArray : [0];
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const activeIndices = currentStep?.indices ?? [];
  const finalizedIndices = currentStep?.finalizedIndices ?? [];
  const operationLabel = currentStep ? OPERATION_LABELS[currentStep.type] ?? currentStep.operation : "جاهز للتشغيل";

  return (
    <section className="relative flex min-h-0 min-w-0 flex-col overflow-hidden bg-bg-app" aria-labelledby="visualization-heading">
      <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-5 py-3">
        <div>
          <h1 id="visualization-heading" className="text-sm font-medium text-text-secondary">{selectedAlgorithm?.name ?? "منطقة التصور"}</h1>
          <p className="mt-1 text-xs text-text-muted">{currentStep ? "تابع سجل التنفيذ لمعرفة ما يحدث خطوة بخطوة" : "اختر خوارزمية ثم شغّل خطواتها"}</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-text-muted">
          <span className="h-2 w-2 rounded-full bg-accent-blue" />
          <span>{operationLabel}</span>
          {currentStep && currentStep.codeLine !== null && <span className="font-mono text-accent-yellow">السطر {currentStep.codeLine}</span>}
        </div>
      </div>

      <div className="flex min-h-80 flex-1 items-end justify-center px-6 pb-10 pt-8">
        {currentArray.length === 0 ? (
          <div className="flex flex-col items-center gap-3 text-center text-text-muted">
            <BarChart3 className="h-10 w-10" strokeWidth={1.2} />
            <p className="text-xs">أضف عناصر إلى المصفوفة لبدء التصور</p>
          </div>
        ) : (
          <div className="flex h-full w-full max-w-3xl items-end justify-center gap-2 border-b border-border px-4">
            {currentArray.map((value, index) => {
              const isActive = activeIndices.includes(index);
              const isFinalized = finalizedIndices.includes(index);
              const barColor = isFinalized
                ? "border-accent-green bg-accent-green/30 text-accent-green"
                : isActive && currentStep?.type === "swap"
                  ? "border-accent-orange bg-accent-orange/30 text-accent-orange"
                  : isActive
                    ? "border-accent-blue bg-accent-blue/30 text-accent-blue"
                    : "border-border bg-bg-elevated text-text-secondary";

              return (
                <div key={index} className="flex h-full min-w-0 flex-1 items-end justify-center">
                  <div
                    className={`relative flex w-full max-w-16 items-start justify-center border transition-all duration-500 ease-out ${barColor}`}
                    style={{ height: `${getBarHeight(value, minimum, maximum)}%` }}
                    aria-label={`العنصر ${value}`}
                  >
                    <span className="absolute -top-5 font-mono text-[11px]">{value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative grid min-h-80 max-h-80 grid-cols-2 border-t border-border-subtle">
        <ExecutionLog executionLog={executionLog} currentStepIndex={currentStepIndex} totalSteps={steps.length} />
        <SourceCodePanel sourceCode={selectedAlgorithm?.sourceCode} activeLine={currentStep?.codeLine} />
      </div>
    </section>
  );
}