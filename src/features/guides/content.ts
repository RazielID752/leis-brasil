import { readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
export function getConstitutionGuide() {
  const { data, content } = matter(
    readFileSync(join(process.cwd(), "content/guides/constituicao.md"), "utf8"),
  );
  return {
    title: String(data.title),
    description: String(data.description),
    status: String(data.status),
    content,
  };
}
