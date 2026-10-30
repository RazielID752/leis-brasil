import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Folder,
  FileText,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { remoteDirectory } from "@/infrastructure/remote-directory";
import {
  RemoteNotFoundError,
  RemoteUnavailableError,
} from "@/infrastructure/remote-source";
import { getCatalogLawByPath } from "@/infrastructure/legislation";
import { RemoteUnavailable } from "@/features/legislation/remote-unavailable";
import {
  remoteId,
  validateDirectory,
} from "@/features/legislation/remote-path";
import { normalizeSearch } from "@/features/search/catalog-search";
import { Pagination } from "@/features/search/pagination";
import { UPSTREAM } from "@/infrastructure/upstream";
export const dynamic = "force-dynamic";
export const metadata = { title: "Explorar coleções remotas" };
const labels: Record<string, string> = {
  federal: "Legislação federal",
  estaduais: "Estados e Distrito Federal",
  municipais: "Legislação municipal",
  reguladores: "Órgãos reguladores",
  jurisprudencia: "Jurisprudência",
  tratados: "Tratados internacionais",
};
export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const path = typeof raw.path === "string" ? raw.path : "";
  const q = typeof raw.q === "string" ? raw.q.slice(0, 100) : "";
  try {
    validateDirectory(path);
  } catch {
    notFound();
  }
  let result;
  try {
    result = await remoteDirectory.list(path);
  } catch (error) {
    if (error instanceof RemoteNotFoundError) notFound();
    if (error instanceof RemoteUnavailableError) return <RemoteUnavailable />;
    throw error;
  }
  const entries = q
    ? result.entries.filter((e) =>
        normalizeSearch(e.name).includes(normalizeSearch(q)),
      )
    : result.entries;
  const pageSize = 50;
  const pages = Math.max(1, Math.ceil(entries.length / pageSize));
  const page = Math.min(pages, Math.max(1, Math.floor(Number(raw.page) || 1)));
  const segments = path.split("/").filter(Boolean);
  return (
    <main id="conteudo" className="shell page-main">
      <nav className="breadcrumb" aria-label="Caminho da coleção">
        <Link href="/">Início</Link>
        <ChevronRight size={12} />
        <Link href="/acervo">Coleções</Link>
        {segments.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <ChevronRight size={12} />
            <Link
              href={`/acervo?${new URLSearchParams({ path: segments.slice(0, i + 1).join("/") })}`}
            >
              {s}
            </Link>
          </span>
        ))}
      </nav>
      <div className="page-heading">
        <h1>{labels[path] || "Explore o repositório."}</h1>
        <p>
          Navegue por esfera, estado, tipo e ano. Os diretórios e textos são
          consultados na origem, sem baixar a biblioteca inteira.
        </p>
      </div>
      <div className="note-box">
        <div>
          <strong>{path || "Coleções disponíveis"}</strong>
          <p>
            Versão {UPSTREAM.commit.slice(0, 7)} · Esta navegação lista nomes de
            arquivos. A busca por título e ementa da seleção inicial está no{" "}
            <Link href="/leis" className="underline text-accent">
              catálogo de leis
            </Link>
            . A disponibilidade depende do GitHub.
          </p>
        </div>
      </div>
      <form
        action="/acervo"
        className="search-form search-compact mb-7"
        role="search"
      >
        <Search size={20} />
        <input type="hidden" name="path" value={path} />
        <label className="sr-only" htmlFor="collection-search">
          Filtrar nomes nesta pasta
        </label>
        <input
          id="collection-search"
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Filtrar nomes nesta pasta…"
          maxLength={100}
        />
        <button className="button-primary">Filtrar</button>
      </form>
      {result.truncated ? (
        <p className="text-sm">
          A origem limitou esta listagem.{" "}
          <a
            className="underline"
            href={`${UPSTREAM.repository}/tree/${UPSTREAM.commit}/${path}`}
          >
            Consulte a pasta completa no GitHub.
          </a>
        </p>
      ) : null}
      <p className="text-xs">
        {entries.length.toLocaleString("pt-BR")} itens nesta pasta
        {q ? " após o filtro" : ""}.
      </p>
      <div className="remote-list">
        {entries.slice((page - 1) * pageSize, page * pageSize).map((entry) => (
          <Link
            key={entry.path}
            prefetch={false}
            className="remote-entry"
            href={
              entry.directory
                ? `/acervo?${new URLSearchParams({ path: entry.path })}`
                : `/leis/${getCatalogLawByPath(entry.path)?.id || remoteId(entry.path)}`
            }
          >
            {entry.directory ? <Folder size={22} /> : <FileText size={20} />}
            <span>{labels[entry.path] || entry.name}</span>
            {entry.directory ? (
              <ChevronRight size={16} />
            ) : (
              <ArrowUpRight size={16} />
            )}
          </Link>
        ))}
      </div>
      {!entries.length ? (
        <div className="empty-state">
          <h2>Nenhum item encontrado.</h2>
          <p>Experimente outro filtro ou volte à coleção anterior.</p>
          <Link href="/acervo" className="button-secondary">
            Voltar às coleções
          </Link>
        </div>
      ) : null}
      <Pagination
        page={page}
        total={entries.length}
        pageSize={pageSize}
        base="/acervo"
        params={{ path, q }}
      />
    </main>
  );
}
