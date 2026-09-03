import { ChevronDown, ListTree, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ALGORITHM_CATEGORIES } from "../../data/algorithms";

export default function AlgorithmSidebar({ selectedAlgorithm, onSelectAlgorithm }) {
  const [expandedCategory, setExpandedCategory] = useState("sorting");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCategories = useMemo(() => ALGORITHM_CATEGORIES.map((category) => ({
    ...category,
    algorithms: category.algorithms.filter((algorithm) => (
      !normalizedQuery
      || algorithm.name.toLowerCase().includes(normalizedQuery)
      || algorithm.englishName.toLowerCase().includes(normalizedQuery)
    )),
  })).filter((category) => category.algorithms.length > 0), [normalizedQuery]);

  function toggleCategory(categoryId) {
    setExpandedCategory((currentCategory) => (
      currentCategory === categoryId ? null : categoryId
    ));
  }

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden border-s border-border bg-bg-panel" aria-labelledby="algorithms-heading">
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <h2 id="algorithms-heading" className="text-xs font-semibold text-text-primary">الخوارزميات</h2>
        <ListTree className="h-4 w-4 text-accent-blue" strokeWidth={1.8} />
      </div>
      <div className="border-b border-border-subtle p-3">
        <label className="flex h-7 items-center gap-2 border border-border-subtle bg-bg-inset px-2 text-text-muted focus-within:border-accent-blue">
          <Search className="h-3.5 w-3.5" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="بحث..." aria-label="البحث عن خوارزمية" className="min-w-0 flex-1 bg-transparent text-[11px] text-text-primary outline-none placeholder:text-text-muted" />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {filteredCategories.map((category) => {
          const isExpanded = normalizedQuery ? true : expandedCategory === category.id;

          return (
            <section key={category.id} className="border-b border-border-subtle">
              <button
                type="button"
                className={`flex min-h-9 w-full items-center gap-2 px-3 text-right text-xs transition-colors hover:bg-bg-hover ${isExpanded ? "text-text-primary" : "text-text-secondary"}`}
                aria-expanded={isExpanded}
                aria-controls={`category-${category.id}`}
                onClick={() => toggleCategory(category.id)}
              >
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`} strokeWidth={2} />
                <span>{category.name}</span>
              </button>

              {isExpanded && (
                <div id={`category-${category.id}`} className="pb-1">
                  {category.algorithms.map((algorithm) => {
                    const isSelected = selectedAlgorithm?.id === algorithm.id;

                    return (
                      <button
                        key={algorithm.id}
                        type="button"
                        className={`flex w-full flex-col items-start border-s-2 py-1.5 pe-3 ps-8 text-right transition-colors ${isSelected ? "border-accent-blue bg-bg-elevated text-text-primary" : "border-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary"}`}
                        aria-pressed={isSelected}
                        onClick={() => onSelectAlgorithm(algorithm)}
                      >
                        <span className="text-xs leading-4">{algorithm.name}</span>
                        <span className="font-mono text-[10px] leading-4 text-text-muted">{algorithm.englishName}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
        {normalizedQuery && filteredCategories.length === 0 && <p className="px-4 py-4 text-xs text-text-muted">لم يتم العثور على خوارزمية.</p>}
      </div>
    </aside>
  );
}