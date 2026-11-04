import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  a: ({ href, children }) => {
    const external = typeof href === "string" && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th
      scope="col"
      className="border border-white/10 bg-white/5 px-3 py-2 font-medium text-neutral-200"
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-white/10 px-3 py-2 align-top text-neutral-400">
      {children}
    </td>
  ),
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose-dark">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
