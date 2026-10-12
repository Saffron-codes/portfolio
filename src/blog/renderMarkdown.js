// Markdown → HTML for our own (trusted) posts. Shared by the React view and the prerender script.
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
    // Ids only, no anchor links, so a heading never fights the app's routing.
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

export function renderMarkdown(source) {
  return marked.parse(source);
}
