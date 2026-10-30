import Link from "next/link";
import { ChevronRight, Cloud, BookOpen, ShieldCheck } from "lucide-react";
import { LegalNotice } from "@/features/about/legal-notice";
import { getCoverage } from "@/infrastructure/legislation";
import { formatDate, formatNumber } from "@/lib/utils";
export const metadata = { title: "Sobre, fontes e aviso legal" };
export default function About() {
  const coverage = getCoverage();
  return (
    <main id="conteudo" className="shell page-main">
      <div className="breadcrumb">
        <Link href="/">Início</Link>
        <ChevronRight size={12} />
        <span>Fontes e cobertura</span>
      </div>
      <div className="page-heading">
        <h1>Um acervo aberto. Fontes à vista.</h1>
        <p>
          Um projeto independente para facilitar a leitura das leis e
          compartilhar conhecimento, com clareza sobre suas fontes e limitações.
        </p>
      </div>
      <div className="note-box legal-summary">
        <ShieldCheck size={23} />
        <div>
          <strong>Para aprender e se orientar na leitura.</strong>
          <p>
            Este site tem finalidade educativa e informativa. As explicações não
            substituem a publicação oficial nem orientação jurídica para um caso
            concreto.{" "}
            <a href="#aviso-legal" className="underline text-accent">
              Leia o aviso legal completo.
            </a>
          </p>
        </div>
      </div>
      <div className="coverage-grid">
        <div className="coverage-stat">
          <strong>1</strong>
          <span>texto legal completo local: a Constituição</span>
        </div>
        <div className="coverage-stat">
          <strong>{formatNumber(coverage.catalogCount)}</strong>
          <span>normas na seleção de metadados pesquisáveis</span>
        </div>
        <div className="coverage-stat">
          <strong>16 MB</strong>
          <span>limite do cache de textos por processo</span>
        </div>
      </div>
      <div className="prose-wrap">
        <div className="note-box">
          <ShieldCheck size={23} />
          <div>
            <strong>Transparência sobre a cobertura</strong>
            <p>
              O catálogo pesquisável é uma seleção inicial, não um índice
              nacional completo. A navegação por coleções consulta as pastas
              disponíveis no repositório e permite abrir outras normas, sem
              baixar o acervo inteiro.
            </p>
          </div>
        </div>
        <section className="source-detail">
          <h2>
            <BookOpen size={22} className="mr-2 inline" />O que fica local
          </h2>
          <p>
            A Constituição Federal completa, os guias e os metadados do
            catálogo. O texto da Constituição tem aproximadamente 705 KB e foi
            coletado na origem em {formatDate(coverage.constitutionCollectedAt)}
            . Esses conteúdos não precisam de acesso ao repositório para serem
            consultados.
          </p>
          <p>
            Integridade da Constituição:{" "}
            <code>{coverage.constitution.sha256}</code>
          </p>
        </section>
        <section className="source-detail">
          <h2>
            <Cloud size={22} className="mr-2 inline" />O que é consultado
            remotamente
          </h2>
          <p>
            Os demais textos vêm de{" "}
            <a
              className="underline text-accent"
              href={coverage.repository}
              target="_blank"
              rel="noopener noreferrer"
            >
              ctresb/leis
            </a>
            , no servidor, apenas ao abrir uma norma. A navegação remota depende
            da API pública do GitHub e está sujeita a indisponibilidade e
            limites de acesso.
          </p>
          <p>
            Versão fixada:{" "}
            <a
              className="underline"
              href={`${coverage.repository}/tree/${coverage.commit}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <code>{coverage.commit}</code>
            </a>
            . Usamos um commit identificado para evitar mudanças silenciosas nos
            textos; isso não garante que seja a redação mais recente.
          </p>
          <p>
            O cache temporário mantém até 16 MB de textos e 128 entradas por
            processo, válidos por 6 horas. Em falha de rede, uma cópia já
            consultada pode ser usada por mais 7 dias dentro desse mesmo limite,
            identificada no leitor. O cache desaparece ao reiniciar o servidor e
            não substitui um backup. Documentos acima de 8 MB não são abertos
            neste leitor; consulte a fonte de origem.
          </p>
        </section>
        <section className="source-detail">
          <h2>Textos, guias e vigência</h2>
          <p>
            Os textos são conversões informativas e podem conter erros ou
            lacunas. A fonte oficial e a data de coleta são exibidas quando
            fornecidas. O site não verifica independentemente a vigência de cada
            dispositivo.
          </p>
          <p>
            Os guias são conteúdos editoriais separados das normas, com estado
            de revisão visível. O projeto{" "}
            <a
              className="underline"
              href="https://github.com/abjur/constituicao"
              target="_blank"
              rel="noopener noreferrer"
            >
              abjur/constituicao
            </a>{" "}
            permanece uma referência complementar, sem substituir o texto local.
          </p>
        </section>
        <LegalNotice />
        <Link href="/acervo" className="button-primary">
          Explorar coleções remotas
        </Link>
      </div>
    </main>
  );
}
