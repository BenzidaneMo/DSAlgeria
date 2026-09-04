export function createVisualizationCaptureSource({ mode, captureStream } = {}) {
  if (mode !== "2d" && mode !== "3d") {
    throw new RangeError("Visualization capture mode must be 2d or 3d");
  }
  if (typeof captureStream !== "function") {
    throw new TypeError("A visualization capture source must provide captureStream");
  }

  return Object.freeze({
    mode,
    captureStream,
  });
}

export function createCanvasCaptureSource(canvas, mode) {
  if (!canvas || typeof canvas.captureStream !== "function") {
    throw new TypeError("Canvas capture requires a canvas with captureStream support");
  }

  return createVisualizationCaptureSource({
    mode,
    captureStream: (frameRate) => canvas.captureStream(frameRate),
  });
}