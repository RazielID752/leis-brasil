"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="conteudo" className="shell page-main">
      <div className="empty-state">
        <h1>Não foi possível abrir o acervo.</h1>
        <p>
          Tente novamente. Se o problema continuar, o índice local pode precisar
          ser reconstruído.
        </p>
        <button className="button-primary" onClick={reset}>
          Tentar novamente
        </button>
        <Link className="ml-4 underline" href="/">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
