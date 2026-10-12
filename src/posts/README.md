# Writing a post

Add a Markdown file to this folder and it is published on the next build. Nothing else to wire up.

Name the file `YYYY-MM-DD-slug.md`. The date prefix keeps the folder sorted; the slug becomes the URL, so `2026-10-12-my-post.md` is served at `/blog/my-post/`.

Start the file with a front matter block:

```md
---
title: "What the post is called"
date: 2026-10-12
summary: "One or two sentences shown on the cards and under the title."
description: "Under 155 characters. Used for the search snippet and link previews."
tags: [Nomad, Claude Code]
cover: /assets/some-image.webp
coverAlt: "What the cover image shows."
---

Body in Markdown (GitHub flavoured: tables, fenced code, task lists).
```

- `title`, `date` (ISO, `YYYY-MM-DD`) and `summary` are required in practice.
- `description` is the meta description. If you leave it out, the summary is trimmed to fit.
- `updated` (ISO date) marks a revision; it feeds `article:modified_time` and the sitemap.
- `tags` is optional. `cover` and `coverAlt` are optional; put images in `public/assets/`. The cover doubles as the social preview image, so a wide image (about 1200×630) works best.
- `draft: true` keeps a post out of production builds while it still shows in `npm run dev`.
- Headings get ids but no anchor links. External links open in a new tab automatically.

## What the build generates for SEO

`npm run build` runs `scripts/prerender.mjs` after Vite, which writes for every post a static `dist/blog/<slug>/index.html` carrying its own title, meta description, canonical URL, Open Graph and Twitter tags, `BlogPosting` JSON-LD and the rendered article, so search engines and link previews get the right content without JavaScript. It also writes `dist/blog/index.html`, `sitemap.xml`, `robots.txt` and an RSS feed at `feed.xml`. The same tags are applied in the browser when navigating between posts.

Posts are sorted newest first. The three newest appear in the Blog section of the portfolio page; all of them are listed at `/blog/`.
