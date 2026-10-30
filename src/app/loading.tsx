export default function Loading() {
  return (
    <main id="conteudo" className="shell page-main" aria-busy="true">
      <p>Carregando o acervo…</p>
      <div className="loading-block" />
      <div className="loading-block" />
    </main>
  );
}
