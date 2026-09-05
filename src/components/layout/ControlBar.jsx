import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

export default function ControlBar({ player }) {
  const { isPlaying, currentStepIndex, totalSteps, canGoNext, canGoPrevious, speed } = player;
  const speedOptions = [0.5, 1, 1.5, 2];

  return (
    <section className="flex h-12 shrink-0 items-center justify-between gap-2 bg-bg-panel px-2 sm:px-4" aria-label="أدوات الخوارزمية">
      <div className="flex items-center gap-0.5 sm:gap-1">
        <button type="button" onClick={player.previous} disabled={!canGoPrevious} className="flex h-7 items-center gap-1 border border-border-subtle px-1.5 text-[11px] text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:px-2" aria-label="السابق">
          <SkipForward className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">السابق</span>
        </button>
        <button type="button" onClick={player.play} disabled={isPlaying || !canGoNext} className="flex h-7 items-center gap-1 border border-border-subtle px-1.5 text-[11px] text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:px-2" aria-label="تشغيل">
          <Play className="h-3.5 w-3.5 text-accent-green" />
          <span className="hidden sm:inline">تشغيل</span>
        </button>
        <button type="button" onClick={player.pause} disabled={!isPlaying} className="flex h-7 items-center gap-1 border border-border-subtle px-1.5 text-[11px] text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:px-2" aria-label="إيقاف مؤقت">
          <Pause className="h-3.5 w-3.5 text-accent-orange" />
          <span className="hidden sm:inline">إيقاف مؤقت</span>
        </button>
        <button type="button" onClick={player.next} disabled={!canGoNext} className="flex h-7 items-center gap-1 border border-border-subtle px-1.5 text-[11px] text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:px-2" aria-label="التالي">
          <span className="hidden sm:inline">التالي</span>
          <SkipBack className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={player.reset} disabled={currentStepIndex < 0} className="flex h-7 items-center gap-1 border border-border-subtle px-1.5 text-[11px] text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:px-2" aria-label="إعادة ضبط">
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">إعادة ضبط</span>
        </button>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 text-text-muted sm:gap-3">
        <span className="font-mono text-[10px] hover:cursor-default sm:text-[11px]"><span className="hidden sm:inline">الخطوة </span>{Math.max(currentStepIndex + 1, 0)} / {totalSteps}</span>
        <label className="flex items-center gap-1.5 text-[11px]">
          <span className="hidden sm:inline">السرعة</span>
          <select value={speed} onChange={(event) => player.setSpeed(Number(event.target.value))} className="h-7 border border-border-subtle bg-bg-inset px-1.5 font-mono text-[11px] text-text-secondary outline-none" aria-label="سرعة التشغيل">
            {speedOptions.map((option) => <option key={option} value={option}>{option}x</option>)}
          </select>
        </label>
      </div>
    </section>
  );
}
