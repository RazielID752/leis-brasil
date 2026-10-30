import Link from "next/link";
import { BookOpen } from "lucide-react";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeToggle } from "./theme-toggle";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="leisbrasil — início">
      <BookOpen strokeWidth={1.7} />
      <span>leisbrasil</span>
    </Link>
  );
}
export function SiteHeader() {
  return (
    <header className="site-header shell">
      <Brand />
      <nav className="desktop-nav" aria-label="Navegação principal">
        <Link href="/leis">Explorar leis</Link>
        <Link href="/guias">Guias de leitura</Link>
        <Link href="/sobre">Sobre o acervo</Link>
      </nav>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <MobileNavigation />
      </div>
    </header>
  );
}
