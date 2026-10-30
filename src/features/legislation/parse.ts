import matter from "gray-matter";
import { createHash } from "node:crypto";
import { resolve, sep, posix } from "node:path";
import type { LawDocument, Section, Sphere } from "./types";

export function safeContentPath(root: string, relative: string): string {
  if (
    relative.includes("\\") ||
    relative.startsWith("/") ||
    relative.split("/").includes("..")
  )
    throw new Error("Caminho inseguro");
  const full = resolve(root, relative);
  if (!full.startsWith(resolve(root) + sep))
    throw new Error("Caminho inseguro");
  return full;
}
const field = (value: unknown): string =>
  value instanceof Date
    ? value.toISOString().slice(0, 10)
    : typeof value === "string" || typeof value === "number"
      ? String(value)
      : "";
export function parseLaw(source: string, path: string): LawDocument {
  safeContentPath("/content", path);
  const { data, content } = matter(source);
  const constitution = path === "constituicao.md";
  if (!constitution && (!field(data.titulo) || !field(data.fonte)))
    throw new Error("Metadados obrigatórios ausentes");
  const group = path.split("/")[0];
  const spheres: Record<string, Sphere> = {
    estaduais: "Estadual",
    municipais: "Municipal",
    reguladores: "Reguladores",
    jurisprudencia: "Jurisprudência",
    tratados: "Tratados",
  };
  const date = field(data.data) || null;
  const title = constitution
    ? "Constituição Federal de 1988"
    : field(data.titulo);
  return {
    id: constitution
      ? "constituicao"
      : createHash("sha256").update(path).digest("hex").slice(0, 24),
    path: posix.normalize(path),
    title,
    description:
      field(data.ementa) ||
      (constitution
        ? "Constituição da República Federativa do Brasil de 1988."
        : "Ementa não informada na fonte."),
    type: field(data.tipo) || (constitution ? "Constituição" : "Norma"),
    number: field(data.numero),
    date,
    year: date?.slice(0, 4) || field(data.ano) || (constitution ? "1988" : ""),
    sphere: spheres[group] || "Federal",
    uf:
      field(data.uf) ||
      (group === "estaduais" || group === "municipais"
        ? path.split("/")[1]
        : ""),
    status: field(data.situacao) || null,
    source:
      field(data.fonte) ||
      (constitution
        ? "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
        : ""),
    collectedAt:
      field(data.baixado_em) ||
      (constitution
        ? content.match(/obtido em (\d{4}-\d{2}-\d{2})/)?.[1] || null
        : null),
    version: field(data.versao_texto) || null,
    body: content.trim(),
  };
}
export function buildSections(body: string): Section[] {
  const chunks = body.split(/\n(?=(?:#{1,4} |\*\*Art\.\s*\d|Art\.\s*\d))/);
  const seen = new Map<string, number>();
  return chunks
    .filter((c) => c.trim())
    .map((content, index) => {
      const line = content.trim().split("\n")[0];
      const article = line.match(/^(?:\*\*)?Art\.\s*(\d+[º°o]?(?:-[A-Z])?)/i);
      const title = article
        ? `Art. ${article[1]}`
        : line
            .replace(/^#+\s*/, "")
            .replace(/\*\*/g, "")
            .slice(0, 140);
      const base = article
        ? `art-${article[1].replace(/[º°]/g, "")}`
        : `secao-${index}`;
      const n = seen.get(base) || 0;
      seen.set(base, n + 1);
      return {
        id: n ? `${base}-${n + 1}` : base,
        title,
        content,
        isArticle: !!article,
      };
    });
}
