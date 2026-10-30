import type {
  LawSummary,
  SearchFilters,
  SearchResult,
} from "../legislation/types";
export type CatalogLaw = LawSummary & { keywords?: string[] };
export const normalizeSearch = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/(\d)[.,](?=\d)/g, "$1");
export function searchCatalog(
  catalog: CatalogLaw[],
  filters: SearchFilters,
): SearchResult {
  const q = filters.q?.trim() || "";
  const tokens =
    normalizeSearch(q.slice(0, 200)).match(/[\p{L}\p{N}]+/gu) || [];
  const items = catalog.filter((law) => {
    if (q && !tokens.length) return false;
    for (const key of ["sphere", "uf", "type", "year"] as const)
      if (filters[key] && filters[key] !== law[key]) return false;
    const text = normalizeSearch(
      [law.title, law.description, law.number, ...(law.keywords || [])].join(
        " ",
      ),
    );
    return tokens.every((token) => text.includes(token));
  });
  const pageSize = 20;
  const total = items.length;
  const page = Math.min(
    Math.max(1, Math.floor(Number(filters.page) || 1)),
    Math.max(1, Math.ceil(total / pageSize)),
  );
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    total,
    page,
    pageSize,
  };
}
