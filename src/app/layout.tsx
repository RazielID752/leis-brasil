import type { Metadata } from "next";
import { SiteHeader } from "@/components/ui/site-header";
import { SiteFooter } from "@/components/ui/site-footer";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "leisbrasil — Conheça as leis. Entenda seus direitos.",
    template: "%s | leisbrasil",
  },
  description:
    "Biblioteca pública da legislação brasileira. Explore leis, consulte fontes e entenda seus direitos com guias de leitura.",
};
const themeScript = `try{const t=localStorage.getItem('leisbrasil-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch{}`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
