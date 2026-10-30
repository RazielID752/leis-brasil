import { ArrowRight, Search } from "lucide-react";
export function SearchForm({
  defaultValue = "",
  compact = false,
}: {
  defaultValue?: string;
  compact?: boolean;
}) {
  return (
    <form
      action="/leis"
      className={`search-form ${compact ? "search-compact" : ""}`}
      role="search"
    >
      <Search size={23} aria-hidden="true" />
      <label htmlFor="law-search" className="sr-only">
        Buscar por título, número ou ementa
      </label>
      <input
        id="law-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Buscar leis, números, assuntos ou palavras-chave…"
        maxLength={200}
      />
      <button type="submit" className="button-primary">
        Buscar <ArrowRight size={19} />
      </button>
    </form>
  );
}
