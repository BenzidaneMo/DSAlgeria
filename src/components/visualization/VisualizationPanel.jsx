import { Video } from "lucide-react";
import { useRef, useState } from "react";
import { createCanvasCaptureSource, createRecordingProfile, createVideoRecordingSession } from "../../recording";
import { renderArray2DFrame } from "../../recording/array2DVideoRenderer";
import Array2DVisualizer from "./Array2DVisualizer";
import Array3DVisualizer from "./Array3DVisualizer";
import ExecutionLog from "./ExecutionLog";
import SourceCodePanel from "./SourceCodePanel";
import VisualizationToolbar from "./VisualizationToolbar";
import VideoGenerationModal from "./VideoGenerationModal";

const OPERATION_LABELS = {
  compare: "مقارنة",
  swap: "تبديل",
  complete: "اكتمل الترتيب",
};

export default function VisualizationPanel({ selectedAlgorithm, currentStep, steps = [], currentStepIndex = -1, executionLog = [], array = [], onCanvasReady }) {
  const [mode, setMode] = useState("2d");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoStatus, setVideoStatus] = useState({ state: "idle", progress: 0, url: "", message: "" });
  const [recordingMode, setRecordingMode] = useState(null);
  const [recordingStep, setRecordingStep] = useState(null);
  const [, setRecordingCanvas] = useState(null);
  const recordingCanvasRef = useRef(null);
  const [recordingSize, setRecordingSize] = useState({ width: 1280, height: 720 });
  const operationLabel = currentStep ? OPERATION_LABELS[currentStep.type] ?? currentStep.operation : "جاهز للتشغيل";

  function closeVideoModal() {
    if (videoStatus.url) {
      URL.revokeObjectURL(videoStatus.url);
    }
    setIsVideoModalOpen(false);
    setVideoStatus({ state: "idle", progress: 0, url: "", message: "" });
    setRecordingMode(null);
    setRecordingStep(null);
    setRecordingCanvas(null);
    recordingCanvasRef.current = null;
  }

  async function generateVideo(configuration) {
    const { mode: videoMode, width, height, frameRate, playbackSpeed } = configuration;
    setVideoStatus({ state: "generating", progress: 0, url: "", message: "" });
    setRecordingMode(videoMode);
    setRecordingStep(null);
    setRecordingSize({ width, height });
    recordingCanvasRef.current = null;

    let session;

    try {
      if (videoMode === "3d") {
        await new Promise((resolve, reject) => {
          const startedAt = performance.now();
          const waitForCanvas = () => {
            if (recordingCanvasRef.current) {
              resolve();
            } else if (performance.now() - startedAt > 2000) {
              reject(new Error("لم يتم تجهيز مساحة التصور للتسجيل بعد."));
            } else {
              window.setTimeout(waitForCanvas, 16);
            }
          };
          waitForCanvas();
        });
      }
      const captureCanvas = videoMode === "2d"
        ? Object.assign(document.createElement("canvas"), { width, height })
        : recordingCanvasRef.current;
      if (!captureCanvas) {
        throw new Error("لم يتم تجهيز مساحة التصور للتسجيل بعد.");
      }

      const profile = createRecordingProfile({ mode: videoMode, width, height, frameRate, playbackSpeed });
      const source = createCanvasCaptureSource(captureCanvas, videoMode);
      session = createVideoRecordingSession({
        steps,
        source,
        profile,
        algorithm: selectedAlgorithm,
        input: array,
        renderStep: (step) => {
          setRecordingStep(step);
          if (videoMode === "2d") {
            renderArray2DFrame(captureCanvas, step, { width, height });
          }
        },
      });

      session.start();
      while (session.timeline.hasNext) {
        session.renderNextStep();
        setVideoStatus((status) => ({ ...status, progress: Math.round(((session.timeline.currentStepIndex + 1) / session.timeline.totalSteps) * 100) }));
        await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
        await new Promise((resolve) => window.setTimeout(resolve, session.timeline.stepDurationMs));
      }

      const blob = await session.stop();
      const url = URL.createObjectURL(blob);
      setRecordingMode(null);
      setRecordingStep(null);
      recordingCanvasRef.current = null;
      setVideoStatus({ state: "complete", progress: 100, url, message: "" });
    } catch (error) {
      if (typeof session !== "undefined") {
        session.cancel();
      }
      setVideoStatus({ state: "error", progress: 0, url: "", message: error.message });
      setRecordingMode(null);
      setRecordingStep(null);
      recordingCanvasRef.current = null;
    }
  }

  return (
    <section className="relative col-span-6 flex min-h-0 min-w-0 flex-col overflow-hidden bg-bg-app" aria-labelledby="visualization-heading">
      <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-5 py-3">
        <div>
          <h1 id="visualization-heading" className="text-sm font-medium text-text-secondary">{selectedAlgorithm?.name ?? "منطقة التصور"}</h1>
          <p className="mt-1 text-xs text-text-muted">{currentStep ? "تابع سجل التنفيذ لمعرفة ما يحدث خطوة بخطوة" : "اختر خوارزمية ثم شغّل خطواتها"}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <span className="h-2 w-2 rounded-full bg-accent-blue" />
            <span>{operationLabel}</span>
            {currentStep && currentStep.codeLine !== null && <span className="font-mono text-accent-yellow">السطر {currentStep.codeLine}</span>}
          </div>
          <VisualizationToolbar mode={mode} onModeChange={setMode} />
          {selectedAlgorithm && steps.length > 0 && <button type="button" onClick={() => setIsVideoModalOpen(true)} className="flex h-7 items-center gap-1.5 border border-accent-blue px-2 text-[11px] text-accent-blue hover:bg-accent-blue hover:text-bg-inset" aria-label="إنشاء فيديو">
            <Video className="h-3 w-3" />
            إنشاء فيديو
          </button>}
        </div>
      </div>

      <div className="flex min-h-80 flex-1 items-end justify-center px-6 pb-10 pt-8">
        {mode === "2d" ? <Array2DVisualizer array={array} currentStep={currentStep} /> : <Array3DVisualizer array={array} currentStep={currentStep} onCanvasReady={onCanvasReady} />}
      </div>

      {recordingMode === "3d" && <div style={{ position: "fixed", left: "-10000px", top: 0, width: recordingSize.width, height: recordingSize.height, pointerEvents: "none" }} aria-hidden="true">
        <Array3DVisualizer array={array} currentStep={recordingStep} currentStepIndex={-1} viewportWidth={recordingSize.width} viewportHeight={recordingSize.height} onCanvasReady={(canvas) => { recordingCanvasRef.current = canvas; setRecordingCanvas(canvas); }} />
      </div>}

      <div className="relative grid min-h-80 max-h-80 grid-cols-2 border-t border-border-subtle">
        <ExecutionLog executionLog={executionLog} currentStepIndex={currentStepIndex} totalSteps={steps.length} />
        <SourceCodePanel sourceCode={selectedAlgorithm?.sourceCode} activeLine={currentStep?.codeLine} />
      </div>
      {isVideoModalOpen && <VideoGenerationModal defaultMode={mode} onClose={closeVideoModal} onGenerate={generateVideo} status={videoStatus} />}
    </section>
  );
}