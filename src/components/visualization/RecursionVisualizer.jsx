import { ArrowDown, GitBranch } from "lucide-react";

const FRAME_STYLES = {
  pending: "border-border-subtle text-text-muted opacity-40",
  waiting: "border-border-subtle text-text-secondary",
  calling: "border-accent-blue bg-accent-blue/10 text-accent-blue",
  base: "border-accent-purple bg-accent-purple/10 text-accent-purple",
  returning: "border-accent-orange bg-accent-orange/10 text-accent-orange",
  done: "border-accent-green/60 text-text-primary",
};

function FrameCard({ frame, isCurrent }) {
  const style = isCurrent && (frame.status === "calling" || frame.status === "returning")
    ? FRAME_STYLES[frame.status]
    : frame.status === "base"
      ? FRAME_STYLES.base
      : frame.status === "done"
        ? FRAME_STYLES.done
        : frame.status === "pending"
          ? FRAME_STYLES.pending
          : FRAME_STYLES.waiting;

  return (
    <div className={`flex w-full items-center justify-between gap-3 border px-3 py-2 font-mono text-xs transition-colors ${style}`}>
      <span>factorial({frame.n})</span>
      {frame.status === "base" && <span className="text-[9px]">الحالة الأساسية</span>}
      {frame.result !== null && <span className="font-semibold">= {frame.result}</span>}
    </div>
  );
}

export default function RecursionVisualizer({ currentStep }) {
  const metadata = currentStep?.metadata;
  const callStack = metadata?.callStack;

  if (!callStack) {
    return (
      <div className="flex flex-col items-center gap-3 text-center text-text-muted">
        <GitBranch className="h-10 w-10" strokeWidth={1.2} />
        <p className="text-xs">اضغط تشغيل لبدء تتبع الاستدعاء الذاتي خطوة بخطوة</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full max-w-sm flex-col items-center gap-3 overflow-y-auto py-2" dir="ltr">
      {metadata.expression && (
        <div className="mb-1 border border-accent-orange/50 bg-accent-orange/10 px-4 py-2 text-center font-mono text-sm font-semibold text-accent-orange">
          {metadata.expression}
        </div>
      )}
      {metadata.phase === "complete" && (
        <div className="mb-1 border border-accent-green/50 bg-accent-green/10 px-4 py-2 text-center font-mono text-sm font-semibold text-accent-green">
          النتيجة النهائية: {metadata.result}
        </div>
      )}
      <div className="flex w-full flex-col items-center gap-1.5">
        {callStack.map((frame, index) => (
          <div key={frame.depth} className="flex w-full flex-col items-center gap-1.5">
            <FrameCard frame={frame} isCurrent={frame.depth === metadata.depth} />
            {index < callStack.length - 1 && <ArrowDown className="h-3.5 w-3.5 shrink-0 text-text-muted" />}
          </div>
        ))}
      </div>
    </div>
  );
}
