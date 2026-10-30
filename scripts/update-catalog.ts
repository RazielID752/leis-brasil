import { readFile, writeFile, rename } from "node:fs/promises";
import { createHash } from "node:crypto";
import { parseLaw } from "../src/features/legislation/parse";
import { createRemoteSource } from "../src/infrastructure/remote-source";
import { UPSTREAM } from "../src/infrastructure/upstream";
import type { CatalogLaw } from "../src/features/search/catalog-search";

const previous = JSON.parse(
  await readFile("content/catalog/laws.json", "utf8"),
) as CatalogLaw[];
const remote = createRemoteSource();
const updated: CatalogLaw[] = [];
for (const entry of previous) {
  const content =
    entry.id === "constituicao"
      ? await readFile("content/constituicao.md", "utf8")
      : (await remote.read(entry.path)).content;
  const { body: _, ...summary } = parseLaw(content, entry.path); // Only metadata is persisted; the remote text is discarded.
  void _;
  updated.push({ ...summary, keywords: entry.keywords });
}
const local = await readFile("content/constituicao.md");
await writeFile(
  "content/catalog/laws.json.pending",
  JSON.stringify(updated, null, 2) + "\n",
);
await writeFile(
  "content/catalog/source.json.pending",
  JSON.stringify(
    {
      repository: UPSTREAM.repository,
      commit: UPSTREAM.commit,
      catalog:
        "Seleção inicial de normas essenciais; não é índice nacional completo",
      constitution: {
        bytes: local.byteLength,
        sha256: createHash("sha256").update(local).digest("hex"),
      },
      remoteDocuments: updated.length - 1,
    },
    null,
    2,
  ) + "\n",
);
await rename("content/catalog/laws.json.pending", "content/catalog/laws.json");
await rename(
  "content/catalog/source.json.pending",
  "content/catalog/source.json",
);
console.log(
  `${updated.length} entradas atualizadas. Nenhum texto remoto persistido.`,
);
