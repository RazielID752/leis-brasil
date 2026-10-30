"use client";
import { useId, useState, type ReactNode } from "react";
import { ChevronDown, List } from "lucide-react";
/** Desktop rail and a compact mobile drawer share the same server-rendered links. */
export function ReaderIndex({
  count,
  children,
}: {
  count: number;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <aside className="reader-navigation">
      <div className="reader-sidebar">
        <div className="reader-index-heading">
          Índice da norma · {count} trechos
        </div>
        <button
          type="button"
          className="reader-index-toggle"
          aria-controls={id}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          <List size={18} />
          <span>Índice da norma · {count} trechos</span>
          <ChevronDown size={16} className={expanded ? "rotate-180" : ""} />
        </button>
        <nav
          id={id}
          className="reader-index"
          data-open={expanded}
          aria-label="Índice da norma"
          onClick={() => setExpanded(false)}
        >
          {children}
        </nav>
      </div>
    </aside>
  );
}
