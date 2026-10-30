import { mkdirSync, writeFileSync, createReadStream } from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
const destination = resolve(
  process.argv[2] || "/private/tmp/leisbrasil-backups",
);
mkdirSync(destination, { recursive: true });
const name = `leisbrasil-local-${new Date().toISOString().replace(/[:.]/g, "-")}.tar.gz`;
const archive = join(destination, name);
const result = spawnSync("tar", ["-czf", archive, "content", "docs/legal"], {
  stdio: "inherit",
});
if (result.status !== 0) throw new Error("Backup não foi criado");
const hash = createHash("sha256");
for await (const chunk of createReadStream(archive)) hash.update(chunk);
const digest = hash.digest("hex");
writeFileSync(`${archive}.sha256`, `${digest}  ${name}\n`);
console.log(
  JSON.stringify({
    archive,
    sha256: digest,
    includes:
      "Constituição, guias e catálogo locais. Não contém acervo remoto.",
  }),
);
