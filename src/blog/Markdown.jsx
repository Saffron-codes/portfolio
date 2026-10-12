import { useMemo } from "react";
import { Marked } from "marked";

function slugify(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&[#\w]+;/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

const marked = new Marked({
  gfm: true,
  renderer: {
    // Ids only, no anchor links: an in-page "#heading" link would be read as a route by the app.
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      return `<h${depth} id="${slugify(text)}">${text}</h${depth}>\n`;
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//i.test(href);
      const attrs = [
        `href="${escapeAttr(href)}"`,
        title ? `title="${escapeAttr(title)}"` : "",
        external ? 'target="_blank" rel="noopener noreferrer"' : "",
      ]
        .filter(Boolean)
        .join(" ");
      return `<a ${attrs}>${text}</a>`;
    },
  },
});

/** Renders our own (trusted) Markdown to HTML with the blog prose styles. */
export default function Markdown({ source, className = "" }) {
  const html = useMemo(() => marked.parse(source), [source]);
  return <div className={`prose-blog ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
