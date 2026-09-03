import { Braces } from "lucide-react";

export default function VisualizationPanel() {
  return (
    <section className="relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden bg-bg-app" aria-labelledby="visualization-heading">
      <div className="flex flex-col items-center gap-3 text-center">
        <Braces className="h-9 w-9 text-text-muted" strokeWidth={1.25} />
        <div>
          <h1 id="visualization-heading" className="text-sm font-medium text-text-secondary">منطقة التصور</h1>
          <p className="mt-1 text-xs text-text-muted">ستظهر هنا خطوات الخوارزمية بصريًا</p>
        </div>
      </div>
    </section>
  );
}