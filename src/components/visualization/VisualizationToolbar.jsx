import { Box, Square } from "lucide-react";

export default function VisualizationToolbar({ mode, onModeChange }) {
  return (
    <div className="flex items-center gap-1 border border-border-subtle bg-bg-inset p-0.5" role="group" aria-label="وضع التصور">
      <button type="button" onClick={() => onModeChange("2d")} aria-pressed={mode === "2d"} className={`flex h-7 items-center gap-1 px-2 text-[11px] ${mode === "2d" ? "bg-bg-elevated text-accent-blue" : "text-text-muted hover:bg-bg-hover hover:text-text-primary"}`}>
        <Square className="h-3 w-3" strokeWidth={1.8} />
        ثنائي الأبعاد
      </button>
      <button type="button" onClick={() => onModeChange("3d")} aria-pressed={mode === "3d"} className={`flex h-7 items-center gap-1 px-2 text-[11px] ${mode === "3d" ? "bg-bg-elevated text-accent-blue" : "text-text-muted hover:bg-bg-hover hover:text-text-primary"}`}>
        <Box className="h-3 w-3" strokeWidth={1.8} />
        ثلاثي الأبعاد
      </button>
    </div>
  );
}