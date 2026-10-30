import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseLaw,
  safeContentPath,
  buildSections,
} from "../src/features/legislation/parse";

const source = `---
titulo: "Lei nº 8.078 de 11/09/1990"
tipo: "Lei Ordinária"
numero: "8078"
data: 1990-09-11
ementa: "Dispõe sobre a proteção do consumidor."
fonte: "https://www.planalto.gov.br/ccivil_03/leis/l8078.htm"
---
# Código de Defesa do Consumidor

**Art. 1º** O presente código estabelece normas de proteção.

**Art. 2º** Consumidor é toda pessoa física ou jurídica.
`;

test("preserva metadados sem presumir vigência e gera identidade estável", () => {
  const law = parseLaw(source, "federal/leis-ordinarias/1990/8078.md");
  assert.equal(law.title, "Lei nº 8.078 de 11/09/1990");
  assert.equal(law.date, "1990-09-11");
  assert.equal(law.status, null);
  assert.equal(law.sphere, "Federal");
  assert.equal(law.id, parseLaw(source, law.path).id);
  assert.match(law.body, /Art\. 2º/);
});
test("Constituição sem YAML tem proveniência explícita e artigos únicos", () => {
  const law = parseLaw(
    "# Constituição\n\n> Fonte: [Planalto](https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm), obtido em 2026-10-20.\n\n**Art. 1º** Texto\n\n## ADCT\n\n**Art. 1º** Transitório",
    "constituicao.md",
  );
  assert.equal(law.id, "constituicao");
  assert.match(law.source, /planalto/);
  assert.equal(law.collectedAt, "2026-10-20");
  const sections = buildSections(law.body);
  assert.equal(new Set(sections.map((s) => s.id)).size, sections.length);
});
test("rejeita caminho inseguro e metadados incompletos fora da Constituição", () => {
  assert.throws(() => safeContentPath("/tmp/content", "../../etc/passwd"));
  assert.throws(() => parseLaw("sem metadados", "federal/invalido.md"));
});

test("identifica artigos no texto sem confundir referências no meio de parágrafos", () => {
  const sections = buildSections(
    "# Lei\n\n**Art. 1º** Regra do artigo 2º.\n\nParágrafo único. Detalhe.\n\n**Art. 2º** Outra regra.",
  );
  assert.equal(sections.filter((s) => s.isArticle).length, 2);
  assert.match(
    sections.find((s) => s.id === "art-1")!.content,
    /Parágrafo único/,
  );
});
