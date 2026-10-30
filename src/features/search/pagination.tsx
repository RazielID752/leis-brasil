import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatNumber } from "@/lib/utils";
export function Pagination({
  page,
  total,
  pageSize,
  base,
  params,
}: {
  page: number;
  total: number;
  pageSize: number;
  base: string;
  params: Record<string, string>;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const link = (n: number) =>
    `${base}?${new URLSearchParams({ ...params, page: String(n) })}`;
  if (pages === 1) return null;
  return (
    <nav className="pagination" aria-label="Paginação">
      {page > 1 ? (
        <Link href={link(page - 1)} className="button-secondary">
          <ArrowLeft size={14} />
          Anterior
        </Link>
      ) : (
        <span />
      )}
      <span>
        Página {formatNumber(page)} de {formatNumber(pages)}
      </span>
      {page < pages ? (
        <Link href={link(page + 1)} className="button-secondary">
          Próxima
          <ArrowRight size={14} />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
