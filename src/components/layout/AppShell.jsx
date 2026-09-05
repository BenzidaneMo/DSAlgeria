import { useEffect, useState } from "react";
import { generateStepsForAlgorithm } from "../../algorithms";
import { useAlgorithmPlayer } from "../../engine/algorithmPlayer";
import { getStepOperation, STEP_OPERATIONS } from "../../engine/stepTypes";
import MainWorkspace from "./MainWorkspace";
import Navbar from "./Navbar";

export default function AppShell() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [array, setArray] = useState([5, 3, 8, 2, 7]);
  const [steps, setSteps] = useState([]);
  const [sortedState, setSortedState] = useState({ sortedArray: [], isSorted: false, sortedBy: null });
  const [target, setTarget] = useState(42);
  const player = useAlgorithmPlayer({ steps });

  useEffect(() => {
    if (getStepOperation(player.currentStep) === STEP_OPERATIONS.COMPLETE && selectedAlgorithm?.producesSortedOutput) {
      setSortedState({ sortedArray: [...player.currentStep.array], isSorted: true, sortedBy: selectedAlgorithm.id });
    }
  }, [player.currentStep, selectedAlgorithm]);

  function getAlgorithmInput(algorithm, nextArray = array, nextTarget = target) {
    if (algorithm.requiresSortedInput) {
      return { sortedArray: sortedState.sortedArray, isSorted: sortedState.isSorted, sortedBy: sortedState.sortedBy, target: nextTarget };
    }
    if (algorithm.requiresTarget) {
      return { array: nextArray, target: nextTarget };
    }
    return nextArray;
  }

  function selectAlgorithm(algorithm) {
    setSelectedAlgorithm(algorithm);
    setSteps(generateStepsForAlgorithm({ ...algorithm, input: getAlgorithmInput(algorithm) }));
  }

  function applyArray(nextArray) {
    setArray(nextArray);
    setSortedState({ sortedArray: [], isSorted: false, sortedBy: null });
    if (selectedAlgorithm) {
      const input = selectedAlgorithm.requiresSortedInput
        ? { sortedArray: [], isSorted: false, sortedBy: null, target }
        : getAlgorithmInput(selectedAlgorithm, nextArray);
      setSteps(generateStepsForAlgorithm({ ...selectedAlgorithm, input }));
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
        array={selectedAlgorithm?.requiresSortedInput ? (sortedState.isSorted ? sortedState.sortedArray : array) : array}
        originalArray={array}
        sortedState={sortedState}

        onApplyArray={applyArray}
        target={target}
        onTargetChange={(nextTarget) => {
          setTarget(nextTarget);
          if (selectedAlgorithm?.requiresTarget) {
            setSteps(generateStepsForAlgorithm({ ...selectedAlgorithm, input: getAlgorithmInput(selectedAlgorithm, array, nextTarget) }));
          }
        }}
        player={player}
      />
    </div>
  );
}
