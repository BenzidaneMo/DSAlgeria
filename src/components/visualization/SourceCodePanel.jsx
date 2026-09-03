import { Code2 } from "lucide-react";

export default function SourceCodePanel({ sourceCode = "", activeLine = null }) {
  const lines = sourceCode ? sourceCode.split("\n") : [];

  return (
    <section className="flex min-h-0 min-w-0 flex-col border-s border-border-subtle bg-bg-inset" aria-labelledby="source-code-heading">
      <div className="flex shrink-0 items-center gap-2 border-b border-border-subtle px-3 py-2">
        <Code2 className="h-3.5 w-3.5 text-accent-blue" strokeWidth={1.8} />
        <h2 id="source-code-heading" className="text-xs font-semibold text-text-primary">الكود المصدري</h2>
      </div>

      {lines.length === 0 ? (
        <p className="px-3 py-4 text-[11px] text-text-muted">لا يتوفر كود مصدري لهذه الخوارزمية بعد.</p>
      ) : (
        <pre className="min-h-0 flex-1 overflow-auto py-2 font-mono text-[10px] leading-5 text-text-secondary" dir="ltr">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isActive = lineNumber === activeLine;

            return (
                <div
                  key={lineNumber}
                  className={`block min-w-max whitespace-pre px-3 ${
                    isActive
                      ? "border-s-2 border-accent-yellow bg-accent-yellow/10 text-accent-yellow"
                      : "border-s-2 border-transparent"
                    }`}
                >
                    <span className="me-4 inline-block w-5 select-none text-right text-text-muted">
                      {lineNumber}
                    </span>
                {line || " "}
                </div>
            );
          })}
        </pre>
      )}
    </section>
  );
}