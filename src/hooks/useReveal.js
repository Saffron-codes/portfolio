import { useCallback, useEffect, useRef } from "react";

const REVEALED = "is-revealed";
let observer = null;
const pending = new WeakMap();

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(REVEALED);
        observer.unobserve(entry.target);
        pending.get(entry.target)?.();
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  return observer;
}

/**
 * Reveal-on-scroll: returns a ref callback. The element gets `data-reveal` (styled hidden only
 * under `.js-motion` and never for reduced motion or print) and `is-revealed` once it enters
 * the viewport. Each element reveals exactly once. `onReveal` is optional.
 */
export function useReveal(onReveal) {
  const node = useRef(null);
  const callback = useRef(onReveal);
  useEffect(() => {
    callback.current = onReveal;
  });
  return useCallback((el) => {
    if (node.current && node.current !== el) {
      getObserver().unobserve(node.current);
      pending.delete(node.current);
    }
    node.current = el;
    if (!el) return;
    el.setAttribute("data-reveal", "");
    if (callback.current) pending.set(el, () => callback.current?.());
    getObserver().observe(el);
  }, []);
}
