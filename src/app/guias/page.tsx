import Link from "next/link";
import { BookOpen, ArrowUpRight, ChevronRight } from "lucide-react";
import { getConstitutionGuide } from "@/features/guides/content";
export const metadata = { title: "Guias de leitura" };
export default function GuidesPage() {
  const guide = getConstitutionGuide();
  return (
    <main id="conteudo" className="shell page-main">
      <div className="breadcrumb">
        <Link href="/">Início</Link>
        <ChevronRight size={12} />
        <span>Guias de leitura</span>
      </div>
      <div className="page-heading">
        <h1>Uma leitura mais clara.</h1>
        <p>
          Mapas, exemplos e explicações para se orientar nos textos da
          legislação brasileira. Um tema de cada vez.
        </p>
      </div>
      <div className="note-box max-w-3xl">
        <BookOpen size={20} />
        <div>
          <strong>Conhecer o texto é o primeiro passo.</strong>
          <p>
            Os guias são conteúdos editoriais separados das normas. A situação
            de revisão de cada material fica visível antes da leitura.
          </p>
        </div>
      </div>
      <section className="guide-list" aria-label="Guias disponíveis">
        <Link href="/guias/constituicao" className="guide-card">
          <div className="guide-cover">
            <BookOpen />
          </div>
          <div className="flex-1">
            <span className="status-label">{guide.status}</span>
            <h2>{guide.title}</h2>
            <p>{guide.description}</p>
          </div>
          <ArrowUpRight size={25} />
        </Link>
      </section>
      <p className="mt-8 text-sm">
        A coleção começa pela Constituição. Novos guias serão adicionados
        conforme forem preparados e revisados.
      </p>
    </main>
  );
}
