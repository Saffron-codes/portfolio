// SEO metadata for blog pages. Pure: used at runtime (useHead) and at build time
// (scripts/prerender.mjs), so keep it free of React and DOM access.
import profile from "../data/profile.js";

export const SITE_URL = profile.siteUrl.replace(/\/$/, "");
export const BLOG_PATH = "/blog/";
const DEFAULT_IMAGE = "/og-image.png";
const DEFAULT_IMAGE_ALT = "Illustration of Saffron's desk: a monitor, laptop, keyboard and phone in a cozy room.";
const BLOG_TITLE = "Blog";
const BLOG_DESCRIPTION = `Build logs and write-ups by ${profile.name}: what I'm shipping, what worked, what broke, and what I learned.`;

const xLink = profile.links.find((link) => link.id === "x");
export const TWITTER_HANDLE = xLink ? `@${xLink.url.replace(/\/$/, "").split("/").pop()}` : null;

export function absoluteUrl(path) {
  return /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** "/blog/<slug>/": the trailing slash matches the prerendered directory index. */
export function postPath(slug) {
  return `${BLOG_PATH}${encodeURIComponent(slug)}/`;
}

/** The home page's tags, matching the static ones in index.html. Applied again after leaving the blog. */
export function homeMeta() {
  return {
    title: `${profile.name}, ${profile.title}`,
    headline: `${profile.name}, ${profile.title}`,
    description:
      "Software Engineer with 3 years of experience building cross-platform mobile apps in Flutter and Dart, with FastAPI backends on PostgreSQL and Supabase. Based in Chennai, India. Step inside a live 3D model of my desk.",
    url: `${SITE_URL}/`,
    image: absoluteUrl(DEFAULT_IMAGE),
    imageAlt: DEFAULT_IMAGE_ALT,
    imageWidth: 1200,
    imageHeight: 630,
    type: "website",
  };
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    url: profile.siteUrl,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
    sameAs: profile.links.map((link) => link.url),
  };
}

export function indexMeta() {
  return {
    title: `${BLOG_TITLE} · ${profile.name}`,
    headline: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    url: absoluteUrl(BLOG_PATH),
    image: absoluteUrl(DEFAULT_IMAGE),
    imageAlt: DEFAULT_IMAGE_ALT,
    type: "website",
  };
}

export function postMeta(post) {
  return {
    title: `${post.title} · ${profile.name}`,
    headline: post.title,
    description: post.description,
    url: absoluteUrl(postPath(post.slug)),
    image: absoluteUrl(post.cover || DEFAULT_IMAGE),
    imageAlt: post.cover ? post.coverAlt || post.title : DEFAULT_IMAGE_ALT,
    type: "article",
    published: post.date,
    updated: post.updated,
    tags: post.tags,
  };
}

/**
 * The head tags for a page, in a DOM-agnostic shape: `{ tag, attrs, text?, repeat? }`.
 * `repeat` marks tags that may appear more than once (article:tag), so the runtime always adds them fresh.
 */
export function headTags(meta) {
  const meta_ = (attrs) => ({ tag: "meta", attrs });
  const tags = [
    { tag: "title", attrs: {}, text: meta.title },
    meta_({ name: "description", content: meta.description }),
    { tag: "link", attrs: { rel: "canonical", href: meta.url } },
    meta_({ property: "og:type", content: meta.type }),
    meta_({ property: "og:url", content: meta.url }),
    meta_({ property: "og:site_name", content: profile.name }),
    meta_({ property: "og:title", content: meta.headline }),
    meta_({ property: "og:description", content: meta.description }),
    meta_({ property: "og:image", content: meta.image }),
    ...(meta.imageWidth && meta.imageHeight
      ? [meta_({ property: "og:image:width", content: String(meta.imageWidth) }), meta_({ property: "og:image:height", content: String(meta.imageHeight) })]
      : []),
    meta_({ property: "og:image:alt", content: meta.imageAlt }),
    meta_({ name: "twitter:card", content: "summary_large_image" }),
    meta_({ name: "twitter:title", content: meta.headline }),
    meta_({ name: "twitter:description", content: meta.description }),
    meta_({ name: "twitter:image", content: meta.image }),
    meta_({ name: "twitter:image:alt", content: meta.imageAlt }),
  ];
  if (TWITTER_HANDLE) tags.push(meta_({ name: "twitter:site", content: TWITTER_HANDLE }), meta_({ name: "twitter:creator", content: TWITTER_HANDLE }));
  if (meta.robots) tags.push(meta_({ name: "robots", content: meta.robots }));
  if (meta.type === "article") {
    tags.push(meta_({ name: "author", content: profile.name }));
    if (meta.published) tags.push(meta_({ property: "article:published_time", content: meta.published }));
    if (meta.updated) tags.push(meta_({ property: "article:modified_time", content: meta.updated }));
    tags.push(meta_({ property: "article:author", content: profile.siteUrl }));
    for (const tag of meta.tags || []) tags.push({ ...meta_({ property: "article:tag", content: tag }), repeat: true });
  }
  return tags;
}

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** The same tags as HTML, for the prerendered pages. */
export function serializeHeadTags(tags) {
  return tags
    .map((tag) => {
      if (tag.tag === "title") return `<title>${escapeHtml(tag.text)}</title>`;
      const attrs = Object.entries(tag.attrs)
        .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
        .join(" ");
      return `<${tag.tag} ${attrs} />`;
    })
    .join("\n    ");
}

const author = { "@type": "Person", name: profile.name, url: profile.siteUrl, sameAs: profile.links.map((link) => link.url) };

/** JSON-LD for a post (BlogPosting) or the index (Blog). */
export function jsonLd(meta, post) {
  if (post) {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      image: meta.image,
      url: meta.url,
      mainEntityOfPage: meta.url,
      datePublished: post.date,
      dateModified: post.updated || post.date,
      author,
      publisher: author,
      keywords: post.tags.join(", "),
      wordCount: post.body.split(/\s+/).filter(Boolean).length,
      inLanguage: "en",
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${profile.name}'s blog`,
    description: meta.description,
    url: meta.url,
    author,
    inLanguage: "en",
  };
}
