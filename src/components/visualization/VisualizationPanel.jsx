import { Video } from "lucide-react";
import { useRef, useState } from "react";
import { getStepOperation } from "../../engine/stepTypes";
import { createCanvasCaptureSource, createRecordingProfile, createVideoRecordingSession } from "../../recording";
import ExecutionLog from "./ExecutionLog";
import SourceCodePanel from "./SourceCodePanel";
import { STEP_OPERATION_LABELS } from "./stepPresentation";
import VisualizationToolbar from "./VisualizationToolbar";
import VideoGenerationModal from "./VideoGenerationModal";
import { getVisualizationKind } from "./visualizationRegistry";

export default function VisualizationPanel({ selectedAlgorithm, currentStep, steps = [], currentStepIndex = -1, executionLog = [], array = [], onCanvasReady, showInlinePanels = true }) {
  const { View2D, View3D, renderFrame, align } = getVisualizationKind(selectedAlgorithm);
  const [mode, setMode] = useState("2d");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoStatus, setVideoStatus] = useState({ state: "idle", progress: 0, url: "", message: "" });
  const [recordingMode, setRecordingMode] = useState(null);
  const [recordingStep, setRecordingStep] = useState(null);
  const [, setRecordingCanvas] = useState(null);
  const recordingCanvasRef = useRef(null);
  const [recordingSize, setRecordingSize] = useState({ width: 1280, height: 720 });
  const operation = getStepOperation(currentStep);
  const operationLabel = currentStep ? STEP_OPERATION_LABELS[operation] ?? operation : "جاهز للتشغيل";

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
            renderFrame(captureCanvas, step, { width, height });
            session.requestFrame();
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
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border-subtle px-3 py-3 sm:flex-nowrap sm:px-5">
        <div className="min-w-0">
          <h1 id="visualization-heading" className="truncate text-sm font-medium text-text-secondary">{selectedAlgorithm?.name ?? "منطقة التصور"}</h1>
          <p className="mt-1 text-xs text-text-muted">{currentStep ? "تابع سجل التنفيذ لمعرفة ما يحدث خطوة بخطوة" : "اختر خوارزمية ثم شغّل خطواتها"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <span className="h-2 w-2 shrink-0 rounded-full bg-accent-blue" />
            <span>{operationLabel}</span>
            {currentStep && currentStep.codeLine !== null && <span className="font-mono text-accent-yellow">السطر {currentStep.codeLine}</span>}
          </div>
          <VisualizationToolbar mode={mode} onModeChange={setMode} />
          {selectedAlgorithm && steps.length > 0 && <button type="button" onClick={() => setIsVideoModalOpen(true)} className="flex h-7 items-center gap-1.5 border border-accent-blue px-2 text-[11px] text-accent-blue hover:bg-accent-blue hover:text-bg-inset" aria-label="إنشاء فيديو">
            <Video className="h-3 w-3" />
            <span className="hidden sm:inline">إنشاء فيديو</span>
          </button>}
        </div>
      </div>

      <div className={`flex min-h-80 flex-1 ${align} justify-center px-6 pb-10 pt-8`}>
        {mode === "2d"
          ? <View2D array={array} currentStep={currentStep} />
          : <View3D array={array} currentStep={currentStep} onCanvasReady={onCanvasReady} />}
      </div>

      {recordingMode === "3d" && <div style={{ position: "fixed", left: "-10000px", top: 0, width: recordingSize.width, height: recordingSize.height, pointerEvents: "none" }} aria-hidden="true">
        <View3D
          array={array}
          currentStep={recordingStep}
          currentStepIndex={-1}
          viewportWidth={recordingSize.width}
          viewportHeight={recordingSize.height}
          onCanvasReady={(canvas) => { recordingCanvasRef.current = canvas; setRecordingCanvas(canvas); }}
        />
      </div>}

      {showInlinePanels && (
        <div className="relative grid min-h-80 max-h-80 grid-cols-2 border-t border-border-subtle">
          <ExecutionLog executionLog={executionLog} currentStepIndex={currentStepIndex} totalSteps={steps.length} />
          <SourceCodePanel sourceCode={selectedAlgorithm?.sourceCode} activeLine={currentStep?.codeLine} />
        </div>
      )}
      {isVideoModalOpen && <VideoGenerationModal defaultMode={mode} onClose={closeVideoModal} onGenerate={generateVideo} status={videoStatus} />}
    </section>
  );
}