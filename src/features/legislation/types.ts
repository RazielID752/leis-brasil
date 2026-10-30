export type Sphere =
  | "Federal"
  | "Estadual"
  | "Municipal"
  | "Reguladores"
  | "Jurisprudência"
  | "Tratados";
export interface LawSummary {
  id: string;
  path: string;
  title: string;
  description: string;
  type: string;
  number: string;
  date: string | null;
  year: string;
  sphere: Sphere;
  uf: string;
  status: string | null;
  source: string;
  collectedAt: string | null;
  version: string | null;
}
export interface LawDocument extends LawSummary {
  body: string;
  delivery?: "local" | "remote" | "cache" | "stale";
}
export interface SearchFilters {
  q?: string;
  sphere?: string;
  uf?: string;
  type?: string;
  year?: string;
  page?: number;
}
export interface SearchResult {
  items: LawSummary[];
  total: number;
  page: number;
  pageSize: number;
}
export interface LegislationRepository {
  search(filters: SearchFilters): SearchResult;
  find(id: string): Promise<LawDocument | null>;
}
export interface Section {
  id: string;
  title: string;
  content: string;
  isArticle: boolean;
}
