import education, { educationMedia } from "../data/education";

export const EDUCATION_DESIGN = { width: 1000, height: 708 };

/** Rendered on the certificate frame: the graduation photo and both entries. */
export default function EducationCard() {
  return (
    <div className="flex h-full w-full gap-8 bg-[#f7f1e2] p-8 text-ink ring-4 ring-inset ring-[#8a7a52]">
      <img
        src={educationMedia.graduationPhoto}
        alt={educationMedia.graduationAlt}
        loading="lazy"
        decoding="async"
        className="h-full w-[38%] shrink-0 rounded-lg object-cover shadow-md"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="text-lg uppercase tracking-[0.35em] text-ink/60">Education</p>
        <ol className="mt-6 flex flex-col gap-8">
          {education.map((item) => (
            <li key={item.id}>
              <p className="text-base text-ink/60">
                {item.start} – {item.end}
              </p>
              <h3 className="mt-1 font-serif text-3xl font-bold leading-snug">{item.degree}</h3>
              <p className="mt-1 text-xl text-ink/80">{item.school}</p>
              {item.detail && <p className="mt-1 text-lg text-ink/70">{item.detail}</p>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
