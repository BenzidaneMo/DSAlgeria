import { useEffect, useState } from "react";

const DEFAULT_INTERVAL = 700;

function recordStep(setExecutionLog, steps, stepIndex) {
  if (stepIndex < 0 || stepIndex >= steps.length) {
    return;
  }

  setExecutionLog((log) => log.some((entry) => entry.stepIndex === stepIndex)
    ? log
    : [...log, { stepIndex, step: steps[stepIndex] }]);
}

/**
 * Owns timeline navigation and playback. It does not know what a step means.
 * @param {{steps?: import("./stepTypes").AlgorithmStep[], interval?: number}} options
 */
export function useAlgorithmPlayer({ steps = [], interval = DEFAULT_INTERVAL } = {}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [executionLog, setExecutionLog] = useState([]);

  useEffect(() => {
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    setExecutionLog([]);
  }, [steps]);

  useEffect(() => {
    if (!isPlaying || steps.length === 0) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setCurrentStepIndex((index) => {
        if (index >= steps.length - 1) {
          setIsPlaying(false);
          return index;
        }
        const nextIndex = index + 1;
        recordStep(setExecutionLog, steps, nextIndex);
        return nextIndex;
      });
    }, interval);

    return () => window.clearInterval(timerId);
  }, [interval, isPlaying, steps]);

  function next() {
    const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
    if (nextIndex > currentStepIndex) {
      recordStep(setExecutionLog, steps, nextIndex);
      setCurrentStepIndex(nextIndex);
    }
  }

  function previous() {
    setCurrentStepIndex((index) => Math.max(index - 1, -1));
  }

  function play() {
    if (steps.length > 0 && currentStepIndex < steps.length - 1) {
      setIsPlaying(true);
    }
  }

  function pause() {
    setIsPlaying(false);
  }

  function reset() {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setExecutionLog([]);
  }

  return {
    currentStep: currentStepIndex >= 0 ? steps[currentStepIndex] : null,
    currentStepIndex,
    totalSteps: steps.length,
    executionLog,
    isPlaying,
    canGoNext: currentStepIndex < steps.length - 1,
    canGoPrevious: currentStepIndex >= 0,
    next,
    previous,
    play,
    pause,
    reset,
  };
}