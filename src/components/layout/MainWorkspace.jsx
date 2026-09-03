import ExplanationPanel from "../explanation/ExplanationPanel";
import VisualizationPanel from "../visualization/VisualizationPanel";
import AlgorithmSidebar from "../algorithms/AlgorithmSidebar";

export default function MainWorkspace({ selectedAlgorithm, onSelectAlgorithm, currentStep }) {
  return (
    <main className="grid min-h-0 flex-1 grid-cols-[minmax(190px,0.8fr)_minmax(0,2.2fr)_minmax(210px,0.9fr)] overflow-hidden border-b border-border" aria-label="مساحة العمل الرئيسية">
      <ExplanationPanel />
      <VisualizationPanel selectedAlgorithm={selectedAlgorithm} currentStep={currentStep} />
      <AlgorithmSidebar selectedAlgorithm={selectedAlgorithm} onSelectAlgorithm={onSelectAlgorithm} />
    </main>
  );
}
