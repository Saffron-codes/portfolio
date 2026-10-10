import education, { educationMedia } from "../../data/education";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/** Two cards; the degree card carries the graduation photo. */
export default function Education() {
  const [degree, school] = education;
  return (
    <section id="education" aria-labelledby="education-heading" className="scroll-mt-24">
      <SectionHeading index={5} id="education" title="Education" />
      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <Reveal as="article" className="flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white/60 dark:border-cream/10 dark:bg-night-800/60 sm:flex-row">
          <img
            src={educationMedia.graduationPhoto}
            alt={educationMedia.graduationAlt}
            loading="lazy"
            decoding="async"
            width="768"
            height="1024"
            className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:w-56 md:w-64"
          />
          <div className="flex flex-col justify-center p-6">
            <p className="text-sm text-ink/60 dark:text-cream/60">
              {degree.start} – {degree.end}
            </p>
            <h3 className="mt-1 text-xl font-semibold">{degree.degree}</h3>
            <p className="mt-1 text-sm text-ink/70 dark:text-cream/70">{degree.school}</p>
            {degree.detail && <p className="mt-3 inline-block w-fit rounded-full bg-sage-400/20 px-2.5 py-0.5 text-xs font-medium text-sage-700 dark:bg-sage-600/25 dark:text-sage-300">{degree.detail}</p>}
          </div>
        </Reveal>
        <Reveal as="article" delay={90} className="flex flex-col justify-center rounded-3xl border border-ink/10 bg-white/60 p-6 dark:border-cream/10 dark:bg-night-800/60">
          <p className="text-sm text-ink/60 dark:text-cream/60">
            {school.start} – {school.end}
          </p>
          <h3 className="mt-1 text-xl font-semibold">{school.degree}</h3>
          <p className="mt-1 text-sm text-ink/70 dark:text-cream/70">{school.school}</p>
        </Reveal>
      </div>
    </section>
  );
}
