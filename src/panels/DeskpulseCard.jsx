import projects from "../data/projects";
import ProjectCard from "../components/ProjectCard";

export const DESKPULSE_DESIGN = { width: 880, height: 600 };

/** Floats above the Deskpulse device: the project card. */
export default function DeskpulseCard() {
  const project = projects.find((p) => p.id === "deskpulse");
  return (
    <div className="flex h-full w-full items-stretch rounded-2xl bg-cream p-4 shadow-2xl ring-1 ring-ink/10">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col justify-center gap-3 pl-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-700">On the desk</p>
          <h2 className="text-3xl font-bold leading-tight text-ink">Deskpulse</h2>
          <p className="text-sm leading-relaxed text-ink/80">
            The little display beside the monitor is real. It shows the Chennai time, the weather and what I&apos;m building, straight from this site&apos;s data.
          </p>
        </div>
        <ProjectCard project={project} />
      </div>
    </div>
  );
}
