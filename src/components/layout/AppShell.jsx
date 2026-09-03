import { useState } from "react";
import { generateStepsForAlgorithm } from "../../algorithms";
import { useAlgorithmPlayer } from "../../engine/algorithmPlayer";
import ControlBar from "./ControlBar";
import MainWorkspace from "./MainWorkspace";
import Navbar from "./Navbar";

export default function AppShell() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [steps, setSteps] = useState([]);
  const player = useAlgorithmPlayer({ steps });

  function selectAlgorithm(algorithm) {
    setSelectedAlgorithm(algorithm);
    setSteps(generateStepsForAlgorithm(algorithm));
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-bg-app text-text-primary">
      <Navbar />
      <MainWorkspace
        selectedAlgorithm={selectedAlgorithm}
        onSelectAlgorithm={selectAlgorithm}
        currentStep={player.currentStep}
      />
      <ControlBar player={player} />
    </div>
  );
}
