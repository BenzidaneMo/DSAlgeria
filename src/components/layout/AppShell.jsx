import { useState } from "react";
import { generateStepsForAlgorithm } from "../../algorithms";
import { useAlgorithmPlayer } from "../../engine/algorithmPlayer";
import ControlBar from "./ControlBar";
import MainWorkspace from "./MainWorkspace";
import Navbar from "./Navbar";

export default function AppShell() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [array, setArray] = useState([5, 3, 8, 2, 7]);
  const [steps, setSteps] = useState([]);
  const [target, setTarget] = useState(42);
  const player = useAlgorithmPlayer({ steps });

  function getAlgorithmInput(algorithm, nextArray = array, nextTarget = target) {
    return algorithm.id === "linear-search" ? { array: nextArray, target: nextTarget } : nextArray;
  }

  function selectAlgorithm(algorithm) {
    setSelectedAlgorithm(algorithm);
    setSteps(generateStepsForAlgorithm({ ...algorithm, input: getAlgorithmInput(algorithm) }));
  }

  function applyArray(nextArray) {
    setArray(nextArray);
    if (selectedAlgorithm) {
      setSteps(generateStepsForAlgorithm({ ...selectedAlgorithm, input: getAlgorithmInput(selectedAlgorithm, nextArray) }));
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-bg-app text-text-primary">
      <Navbar />
      <MainWorkspace
        selectedAlgorithm={selectedAlgorithm}
        onSelectAlgorithm={selectAlgorithm}
        currentStep={player.currentStep}
        steps={steps}
        currentStepIndex={player.currentStepIndex}
        executionLog={player.executionLog}
        array={array}
        onApplyArray={applyArray}
        target={target}
        onTargetChange={(nextTarget) => {
          setTarget(nextTarget);
          if (selectedAlgorithm?.id === "linear-search") {
            setSteps(generateStepsForAlgorithm({ ...selectedAlgorithm, input: { array, target: nextTarget } }));
          }
        }}
      />
      <ControlBar player={player} />
    </div>
  );
}
