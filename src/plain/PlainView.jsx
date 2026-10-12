import { useCallback, useEffect } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { useSky } from "../three/useSky";
import { useChennaiWeather } from "../three/useChennaiWeather";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Background from "./sections/Background";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Education from "./sections/Education";
import Blog from "./sections/Blog";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];
const SECTION_IDS = SECTIONS.map((s) => s.id);

/**
 * The portfolio (recruiter) page: the home page. Uses the same data files as the desk scene.
 * Section links scroll without touching the hash; a legacy "#projects"-style hash from an old
 * link is treated as an in-page anchor once. ("#blog" itself opens the blog index, not the section.)
 */
export default function PlainView({ theme, onToggleTheme, anchor, onClearAnchor, onOpenDesk }) {
  const reducedMotion = useReducedMotion();
  const activeId = useScrollSpy(SECTION_IDS);
  const { sky, hour, minute } = useSky();
  const weather = useChennaiWeather();

  // Returning from the desk restores the hero (and fades the page back in).
  useEffect(() => {
    if (!anchor) window.scrollTo({ top: 0, behavior: "auto" });
    const id = requestAnimationFrame(() => document.documentElement.classList.remove("leaving"));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A legacy "#projects"-style hash (old links, or typed in) scrolls to that section and is then cleared.
  useEffect(() => {
    const target = anchor && SECTIONS.some((s) => s.id === anchor) ? document.getElementById(anchor) : null;
    if (!target) return;
    target.scrollIntoView({ behavior: "auto", block: "start" });
    onClearAnchor?.();
  }, [anchor, onClearAnchor]);

  const scrollTo = useCallback(
    (id) => {
      document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    },
    [reducedMotion],
  );
  const scrollTop = useCallback(() => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }), [reducedMotion]);

  return (
    <div className="portfolio-page relative min-h-screen overflow-x-clip bg-cream text-ink dark:bg-night-900 dark:text-cream">
      <a
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("main");
          main?.focus({ preventScroll: true });
          main?.scrollIntoView({ behavior: "auto", block: "start" });
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-sage-600 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Navbar sections={SECTIONS} activeId={activeId} theme={theme} onToggleTheme={onToggleTheme} onNavigate={scrollTo} onHome={scrollTop} />

      <main id="main" tabIndex={-1} className="relative mx-auto flex max-w-6xl flex-col gap-24 px-4 pb-24 outline-none sm:px-6">
        <Background />
        <Hero theme={theme} sky={sky} hour={hour} minute={minute} weather={weather} onOpenDesk={onOpenDesk} />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Blog />
        <Contact />
      </main>

      <Footer onOpenDesk={onOpenDesk} />
    </div>
  );
}
