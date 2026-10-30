import Link from "next/link";
import { RemoteUnavailable } from "@/features/legislation/remote-unavailable";
import { RemoteUnavailableError } from "@/infrastructure/remote-source";
import { UPSTREAM } from "@/infrastructure/upstream";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  ExternalLink,
  Info,
  Link as LinkIcon,
  Search,
  ArrowLeft,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { legislation } from "@/infrastructure/legislation";
import { buildSections } from "@/features/legislation/parse";
import { LegalMarkdown } from "@/features/legislation/markdown";
import { ReaderIndex } from "@/features/legislation/reader-index";
import { ReadingControls } from "@/features/legislation/reading-controls";
import { formatDate } from "@/lib/utils";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const law = await legislation.find((await params).id);
    return { title: law?.title || "Norma não encontrada" };
  } catch {
    return { title: "Consulta temporariamente indisponível" };
  }
}
export default async function LawPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const raw = await searchParams;
  let law;
  try {
    law = await legislation.find(id);
  } catch (error) {
    if (error instanceof RemoteUnavailableError) return <RemoteUnavailable />;
    throw error;
  }
  if (!law) notFound();
  const sections = buildSections(law.body);
  const q = typeof raw.q === "string" ? raw.q.slice(0, 200) : "";
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtered = q
    ? sections.filter((s) => normalize(s.content).includes(normalize(q)))
    : sections;
  const pageSize = 24;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const part = Math.min(pages, Math.max(1, Math.floor(Number(raw.parte)) || 1));
  const shown = filtered.slice((part - 1) * pageSize, part * pageSize);
  const partLink = (n: number) =>
    `/leis/${id}?${new URLSearchParams({ parte: String(n), ...(q ? { q } : {}) })}`;
  return (
    <main id="conteudo" className="shell page-main">
      <div className="breadcrumb">
        <Link href="/">Início</Link>
        <ChevronRight size={12} />
        <Link href="/leis">Explorar leis</Link>
        <ChevronRight size={12} />
        <span>{law.type}</span>
      </div>
      <div className="reader-layout">
        <ReaderIndex count={sections.length}>
          {sections.map((s, i) => (
            <Link
              prefetch={false}
              key={s.id}
              href={`/leis/${id}?parte=${Math.floor(i / pageSize) + 1}#${s.id}`}
              className={s.isArticle ? "" : "chapter"}
            >
              {s.title}
            </Link>
          ))}
        </ReaderIndex>
        <article className="reader-main">
          <div className="law-meta">
            <span className="tag">
              {law.sphere}
              {law.uf ? ` · ${law.uf}` : ""}
            </span>
            <span>{law.type}</span>
            <span>{law.status || "Vigência não verificada pelo site"}</span>
          </div>
          <h1>{law.title}</h1>
          <p className="law-description">{law.description}</p>
          <div className="reader-source">
            <Info size={18} />
            <div>
              <div>
                {law.delivery === "local"
                  ? "Constituição local"
                  : law.delivery === "stale"
                    ? "Cópia em cache · fonte indisponível"
                    : "Consulta ao repositório"}{" "}
                · Coleta: {formatDate(law.collectedAt)}
              </div>
              <p>
                {law.delivery === "stale"
                  ? "A fonte falhou; exibimos uma cópia consultada anteriormente nesta sessão. "
                  : ""}
                {law.version || "Versão conforme o arquivo de origem."} A
                conversão pode conter erros; consulte a publicação oficial.
              </p>
              <a href={law.source} target="_blank" rel="noopener noreferrer">
                Consultar fonte oficial{" "}
                <ExternalLink size={12} className="inline" />
              </a>
              <p>
                Conteúdo informativo; não substitui orientação jurídica.{" "}
                <Link href="/sobre#aviso-legal">Aviso legal</Link>.
              </p>
            </div>
          </div>
          {id === "constituicao" ? (
            <Link className="text-link" href="/guias/constituicao">
              <BookOpen size={18} />
              Conhecer a estrutura da Constituição
              <ArrowRight size={15} />
            </Link>
          ) : null}
          <div className="reader-toolbar">
            <ReadingControls />
            <form className="reader-search" action={`/leis/${id}`}>
              <label className="sr-only" htmlFor="article-search">
                Buscar no texto integral desta norma
              </label>
              <input
                id="article-search"
                name="q"
                type="search"
                placeholder="Buscar nesta norma…"
                defaultValue={q}
                maxLength={200}
              />
              <button aria-label="Buscar nesta norma">
                <Search size={18} />
              </button>
              {q ? (
                <Link href={`/leis/${id}`} className="text-xs underline">
                  Limpar
                </Link>
              ) : null}
            </form>
          </div>
          <div className="reader-pagination-top">
            {q ? `${filtered.length} trechos com “${q}” · ` : ""}Parte {part} de{" "}
            {pages} · O texto integral está distribuído em partes para facilitar
            a leitura.
          </div>
          <div className="prose">
            {shown.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="article-section"
              >
                <a
                  className="article-anchor"
                  href={`#${section.id}`}
                  aria-label={`Link para ${section.title}`}
                >
                  <LinkIcon size={11} />
                  {section.isArticle ? section.title : "Link deste trecho"}
                </a>
                <LegalMarkdown>{section.content}</LegalMarkdown>
              </section>
            ))}
          </div>
          {!shown.length ? (
            <div className="empty-state">
              <h2>Nenhum trecho encontrado</h2>
              <p>Tente uma palavra diferente.</p>
            </div>
          ) : null}
          <nav className="pagination" aria-label="Partes da norma">
            {part > 1 ? (
              <Link className="button-secondary" href={partLink(part - 1)}>
                <ArrowLeft size={14} />
                Parte anterior
              </Link>
            ) : (
              <span />
            )}
            <span>
              Parte {part} de {pages}
            </span>
            {part < pages ? (
              <Link className="button-secondary" href={partLink(part + 1)}>
                Próxima parte
                <ArrowRight size={14} />
              </Link>
            ) : (
              <span />
            )}
          </nav>
          <p className="mt-8 text-xs">
            Arquivo do acervo: <code>{law.path}</code> · Versão{" "}
            {UPSTREAM.commit.slice(0, 7)} ·{" "}
            <Link href="/sobre" className="underline">
              Sobre esta cópia
            </Link>
          </p>
        </article>
      </div>
    </main>
  );
}
