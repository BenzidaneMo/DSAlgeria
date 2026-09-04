import { CheckCircle2, Download, LoaderCircle, X } from "lucide-react";
import { useState } from "react";

const RESOLUTIONS = [
  { value: "1280x720", label: "1280 × 720", width: 1280, height: 720 },
  { value: "1920x1080", label: "1920 × 1080", width: 1920, height: 1080 },
];
const FRAME_RATES = [30, 60];
const SPEEDS = [0.5, 1, 1.5, 2];

export default function VideoGenerationModal({ defaultMode, onClose, onGenerate, status }) {
  const [mode, setMode] = useState(defaultMode);
  const [resolution, setResolution] = useState(RESOLUTIONS[0].value);
  const [frameRate, setFrameRate] = useState(30);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const selectedResolution = RESOLUTIONS.find((item) => item.value === resolution);
  const isGenerating = status.state === "generating";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !isGenerating && onClose()}>
      <section className="w-full mt-28 max-w-md rounded-lg border border-border bg-bg-panel shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="video-settings-heading">
        <header className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <h2 id="video-settings-heading" className="text-sm font-semibold text-text-primary">إعدادات الفيديو</h2>
          <button type="button" onClick={onClose} disabled={isGenerating} className="flex h-7 w-7 items-center justify-center text-text-muted hover:bg-bg-hover hover:text-text-primary disabled:opacity-40" aria-label="إغلاق إعدادات الفيديو"><X className="h-4 w-4" /></button>
        </header>

        {isGenerating ? (
          <div className="flex flex-col items-center gap-3 px-4 py-10 text-center" aria-live="polite">
            <LoaderCircle className="h-7 w-7 animate-spin text-accent-blue" />
            <p className="text-sm text-text-primary">جاري إنشاء الفيديو...</p>
            <div className="h-2 w-full overflow-hidden bg-bg-inset"><div className="h-full bg-accent-blue transition-[width] duration-150" style={{ width: `${status.progress}%` }} /></div>
            <span className="font-mono text-xs text-text-secondary">{status.progress}%</span>
          </div>
        ) : status.state === "complete" ? (
          <div className="flex flex-col items-center gap-3 px-4 py-8 text-center" aria-live="polite">
            <CheckCircle2 className="h-8 w-8 text-accent-green" />
            <p className="text-sm text-text-primary">تم إنشاء الفيديو بنجاح</p>
            <a href={status.url} download="dsalgeria-algorithm.webm" className="flex h-8 items-center gap-2 border border-accent-blue bg-accent-blue px-3 text-xs text-bg-inset hover:bg-accent-blue-bright"><Download className="h-3.5 w-3.5" />حفظ الفيديو</a>
            <button type="button" onClick={onClose} className="text-xs text-text-muted hover:text-text-primary">إغلاق</button>
          </div>
        ) : status.state === "error" ? (
          <div className="flex flex-col items-center gap-3 px-4 py-8 text-center" role="alert">
            <p className="text-sm text-accent-red">تعذر إنشاء الفيديو</p>
            <p className="text-xs text-text-muted">{status.message}</p>
            <button type="button" onClick={onClose} className="h-8 border border-border-subtle px-3 text-xs text-text-secondary hover:bg-bg-hover">إغلاق</button>
          </div>
        ) : (
          <div className="space-y-4 px-4 py-5">
            <label className="block text-xs text-text-secondary">نوع التصور<select value={mode} onChange={(event) => setMode(event.target.value)} className="mt-1 h-8 w-full border border-border-subtle bg-bg-inset px-2 text-xs text-text-primary outline-none"><option value="2d">ثنائي الأبعاد</option><option value="3d">ثلاثي الأبعاد</option></select></label>
            <label className="block text-xs text-text-secondary">الدقة<select value={resolution} onChange={(event) => setResolution(event.target.value)} className="mt-1 h-8 w-full border border-border-subtle bg-bg-inset px-2 font-mono text-xs text-text-primary outline-none">{RESOLUTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label className="block text-xs text-text-secondary">معدل الإطارات<select value={frameRate} onChange={(event) => setFrameRate(Number(event.target.value))} className="mt-1 h-8 w-full border border-border-subtle bg-bg-inset px-2 font-mono text-xs text-text-primary outline-none">{FRAME_RATES.map((item) => <option key={item} value={item}>{item} FPS</option>)}</select></label>
            <label className="block text-xs text-text-secondary">سرعة العرض<select value={playbackSpeed} onChange={(event) => setPlaybackSpeed(Number(event.target.value))} className="mt-1 h-8 w-full border border-border-subtle bg-bg-inset px-2 font-mono text-xs text-text-primary outline-none">{SPEEDS.map((item) => <option key={item} value={item}>{item}x</option>)}</select></label>
            <button type="button" onClick={() => onGenerate({ mode, ...selectedResolution, frameRate, playbackSpeed })} className="h-8 w-full border border-accent-blue bg-accent-blue text-xs font-medium text-bg-inset hover:bg-accent-blue-bright">إنشاء الفيديو</button>
          </div>
        )}
      </section>
    </div>
  );
}
