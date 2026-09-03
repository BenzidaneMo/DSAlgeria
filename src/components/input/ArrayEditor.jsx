import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const MAX_ARRAY_LENGTH = 12;
const RANDOM_MIN = 1;
const RANDOM_MAX = 99;
const MIN_ARRAY_LENGTH = 2;

function randomValue() {
  return Math.floor(Math.random() * (RANDOM_MAX - RANDOM_MIN + 1)) + RANDOM_MIN;
}

export default function ArrayEditor({ value, onApply, onClose }) {
  const [draft, setDraft] = useState(() => value.map(String));
  const [error, setError] = useState("");
  const dialogRef = useRef(null);

  function updateValue(index, nextValue) {
    setDraft((current) => current.map((item, itemIndex) => (
      itemIndex === index ? nextValue : item
    )));
    setError("");
  }

  function addElement() {
    if (draft.length < MAX_ARRAY_LENGTH) {
      setDraft((current) => [...current, ""]);
      setError("");
    }
  }

  function removeElement(index) {
    if (draft.length > MIN_ARRAY_LENGTH) {
      setDraft((current) => current.filter((_, itemIndex) => itemIndex !== index));
    }
    setError("");
  }

  function randomize() {
    const length = Math.floor(Math.random() * (MAX_ARRAY_LENGTH - MIN_ARRAY_LENGTH + 1)) + MIN_ARRAY_LENGTH;
    setDraft(() => Array.from({ length }, randomValue).map(String));
    setError("");
  }

  function apply() {
    if (draft.length === 0 || draft.some((item) => item.trim() === "" || !Number.isFinite(Number(item)))) {
      setError("أدخل أرقامًا صحيحة في جميع الخانات.");
      return;
    }

    onApply(draft.map(Number));
    setError("");
    onClose();
  }

  useEffect(() => {
      function handleKeyDown(event) {
        if (event.key === "Escape") {
          onClose();
        }
      }
  
      document.addEventListener("keydown", handleKeyDown);
      dialogRef.current?.focus();
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

  return (
    <>
        <div className="fixed inset-0 z-10 bg-black/50" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()} />
        <div className="fixed bottom-14 left-4 z-20 w-[min(360px,calc(100vw-2rem))] border border-border bg-bg-panel p-4 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="array-editor-heading">
            <div className="mb-3 flex items-center justify-between border-b border-border-subtle pb-3">
                <div>
                    <h3 id="array-editor-heading" className="text-xs font-semibold text-text-primary">تعديل المصفوفة</h3>
                    <p className="mt-1 text-[10px] text-text-muted">غيّر القيم ثم طبّق المصفوفة على الخوارزمية.</p>
                </div>
                <button type="button" onClick={onClose} className="h-6 w-6 text-lg leading-none text-text-muted hover:bg-bg-hover hover:text-text-primary" aria-label="إغلاق محرر المصفوفة">×</button>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
            {draft.map((item, index) => (
                <div key={index} className="group relative">
                    <input
                    type="number"
                    value={item}
                    onChange={(event) => updateValue(index, event.target.value)}
                    aria-label={`العنصر ${index + 1}`}
                    className="h-8 w-full border border-border-subtle bg-bg-inset px-1.5 text-center font-mono text-xs text-text-primary outline-none focus:border-accent-blue"
                    />
                    <button
                    type="button"
                    onClick={() => removeElement(index)}
                    disabled={draft.length <= MIN_ARRAY_LENGTH}
                    className="absolute -inset-e-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-accent-red text-bg-inset group-hover:flex disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`حذف العنصر ${index + 1}`}
                    title="حذف العنصر"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                </div>
            ))}
          </div>

          {error && <p className="mt-2 text-[11px] text-accent-red" role="alert">{error}</p>}

          <div className="mt-3 flex flex-wrap gap-1.5">
            <button type="button" onClick={addElement} disabled={draft.length >= MAX_ARRAY_LENGTH} className="flex h-7 items-center gap-1 border border-border-subtle px-2 text-[11px] text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40">
              <Plus className="h-3 w-3" />
              إضافة عنصر
            </button>
            <button type="button" onClick={randomize} className="flex h-7 items-center gap-1 border border-border-subtle px-2 text-[11px] text-text-secondary hover:bg-bg-hover hover:text-text-primary">
              <RefreshCw className="h-3 w-3" />
              توليد عشوائي
            </button>
            <button type="button" onClick={apply} className="h-7 border border-accent-blue bg-accent-blue px-3 text-[11px] font-medium text-bg-inset hover:bg-accent-blue-bright">
              تطبيق
            </button>
          </div>
        </div>
    </>
  );
}