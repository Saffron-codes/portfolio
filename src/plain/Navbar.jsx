import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaBars, FaDownload, FaMoon, FaSun, FaXmark } from "react-icons/fa6";
import profile from "../data/profile";
import { iconButton, primaryButton } from "./styles";

/** Thin accent bar along the top that tracks how far down the page you are. */
function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div ref={bar} aria-hidden="true" className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-sage-600 dark:bg-sage-400 print:hidden" style={{ transform: "scaleX(0)" }} />;
}

/** Mobile menu: a full-width sheet with the links. Focus is trapped; Esc and link clicks close it. */
function MobileMenu({ sections, activeId, onNavigate, onClose, returnFocusTo }) {
  const sheet = useRef(null);
  useEffect(() => {
    const node = sheet.current;
    const focusables = () => [...node.querySelectorAll('a[href], button:not([disabled])')];
    (node.querySelector('nav a[href]') ?? focusables()[0])?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    node.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      node.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      returnFocusTo?.current?.focus();
    };
  }, [onClose, returnFocusTo]);

  return (
    <div ref={sheet} role="dialog" aria-modal="true" aria-label="Sections" className="fixed inset-0 z-40 flex flex-col bg-cream/95 px-5 pb-8 pt-20 backdrop-blur dark:bg-night-900/95 md:hidden">
      <button type="button" onClick={onClose} aria-label="Close menu" className={`${iconButton} absolute right-4 top-3`}>
        <FaXmark size={16} aria-hidden="true" />
      </button>
      <nav aria-label="Sections">
        <ul className="flex flex-col gap-1">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={activeId === s.id ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(s.id);
                  onClose();
                }}
                className={`block rounded-lg px-3 py-3 text-xl font-medium ${activeId === s.id ? "bg-sage-600/10 text-sage-700 dark:text-sage-300" : "text-ink/80 dark:text-cream/80"}`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <a href={profile.resume} download className={`${primaryButton} mt-6 self-start`}>
        <FaDownload size={13} aria-hidden="true" /> Download resume
      </a>
    </div>
  );
}

/**
 * Sticky navbar: wordmark, section links with a sliding scroll-spy pill, theme toggle and a
 * resume button. Transparent at the top; blurred, bordered and shorter after 24 px of scroll.
 */
export default function Navbar({ sections, activeId, theme, onToggleTheme, onNavigate, onHome }) {
  const isDark = theme === "dark";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const linkRefs = useRef({});
  const listRef = useRef(null);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const measure = useCallback(() => {
    const link = linkRefs.current[activeId];
    const list = listRef.current;
    if (!link || !list) return;
    const a = link.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    setPill({ left: a.left - b.left, width: a.width, ready: true });
  }, [activeId]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <ScrollProgress />
      <header
        className={`sticky top-0 z-30 transition-[background-color,border-color,box-shadow] duration-300 print:hidden ${
          scrolled ? "border-b border-ink/10 bg-cream/85 shadow-sm backdrop-blur dark:border-cream/10 dark:bg-night-900/85" : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-[padding] duration-300 sm:px-6 ${scrolled ? "py-2" : "py-4"}`}>
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              onHome();
            }}
            className="rounded-md text-base font-semibold tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:text-cream"
          >
            <span className="hidden sm:inline">{profile.name}</span>
            <span className="sm:hidden">SDT</span>
          </a>

          <nav aria-label="Sections" className="hidden md:block">
            <ul ref={listRef} className="relative flex items-center gap-1">
              <span
                aria-hidden="true"
                className={`absolute top-0 h-full rounded-full bg-sage-600/12 transition-[left,width,opacity] duration-300 ease-out motion-reduce:transition-none dark:bg-sage-400/15 ${pill.ready ? "opacity-100" : "opacity-0"}`}
                style={{ left: pill.left, width: pill.width }}
              />
              {sections.map((s) => (
                <li key={s.id} className="relative">
                  <a
                    ref={(el) => {
                      linkRefs.current[s.id] = el;
                    }}
                    href={`#${s.id}`}
                    aria-current={activeId === s.id ? "true" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate(s.id);
                    }}
                    className={`block rounded-full px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 ${
                      activeId === s.id ? "text-sage-700 dark:text-sage-300" : "text-ink/70 hover:text-ink dark:text-cream/70 dark:hover:text-cream"
                    }`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={onToggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={isDark} className={iconButton}>
              {isDark ? <FaSun size={15} aria-hidden="true" /> : <FaMoon size={15} aria-hidden="true" />}
            </button>
            <a href={profile.resume} download className={`${primaryButton} hidden md:inline-flex`}>
              <FaDownload size={13} aria-hidden="true" /> Resume
            </a>
            <button ref={menuButton} type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className={`${iconButton} md:hidden`}>
              <FaBars size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      {menuOpen && <MobileMenu sections={sections} activeId={activeId} onNavigate={onNavigate} onClose={closeMenu} returnFocusTo={menuButton} />}
    </>
  );
}
