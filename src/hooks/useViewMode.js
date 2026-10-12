import { useCallback, useEffect, useMemo } from "react";
import { useHashRoute } from "./useHashRoute";

/**
 * Three views, routed by the URL hash:
 *   ""                → the portfolio (recruiter) page, always the default
 *   "#desk"           → the 3D desk overview
 *   "#desk/<section>" → a desk section (projects, experience, …)
 *   "#blog"           → the blog index
 *   "#blog/<slug>"    → one blog post
 * "#plain" is a legacy alias for the portfolio page. Bare section ids ("#projects") are left
 * to the portfolio page, which treats them as in-page anchors.
 */
export const DESK_HASH = "desk";
export const BLOG_HASH = "blog";
const LEGACY_VIEW_KEY = "view";

const EMPTY = { view: "portfolio", section: null, slug: null, anchor: null };

export function parseViewHash(hash) {
  if (hash === DESK_HASH) return { ...EMPTY, view: "desk" };
  if (hash.startsWith(`${DESK_HASH}/`)) return { ...EMPTY, view: "desk", section: hash.slice(DESK_HASH.length + 1) || null };
  if (hash === BLOG_HASH) return { ...EMPTY, view: "blog" };
  if (hash.startsWith(`${BLOG_HASH}/`)) {
    let slug = hash.slice(BLOG_HASH.length + 1);
    try {
      slug = decodeURIComponent(slug);
    } catch {
      /* keep the raw value */
    }
    return { ...EMPTY, view: "blog", slug: slug || null };
  }
  return { ...EMPTY, anchor: hash || null };
}

export function useViewMode() {
  const [hash, navigate] = useHashRoute();

  // The old build remembered the last view in localStorage; the portfolio page is now always home.
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_VIEW_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Legacy alias.
  useEffect(() => {
    if (hash === "plain") navigate("", { replace: true });
  }, [hash, navigate]);

  const parsed = useMemo(() => parseViewHash(hash === "plain" ? "" : hash), [hash]);

  /** Portfolio → desk. The new history entry is tagged so "Back to portfolio" can use history.back(). */
  const openDesk = useCallback(() => {
    navigate(DESK_HASH);
    requestAnimationFrame(() => {
      try {
        if (window.location.hash === `#${DESK_HASH}`) history.replaceState({ fromPortfolio: true }, "");
      } catch {
        /* ignore */
      }
    });
  }, [navigate]);

  /** Desk → portfolio. Goes back in history when we came from the portfolio, otherwise pushes "/". */
  const closeDesk = useCallback(() => {
    let fromPortfolio = false;
    try {
      fromPortfolio = Boolean(history.state?.fromPortfolio);
    } catch {
      /* ignore */
    }
    if (fromPortfolio) history.back();
    else navigate("");
  }, [navigate]);

  const openDeskSection = useCallback((id) => navigate(`${DESK_HASH}/${id}`), [navigate]);
  const deskOverview = useCallback(() => navigate(DESK_HASH), [navigate]);
  /** Drops a legacy "#section" anchor from the URL without adding a history entry. */
  const clearAnchor = useCallback(() => navigate("", { replace: true }), [navigate]);

  return { ...parsed, openDesk, closeDesk, openDeskSection, deskOverview, clearAnchor };
}
