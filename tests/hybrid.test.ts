import { test } from "node:test";
import assert from "node:assert/strict";
import { BoundedCache } from "../src/infrastructure/bounded-cache";
import {
  remoteId,
  pathFromId,
  validateRemotePath,
} from "../src/features/legislation/remote-path";
import { createRemoteSource } from "../src/infrastructure/remote-source";
import { searchCatalog } from "../src/features/search/catalog-search";
import { parseLaw } from "../src/features/legislation/parse";
const path = "federal/leis-ordinarias/1990/lei-8078-1990-09-11.md";
const text =
  '---\ntitulo: "Lei 8078"\nfonte: "https://www.planalto.gov.br/ccivil_03/leis/l8078.htm"\nementa: "Proteção do consumidor"\nnumero: "8078"\n---\n# Lei\n\nTexto original';
test("identidade remota preserva caminho e rejeita fuga/URL e arquivos auxiliares", () => {
  assert.equal(pathFromId(remoteId(path)), path);
  for (const p of [
    "../../etc/passwd",
    "https://example.com/a.md",
    "federal/../a.md",
    "federal/_fonte/a.md",
    "federal/a.json",
    "federal/%2e%2e/a.md",
  ])
    assert.throws(() => validateRemotePath(p));
  assert.equal(pathFromId("hash-inexistente"), null);
});
test("cache limita bytes/entradas, remove LRU e expira sem crescimento indefinido", () => {
  let now = 0;
  const c = new BoundedCache({
    maxBytes: 8,
    maxEntries: 2,
    ttlMs: 10,
    staleMs: 20,
    now: () => now,
  });
  c.set("a", "1234");
  c.set("b", "5678");
  c.get("a");
  c.set("c", "90");
  assert.equal(c.get("b"), null);
  assert.equal(c.stats.bytes, 6);
  now = 11;
  assert.equal(c.get("a"), null);
  assert.equal(c.get("a", true)?.value, "1234");
  now = 31;
  assert.equal(c.get("a", true), null);
  assert.equal(c.stats.entries, 0);
  c.set("huge", "123456789");
  assert.equal(c.stats.entries, 0);
});
test("fonte remota usa commit fixo, reutiliza cache e serve cópia expirada em falha", async () => {
  let now = 0;
  let failed = false;
  const urls: string[] = [];
  const cache = new BoundedCache({
    maxBytes: 20000,
    maxEntries: 4,
    ttlMs: 10,
    staleMs: 100,
    now: () => now,
  });
  const remote = createRemoteSource({
    cache,
    fetcher: async (url) => {
      urls.push(String(url));
      if (failed) throw new Error("offline");
      return new Response(text);
    },
  });
  assert.equal((await remote.read(path)).content, text);
  assert.equal((await remote.read(path)).delivery, "cache");
  assert.equal(urls.length, 1);
  assert.match(urls[0], /2dac3a272eed1121f8dc38aab80fe563d713656d/);
  now = 11;
  failed = true;
  assert.equal((await remote.read(path)).delivery, "stale");
  now = 111;
  await assert.rejects(() => remote.read(path));
});
test("resposta remota 404 é ausência, e resposta grande não é armazenada", async () => {
  const remote = createRemoteSource({
    fetcher: async () => new Response("missing", { status: 404 }),
  });
  await assert.rejects(() => remote.read(path), {
    name: "RemoteNotFoundError",
  });
  const big = createRemoteSource({
    fetcher: async () => new Response("x".repeat(1025)),
    maxDocumentBytes: 1024,
  });
  await assert.rejects(() => big.read(path), /limite/);
});
test("busca de catálogo funciona offline, normaliza acentos/número pontuado e filtros", () => {
  const law = {
    ...parseLaw(text, path),
    keywords: ["Código de Defesa do Consumidor"],
  };
  assert.equal(searchCatalog([law], { q: "8.078" }).total, 1);
  assert.equal(searchCatalog([law], { q: "codigo consumidor" }).total, 1);
  assert.equal(
    searchCatalog([law], { q: "consumidor", sphere: "Estadual" }).total,
    0,
  );
  assert.equal(searchCatalog([law], { q: '* : "' }).total, 0);
});

test("Constituição local abre com rede desativada e corresponde ao hash registrado", async () => {
  const { findLaw } = await import("../src/infrastructure/legislation");
  const { readFileSync } = await import("node:fs");
  const { createHash } = await import("node:crypto");
  const source = JSON.parse(
    readFileSync("content/catalog/source.json", "utf8"),
  );
  const bytes = readFileSync("content/constituicao.md");
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    source.constitution.sha256,
  );
  const fetcher = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("Rede desativada");
  };
  try {
    const law = await findLaw("constituicao");
    assert.equal(law?.delivery, "local");
    assert.match(law!.body, /Art\. 5º/);
  } finally {
    globalThis.fetch = fetcher;
  }
});

test("cache expirado continua acessível quando todos os downloads estão ocupados", async () => {
  const { UPSTREAM } = await import("../src/infrastructure/upstream");
  let now = 0;
  const cache = new BoundedCache({
    maxBytes: 100000,
    maxEntries: 20,
    ttlMs: 10,
    staleMs: 100,
    now: () => now,
  });
  cache.set(`${UPSTREAM.commit}/${path}`, text);
  now = 11;
  const release: (() => void)[] = [];
  const remote = createRemoteSource({
    cache,
    fetcher: async () => {
      await new Promise<void>((resolve) => release.push(resolve));
      return new Response(text);
    },
  });
  const requests = Array.from({ length: 8 }, (_, i) =>
    remote.read(`federal/leis-ordinarias/1990/lei-${i}-1990-01-01.md`),
  );
  try {
    assert.equal((await remote.read(path)).delivery, "stale");
  } finally {
    release.forEach((resolve) => resolve());
    await Promise.all(requests);
  }
});
