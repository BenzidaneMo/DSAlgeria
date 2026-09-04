import { Check, Circle, GitCompareArrows, MoveRight } from "lucide-react";
import { getStepOperation, STEP_OPERATIONS } from "../../engine/stepTypes";
import { STEP_OPERATION_LABELS } from "./stepPresentation";

const OPERATION_ICONS = {
  compare: GitCompareArrows,
  swap: MoveRight,
  complete: Check,
};

export default function ExecutionLog({ executionLog = [], currentStepIndex, totalSteps = 0 }) {
  const visibleSteps = [...executionLog].reverse();

  return (
    <section className="col-span-1 inset-e-4 flex h-full overflow-scroll flex-col border border-border bg-bg-panel/95 shadow-xl backdrop-blur-sm" aria-labelledby="execution-log-heading">
      <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-3 py-2">
        <h2 id="execution-log-heading" className="text-xs font-semibold text-text-primary">سجل التنفيذ</h2>
        <span className="font-mono text-[10px] text-text-muted">{Math.max(currentStepIndex + 1, 0)} / {totalSteps}</span>
      </div>

      <div className="min-h-0 overflow-y-auto p-2">
        {visibleSteps.length === 0 ? (
          <p className="px-2 py-3 text-[11px] text-text-muted">سيظهر سير الخوارزمية هنا عند التشغيل.</p>
        ) : (
          <ol className="flex flex-col gap-1">
                        {visibleSteps.map(({ step, stepIndex }) => {
              const operation = getStepOperation(step);

              const Icon = OPERATION_ICONS[operation] ?? Circle;
              const label = STEP_OPERATION_LABELS[operation] ?? operation;

              return (
                                <li key={`${stepIndex}-${operation}`} className={`flex items-start gap-2 border-s-2 px-2 py-1.5 ${stepIndex === currentStepIndex ? "border-accent-blue bg-bg-elevated" : "border-transparent"}`}>
                  <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${operation === STEP_OPERATIONS.SWAP ? "text-accent-orange" : operation === STEP_OPERATIONS.COMPLETE ? "text-accent-green" : "text-accent-blue"}`} strokeWidth={1.8} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-text-muted">الخطوة {stepIndex + 1} · {label}</span>
                      {step.codeLine !== null && <span className="font-mono text-[10px] text-accent-yellow">سطر {step.codeLine}</span>}
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-text-secondary" title={step.message ?? ""}>{step.message ?? step.operation}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}