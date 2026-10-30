"use client";
import { useState } from "react";
import { Copy, Check, Type } from "lucide-react";
export function ReadingControls() {
  const [size, setSize] = useState(18);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  function resize(delta: number) {
    const next = Math.max(15, Math.min(25, size + delta));
    setSize(next);
    document.documentElement.style.setProperty("--reading-size", `${next}px`);
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(true);
    }
  }
  return (
    <div className="reader-controls">
      <Type size={15} />
      <span className="sr-only">Tamanho do texto</span>
      <button
        onClick={() => resize(-1)}
        disabled={size === 15}
        aria-label="Diminuir tamanho do texto"
      >
        A−
      </button>
      <button
        onClick={() => resize(1)}
        disabled={size === 25}
        aria-label="Aumentar tamanho do texto"
      >
        A+
      </button>
      <button onClick={share} className="inline-flex items-center gap-1">
        {copied ? <Check size={13} /> : <Copy size={13} />}
        <span>{copied ? "Copiado" : "Copiar link"}</span>
      </button>
      <span role="status" className="sr-only">
        {error
          ? "Não foi possível copiar. Copie o endereço do navegador."
          : copied
            ? "Link copiado."
            : ""}
      </span>
    </div>
  );
}
