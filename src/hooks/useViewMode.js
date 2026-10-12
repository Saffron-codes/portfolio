import { useCallback, useEffect, useMemo } from "react";
import { useRoute } from "./useRoute";

/**
 * Three views, routed by the URL:
 *   "/"               → the portfolio (recruiter) page, always the default
 *   "/#desk"          → the 3D desk overview
 *   "/#desk/<section>"→ a desk section (projects, experience, …)
 *   "/blog/"          → the blog index
 *   "/blog/<slug>/"   → one blog post (prerendered to a static file at build time)
 * "#plain" is a legacy alias for the portfolio page, and "#blog…" hashes redirect to the paths.
 * Bare section ids ("#projects") are left to the portfolio page, which treats them as anchors.
 */
export const DESK_HASH = "desk";
export const BLOG_PATH = "/blog/";
const LEGACY_VIEW_KEY = "view";

const EMPTY = { view: "portfolio", section: null, slug: null, anchor: null };
const BLOG_ROUTE = /^\/blog(?:\.html)?(?:\/([^/]+?)(?:\.html)?)?\/?$/;

export function parseRoute(path, hash) {
  const blog = path.match(BLOG_ROUTE);
  if (blog) {
    let slug = blog[1] || null;
    if (slug) {
      try {
        slug = decodeURIComponent(slug);
      } catch {
        /* keep the raw value */
      }
    }
    return { ...EMPTY, view: "blog", slug };
  }
  if (hash === DESK_HASH) return { ...EMPTY, view: "desk" };
  if (hash.startsWith(`${DESK_HASH}/`)) return { ...EMPTY, view: "desk", section: hash.slice(DESK_HASH.length + 1) || null };
  return { ...EMPTY, anchor: hash || null };
}

export function useViewMode() {
  const [{ path, hash }, navigate] = useRoute();

  // The old build remembered the last view in localStorage; the portfolio page is now always home.
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_VIEW_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Legacy aliases: "#plain" → "/", "#blog" and "#blog/<slug>" → the blog paths.
  useEffect(() => {
    if (hash === "plain") navigate("/", { replace: true });
    else if (hash === "blog") navigate(BLOG_PATH, { replace: true });
    else if (hash.startsWith("blog/")) navigate(`${BLOG_PATH}${hash.slice(5)}/`, { replace: true });
  }, [hash, navigate]);

  const parsed = useMemo(() => parseRoute(path, hash === "plain" ? "" : hash), [path, hash]);

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
