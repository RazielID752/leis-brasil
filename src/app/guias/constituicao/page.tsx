import Link from "next/link";
import { ChevronRight, BookOpen, ExternalLink } from "lucide-react";
import { getConstitutionGuide } from "@/features/guides/content";
import { GuideMarkdown } from "@/features/guides/guide-markdown";
import { legislation } from "@/infrastructure/legislation";
import { formatDate } from "@/lib/utils";
export const dynamic = "force-dynamic";
export const metadata = { title: "Constituição: por onde começar?" };
export default async function ConstitutionGuide() {
  const guide = getConstitutionGuide();
  const law = await legislation.find("constituicao");
  return (
    <main id="conteudo" className="shell page-main">
      <div className="breadcrumb">
        <Link href="/">Início</Link>
        <ChevronRight size={12} />
        <Link href="/guias">Guias de leitura</Link>
        <ChevronRight size={12} />
        <span>Constituição</span>
      </div>
      <div className="page-heading">
        <span className="status-label">{guide.status}</span>
        <h1 className="mt-5">{guide.title}</h1>
        <p>{guide.description}</p>
      </div>
      <div className="guide-layout">
        <article>
          <GuideMarkdown content={guide.content} />
        </article>
        <aside className="guide-aside">
          <h2>Norma de referência</h2>
          <p>Constituição Federal de 1988</p>
          <p>
            Coleta do texto consultado: {formatDate(law?.collectedAt || null)}
          </p>
          <Link href="/leis/constituicao">
            <BookOpen size={15} className="mr-2 inline" />
            Abrir texto original
          </Link>
          <a
            href="https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar o Planalto <ExternalLink size={12} className="inline" />
          </a>
          <Link href="/sobre">Sobre as fontes e a cobertura</Link>
        </aside>
      </div>
    </main>
  );
}
