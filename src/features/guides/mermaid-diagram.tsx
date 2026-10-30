"use client";
import { useId, useRef, useState } from "react";
import { GitBranch } from "lucide-react";
export default function MermaidDiagram({ source }: { source: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  async function show() {
    setState("loading");
    try {
      const { default: mermaid } = await import("mermaid");
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        themeVariables: {
          primaryColor: "#e7eee2",
          primaryTextColor: "#163b2a",
          primaryBorderColor: "#96b49b",
          lineColor: "#527b60",
          fontFamily: "Arial",
          fontSize: "15px",
        },
        flowchart: { htmlLabels: false },
      });
      const { svg } = await mermaid.render(`diagram${id}`, source);
      if (ref.current) ref.current.innerHTML = svg;
      setState("ready");
    } catch {
      setState("error");
    }
  }
  return (
    <div className="diagram-panel">
      <div className="mb-3 flex items-center gap-2 text-xs text-accent">
        <GitBranch size={16} />
        Mapa visual · estrutura do texto
      </div>
      {state !== "ready" ? (
        <button
          onClick={show}
          disabled={state === "loading"}
          className="button-secondary"
        >
          {state === "loading"
            ? "Carregando diagrama…"
            : state === "error"
              ? "Tentar exibir novamente"
              : "Exibir diagrama"}
        </button>
      ) : null}
      <div
        ref={ref}
        aria-label="Diagrama da hierarquia da Constituição"
        role="img"
      />
      {state !== "ready" ? (
        <pre className="text-xs whitespace-pre-wrap text-foreground">
          {source}
        </pre>
      ) : null}
      {state === "error" ? (
        <p role="status" className="text-xs">
          Não foi possível renderizar o diagrama. A estrutura em texto está
          disponível acima.
        </p>
      ) : null}
    </div>
  );
}
