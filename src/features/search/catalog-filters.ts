export interface CatalogFilters {
  q?: string;
  sphere?: string;
  uf?: string;
  type?: string;
  year?: string;
}
export function catalogUrl(
  current: CatalogFilters,
  changes: Partial<CatalogFilters> = {},
): string {
  const params = new URLSearchParams();
  const merged = { ...current, ...changes };
  for (const key of ["q", "sphere", "uf", "type", "year"] as const)
    if (merged[key]) params.set(key, merged[key]!);
  return `/leis${params.size ? `?${params}` : ""}`;
}
