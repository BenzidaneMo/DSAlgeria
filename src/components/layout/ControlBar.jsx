import { CirclePlay, RotateCcw, SkipBack, SkipForward } from "lucide-react";

export default function ControlBar() {
  return (
    <section className="flex h-12 shrink-0 items-center justify-between bg-bg-panel px-4" aria-label="أدوات الخوارزمية">
      <div className="flex items-center gap-1.5">
        <button type="button" className="flex h-7 items-center gap-1.5 border border-border bg-bg-elevated px-2.5 text-xs text-text-primary hover:bg-bg-hover" aria-label="تشغيل الخوارزمية">
          <CirclePlay className="h-3.5 w-3.5 text-accent-green" />
          تشغيل
        </button>
        <button type="button" className="flex h-7 w-7 items-center justify-center border border-border-subtle text-text-secondary hover:bg-bg-hover hover:text-text-primary" aria-label="إعادة التعيين">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-1 text-text-muted">
        <button type="button" className="flex h-7 w-7 items-center justify-center hover:bg-bg-hover hover:text-text-primary" aria-label="الخطوة السابقة">
          <SkipForward className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-20 text-center font-mono text-[11px]">الخطوة 0 من 0</span>
        <button type="button" className="flex h-7 w-7 items-center justify-center hover:bg-bg-hover hover:text-text-primary" aria-label="الخطوة التالية">
          <SkipBack className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}