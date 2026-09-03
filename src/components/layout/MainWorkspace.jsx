import { useState } from "react";
import ArrayEditor from "../input/ArrayEditor";
import ExplanationPanel from "../explanation/ExplanationPanel";
import VisualizationPanel from "../visualization/VisualizationPanel";
import AlgorithmSidebar from "../algorithms/AlgorithmSidebar";
import { Pencil } from "lucide-react";

export default function MainWorkspace({ selectedAlgorithm, onSelectAlgorithm, currentStep, steps, currentStepIndex, executionLog, array, onApplyArray }) {
  const [isArrayEditorOpen, setIsArrayEditorOpen] = useState(false);

  return (
    <main className="relative grid min-h-0 flex-1 grid-cols-[minmax(190px,0.8fr)_minmax(0,2.2fr)_minmax(210px,0.9fr)] overflow-hidden border-b border-border" aria-label="مساحة العمل الرئيسية">
        <ExplanationPanel array={array} selectedAlgorithm={selectedAlgorithm} currentStep={currentStep} />
        <VisualizationPanel selectedAlgorithm={selectedAlgorithm} currentStep={currentStep} steps={steps} currentStepIndex={currentStepIndex} executionLog={executionLog} array={array} />
        <AlgorithmSidebar selectedAlgorithm={selectedAlgorithm} onSelectAlgorithm={onSelectAlgorithm} />
        <div className="absolute bottom-4 left-4 flex items-center justify-center w-xs gap-2 border border-border-subtle p-1.5 bg-bg-app">
            <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-text-primary">المصفوفة</h3>
                <span className="font-mono text-[10px] text-text-muted">{array.join("، ")}</span>
            </div>
            <button type="button" onClick={() => setIsArrayEditorOpen(true)} className="group w-34 h-fit flex items-center justify-center gap-1 rounded-md border border-border-subtle py-4 px-2.5  hover:bg-bg-hover transform transition-all hover:scale-102 ease-in-out duration-150 focus:scale-95">
                <Pencil className="h-3 w-3" />
                <span className="w-fit text-[11px] text-text-secondary group-hover:text-text-primary">تعديل المصفوفة</span>
            </button>
        </div>
      {isArrayEditorOpen && <ArrayEditor value={array} onApply={onApplyArray} onClose={() => setIsArrayEditorOpen(false)} />}
    </main>
  );
}
