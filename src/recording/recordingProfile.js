export const DEFAULT_RECORDING_PROFILE = Object.freeze({
  mode: "3d",
  width: 1280,
  height: 720,
  frameRate: 30,
  duration: null,
  playbackSpeed: 1,
  mimeType: "video/webm;codecs=vp9",
});

export function createRecordingProfile(overrides = {}) {
  const profile = { ...DEFAULT_RECORDING_PROFILE, ...overrides };

  if (profile.mode !== "2d" && profile.mode !== "3d") {
    throw new RangeError("Recording mode must be 2d or 3d");
  }
  if (profile.width <= 0 || profile.height <= 0 || profile.width / profile.height !== 16 / 9) {
    throw new RangeError("Recording resolution must use a 16:9 aspect ratio");
  }
  if (profile.frameRate <= 0 || profile.playbackSpeed <= 0) {
    throw new RangeError("Frame rate and playback speed must be positive");
  }
  if (profile.duration !== null && profile.duration <= 0) {
    throw new RangeError("Recording duration must be positive");
  }

  return Object.freeze(profile);
}
