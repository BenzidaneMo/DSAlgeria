import { BarChart3 } from "lucide-react";
import { getStepVisualState, STEP_OPERATIONS } from "../../engine/stepTypes";

function getBarHeight(value, minimum, maximum) {
  if (minimum === maximum) {
    return 52;
  }

  return 18 + ((value - minimum) / (maximum - minimum)) * 72;
}

export default function Array2DVisualizer({ array = [], currentStep }) {
  const currentArray = currentStep?.array?.length ? currentStep.array : array;
  const values = currentArray.length > 0 ? currentArray : [0];
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const { activeIndices, currentSearchRange, eliminatedIndices, foundIndices, partitionIndices, pivotIndex, pointerIndices, searchPointers, shiftedIndices, sortedIndices: finalizedIndices, operation } = getStepVisualState(currentStep);

  if (currentArray.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 text-center text-text-muted">
        <BarChart3 className="h-10 w-10" strokeWidth={1.2} />
        <p className="text-xs">أضف عناصر إلى المصفوفة لبدء التصور</p>
      </div>
    );
  }

  return (
    <div dir="ltr" className="flex h-full w-full max-w-3xl items-end justify-center gap-2 border-b border-border px-4">
      {currentArray.map((value, index) => {
        const isActive = activeIndices.includes(index);
        const isFinalized = finalizedIndices.includes(index);
        const isPivot = pivotIndex === index && !isFinalized;
        const isPointer = pointerIndices.includes(index);
                const isInPartition = partitionIndices.includes(index) && !isFinalized;
                const isInSearchRange = currentSearchRange
          ? index >= currentSearchRange.start && index <= currentSearchRange.end
          : true;
        const isEliminated = eliminatedIndices.includes(index);
        const pointerRole = searchPointers.left === index ? "يسار" : searchPointers.middle === index ? "وسط" : searchPointers.right === index ? "يمين" : null;
        const barColor = foundIndices.includes(index)
          ? "border-accent-green bg-accent-green/30 text-accent-green"
          : isFinalized
            ? "border-accent-green bg-accent-green/30 text-accent-green"
            : isActive && operation === STEP_OPERATIONS.SWAP
            ? "border-accent-orange bg-accent-orange/30 text-accent-orange"
            : isPivot
              ? "border-accent-purple bg-accent-purple/30 text-accent-purple"
            : isActive && shiftedIndices.includes(index)
              ? "border-accent-yellow bg-accent-yellow/30 text-accent-yellow"
            : isPointer
              ? "border-accent-blue-bright bg-accent-blue/20 text-accent-blue-bright"
            : isInPartition
              ? "border-accent-purple/50 bg-accent-purple/10 text-text-secondary"
            : isActive
              ? "border-accent-blue bg-accent-blue/30 text-accent-blue"
              : "border-border bg-bg-elevated text-text-secondary";

        return (
                    <div key={index} className={`flex h-full min-w-0 flex-1 items-end justify-center ${isEliminated ? "opacity-30" : isInSearchRange ? "opacity-100" : "opacity-45"}`}>
            <div className={`relative flex w-full max-w-16 items-start justify-center border transition-all duration-500 ease-out ${barColor}`} style={{ height: `${getBarHeight(value, minimum, maximum)}%` }} aria-label={`العنصر ${value}`}>
              <span className="absolute -top-5 font-mono text-[11px]">{value}</span>
              {pointerRole && <span className="absolute -bottom-7 text-[9px] text-accent-yellow">{pointerRole}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}