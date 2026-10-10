import Reveal from "./Reveal";

/** Eyebrow ("02 · Experience") plus a large heading whose underline draws in on reveal. */
export default function SectionHeading({ index, id, title, lede }) {
  return (
    <Reveal className="mb-8 sm:mb-10">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-700 dark:text-sage-300">
        {String(index).padStart(2, "0")} · {title}
      </p>
      <h2 id={`${id}-heading`} className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
        <span aria-hidden="true" className="underline-accent mt-2 block h-1 w-16 origin-left rounded-full bg-sage-600 dark:bg-sage-400" />
      </h2>
      {lede && <p className="mt-3 max-w-2xl text-base text-ink/70 dark:text-cream/70">{lede}</p>}
    </Reveal>
  );
}
