import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import laws from "../../content/catalog/laws.json";
import source from "../../content/catalog/source.json";
import { parseLaw } from "../features/legislation/parse";
import { pathFromId } from "../features/legislation/remote-path";
import {
  searchCatalog,
  type CatalogLaw,
} from "../features/search/catalog-search";
import {
  remoteSource,
  RemoteNotFoundError,
  RemoteUnavailableError,
} from "./remote-source";
import type {
  LegislationRepository,
  LawDocument,
} from "../features/legislation/types";
const catalog = laws as CatalogLaw[];
export const findLaw = cache(
  async (id: string): Promise<LawDocument | null> => {
    if (id === "constituicao")
      return {
        ...parseLaw(
          readFileSync(join(process.cwd(), "content/constituicao.md"), "utf8"),
          "constituicao.md",
        ),
        delivery: "local",
      };
    const path = catalog.find((law) => law.id === id)?.path || pathFromId(id);
    if (!path) return null;
    try {
      const { content, delivery } = await remoteSource.read(path);
      return { ...parseLaw(content, path), delivery };
    } catch (error) {
      if (error instanceof RemoteNotFoundError) return null;
      if (error instanceof RemoteUnavailableError) throw error;
      throw new RemoteUnavailableError(
        "Não foi possível interpretar o texto remoto.",
      );
    }
  },
);
export const legislation: LegislationRepository = {
  search: (filters) => searchCatalog(catalog, filters),
  find: findLaw,
};
export function getFacets() {
  return {
    total: catalog.length,
    years: [...new Set(catalog.map((l) => l.year).filter(Boolean))]
      .sort()
      .reverse(),
    spheres: [...new Set(catalog.map((l) => l.sphere))],
    types: [...new Set(catalog.map((l) => l.type))].map((value) => ({
      value,
      count: catalog.filter((l) => l.type === value).length,
    })),
    ufs: [...new Set(catalog.map((l) => l.uf).filter(Boolean))].sort(),
  };
}
export function getCoverage() {
  return {
    ...source,
    catalogCount: catalog.length,
    localDocuments: 1,
    constitutionCollectedAt:
      catalog.find((l) => l.id === "constituicao")?.collectedAt || null,
  };
}
export function getCatalogLawByPath(path: string) {
  return catalog.find((law) => law.path === path);
}
