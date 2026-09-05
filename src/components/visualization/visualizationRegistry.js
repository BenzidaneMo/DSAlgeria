import { renderArray2DFrame } from "../../recording/array2DVideoRenderer";
import { renderHanoiFrame } from "../../recording/hanoiVideoRenderer";
import { renderRecursionFrame } from "../../recording/recursionVideoRenderer";
import Array2DVisualizer from "./Array2DVisualizer";
import Array3DVisualizer from "./Array3DVisualizer";
import HanoiVisualizer from "./HanoiVisualizer";
import Hanoi3DVisualizer from "./Hanoi3DVisualizer";
import RecursionVisualizer from "./RecursionVisualizer";
import Recursion3DVisualizer from "./Recursion3DVisualizer";

/**
 * Maps an algorithm's `visualizationKind` metadata to the components/frame
 * renderer that should be used for it. Every entry receives the same props
 * (array, currentStep, onCanvasReady, viewport size) regardless of which
 * ones it actually reads, so adding a new kind here never requires changes
 * to VisualizationPanel's rendering logic.
 */
export const VISUALIZATION_KINDS = Object.freeze({
  array: {
    View2D: Array2DVisualizer,
    View3D: Array3DVisualizer,
    renderFrame: renderArray2DFrame,
    align: "items-end",
  },
  recursion: {
    View2D: RecursionVisualizer,
    View3D: Recursion3DVisualizer,
    renderFrame: renderRecursionFrame,
    align: "items-center",
  },
  hanoi: {
    View2D: HanoiVisualizer,
    View3D: Hanoi3DVisualizer,
    renderFrame: renderHanoiFrame,
    align: "items-center",
  },
});

export function getVisualizationKind(selectedAlgorithm) {
  return VISUALIZATION_KINDS[selectedAlgorithm?.visualizationKind] ?? VISUALIZATION_KINDS.array;
}
