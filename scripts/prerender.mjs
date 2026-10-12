// Runs after `vite build`. For every blog post it writes a static HTML page with that post's
// SEO tags (title, description, canonical, Open Graph, Twitter, JSON-LD) and the rendered
// article, so crawlers and link previews see the right thing without running JavaScript.
// Also writes the blog index page, sitemap.xml, robots.txt and an RSS feed.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import profile from "../src/data/profile.js";
import { formatDate, parsePost, sortPosts } from "../src/blog/parsePost.js";
import { renderMarkdown } from "../src/blog/renderMarkdown.js";
import { BLOG_PATH, SITE_URL, absoluteUrl, headTags, indexMeta, jsonLd, postMeta, postPath, serializeHeadTags } from "../src/blog/seo.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const postsDir = resolve(root, "src/posts");

const template = readFileSync(resolve(dist, "index.html"), "utf8");
const SEO_BLOCK = /<!-- seo:start[^>]*-->[\s\S]*?<!-- seo:end -->/;
if (!SEO_BLOCK.test(template) || !template.includes('<div id="root"></div>')) {
  throw new Error("index.html needs the <!-- seo:start --> … <!-- seo:end --> markers and an empty #root.");
}

const posts = sortPosts(
  readdirSync(postsDir)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => parsePost(file, readFileSync(resolve(postsDir, file), "utf8")))
    .filter((post) => !post.draft),
);

const escape = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function page(meta, structuredData, body) {
  const head = `${serializeHeadTags(headTags(meta))}\n    <script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, "\\u003c")}</script>`;
  return template
    .replace(SEO_BLOCK, `<!-- seo:start -->\n    ${head}\n    <!-- seo:end -->`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

// Markup that mirrors BlogView closely enough that the switch to React is not a visible jump.
const shell = (inner) =>
  `<div class="portfolio-page relative min-h-screen overflow-x-clip bg-cream text-ink dark:bg-night-900 dark:text-cream"><main class="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">${inner}</main></div>`;
const eyebrow = '<p class="text-xs font-semibold uppercase tracking-[0.25em] text-sage-700 dark:text-sage-300">Blog</p>';
const tagList = (tags) =>
  tags.length
    ? `<ul class="mt-5 flex flex-wrap gap-1.5" aria-label="Tags">${tags.map((tag) => `<li class="rounded-md bg-sage-400/20 px-2 py-0.5 text-xs font-medium text-sage-700 dark:bg-sage-600/25 dark:text-sage-300">${escape(tag)}</li>`).join("")}</ul>`
    : "";
const metaLine = (post) =>
  `<p class="mt-5 text-sm text-ink/60 dark:text-cream/60"><time datetime="${post.date}">${formatDate(post.date)}</time> · ${post.readingTime} min read</p>`;

function postBody(post) {
  const cover = post.cover
    ? `<figure class="mx-auto mt-10 max-w-3xl"><img src="${escape(post.cover)}" alt="${escape(post.coverAlt)}" class="aspect-[16/9] w-full rounded-3xl border border-ink/10 object-cover shadow-sm dark:border-cream/10" />${
        post.coverAlt ? `<figcaption class="mt-3 text-center text-sm text-ink/60 dark:text-cream/60">${escape(post.coverAlt)}</figcaption>` : ""
      }</figure>`
    : "";
  return shell(
    `<article class="pt-8 sm:pt-12"><header class="mx-auto max-w-3xl">${eyebrow}<h1 class="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">${escape(post.title)}</h1>${metaLine(post)}<p class="mt-5 text-lg leading-relaxed text-ink/75 dark:text-cream/75">${escape(post.summary)}</p>${tagList(post.tags)}</header>${cover}<div class="prose-blog mx-auto mt-10 max-w-2xl">${renderMarkdown(post.body)}</div></article>`,
  );
}

function indexBody() {
  const items = posts
    .map(
      (post) =>
        `<li><a href="${postPath(post.slug)}" class="block rounded-3xl border border-ink/10 bg-white/70 p-6 dark:border-cream/10 dark:bg-night-800/70">${metaLine(post).replace("mt-5 ", "")}<h2 class="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">${escape(post.title)}</h2><p class="mt-3 text-sm leading-relaxed text-ink/80 dark:text-cream/80">${escape(post.summary)}</p></a></li>`,
    )
    .join("");
  return shell(
    `<div class="pb-10 pt-10 sm:pt-16">${eyebrow}<h1 class="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Notes from my desk</h1></div><ol class="flex flex-col gap-5">${items}</ol>`,
  );
}

function write(relative, content) {
  const target = resolve(dist, relative);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

// Pages
const index = indexMeta();
write("blog/index.html", page(index, jsonLd(index), indexBody()));
for (const post of posts) {
  const meta = postMeta(post);
  write(`blog/${post.slug}/index.html`, page(meta, jsonLd(meta, post), postBody(post)));
}

// Sitemap
const today = new Date().toISOString().slice(0, 10);
const newest = posts[0]?.updated || today;
const urls = [
  { loc: `${SITE_URL}/`, lastmod: today, priority: "1.0" },
  { loc: absoluteUrl(BLOG_PATH), lastmod: newest, priority: "0.8" },
  ...posts.map((post) => ({ loc: absoluteUrl(postPath(post.slug)), lastmod: post.updated || post.date, priority: "0.7" })),
];
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`)
    .join("\n")}\n</urlset>\n`,
);

// robots.txt
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

// RSS
const rfc822 = (iso) => new Date(`${iso}T00:00:00Z`).toUTCString();
write(
  "feed.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n  <title>${escape(profile.name)} · Blog</title>\n  <link>${absoluteUrl(BLOG_PATH)}</link>\n  <description>${escape(index.description)}</description>\n  <language>en</language>\n  <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />\n${posts
    .map(
      (post) =>
        `  <item>\n    <title>${escape(post.title)}</title>\n    <link>${absoluteUrl(postPath(post.slug))}</link>\n    <guid>${absoluteUrl(postPath(post.slug))}</guid>\n    <pubDate>${rfc822(post.date)}</pubDate>\n    <description>${escape(post.summary)}</description>\n${post.tags.map((tag) => `    <category>${escape(tag)}</category>`).join("\n")}\n  </item>`,
    )
    .join("\n")}\n</channel>\n</rss>\n`,
);

console.log(`prerender: ${posts.length} post(s) → dist/blog/, plus sitemap.xml, robots.txt, feed.xml`);
