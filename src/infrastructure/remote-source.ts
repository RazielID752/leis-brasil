import { BoundedCache } from "./bounded-cache";
import { UPSTREAM, CACHE_POLICY } from "./upstream";
import { validateRemotePath } from "../features/legislation/remote-path";
export class RemoteUnavailableError extends Error {
  constructor(message = "Não foi possível consultar o repositório agora.") {
    super(message);
    this.name = "RemoteUnavailableError";
  }
}
export class RemoteNotFoundError extends Error {
  constructor() {
    super("Documento não encontrado na versão consultada.");
    this.name = "RemoteNotFoundError";
  }
}
export async function readLimited(
  response: Response,
  maxBytes: number,
): Promise<string> {
  if (Number(response.headers.get("content-length")) > maxBytes)
    throw new RemoteUnavailableError("Documento acima do limite de leitura.");
  if (!response.body) throw new RemoteUnavailableError();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        throw new RemoteUnavailableError(
          "Documento acima do limite de leitura.",
        );
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, bytes).toString("utf8");
}
interface Options {
  cache?: BoundedCache;
  fetcher?: typeof fetch;
  maxDocumentBytes?: number;
}
export function createRemoteSource(options: Options = {}) {
  const cache = options.cache || new BoundedCache(CACHE_POLICY);
  const fetcher = options.fetcher || fetch;
  const pending = new Map<
    string,
    Promise<{ content: string; delivery: "remote" | "cache" | "stale" }>
  >();
  return {
    async read(
      path: string,
    ): Promise<{ content: string; delivery: "remote" | "cache" | "stale" }> {
      validateRemotePath(path);
      const key = `${UPSTREAM.commit}/${path}`;
      const hit = cache.get(key);
      if (hit) return { content: hit.value, delivery: "cache" };
      const existing = pending.get(key);
      if (existing) return existing;
      if (pending.size >= 8) {
        const stale = cache.get(key, true);
        if (stale) return { content: stale.value, delivery: "stale" };
        throw new RemoteUnavailableError(
          "Muitas consultas simultâneas. Tente novamente em instantes.",
        );
      }
      const request = (async () => {
        try {
          const response = await fetcher(
            `https://raw.githubusercontent.com/${UPSTREAM.owner}/${UPSTREAM.repo}/${UPSTREAM.commit}/${path.split("/").map(encodeURIComponent).join("/")}`,
            {
              cache: "no-store",
              redirect: "error",
              signal: AbortSignal.timeout(12000),
            },
          );
          if (response.status === 404) throw new RemoteNotFoundError();
          if (!response.ok) throw new RemoteUnavailableError();
          const content = await readLimited(
            response,
            options.maxDocumentBytes || 8 * 1024 * 1024,
          );
          if (!/^---\r?\n/.test(content))
            throw new RemoteUnavailableError(
              "Formato inesperado na fonte remota.",
            );
          cache.set(key, content);
          return { content, delivery: "remote" as const };
        } catch (error) {
          const stale = cache.get(key, true);
          if (stale)
            return { content: stale.value, delivery: "stale" as const };
          if (
            error instanceof RemoteNotFoundError ||
            error instanceof RemoteUnavailableError
          )
            throw error;
          throw new RemoteUnavailableError();
        } finally {
          pending.delete(key);
        }
      })();
      pending.set(key, request);
      return request;
    },
  };
}
export const remoteSource = createRemoteSource();
