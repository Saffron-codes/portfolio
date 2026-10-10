import skills from "../data/skills";

export const SKILLS_DESIGN = { width: 1120, height: 445 };

/** Floats above the keyboard: skill groups as keycap chips. */
export default function SkillsPanel() {
  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-night-900/85 p-6 text-cream shadow-2xl ring-1 ring-white/10 backdrop-blur">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-cream/60">Type on your keyboard — the keycaps below will press.</p>
      </div>
      <dl className="grid flex-1 grid-cols-[11rem_1fr] content-start gap-x-6 gap-y-5">
        {skills.map((group, index) => (
          <div key={group.id} className="contents">
            <dt className="pt-1.5 text-sm font-medium uppercase tracking-wider text-cream/60">{group.label}</dt>
            <dd className="flex flex-wrap content-start gap-2">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className={`rounded-md px-3 py-1.5 text-base font-medium shadow-[0_3px_0_0_rgba(0,0,0,0.45)] ${
                    index % 2 ? "bg-[#8f84d6] text-night-900" : "bg-[#2a2a33] text-cream"
                  }`}
                >
                  {skill}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
