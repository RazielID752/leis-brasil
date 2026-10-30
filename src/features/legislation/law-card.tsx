import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LawSummary } from "./types";
import { formatDate } from "@/lib/utils";
export function LawCard({ law }: { law: LawSummary }) {
  return (
    <Link href={`/leis/${law.id}`} className="law-result">
      <div className="law-meta">
        <span className="tag">
          {law.sphere}
          {law.uf ? ` · ${law.uf}` : ""}
        </span>
        <span>{law.type}</span>
        {law.date ? <span>· {formatDate(law.date)}</span> : null}
      </div>
      <h2>{law.title}</h2>
      <p>{law.description}</p>
      <span className="result-link">
        Ler texto da norma <ArrowUpRight size={14} />
      </span>
    </Link>
  );
}
