import { BookOpen, Code2, ListOrdered } from "lucide-react";
import { useState } from "react";
import AlgorithmDrawer from "../algorithms/AlgorithmDrawer";
import AlgorithmSidebar from "../algorithms/AlgorithmSidebar";
import ExplanationPanel from "../explanation/ExplanationPanel";
import ArrayEditor from "../input/ArrayEditor";
import ExecutionLog from "../visualization/ExecutionLog";
import SourceCodePanel from "../visualization/SourceCodePanel";
import VisualizationPanel from "../visualization/VisualizationPanel";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import CollapsibleSection from "./CollapsibleSection";
import ControlBar from "./ControlBar";

export default function MainWorkspace({ selectedAlgorithm, onSelectAlgorithm, currentStep, steps, currentStepIndex, executionLog, array, originalArray, sortedState, onApplyArray, target, onTargetChange, count, onCountChange, player }) {
  const [isArrayEditorOpen, setIsArrayEditorOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const arrayEditorModal = isArrayEditorOpen && <ArrayEditor value={originalArray} onApply={onApplyArray} onClose={() => setIsArrayEditorOpen(false)} />;

  if (isDesktop) {
    return (
      <>
        <main className="relative grid grid-cols-10 min-h-0 flex-1 overflow-hidden border-b border-border" aria-label="مساحة العمل الرئيسية">
          <ExplanationPanel array={array} selectedAlgorithm={selectedAlgorithm} currentStep={currentStep} />
          <VisualizationPanel selectedAlgorithm={selectedAlgorithm} currentStep={currentStep} steps={steps} currentStepIndex={currentStepIndex} executionLog={executionLog} array={array} />
          <AlgorithmSidebar selectedAlgorithm={selectedAlgorithm} onSelectAlgorithm={onSelectAlgorithm} array={originalArray} sortedState={sortedState} setIsArrayEditorOpen={setIsArrayEditorOpen} target={target} onTargetChange={onTargetChange} count={count} onCountChange={onCountChange} />
        </main>
        <ControlBar player={player} />
        {arrayEditorModal}
      </>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto" aria-label="مساحة العمل الرئيسية">
      <AlgorithmDrawer selectedAlgorithm={selectedAlgorithm} onSelectAlgorithm={onSelectAlgorithm} array={originalArray} sortedState={sortedState} setIsArrayEditorOpen={setIsArrayEditorOpen} target={target} onTargetChange={onTargetChange} count={count} onCountChange={onCountChange} />

      <VisualizationPanel selectedAlgorithm={selectedAlgorithm} currentStep={currentStep} steps={steps} currentStepIndex={currentStepIndex} executionLog={executionLog} array={array} showInlinePanels={false} />

      <ControlBar player={player} />

      <CollapsibleSection title="شرح الخوارزمية" icon={BookOpen}>
        <ExplanationPanel array={array} selectedAlgorithm={selectedAlgorithm} currentStep={currentStep} />
      </CollapsibleSection>

      <CollapsibleSection title="الكود المصدري" icon={Code2}>
        <SourceCodePanel sourceCode={selectedAlgorithm?.sourceCode} activeLine={currentStep?.codeLine} />
      </CollapsibleSection>

      <CollapsibleSection title="سجل التنفيذ" icon={ListOrdered}>
        <ExecutionLog executionLog={executionLog} currentStepIndex={currentStepIndex} totalSteps={steps.length} />
      </CollapsibleSection>

      {arrayEditorModal}
    </div>
  );
}
