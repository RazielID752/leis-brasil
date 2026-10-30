"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SlidersHorizontal, X, ChevronDown, LoaderCircle } from "lucide-react";
import { catalogUrl, type CatalogFilters } from "./catalog-filters";
interface Facets {
  types: { value: string; count: number }[];
  years: string[];
  ufs: string[];
  spheres: string[];
}
export function FilterBar({
  filters,
  facets,
}: {
  filters: CatalogFilters;
  facets: Facets;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const active = Object.entries(filters).filter(
    ([key, value]) => key !== "q" && !!value,
  ) as [keyof CatalogFilters, string][];
  function change(key: keyof CatalogFilters, value: string) {
    startTransition(() =>
      router.push(catalogUrl(filters, { [key]: value }), { scroll: false }),
    );
  }
  const options = [
    ...(facets.spheres.length > 1
      ? [
          {
            key: "sphere" as const,
            label: "Esfera",
            all: "Todas",
            values: facets.spheres,
          },
        ]
      : []),
    ...(facets.ufs.length
      ? [
          {
            key: "uf" as const,
            label: "Estado",
            all: "Todos",
            values: facets.ufs,
          },
        ]
      : []),
    {
      key: "type" as const,
      label: "Tipo",
      all: "Todos",
      values: facets.types.map((t) => t.value),
    },
    { key: "year" as const, label: "Ano", all: "Todos", values: facets.years },
  ];
  return (
    <div className="catalog-filters" aria-busy={pending}>
      <div className="filter-bar">
        <span className="filter-bar-label">
          <SlidersHorizontal size={17} />
          Filtrar por
        </span>
        <div className="filter-selects">
          {options
            .filter((o) => o.values.length > 1)
            .map((option) => (
              <label className="compact-filter" key={option.key}>
                <span>{option.label}</span>
                <select
                  aria-label={`Filtrar por ${option.label.toLowerCase()}`}
                  value={filters[option.key] || ""}
                  onChange={(e) => change(option.key, e.target.value)}
                  disabled={pending}
                >
                  <option value="">{option.all}</option>
                  {option.values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} aria-hidden="true" />
              </label>
            ))}
        </div>
        {active.length ? (
          <Link
            className="reset-filters"
            href={catalogUrl({ q: filters.q })}
            scroll={false}
          >
            Limpar filtros
          </Link>
        ) : null}
        <span className="filter-progress" role="status">
          {pending ? (
            <>
              <LoaderCircle size={14} className="animate-spin" />
              Atualizando…
            </>
          ) : null}
        </span>
      </div>
      {active.length ? (
        <div className="active-filters" aria-label="Filtros aplicados">
          {active.map(([key, value]) => (
            <Link
              key={key}
              href={catalogUrl(filters, { [key]: "" })}
              scroll={false}
              aria-label={`Remover filtro ${value}`}
            >
              {value}
              <X size={13} />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
