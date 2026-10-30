"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Menu } from "lucide-react";
export function MobileNavigation() {
  const ref = useRef<HTMLDetailsElement>(null);
  function close() {
    if (ref.current) ref.current.open = false;
  }
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (ref.current?.open && !ref.current.contains(event.target as Node))
        ref.current.open = false;
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && ref.current?.open) {
        ref.current.open = false;
        ref.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <details className="mobile-menu" ref={ref}>
      <summary aria-label="Abrir navegação">
        <Menu size={24} />
      </summary>
      <nav aria-label="Navegação móvel">
        <Link href="/leis" onClick={close}>
          Explorar leis
        </Link>
        <Link href="/guias" onClick={close}>
          Guias de leitura
        </Link>
        <Link href="/sobre" onClick={close}>
          Sobre o acervo
        </Link>
      </nav>
    </details>
  );
}
