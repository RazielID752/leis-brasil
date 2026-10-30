import Link from "next/link";
import { CloudOff } from "lucide-react";
import { UPSTREAM } from "@/infrastructure/upstream";
export function RemoteUnavailable() {
  return (
    <main id="conteudo" className="shell page-main">
      <div className="empty-state">
        <CloudOff size={38} />
        <h1 className="text-4xl!">A fonte remota está indisponível.</h1>
        <p>
          Não foi possível carregar esta norma agora. Tente novamente em
          instantes.
          <br />A Constituição e os guias continuam disponíveis neste site.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/leis/constituicao" className="button-primary">
            Ler a Constituição
          </Link>
          <Link href="/leis" className="button-secondary">
            Voltar ao catálogo
          </Link>
          <a
            href={`${UPSTREAM.repository}/tree/${UPSTREAM.commit}`}
            className="button-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir repositório de origem
          </a>
        </div>
      </div>
    </main>
  );
}
