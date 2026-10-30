import Link from "next/link";
import {
  ChevronRight,
  SearchX,
  ArrowUpRight,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { legislation, getFacets } from "@/infrastructure/legislation";
import { LawCard } from "@/features/legislation/law-card";
import { SearchForm } from "@/features/search/search-form";
import { Pagination } from "@/features/search/pagination";
import { FilterBar } from "@/features/search/filter-bar";
import { catalogUrl } from "@/features/search/catalog-filters";
import { formatNumber } from "@/lib/utils";
export const dynamic = "force-dynamic";
export const metadata = { title: "Explorar leis" };
type Params = Record<string, string | string[] | undefined>;
export default async function LawsPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const raw = await searchParams;
  const value = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string) : "";
  const filters = {
    q: value("q").slice(0, 200),
    sphere: value("sphere"),
    uf: value("uf"),
    type: value("type"),
    year: value("year"),
  };
  const result = legislation.search({
    ...filters,
    page: Number(value("page")) || 1,
  });
  const facets = getFacets();
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value),
  );
  const filtered = Object.entries(filters).some(
    ([key, value]) => key !== "q" && value,
  );
  return (
    <main id="conteudo" className="shell page-main catalog-page">
      <div className="breadcrumb">
        <Link href="/">Início</Link>
        <ChevronRight size={12} />
        <span>Explorar leis</span>
      </div>
      <div className="catalog-header">
        <div className="page-heading">
          <h1>Qual lei você quer entender?</h1>
          <p>
            Busque pelo nome, número ou assunto. Comece pelo que importa para
            você.
          </p>
        </div>
        <Link href="/acervo" className="button-secondary">
          Explorar outras coleções
          <ArrowUpRight size={16} />
        </Link>
      </div>
      <SearchForm defaultValue={filters.q} compact />
      <div className="catalog-context">
        <span>
          Busca na seleção inicial de {facets.total} normas essenciais.
        </span>
        <Link href="/leis/constituicao">
          <BookOpen size={14} />
          Ler a Constituição
          <ArrowRight size={13} />
        </Link>
      </div>
      <FilterBar filters={filters} facets={facets} />
      <section aria-label="Resultados da busca" className="catalog-results">
        <div className="results-top">
          <strong>
            {formatNumber(result.total)}{" "}
            {result.total === 1 ? "norma encontrada" : "normas encontradas"}
            {filters.q ? (
              <span className="result-query"> para “{filters.q}”</span>
            ) : null}
          </strong>
          <span>Títulos, ementas e nomes usuais</span>
        </div>
        {result.items.length ? (
          result.items.map((law) => <LawCard key={law.id} law={law} />)
        ) : (
          <div className="empty-state">
            <SearchX size={35} />
            <h2>Vamos tentar de outro jeito?</h2>
            <p>
              {filtered
                ? "Remova os filtros para ampliar os resultados."
                : "Tente um nome mais curto, como “consumidor”, ou procure nas outras coleções."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {filtered ? (
                <Link
                  className="button-primary"
                  href={catalogUrl({ q: filters.q })}
                >
                  Remover filtros
                </Link>
              ) : (
                <Link className="button-secondary" href="/leis">
                  Ver normas essenciais
                </Link>
              )}
              <Link className="button-secondary" href="/acervo">
                Explorar outras coleções
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        )}
        <Pagination
          page={result.page}
          total={result.total}
          pageSize={result.pageSize}
          base="/leis"
          params={params}
        />
      </section>
    </main>
  );
}
