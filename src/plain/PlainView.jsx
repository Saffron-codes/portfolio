import { FaDownload, FaEnvelope, FaLocationDot, FaMoon, FaSun } from "react-icons/fa6";
import profile from "../data/profile";
import experience from "../data/experience";
import projects from "../data/projects";
import skills from "../data/skills";
import education, { educationMedia } from "../data/education";
import ProjectCard from "../components/ProjectCard";
import LinkIcon from "../components/LinkIcon";
import { useReducedMotion } from "../hooks/useReducedMotion";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const buttonClass =
  "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream dark:focus-visible:ring-sage-400 dark:focus-visible:ring-offset-night-900";
const primaryButton = `${buttonClass} bg-sage-600 text-white hover:bg-sage-700 dark:bg-sage-500 dark:hover:bg-sage-400 dark:text-night-900`;
const secondaryButton = `${buttonClass} border border-ink/15 hover:border-sage-600 hover:text-sage-700 dark:border-cream/20 dark:hover:border-sage-400 dark:hover:text-sage-300`;

function Section({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
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
 * Recruiter mode / plain view: every section as a fast, single-column page.
 * Uses the same data files as the desk scene.
 */
export default function PlainView({ theme, onToggleTheme, onExitPlain }) {
  const reducedMotion = useReducedMotion();
  const isDark = theme === "dark";

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-cream text-ink dark:bg-night-900 dark:text-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-sage-600 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-10 border-b border-ink/10 bg-cream/90 backdrop-blur dark:border-cream/10 dark:bg-night-900/90">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <nav aria-label="Sections" className="-mx-1 flex flex-wrap gap-1">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollTo(section.id)}
                className="rounded-md px-2 py-1 text-sm text-ink/70 hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:text-cream/70 dark:hover:bg-cream/10 dark:hover:text-cream"
              >
                {section.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {onExitPlain && (
              <button type="button" onClick={onExitPlain} className={secondaryButton}>
                Back to desk
              </button>
            )}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={isDark}
              className={`${secondaryButton} px-2.5`}
            >
              {isDark ? <FaSun size={16} aria-hidden="true" /> : <FaMoon size={16} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto flex max-w-3xl flex-col gap-14 px-4 pb-20 pt-12 sm:px-6">
        <Section id="about" title="About">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h1>
          <p className="mt-2 text-xl font-medium text-sage-700 dark:text-sage-300">{profile.title}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/70 dark:text-cream/70">
            <FaLocationDot size={13} aria-hidden="true" />
            {profile.location}
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/85 dark:text-cream/85">
            {profile.bio}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={`mailto:${profile.email}`} className={primaryButton}>
              <FaEnvelope size={14} aria-hidden="true" />
              Email me
            </a>
            <a href={profile.resume} download className={secondaryButton}>
              <FaDownload size={14} aria-hidden="true" />
              Download resume
            </a>
          </div>
        </Section>

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
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink/85 dark:text-cream/85">
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
                  {item.detail && <p className="mt-1 text-sm text-ink/85 dark:text-cream/85">{item.detail}</p>}
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
          <p className="max-w-2xl text-base leading-relaxed text-ink/85 dark:text-cream/85">
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
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </div>
  );
}
