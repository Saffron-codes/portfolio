import education from "../data/education";

export const EDUCATION_DESIGN = { width: 1000, height: 708 };

/** Rendered on the certificate paper. */
export default function EducationCard() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#f7f1e2] px-14 py-10 text-center text-ink ring-4 ring-inset ring-[#8a7a52]">
      <p className="text-xl uppercase tracking-[0.35em] text-ink/60">Education</p>
      <ol className="mt-10 flex w-full flex-col gap-12">
        {education.map((item) => (
          <li key={item.id}>
            <p className="text-lg text-ink/60">
              {item.start} – {item.end}
            </p>
            <h3 className="mt-2 font-serif text-4xl font-bold leading-snug">{item.degree}</h3>
            <p className="mt-2 text-2xl text-ink/80">{item.school}</p>
            {item.detail && <p className="mt-2 text-xl text-ink/70">{item.detail}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
