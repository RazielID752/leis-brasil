const ROOTS = new Set([
  "federal",
  "estaduais",
  "municipais",
  "reguladores",
  "jurisprudencia",
  "tratados",
]);
export function validateDirectory(path: string): string {
  if (!path) return "";
  const parts = path.split("/");
  if (
    path.length > 450 ||
    parts.length > 9 ||
    !ROOTS.has(parts[0]) ||
    parts.some(
      (p) =>
        !p ||
        p === "." ||
        p === ".." ||
        p.startsWith("_") ||
        !/^[-\p{L}\p{N}_.]+$/u.test(p),
    )
  )
    throw new Error("Caminho remoto inválido");
  return path;
}
export function validateRemotePath(path: string): string {
  validateDirectory(path);
  if (
    !path.endsWith(".md") ||
    path.split("/").length < 2 ||
    /\/readme\.md$/i.test(path)
  )
    throw new Error("Arquivo remoto inválido");
  return path;
}
export function remoteId(path: string) {
  return `remoto-${Buffer.from(validateRemotePath(path)).toString("base64url")}`;
}
export function pathFromId(id: string): string | null {
  if (!/^remoto-[A-Za-z0-9_-]{1,600}$/.test(id)) return null;
  try {
    const path = Buffer.from(id.slice(7), "base64url").toString("utf8");
    validateRemotePath(path);
    return remoteId(path) === id ? path : null;
  } catch {
    return null;
  }
}
