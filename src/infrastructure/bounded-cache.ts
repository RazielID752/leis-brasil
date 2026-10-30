interface Options {
  maxBytes: number;
  maxEntries: number;
  ttlMs: number;
  staleMs: number;
  now?: () => number;
}
interface Entry {
  value: string;
  bytes: number;
  freshUntil: number;
  expiresAt: number;
}
/** Process-local LRU. Fresh/stale entries share the same strict storage budget. */
export class BoundedCache {
  private entries = new Map<string, Entry>();
  private bytes = 0;
  private now: () => number;
  constructor(private options: Options) {
    this.now = options.now || Date.now;
  }
  private remove(key: string) {
    const entry = this.entries.get(key);
    if (entry) {
      this.bytes -= entry.bytes;
      this.entries.delete(key);
    }
  }
  private prune() {
    for (const [key, entry] of this.entries)
      if (entry.expiresAt <= this.now()) this.remove(key);
  }
  get(
    key: string,
    allowStale = false,
  ): { value: string; stale: boolean } | null {
    this.prune();
    const entry = this.entries.get(key);
    if (!entry) return null;
    const stale = entry.freshUntil <= this.now();
    if (stale && !allowStale) return null;
    this.entries.delete(key);
    this.entries.set(key, entry);
    return { value: entry.value, stale };
  }
  set(key: string, value: string) {
    this.prune();
    const bytes = Buffer.byteLength(value, "utf8");
    if (bytes > this.options.maxBytes) return;
    this.remove(key);
    while (
      this.entries.size >= this.options.maxEntries ||
      this.bytes + bytes > this.options.maxBytes
    ) {
      const first = this.entries.keys().next().value;
      if (first === undefined) break;
      this.remove(first);
    }
    this.entries.set(key, {
      value,
      bytes,
      freshUntil: this.now() + this.options.ttlMs,
      expiresAt: this.now() + this.options.ttlMs + this.options.staleMs,
    });
    this.bytes += bytes;
  }
  get stats() {
    this.prune();
    return { entries: this.entries.size, bytes: this.bytes };
  }
}
