import { FaDownload, FaEnvelope } from "react-icons/fa6";
import profile from "../data/profile";
import experience from "../data/experience";
import projects from "../data/projects";
import skills from "../data/skills";
import education, { educationMedia } from "../data/education";
import ProjectCard from "../components/ProjectCard";
import LinkIcon from "../components/LinkIcon";
import { useCallback, useEffect } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { useSky } from "../three/useSky";
import { useChennaiWeather } from "../three/useChennaiWeather";
import Navbar from "./Navbar";
import Hero from "./Hero";
import { primaryButton, secondaryButton } from "./styles";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];
const SECTION_IDS = SECTIONS.map((s) => s.id);

function Section({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mx-auto w-full max-w-3xl scroll-mt-24">
      <h2
        id={`${id}-heading`}
        className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sage-700 dark:text-sage-300"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function dateRange(start, end) {
  return end ? `${start} – ${end}` : start;
}

/**
 * The portfolio (recruiter) page: the home page, every section as a fast single-column page.
 * Uses the same data files as the desk scene. Section links scroll without touching the hash;
 * a legacy "#projects"-style hash from an old link is treated as an in-page anchor once.
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
    <div className="portfolio-page min-h-screen bg-cream text-ink dark:bg-night-900 dark:text-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-sage-600 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Navbar sections={SECTIONS} activeId={activeId} theme={theme} onToggleTheme={onToggleTheme} onNavigate={scrollTo} onHome={scrollTop} />

      <main id="main" className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-20 sm:px-6">
        <Hero theme={theme} sky={sky} hour={hour} minute={minute} weather={weather} onOpenDesk={onOpenDesk} />
        <Section id="experience" title="Experience">
          <ol className="flex flex-col gap-8">
            {experience.map((job) => (
              <li key={job.id} className="grid gap-1 sm:grid-cols-[9.5rem_1fr] sm:gap-6">
                <p className="text-sm text-ink/60 dark:text-cream/60 sm:pt-0.5">
                  {dateRange(job.start, job.end)}
                </p>
                <div>
                  <h3 className="text-lg font-semibold">{job.role}</h3>
                  <p className="text-sm text-ink/70 dark:text-cream/70">
                    {job.company} · {job.location}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink/80 dark:text-cream/80">
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="projects" title="Projects">
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <dl className="grid gap-4 sm:grid-cols-[9.5rem_1fr] sm:gap-x-6 sm:gap-y-5">
            {skills.map((group) => (
              <div key={group.id} className="contents">
                <dt className="text-sm font-medium text-ink/70 dark:text-cream/70 sm:pt-1">{group.label}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-md border border-ink/15 bg-white/60 px-2.5 py-1 text-sm dark:border-cream/15 dark:bg-night-800/70"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="education" title="Education">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <ol className="flex flex-1 flex-col gap-6">
            {education.map((item) => (
              <li key={item.id} className="grid gap-1 sm:grid-cols-[9.5rem_1fr] sm:gap-6">
                <p className="text-sm text-ink/60 dark:text-cream/60 sm:pt-0.5">
                  {dateRange(item.start, item.end)}
                </p>
                <div>
                  <h3 className="text-lg font-semibold">{item.degree}</h3>
                  <p className="text-sm text-ink/70 dark:text-cream/70">{item.school}</p>
                  {item.detail && <p className="mt-1 text-sm text-ink/80 dark:text-cream/80">{item.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
          <img
            src={educationMedia.graduationPhoto}
            alt={educationMedia.graduationAlt}
            loading="lazy"
            decoding="async"
            width="768"
            height="1024"
            className="w-40 shrink-0 rounded-xl object-cover shadow-sm sm:w-44"
          />
          </div>
        </Section>

        <Section id="contact" title="Contact">
          <p className="max-w-2xl text-base leading-relaxed text-ink/80 dark:text-cream/80">
            Open to freelance and full-time software engineering roles. The fastest way to reach me is email.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            <li>
              <a href={`mailto:${profile.email}`} className={primaryButton}>
                <FaEnvelope size={14} aria-hidden="true" />
                {profile.email}
              </a>
            </li>
            {profile.links.map((link) => (
              <li key={link.id}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
                  <LinkIcon id={link.id} size={14} />
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <a href={profile.resume} download className={secondaryButton}>
                <FaDownload size={14} aria-hidden="true" />
                Download resume
              </a>
            </li>
          </ul>
        </Section>
      </main>

      <footer className="border-t border-ink/10 py-6 text-center text-xs text-ink/50 dark:border-cream/10 dark:text-cream/50">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        {onOpenDesk && (
          <p className="mt-2">
            <a
              href="#desk"
              onClick={(event) => {
                event.preventDefault();
                onOpenDesk();
              }}
              className="text-sage-700 underline-offset-2 hover:underline dark:text-sage-300"
            >
              Step into my desk in 3D →
            </a>
          </p>
        )}
      </footer>
    </div>
  );
}
