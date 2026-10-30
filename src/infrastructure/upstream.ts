export const UPSTREAM = {
  repository: "https://github.com/ctresb/leis",
  owner: "ctresb",
  repo: "leis",
  commit: "2dac3a272eed1121f8dc38aab80fe563d713656d",
} as const;
export const CACHE_POLICY = {
  maxBytes: 16 * 1024 * 1024,
  maxEntries: 128,
  ttlMs: 6 * 60 * 60 * 1000,
  staleMs: 7 * 24 * 60 * 60 * 1000,
};
