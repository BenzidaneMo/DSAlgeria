import { useEffect, useState } from "react";

const DEFAULT_INTERVAL = 700;

/**
 * Owns timeline navigation and playback. It does not know what a step means.
 * @param {{steps?: import("./stepTypes").AlgorithmStep[], interval?: number}} options
 */
export function useAlgorithmPlayer({ steps = [], interval = DEFAULT_INTERVAL } = {}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setCurrentStepIndex(-1);
    setIsPlaying(false);
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
        return index + 1;
      });
    }, interval);

    return () => window.clearInterval(timerId);
  }, [interval, isPlaying, steps]);

  function next() {
    setCurrentStepIndex((index) => Math.min(index + 1, steps.length - 1));
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
  }

  return {
    currentStep: currentStepIndex >= 0 ? steps[currentStepIndex] : null,
    currentStepIndex,
    totalSteps: steps.length,
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