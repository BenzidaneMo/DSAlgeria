import { createRecordingProfile } from "./recordingProfile";
import { createVisualizationCaptureSource } from "./captureSource";

const MIME_TYPES = [
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
];

export function getSupportedVideoMimeType(preferredType) {
  if (typeof MediaRecorder === "undefined") {
    return null;
  }

  const candidates = preferredType ? [preferredType, ...MIME_TYPES] : MIME_TYPES;
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? null;
}

export class VideoRecorder {
  constructor({ source, canvas, profile, algorithm, input } = {}) {
    const captureSource = source ?? canvas;
    if (!captureSource || typeof captureSource.captureStream !== "function") {
      throw new TypeError("VideoRecorder requires a visualization capture source with captureStream support");
    }

    this.profile = createRecordingProfile(profile);
    this.source = captureSource.mode ? captureSource : createVisualizationCaptureSource({
      mode: profile?.mode ?? "3d",
      captureStream: (frameRate) => captureSource.captureStream(frameRate),
    });
    if (this.source.mode !== this.profile.mode) {
      throw new RangeError("Capture source mode must match the recording profile mode");
    }
    this.metadata = Object.freeze({
      algorithm: algorithm ?? null,
      input: input ? [...input] : [],
      mode: this.profile.mode,
      width: this.profile.width,
      height: this.profile.height,
      frameRate: this.profile.frameRate,
      duration: this.profile.duration,
      playbackSpeed: this.profile.playbackSpeed,
    });
    this.mediaRecorder = null;
    this.chunks = [];
  }

  get state() {
    return this.mediaRecorder?.state ?? "inactive";
  }

  start() {
    if (typeof MediaRecorder === "undefined") {
      throw new Error("MediaRecorder is not supported in this browser");
    }
    if (this.state !== "inactive") {
      throw new Error("Video recording is already active");
    }

    const mimeType = getSupportedVideoMimeType(this.profile.mimeType);
    if (!mimeType) {
      throw new Error("No supported WebM video format is available");
    }

    this.chunks = [];
    const stream = this.source.captureStream(this.profile.frameRate);
    this.mediaRecorder = new MediaRecorder(stream, { mimeType });
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };
    this.mediaRecorder.start();
    return this.metadata;
  }

  stop() {
    if (!this.mediaRecorder || this.state === "inactive") {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      this.mediaRecorder.onerror = () => reject(this.mediaRecorder.error);
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: this.mediaRecorder.mimeType });
        this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        this.mediaRecorder = null;
        this.chunks = [];
        resolve(blob);
      };
      this.mediaRecorder.stop();
    });
  }

  cancel() {
    if (this.mediaRecorder && this.state !== "inactive") {
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      this.mediaRecorder.stop();
    }
    this.mediaRecorder = null;
    this.chunks = [];
  }
}

export function createVideoRecorder(options) {
  return new VideoRecorder(options);
}
