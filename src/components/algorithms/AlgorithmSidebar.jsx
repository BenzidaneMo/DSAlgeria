import { ChevronDown, ListTree, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ALGORITHM_CATEGORIES } from "../../data/algorithms";
import { Pencil } from "lucide-react";
import DifficultyBadge from "./DifficultyBadge";

export default function AlgorithmSidebar({ selectedAlgorithm, onSelectAlgorithm, array, sortedState, setIsArrayEditorOpen, target, onTargetChange, count, onCountChange }) {
  const [expandedCategory, setExpandedCategory] = useState("sorting");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCategories = useMemo(() => ALGORITHM_CATEGORIES.filter((category) => !category.hidden).map((category) => ({
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
    <aside className="flex w-full col-span-2 min-h-0 flex-col overflow-hidden border-s border-border bg-bg-panel" aria-labelledby="algorithms-heading">
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
                                className={`flex w-full items-center justify-between gap-2 border-s-2 py-1.5 pe-3 ps-8 text-right transition-colors ${isSelected ? "border-accent-blue bg-bg-elevated text-text-primary" : "border-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary"}`}
                                aria-pressed={isSelected}
                                onClick={() => onSelectAlgorithm(algorithm)}
                              >
                                <span className="flex min-w-0 flex-col items-start">
                                  <span className="text-xs leading-4">{algorithm.name}</span>
                                  <span className="font-mono text-[10px] leading-4 text-text-muted">{algorithm.englishName}</span>
                                </span>
                                <DifficultyBadge level={algorithm.difficulty} className="shrink-0" />
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
        {sortedState?.isSorted && <p className="border-t border-border-subtle px-3 py-2 text-[10px] leading-5 text-accent-green">مصفوفة مرتبة جاهزة للبحث: [{sortedState.sortedArray.join("، ")}]<br />مصدر الترتيب: {sortedState.sortedBy}</p>}
        
        {selectedAlgorithm?.requiresTarget ? (
          <div className="border-t border-border-subtle p-3">
            <label className="flex items-center justify-between gap-2 text-[11px] text-text-secondary">
              <span>القيمة الهدف</span>
              <input type="number" value={target} onChange={(event) => onTargetChange(Number(event.target.value))} className="h-7 w-20 border border-border-subtle bg-bg-inset px-2 text-center font-mono text-xs text-text-primary outline-none focus:border-accent-blue" aria-label="القيمة الهدف للبحث" />
            </label>
          </div>
                ) : null}
        {selectedAlgorithm?.requiresCount ? (
          <div className="border-t border-border-subtle p-3">
            <label className="flex items-center justify-between gap-2 text-[11px] text-text-secondary">
              <span>{selectedAlgorithm.countLabel ?? "القيمة n"}</span>
              <input type="number" min={0} max={selectedAlgorithm.countMax} value={count} onChange={(event) => onCountChange(Number(event.target.value))} className="h-7 w-20 border border-border-subtle bg-bg-inset px-2 text-center font-mono text-xs text-text-primary outline-none focus:border-accent-blue" aria-label={selectedAlgorithm.countLabel ?? "القيمة n"} />
            </label>
          </div>
        ) : null}
        {!selectedAlgorithm?.requiresCount && (
          <div className="self-end mx-auto mb-2 flex items-center justify-center rounded-md max-w-3xs 2xl:max-w-2xs gap-2 border border-border-subtle p-1.5 bg-bg-app">
              <div className="items-center justify-between gap-2 hidden 2xl:flex">
                  <h3 className="text-xs font-semibold text-text-primary">المصفوفة</h3>
                  <span className="font-mono text-[10px] text-text-muted">{array.join("، ")}</span>
              </div>
              <button type="button" onClick={() => setIsArrayEditorOpen(true)} className="group max-w-34 h-fit cursor-pointer flex items-center justify-center gap-1 rounded-md border border-border-subtle py-4 px-2.5  hover:bg-bg-hover transform transition-all hover:scale-102 ease-in-out duration-150 focus:scale-95">
                  <Pencil className="h-3 w-3" />
                  <span className="w-fit text-[11px] text-text-secondary group-hover:text-text-primary">تعديل المصفوفة</span>
              </button>
          </div>
        )}
    </aside>
  );
}