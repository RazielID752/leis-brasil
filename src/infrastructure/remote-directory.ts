import { BoundedCache } from "./bounded-cache";
import { UPSTREAM } from "./upstream";
import {
  readLimited,
  RemoteUnavailableError,
  RemoteNotFoundError,
} from "./remote-source";
import {
  validateDirectory,
  validateRemotePath,
} from "../features/legislation/remote-path";
interface TreeEntry {
  path: string;
  sha: string;
  type: "tree" | "blob";
  mode: string;
}
interface Tree {
  tree: TreeEntry[];
  truncated?: boolean;
}
export interface DirectoryEntry {
  name: string;
  path: string;
  directory: boolean;
}
export function createDirectoryBrowser({
  fetcher = fetch,
}: { fetcher?: typeof fetch } = {}) {
  const cache = new BoundedCache({
    maxBytes: 4 * 1024 * 1024,
    maxEntries: 128,
    ttlMs: 24 * 60 * 60 * 1000,
    staleMs: 24 * 60 * 60 * 1000,
  });
  const pending = new Map<string, Promise<Tree>>();
  async function tree(sha: string): Promise<Tree> {
    const hit = cache.get(sha);
    if (hit) return JSON.parse(hit.value);
    const existing = pending.get(sha);
    if (existing) return existing;
    if (pending.size >= 4) {
      const stale = cache.get(sha, true);
      if (stale) return JSON.parse(stale.value);
      throw new RemoteUnavailableError();
    }
    const promise = (async () => {
      try {
        const response = await fetcher(
          `https://api.github.com/repos/${UPSTREAM.owner}/${UPSTREAM.repo}/git/trees/${sha}`,
          {
            headers: { Accept: "application/vnd.github+json" },
            cache: "no-store",
            signal: AbortSignal.timeout(10000),
            redirect: "error",
          },
        );
        if (!response.ok) throw new RemoteUnavailableError();
        const text = await readLimited(response, 4 * 1024 * 1024);
        const data: Tree = JSON.parse(text);
        if (
          !Array.isArray(data.tree) ||
          !data.tree.every(
            (e) => typeof e.path === "string" && /^[a-f0-9]{40}$/.test(e.sha),
          )
        )
          throw new RemoteUnavailableError();
        cache.set(sha, text);
        return data;
      } catch (error) {
        const stale = cache.get(sha, true);
        if (stale) return JSON.parse(stale.value);
        if (error instanceof RemoteUnavailableError) throw error;
        throw new RemoteUnavailableError();
      } finally {
        pending.delete(sha);
      }
    })();
    pending.set(sha, promise);
    return promise;
  }
  return {
    async list(
      path: string,
    ): Promise<{ entries: DirectoryEntry[]; truncated: boolean }> {
      validateDirectory(path);
      let current = await tree(UPSTREAM.commit);
      for (const segment of path.split("/").filter(Boolean)) {
        const node = current.tree.find(
          (e) => e.path === segment && e.type === "tree",
        );
        if (!node) {
          if (current.truncated)
            throw new RemoteUnavailableError(
              "A origem retornou uma listagem incompleta.",
            );
          throw new RemoteNotFoundError();
        }
        current = await tree(node.sha);
      }
      const entries: DirectoryEntry[] = [];
      for (const entry of current.tree) {
        const full = [path, entry.path].filter(Boolean).join("/");
        try {
          if (entry.type === "tree") {
            validateDirectory(full);
            entries.push({ name: entry.path, path: full, directory: true });
          } else if (entry.type === "blob" && entry.mode === "100644") {
            validateRemotePath(full);
            entries.push({ name: entry.path, path: full, directory: false });
          }
        } catch {
          /* Auxiliary files are deliberately not part of the legal library. */
        }
      }
      entries.sort(
        (a, b) =>
          Number(b.directory) - Number(a.directory) ||
          a.name.localeCompare(b.name, "pt-BR", { numeric: true }),
      );
      return { entries, truncated: !!current.truncated };
    },
  };
}
export const remoteDirectory = createDirectoryBrowser();
