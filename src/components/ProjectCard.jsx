import { useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

function ProjectImage({ src, alt }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-sage-400/30 to-wood-300/40 px-4 text-center text-lg font-semibold text-ink/70 dark:from-sage-600/30 dark:to-night-700 dark:text-cream/70"
      >
        {alt}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-40 w-full object-cover"
    />
  );
}

export default function ProjectCard({ project }) {
  const { title, description, stack, links, image, badge } = project;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white/70 shadow-sm transition-shadow hover:shadow-md dark:border-cream/10 dark:bg-night-800/70">
      <ProjectImage src={image} alt={title} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {badge && (
            <span className="rounded-full bg-lamp/30 px-2 py-0.5 text-xs font-medium text-ink dark:bg-lamp/20 dark:text-lamp">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-ink/80 dark:text-cream/80">{description}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label={`${title} tech stack`}>
          {stack.map((item) => (
            <li
              key={item}
              className="rounded-md bg-sage-400/20 px-2 py-0.5 text-xs font-medium text-sage-700 dark:bg-sage-600/25 dark:text-sage-300"
            >
              {item}
            </li>
          ))}
        </ul>
        {links.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-2 pt-1">
            {links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ink/15 px-3 py-1.5 text-sm font-medium transition-colors hover:border-sage-600 hover:text-sage-700 dark:border-cream/20 dark:hover:border-sage-400 dark:hover:text-sage-300"
                >
                  {link.label}
                  <FaArrowUpRightFromSquare size={11} aria-hidden="true" />
                  <span className="sr-only"> ({title}, opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
