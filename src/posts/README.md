# Writing a post

Add a Markdown file to this folder and it is published on the next build. Nothing else to wire up.

Name the file `YYYY-MM-DD-slug.md`. The date prefix keeps the folder sorted; the slug becomes the URL, so `2026-10-12-my-post.md` is served at `/#blog/my-post`.

Start the file with a front matter block:

```md
---
title: "What the post is called"
date: 2026-10-12
summary: "One or two sentences shown on the cards and under the title."
tags: [Nomad, Claude Code]
cover: /assets/some-image.webp
coverAlt: "What the cover image shows."
---

Body in Markdown (GitHub flavoured: tables, fenced code, task lists).
```

- `title`, `date` (ISO, `YYYY-MM-DD`) and `summary` are required in practice.
- `tags` is optional. `cover` and `coverAlt` are optional; put images in `public/assets/`.
- `draft: true` keeps a post out of production builds while it still shows in `npm run dev`.
- Headings get ids but no anchor links, because an in-page `#heading` link would be read as a route.
- External links open in a new tab automatically.

Posts are sorted newest first. The three newest appear in the Blog section of the portfolio page; all of them are listed at `/#blog`.
