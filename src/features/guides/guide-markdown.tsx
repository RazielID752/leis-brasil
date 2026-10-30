import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Info } from "lucide-react";
import { Children, isValidElement, type ReactNode } from "react";
import MermaidDiagram from "./mermaid-diagram";
function text(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? String(child)
        : isValidElement<{ children?: ReactNode }>(child)
          ? text(child.props.children)
          : "",
    )
    .join("");
}
export function GuideMarkdown({ content }: { content: string }) {
  return (
    <div className="prose">
      <Markdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          blockquote: ({ children }) => (
            <aside className="note-box">
              <Info size={20} />
              <div>{children}</div>
            </aside>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
          pre: ({ children }) => {
            const code = Children.toArray(children).find((c) =>
              isValidElement(c),
            );
            return isValidElement<{ className?: string }>(code) &&
              code.props.className === "language-mermaid" ? (
              <MermaidDiagram source={text(children)} />
            ) : (
              <pre>{children}</pre>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("https://") ? "_blank" : undefined}
              rel={
                href?.startsWith("https://") ? "noopener noreferrer" : undefined
              }
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
