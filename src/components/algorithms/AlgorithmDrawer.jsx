import { ChevronDown, ListTree, X } from "lucide-react";
import { useEffect, useState } from "react";
import AlgorithmSidebar from "./AlgorithmSidebar";

export default function AlgorithmDrawer({ selectedAlgorithm, onSelectAlgorithm, array, sortedState, setIsArrayEditorOpen, target, onTargetChange }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function handleSelect(algorithm) {
    onSelectAlgorithm(algorithm);
    setIsOpen(false);
  }

  return (
    <div className="shrink-0 border-b border-border-subtle bg-bg-panel">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-12 w-full items-center justify-between gap-2 px-4 text-right text-sm text-text-secondary transition-colors hover:bg-bg-hover"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-2">
          <ListTree className="h-4 w-4 shrink-0 text-accent-blue" strokeWidth={1.8} />
          <span className="truncate">{selectedAlgorithm ? selectedAlgorithm.name : "اختر خوارزمية"}</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" onClick={() => setIsOpen(false)} />
          <div role="dialog" aria-modal="true" aria-label="اختيار خوارزمية" className="relative flex h-[85vh] w-full flex-col border-t border-border bg-bg-panel shadow-2xl">
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-border-subtle px-4">
              <span className="text-xs font-semibold text-text-primary">اختر خوارزمية</span>
              <button type="button" onClick={() => setIsOpen(false)} className="flex h-7 w-7 items-center justify-center text-text-muted hover:bg-bg-hover hover:text-text-primary" aria-label="إغلاق">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1">
              <AlgorithmSidebar
                selectedAlgorithm={selectedAlgorithm}
                onSelectAlgorithm={handleSelect}
                array={array}
                sortedState={sortedState}
                setIsArrayEditorOpen={setIsArrayEditorOpen}
                target={target}
                onTargetChange={onTargetChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
