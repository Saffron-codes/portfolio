// Pure helpers shared by the app (src/blog/posts.js) and the build-time prerender
// script (scripts/prerender.mjs). No Vite, React or DOM here.

const WORDS_PER_MINUTE = 220;
const DESCRIPTION_LIMIT = 155;

function unquote(value) {
  return value.replace(/^["']|["']$/g, "");
}

/** Minimal front matter: `key: value` lines; `[a, b]` becomes a list. */
export function parseFrontMatter(raw) {
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
export function slugFromPath(path) {
  return path
    .split("/")
    .pop()
    .replace(/\.md$/, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

export function readingTime(body) {
  const words = body.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Meta description: the explicit `description`, else the summary cut at a word boundary. */
function describe(meta) {
  if (meta.description) return meta.description;
  const summary = (meta.summary || "").replace(/\s+/g, " ").trim();
  if (summary.length <= DESCRIPTION_LIMIT) return summary;
  const cut = summary.slice(0, DESCRIPTION_LIMIT - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 80))}…`;
}

/** "2026-10-12" → "12 October 2026". */
export function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function parsePost(path, raw) {
  const { meta, body } = parseFrontMatter(raw);
  const slug = meta.slug || slugFromPath(path);
  return {
    slug,
    title: meta.title || slug,
    date: meta.date || "",
    updated: meta.updated || meta.date || "",
    summary: meta.summary || "",
    description: describe(meta),
    tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [],
    cover: meta.cover || null,
    coverAlt: meta.coverAlt || "",
    draft: meta.draft === "true",
    readingTime: readingTime(body),
    body,
  };
}

/** Newest first, then by title. */
export function sortPosts(posts) {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}
