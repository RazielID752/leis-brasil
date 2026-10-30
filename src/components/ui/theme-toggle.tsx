"use client";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
function subscribe(callback: () => void) {
  window.addEventListener("themechange", callback);
  return () => window.removeEventListener("themechange", callback);
}
export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme === "dark",
    () => false,
  );
  function toggle() {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("leisbrasil-theme", next);
    } catch {}
    window.dispatchEvent(new Event("themechange"));
  }
  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
      aria-pressed={dark}
    >
      <Sun size={17} />
      <span className="theme-track">
        <span />
      </span>
      <Moon size={17} />
    </button>
  );
}
