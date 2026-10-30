import { test } from "node:test";
import assert from "node:assert/strict";
import { catalogUrl } from "../src/features/search/catalog-filters";
test("alterar um filtro preserva busca e outros filtros, reiniciando paginação", () => {
  const url = catalogUrl(
    { q: "direitos & saúde", type: "Lei Ordinária", year: "1990" },
    { year: "2002" },
  );
  const params = new URL(url, "https://example.test").searchParams;
  assert.equal(params.get("q"), "direitos & saúde");
  assert.equal(params.get("year"), "2002");
  assert.equal(params.get("type"), "Lei Ordinária");
  assert.equal(params.has("page"), false);
});
test("limpar filtros mantém o termo da busca e omite parâmetros vazios", () => {
  assert.equal(
    catalogUrl(
      { q: "consumidor", type: "Lei Ordinária", year: "1990" },
      { type: "", year: "" },
    ),
    "/leis?q=consumidor",
  );
  assert.equal(catalogUrl({ q: "" }), "/leis");
});
