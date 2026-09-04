export class VideoTimeline {
  constructor(steps = [], { playbackSpeed = 1 } = {}) {
    this.steps = [...steps];
    this.playbackSpeed = playbackSpeed;
    this.reset();
  }

  reset() {
    this.currentStepIndex = -1;
  }

  next() {
    if (!this.hasNext) {
      return null;
    }

    this.currentStepIndex += 1;
    return this.currentStep;
  }

  get currentStep() {
    return this.currentStepIndex >= 0 ? this.steps[this.currentStepIndex] : null;
  }

  get totalSteps() {
    return this.steps.length;
  }

  get hasNext() {
    return this.currentStepIndex < this.steps.length - 1;
  }

  get stepDurationMs() {
    return 700 / this.playbackSpeed;
  }
}