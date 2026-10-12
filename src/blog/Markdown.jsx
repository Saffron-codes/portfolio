import { useMemo } from "react";
import { renderMarkdown } from "./renderMarkdown";

/** Renders our own (trusted) Markdown to HTML with the blog prose styles. */
export default function Markdown({ source, className = "" }) {
  const html = useMemo(() => renderMarkdown(source), [source]);
  return <div className={`prose-blog ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
