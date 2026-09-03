import { ListTree, Search } from "lucide-react";

export default function AlgorithmSidebar() {
  return (
    <aside className="flex min-h-0 flex-col overflow-hidden border-s border-border bg-bg-panel" aria-labelledby="algorithms-heading">
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <h2 id="algorithms-heading" className="text-xs font-semibold text-text-primary">الخوارزميات</h2>
        <ListTree className="h-4 w-4 text-accent-blue" strokeWidth={1.8} />
      </div>
      <div className="border-b border-border-subtle p-3">
        <div className="flex h-7 items-center gap-2 border border-border-subtle bg-bg-inset px-2 text-text-muted">
          <Search className="h-3.5 w-3.5" />
          <span className="text-[11px]">بحث...</span>
        </div>
      </div>
      <p className="px-4 py-4 text-xs leading-6 text-text-muted">ستظهر قائمة الخوارزميات هنا.</p>
    </aside>
  );
}