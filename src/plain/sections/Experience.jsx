import { useEffect, useRef } from "react";
import experience from "../../data/experience";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

function dateRange(start, end) {
  return end ? `${start} – ${end}` : start;
}

/** Fills the timeline line in step with how far the section has scrolled past the viewport's middle. */
function useTimelineProgress(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const anchor = window.innerHeight * 0.65;
      const progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      el.style.setProperty("--timeline-progress", progress.toFixed(3));
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
  }, [ref]);
}

/** Vertical timeline: the line draws as you scroll; each role is a card. */
export default function Experience() {
  const list = useRef(null);
  useTimelineProgress(list);
  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-24">
      <SectionHeading index={2} id="experience" title="Experience" lede="Freelance mobile and backend work, plus the internships that led there." />
      <ol ref={list} className="timeline relative mx-auto max-w-4xl">
        {/* Track and the scroll-linked fill */}
        <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-0.5 rounded-full bg-ink/10 dark:bg-cream/10 sm:left-[calc(9.5rem+7px)]" />
        <span aria-hidden="true" className="timeline-fill absolute bottom-3 left-[7px] top-3 w-0.5 origin-top rounded-full bg-sage-600 dark:bg-sage-400 sm:left-[calc(9.5rem+7px)]" />
        {experience.map((job, i) => {
          const current = job.end === "Present";
          return (
            <Reveal as="li" key={job.id} delay={i * 80} className="relative grid gap-2 pb-10 pl-8 last:pb-0 sm:grid-cols-[9.5rem_1fr] sm:gap-6 sm:pl-0">
              <span
                aria-hidden="true"
                className={`absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-cream bg-sage-600 ring-2 ring-sage-600/30 dark:border-night-900 dark:bg-sage-400 dark:ring-sage-400/30 sm:left-[9.5rem] ${current ? "animate-pulse-ring" : ""}`}
              />
              <p className="text-sm text-ink/60 dark:text-cream/60 sm:pt-2 sm:text-right sm:pr-8">{dateRange(job.start, job.end)}</p>
              <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 shadow-sm dark:border-cream/10 dark:bg-night-800/60">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">{job.role}</h3>
                  {current && (
                    <span className="rounded-full bg-sage-600 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white dark:bg-sage-400 dark:text-night-900">
                      Now
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-ink/70 dark:text-cream/70">
                  {job.company} · {job.location}
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink/80 dark:text-cream/80">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
