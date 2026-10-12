// Blog posts are Markdown files in src/posts/. Each starts with a front matter block
// (title, date, summary, description, tags, cover, coverAlt, optional draft) followed by
// the body. Dropping a new .md file in that folder is all it takes to publish; see
// src/posts/README.md. The same files are prerendered to static HTML by scripts/prerender.mjs.
import { parsePost, sortPosts } from "./parsePost";

export { formatDate } from "./parsePost";

const files = import.meta.glob(["../posts/*.md", "!../posts/README.md"], { as: "raw", eager: true });

const posts = sortPosts(
  Object.entries(files)
    .map(([path, raw]) => parsePost(path, raw))
    // Drafts show up in `npm run dev` only.
    .filter((post) => !post.draft || import.meta.env.DEV),
);

export default posts;

export function findPost(slug) {
  return posts.find((post) => post.slug === slug) ?? null;
}
