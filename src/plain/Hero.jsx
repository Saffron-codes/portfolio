import { FaDownload, FaEnvelope, FaLocationDot } from "react-icons/fa6";
import profile from "../data/profile";
import experience from "../data/experience";
import projects from "../data/projects";
import LinkIcon from "../components/LinkIcon";
import DeskCard from "./DeskCard";
import { iconButton, primaryButton, secondaryButton } from "./styles";
import { AVAILABILITY } from "./availability";

/** Quick facts derived from the data files only. */
function quickFacts() {
  const years = profile.bio.match(/(\d+)\s+years?/i)?.[1];
  return [years ? `${years} years experience` : null, `${experience.length} roles`, `${projects.length} projects`].filter(Boolean);
}

/** The hero: name and bio on the left, the live mini desk on the right. It is also the About section. */
export default function Hero({ theme, sky, hour, minute, weather, onOpenDesk }) {
  const words = profile.name.split(" ");
  const facts = quickFacts();
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-24 pb-16 pt-10 sm:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-3 py-1 text-xs font-medium text-ink/80 dark:border-cream/15 dark:bg-night-800/70 dark:text-cream/80">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {AVAILABILITY}
          </p>
          <h1 id="about-heading" className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {words.map((word, i) => (
              <span key={i} className="hero-word inline-block" style={{ "--i": i }}>
                {word}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>
          <p className="mt-3 text-2xl font-medium text-sage-700 dark:text-sage-300">{profile.title}</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/80 dark:text-cream/80">{profile.bio}</p>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-ink/70 dark:text-cream/70">
            <FaLocationDot size={13} aria-hidden="true" />
            {profile.location}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2">
            <a href={`mailto:${profile.email}`} className={primaryButton}>
              <FaEnvelope size={14} aria-hidden="true" /> Email me
            </a>
            <a href={profile.resume} download className={secondaryButton}>
              <FaDownload size={14} aria-hidden="true" /> Download resume
            </a>
            <ul className="ml-1 flex items-center gap-1.5" aria-label="Social links">
              {profile.links.map((link) => (
                <li key={link.id}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (opens in a new tab)`} className={iconButton}>
                    <LinkIcon id={link.id} size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/10 pt-6 dark:border-cream/10">
            {facts.map((fact) => {
              const [number, ...rest] = fact.split(" ");
              return (
                <div key={fact} className="flex items-baseline gap-2">
                  <dt className="sr-only">{rest.join(" ")}</dt>
                  <dd className="text-2xl font-semibold tabular-nums text-ink dark:text-cream">{number}</dd>
                  <dd className="text-sm text-ink/70 dark:text-cream/70">{rest.join(" ")}</dd>
                </div>
              );
            })}
          </dl>
        </div>
        <DeskCard theme={theme} sky={sky} hour={hour} minute={minute} weather={weather} onOpenDesk={onOpenDesk} />
      </div>
    </section>
  );
}
