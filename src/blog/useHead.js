import { useEffect } from "react";
import { headTags } from "./seo";

// Everything useHead owns. Each apply clears these and writes the page's own set, so it does
// not matter what the prerendered HTML started with or which view was shown before.
const OWNED =
  'meta[name="description"], meta[name="author"], meta[name="robots"], meta[name^="twitter:"], meta[property^="og:"], meta[property^="article:"], link[rel="canonical"], script[type="application/ld+json"]';

/**
 * Sets a page's SEO tags (title, description, canonical, Open Graph, Twitter, JSON-LD) in <head>.
 * Prerendered pages already carry the same tags in their HTML; this keeps them right after
 * in-app navigation. Pass `null` to leave the head alone (another view owns it).
 */
export function useHead(meta, structuredData) {
  useEffect(() => {
    if (!meta) return;
    const head = document.head;
    head.querySelectorAll(OWNED).forEach((el) => el.remove());

    for (const tag of headTags(meta)) {
      if (tag.tag === "title") {
        document.title = tag.text;
        continue;
      }
      const el = document.createElement(tag.tag);
      for (const [key, value] of Object.entries(tag.attrs)) el.setAttribute(key, value);
      head.appendChild(el);
    }

    if (structuredData) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(structuredData).replace(/</g, "\\u003c");
      head.appendChild(script);
    }
    // Re-run only when the page changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta?.url, meta?.title]);
}
