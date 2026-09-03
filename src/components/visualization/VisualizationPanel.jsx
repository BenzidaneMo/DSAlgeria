import { useState } from "react";
import Array2DVisualizer from "./Array2DVisualizer";
import Array3DVisualizer from "./Array3DVisualizer";
import ExecutionLog from "./ExecutionLog";
import SourceCodePanel from "./SourceCodePanel";
import VisualizationToolbar from "./VisualizationToolbar";

const OPERATION_LABELS = {
  compare: "مقارنة",
  swap: "تبديل",
  complete: "اكتمل الترتيب",
};

export default function VisualizationPanel({ selectedAlgorithm, currentStep, steps = [], currentStepIndex = -1, executionLog = [], array = [] }) {
  const [mode, setMode] = useState("2d");
  const operationLabel = currentStep ? OPERATION_LABELS[currentStep.type] ?? currentStep.operation : "جاهز للتشغيل";

  return (
    <section className="relative col-span-6 flex min-h-0 min-w-0 flex-col overflow-hidden bg-bg-app" aria-labelledby="visualization-heading">
      <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-5 py-3">
        <div>
          <h1 id="visualization-heading" className="text-sm font-medium text-text-secondary">{selectedAlgorithm?.name ?? "منطقة التصور"}</h1>
          <p className="mt-1 text-xs text-text-muted">{currentStep ? "تابع سجل التنفيذ لمعرفة ما يحدث خطوة بخطوة" : "اختر خوارزمية ثم شغّل خطواتها"}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <span className="h-2 w-2 rounded-full bg-accent-blue" />
            <span>{operationLabel}</span>
            {currentStep && currentStep.codeLine !== null && <span className="font-mono text-accent-yellow">السطر {currentStep.codeLine}</span>}
          </div>
          <VisualizationToolbar mode={mode} onModeChange={setMode} />
        </div>
      </div>

      <div className="flex min-h-80 flex-1 items-end justify-center px-6 pb-10 pt-8">
        {mode === "2d" ? <Array2DVisualizer array={array} currentStep={currentStep} /> : <Array3DVisualizer array={array} currentStep={currentStep} />}
      </div>

      <div className="relative grid min-h-80 max-h-80 grid-cols-2 border-t border-border-subtle">
        <ExecutionLog executionLog={executionLog} currentStepIndex={currentStepIndex} totalSteps={steps.length} />
        <SourceCodePanel sourceCode={selectedAlgorithm?.sourceCode} activeLine={currentStep?.codeLine} />
      </div>
    </section>
  );
}