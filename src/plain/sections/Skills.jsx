import skills from "../../data/skills";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/** One card per group; the skills are keycap chips that pop in with a stagger and press on hover. */
export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-24">
      <SectionHeading index={4} id="skills" title="Skills" lede="The keys I reach for most. A nod to the keyboard on my desk." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, g) => (
          <Reveal key={group.id} delay={g * 70} group className={`rounded-3xl border border-ink/10 bg-white/60 p-5 dark:border-cream/10 dark:bg-night-800/60 ${g === 3 ? "lg:col-span-2" : ""}`}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/60 dark:text-cream/60">{group.label}</h3>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {group.items.map((skill, i) => (
                <li key={skill} data-reveal-item style={{ "--i": i }} className={`keycap ${(g + i) % 3 === 0 ? "keycap-accent" : ""}`}>
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
