import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "./site-header";
export function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <Brand />
      <div className="footer-note">
        Conteúdo educativo e informativo. Confira sempre a fonte oficial.
        <br />
        <Link href="/sobre">
          Fontes e cobertura <ArrowRight size={13} />
        </Link>
      </div>
      <nav aria-label="Rodapé">
        <Link href="/leis">Explorar leis</Link>
        <Link href="/guias">Guias de leitura</Link>
        <Link href="/sobre#aviso-legal">Aviso legal</Link>
      </nav>
    </footer>
  );
}
