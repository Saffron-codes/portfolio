// Blog posts are Markdown files in src/posts/. Each starts with a front matter block
// (title, date, summary, tags, cover, coverAlt, optional draft) followed by the body.
// Dropping a new .md file in that folder is all it takes to publish; see src/posts/README.md.
const files = import.meta.glob(["../posts/*.md", "!../posts/README.md"], { as: "raw", eager: true });

const WORDS_PER_MINUTE = 220;

function unquote(value) {
  return value.replace(/^["']|["']$/g, "");
}

/** Minimal front matter: `key: value` lines; `[a, b]` becomes a list. */
function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      meta[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => unquote(item.trim()))
        .filter(Boolean);
    } else {
      meta[key] = unquote(value);
    }
  }
  return { meta, body: raw.slice(match[0].length) };
}

/** "2026-10-12-my-post.md" → "my-post". The date prefix keeps the folder sorted. */
function slugFromPath(path) {
  return path
    .split("/")
    .pop()
    .replace(/\.md$/, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function readingTime(body) {
  const words = body.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** "2026-10-12" → "12 October 2026". */
export function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const posts = Object.entries(files)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontMatter(raw);
    const slug = meta.slug || slugFromPath(path);
    return {
      slug,
      title: meta.title || slug,
      date: meta.date || "",
      summary: meta.summary || "",
      tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [],
      cover: meta.cover || null,
      coverAlt: meta.coverAlt || "",
      draft: meta.draft === "true",
      readingTime: readingTime(body),
      body,
    };
  })
  // Drafts show up in `npm run dev` only.
  .filter((post) => !post.draft || import.meta.env.DEV)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));

export default posts;

export function findPost(slug) {
  return posts.find((post) => post.slug === slug) ?? null;
}
