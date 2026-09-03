import { CirclePause, CirclePlay, RotateCcw, SkipBack, SkipForward } from "lucide-react";

export default function ControlBar({ player }) {
  const { isPlaying, currentStepIndex, totalSteps, canGoNext, canGoPrevious } = player;

  return (
    <section className="flex h-12 shrink-0 items-center justify-between bg-bg-panel px-4" aria-label="أدوات الخوارزمية">
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={isPlaying ? player.pause : player.play} disabled={!isPlaying && !canGoNext} className="flex h-7 items-center gap-1.5 border border-border bg-bg-elevated px-2.5 text-xs text-text-primary hover:bg-bg-hover disabled:cursor-not-allowed disabled:opacity-40" aria-label={isPlaying ? "إيقاف الخوارزمية" : "تشغيل الخوارزمية"}>
          {isPlaying ? <CirclePause className="h-3.5 w-3.5 text-accent-orange" /> : <CirclePlay className="h-3.5 w-3.5 text-accent-green" />}
          {isPlaying ? "إيقاف" : "تشغيل"}
        </button>
        <button type="button" onClick={player.reset} disabled={currentStepIndex < 0} className="flex h-7 w-7 items-center justify-center border border-border-subtle text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40" aria-label="إعادة التعيين">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-1 text-text-muted">
        <button type="button" onClick={player.next} disabled={!canGoNext} className="flex h-7 w-7 items-center justify-center hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40" aria-label="الخطوة التالية">
          <SkipBack className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-20 text-center font-mono text-[11px]">الخطوة {Math.max(currentStepIndex + 1, 0)} من {totalSteps}</span>
        <button type="button" onClick={player.previous} disabled={!canGoPrevious} className="flex h-7 w-7 items-center justify-center hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40" aria-label="الخطوة السابقة">
          <SkipForward className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}