/**
 * Framework-independent timeline for generated algorithm steps.
 * The UI can subscribe to this state without the timeline knowing about React
 * or visualization details.
 */
export class AlgorithmTimeline {
  constructor(steps = []) {
    this.replace(steps);
  }

  replace(steps = []) {
    this.steps = [...steps];
    this.reset();
  }

  reset() {
    this.index = -1;
  }

  next() {
    this.index = Math.min(this.index + 1, this.steps.length - 1);
    return this.currentStep;
  }

  previous() {
    this.index = Math.max(this.index - 1, -1);
    return this.currentStep;
  }

  get currentStep() {
    return this.index >= 0 ? this.steps[this.index] : null;
  }

  get currentStepIndex() {
    return this.index;
  }

  get totalSteps() {
    return this.steps.length;
  }
}