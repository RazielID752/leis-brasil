import { readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { LegalMarkdown } from "@/features/legislation/markdown";
import { formatDate } from "@/lib/utils";
export function LegalNotice() {
  const { data, content } = matter(
    readFileSync(join(process.cwd(), "content/legal/aviso-legal.md"), "utf8"),
  );
  return (
    <section
      id="aviso-legal"
      aria-labelledby="legal-title"
      className="legal-notice"
    >
      <div className="legal-notice-heading">
        <h2 id="legal-title">Aviso legal e proposta do projeto</h2>
        <p>Última atualização: {formatDate(String(data.updatedAt))}</p>
      </div>
      <div className="prose legal-copy">
        <LegalMarkdown>{content}</LegalMarkdown>
      </div>
    </section>
  );
}
