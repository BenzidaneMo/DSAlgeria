import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

export default function ControlBar({ player }) {
  const { isPlaying, currentStepIndex, totalSteps, canGoNext, canGoPrevious, speed } = player;
  const speedOptions = [0.5, 1, 1.5, 2];

  return (
    <section className="flex h-12 shrink-0 items-center justify-between bg-bg-panel px-4" aria-label="أدوات الخوارزمية">
      <div className="flex items-center gap-1">
        <button type="button" onClick={player.previous} disabled={!canGoPrevious} className="flex h-7 items-center gap-1 border border-border-subtle px-2 text-[11px] text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40" aria-label="السابق">
          <SkipForward className="h-3.5 w-3.5" />
          السابق
        </button>
        <button type="button" onClick={player.play} disabled={isPlaying || !canGoNext} className="flex h-7 items-center gap-1 border border-border-subtle px-2 text-[11px] text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40" aria-label="تشغيل">
          <Play className="h-3.5 w-3.5 text-accent-green" />
          تشغيل
        </button>
        <button type="button" onClick={player.pause} disabled={!isPlaying} className="flex h-7 items-center gap-1 border border-border-subtle px-2 text-[11px] text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40" aria-label="إيقاف مؤقت">
          <Pause className="h-3.5 w-3.5 text-accent-orange" />
          إيقاف مؤقت
        </button>
        <button type="button" onClick={player.next} disabled={!canGoNext} className="flex h-7 items-center gap-1 border border-border-subtle px-2 text-[11px] text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40" aria-label="التالي">
          التالي
          <SkipBack className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={player.reset} disabled={currentStepIndex < 0} className="flex h-7 items-center gap-1 border border-border-subtle px-2 text-[11px] text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40" aria-label="إعادة ضبط">
          <RotateCcw className="h-3.5 w-3.5" />
          إعادة ضبط
        </button>
      </div>
      <div className="flex items-center gap-3 text-text-muted">
        <span className="font-mono text-[11px] hover:cursor-default">الخطوة {Math.max(currentStepIndex + 1, 0)} / {totalSteps}</span>
        <label className="flex items-center gap-1.5 text-[11px]">
          <span>السرعة</span>
          <select value={speed} onChange={(event) => player.setSpeed(Number(event.target.value))} className="h-7 border border-border-subtle bg-bg-inset px-1.5 font-mono text-[11px] text-text-secondary outline-none" aria-label="سرعة التشغيل">
            {speedOptions.map((option) => <option key={option} value={option}>{option}x</option>)}
          </select>
        </label>
      </div>
    </section>
  );
}