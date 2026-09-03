import { Braces, Info } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-bg-inset px-4" role="banner">
      <div className="flex items-center gap-2">
        <Braces className="h-4 w-4 text-accent-blue" strokeWidth={2.25} />
        <span className="font-mono text-sm font-semibold text-text-primary">DSAlgeria</span>
      </div>

      <button
        type="button"
        className="flex h-7 items-center gap-1.5 border border-border-subtle px-2.5 text-xs text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
        aria-label="حول الموقع"
      >
        <Info className="h-3.5 w-3.5" strokeWidth={2} />
        <span>حول الموقع</span>
      </button>
    </header>
  );
}