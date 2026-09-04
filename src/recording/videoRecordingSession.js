import { createRecordingProfile } from "./recordingProfile";
import { VideoRecorder } from "./videoRecorder";
import { VideoTimeline } from "./videoTimeline";

export class VideoRecordingSession {
  constructor({ steps = [], source, profile, algorithm, input, renderStep, getInteractiveState, restoreInteractiveState } = {}) {
    this.profile = createRecordingProfile(profile);
    this.timeline = new VideoTimeline(steps, this.profile);
    this.recorder = new VideoRecorder({ source, profile: this.profile, algorithm, input });
    this.renderStep = renderStep;
    this.getInteractiveState = getInteractiveState;
    this.restoreInteractiveState = restoreInteractiveState;
    this.previousInteractiveState = null;
  }

  start() {
    this.previousInteractiveState = this.getInteractiveState?.() ?? null;
    this.timeline.reset();
    return this.recorder.start();
  }

  renderNextStep() {
    const step = this.timeline.next();
    if (step) {
      this.renderStep?.(step, this.timeline.currentStepIndex);
    }
    return step;
  }

  async stop() {
    const video = await this.recorder.stop();
    this.restoreInteractiveState?.(this.previousInteractiveState);
    this.previousInteractiveState = null;
    return video;
  }

  cancel() {
    this.recorder.cancel();
    this.timeline.reset();
    this.restoreInteractiveState?.(this.previousInteractiveState);
    this.previousInteractiveState = null;
  }
}

export function createVideoRecordingSession(options) {
  return new VideoRecordingSession(options);
}