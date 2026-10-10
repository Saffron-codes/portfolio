import { useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import projects from "../../data/projects";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const GRADIENTS = [
  "from-sage-500 to-night-700",
  "from-[#5a4b8a] to-[#3b6d8a]",
  "from-[#b94a52] to-[#5e2a84]",
  "from-[#2e6b6b] to-[#1f2a4a]",
  "from-[#a0734a] to-[#4b2420]",
];

/** Project image, or an intentional gradient placeholder with the initial and the stack. */
function TileImage({ project, index, featured }) {
  const [failed, setFailed] = useState(!project.image);
  if (failed) {
    return (
      <div className={`flex h-full w-full flex-col justify-between bg-gradient-to-br p-5 text-white ${GRADIENTS[index % GRADIENTS.length]}`} role="img" aria-label={project.title}>
        <span className={`font-neon ${featured ? "text-7xl" : "text-5xl"} leading-none opacity-90`}>{project.title[0]}</span>
        <span className="text-xs font-medium uppercase tracking-[0.2em] opacity-80">{project.stack.slice(0, 3).join(" · ")}</span>
      </div>
    );
  }
  return (
    <img
      src={project.image}
      alt={project.title}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-105"
    />
  );
}

function ProjectTile({ project, index, featured }) {
  return (
    <Reveal
      as="article"
      delay={index * 70}
      className={`group flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white/70 shadow-sm transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10 dark:border-cream/10 dark:bg-night-800/70 dark:hover:shadow-black/40 ${
        featured ? "md:col-span-4 md:row-span-2" : "md:col-span-2"
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? "aspect-[16/10] md:aspect-auto md:min-h-[18rem] md:flex-1" : "aspect-[16/10]"}`}>
        <TileImage project={project} index={index} featured={featured} />
        {project.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-lamp px-2.5 py-1 text-xs font-semibold text-ink shadow">{project.badge}</span>
        )}
      </div>
      <div className="flex flex-col gap-3 p-5">
        <h3 className={`font-semibold ${featured ? "text-2xl" : "text-lg"}`}>{project.title}</h3>
        <p className="text-sm leading-relaxed text-ink/80 dark:text-cream/80">{project.description}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label={`${project.title} tech stack`}>
          {project.stack.map((item) => (
            <li key={item} className="rounded-md bg-sage-400/20 px-2 py-0.5 text-xs font-medium text-sage-700 dark:bg-sage-600/25 dark:text-sage-300">
              {item}
            </li>
          ))}
        </ul>
        {project.links.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-2 pt-1">
            {project.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ink/15 px-3 py-1.5 text-sm font-medium transition-colors hover:border-sage-600 hover:text-sage-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:border-cream/20 dark:hover:border-sage-400 dark:hover:text-sage-300"
                >
                  {link.label}
                  <FaArrowUpRightFromSquare size={11} aria-hidden="true" />
                  <span className="sr-only"> ({project.title}, opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Reveal>
  );
}

/** Bento grid: Svik featured, the rest in smaller tiles. */
export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-24">
      <SectionHeading index={3} id="projects" title="Projects" lede="Things I've shipped or am building, from Flutter apps to an AI circuit tool." />
      <div className="grid gap-5 md:grid-cols-6">
        {projects.map((project, i) => (
          <ProjectTile key={project.id} project={project} index={i} featured={i === 0} />
        ))}
      </div>
    </section>
  );
}
