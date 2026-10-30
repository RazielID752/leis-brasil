import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { LegalMarkdown } from "../src/features/legislation/markdown";
test("Markdown jurídico não executa HTML ou links JavaScript", () => {
  const html = renderToStaticMarkup(
    LegalMarkdown({
      children:
        "<script>alert(1)</script>\n\n[clique](javascript:alert%281%29)\n\n![imagem](https://tracker.example/pixel)\n\n**Art. 1º** Texto preservado.",
    }),
  );
  assert.doesNotMatch(html, /<script|javascript:|<img|tracker\.example/);
  assert.match(html, /Texto preservado/);
});

test("título do Markdown não duplica o h1 da página de leitura", () => {
  const html = renderToStaticMarkup(
    LegalMarkdown({ children: "# Título da norma\n\nArt. 1º Texto" }),
  );
  assert.doesNotMatch(html, /<h1/);
  assert.match(html, /<h2>Título da norma<\/h2>/);
});
