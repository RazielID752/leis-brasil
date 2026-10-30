import Link from "next/link";
export default function NotFound() {
  return (
    <main id="conteudo" className="shell page-main">
      <div className="empty-state">
        <h1>Página não encontrada.</h1>
        <p>O documento pode não fazer parte do acervo importado.</p>
        <Link href="/leis" className="button-primary">
          Explorar leis
        </Link>
      </div>
    </main>
  );
}
