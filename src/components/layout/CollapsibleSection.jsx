import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function CollapsibleSection({ title, icon: Icon, defaultOpen = false, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="shrink-0 border-t border-border-subtle bg-bg-panel">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-full items-center justify-between gap-2 px-4 text-right text-xs font-semibold text-text-primary transition-colors hover:bg-bg-hover"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-accent-blue" strokeWidth={1.8} />}
          {title}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`} />
      </button>
      {isOpen && <div className="border-t border-border-subtle bg-bg-app">{children}</div>}
    </section>
  );
}
