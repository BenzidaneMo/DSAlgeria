import { useState } from "react";
import ArrayEditor from "../input/ArrayEditor";
import ExplanationPanel from "../explanation/ExplanationPanel";
import VisualizationPanel from "../visualization/VisualizationPanel";
import AlgorithmSidebar from "../algorithms/AlgorithmSidebar";


export default function MainWorkspace({ selectedAlgorithm, onSelectAlgorithm, currentStep, steps, currentStepIndex, executionLog, array, onApplyArray }) {
  const [isArrayEditorOpen, setIsArrayEditorOpen] = useState(false);

  return (
    <main className="relative grid grid-cols-10 min-h-0 flex-1 overflow-hidden border-b border-border" aria-label="مساحة العمل الرئيسية">
        <ExplanationPanel array={array} selectedAlgorithm={selectedAlgorithm} currentStep={currentStep} />
        <VisualizationPanel selectedAlgorithm={selectedAlgorithm} currentStep={currentStep} steps={steps} currentStepIndex={currentStepIndex} executionLog={executionLog} array={array} />
        <AlgorithmSidebar selectedAlgorithm={selectedAlgorithm} onSelectAlgorithm={onSelectAlgorithm} array={array} setIsArrayEditorOpen={setIsArrayEditorOpen} />
        {isArrayEditorOpen && <ArrayEditor value={array} onApply={onApplyArray} onClose={() => setIsArrayEditorOpen(false)} />}
    </main>
  );
}
