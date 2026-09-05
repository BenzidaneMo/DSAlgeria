import { Check, Circle, CornerDownRight, CornerUpLeft, Eye, GitCompareArrows, ListOrdered, Merge, MousePointerClick, MoveRight, RefreshCw, SplitSquareVertical, X } from "lucide-react";
import { getStepOperation, STEP_OPERATIONS } from "../../engine/stepTypes";
import { STEP_OPERATION_LABELS } from "./stepPresentation";

const OPERATION_ICONS = {
  [STEP_OPERATIONS.COMPARE]: GitCompareArrows,
  [STEP_OPERATIONS.SWAP]: MoveRight,
  [STEP_OPERATIONS.SELECT]: MousePointerClick,
  [STEP_OPERATIONS.SHIFT]: MoveRight,
  [STEP_OPERATIONS.INSERT]: ListOrdered,
  [STEP_OPERATIONS.SPLIT]: SplitSquareVertical,
  [STEP_OPERATIONS.MERGE]: Merge,
  [STEP_OPERATIONS.FOUND]: Check,
  [STEP_OPERATIONS.NOT_FOUND]: X,
  [STEP_OPERATIONS.VISIT]: Eye,
  [STEP_OPERATIONS.UPDATE]: RefreshCw,
  [STEP_OPERATIONS.PARTITION]: SplitSquareVertical,
  [STEP_OPERATIONS.RECURSIVE_CALL]: CornerDownRight,
  [STEP_OPERATIONS.RETURN]: CornerUpLeft,
  [STEP_OPERATIONS.COMPLETE]: Check,
};

const OPERATION_COLORS = {
  [STEP_OPERATIONS.SWAP]: "text-accent-orange",
  [STEP_OPERATIONS.SHIFT]: "text-accent-orange",
  [STEP_OPERATIONS.COMPLETE]: "text-accent-green",
  [STEP_OPERATIONS.FOUND]: "text-accent-green",
  [STEP_OPERATIONS.NOT_FOUND]: "text-accent-red",
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
          <ol className="flex flex-col gap-1.5">
            {visibleSteps.map(({ step, stepIndex }) => {
              const operation = getStepOperation(step);
              const isCurrent = stepIndex === currentStepIndex;

              const Icon = OPERATION_ICONS[operation] ?? Circle;
              const label = STEP_OPERATION_LABELS[operation] ?? operation;
              const color = OPERATION_COLORS[operation] ?? "text-accent-blue";

              return (
                <li key={`${stepIndex}-${operation}`} className={`flex items-start gap-2 border-s-2 px-2 py-2 ${isCurrent ? "border-accent-blue bg-bg-elevated" : "border-transparent"}`}>
                  <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${color}`} strokeWidth={1.8} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-text-secondary">الخطوة {stepIndex + 1}</span>
                        <span className={`text-[10px] font-semibold ${color}`}>{label}</span>
                      </span>
                      {step.codeLine !== null && <span className="font-mono text-[10px] text-accent-yellow">سطر {step.codeLine}</span>}
                    </div>
                    <p className={`mt-1 whitespace-pre-line text-[11px] leading-5 ${isCurrent ? "text-text-primary" : "text-text-secondary"}`}>{step.message ?? label}</p>
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
