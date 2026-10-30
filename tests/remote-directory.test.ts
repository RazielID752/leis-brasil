import { test } from "node:test";
import assert from "node:assert/strict";
import { createDirectoryBrowser } from "../src/infrastructure/remote-directory";

test("navegação lê apenas as pastas solicitadas e ignora arquivos auxiliares", async () => {
  const requested: string[] = [];
  const browser = createDirectoryBrowser({
    fetcher: async (url) => {
      const u = String(url);
      requested.push(u);
      return Response.json(
        u.endsWith("/" + "a".repeat(40))
          ? {
              tree: [
                {
                  path: "leis",
                  sha: "b".repeat(40),
                  type: "tree",
                  mode: "040000",
                },
                {
                  path: "README.md",
                  sha: "c".repeat(40),
                  type: "blob",
                  mode: "100644",
                },
              ],
            }
          : {
              tree: [
                {
                  path: "federal",
                  sha: "a".repeat(40),
                  type: "tree",
                  mode: "040000",
                },
                {
                  path: "_fonte",
                  sha: "d".repeat(40),
                  type: "tree",
                  mode: "040000",
                },
              ],
            },
      );
    },
  });
  const root = await browser.list("");
  assert.deepEqual(
    root.entries.map((e) => e.name),
    ["federal"],
  );
  const children = await browser.list("federal");
  assert.deepEqual(
    children.entries.map((e) => e.name),
    ["leis"],
  );
  assert.equal(requested.length, 2);
  await browser.list("federal");
  assert.equal(requested.length, 2);
  await assert.rejects(() => browser.list("../../etc"));
});
test("API indisponível não vira lista vazia e diretório ausente é distinguido", async () => {
  const failed = createDirectoryBrowser({
    fetcher: async () => new Response("", { status: 403 }),
  });
  await assert.rejects(() => failed.list(""), {
    name: "RemoteUnavailableError",
  });
  const empty = createDirectoryBrowser({
    fetcher: async () => Response.json({ tree: [] }),
  });
  await assert.rejects(() => empty.list("federal"), {
    name: "RemoteNotFoundError",
  });
});

test("árvore truncada não comprova inexistência de uma subpasta", async () => {
  const browser = createDirectoryBrowser({
    fetcher: async () => Response.json({ tree: [], truncated: true }),
  });
  await assert.rejects(() => browser.list("federal"), {
    name: "RemoteUnavailableError",
  });
});
