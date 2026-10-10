import projects from "../data/projects";
import ProjectCard from "../components/ProjectCard";

export const PROJECTS_DESIGN = { width: 1200, height: 705 };

/** Rendered on the monitor: a tiny desktop with the project cards as windows. */
export default function ProjectsScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-[#3b6d8a] to-[#5a4b8a] text-ink">
      <div className="flex items-center justify-between bg-black/30 px-4 py-1.5 text-xs text-white/80">
        <span className="font-medium">Projects</span>
        <span>{projects.length} windows open</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
      <div className="flex justify-center pb-2">
        <div className="flex gap-3 rounded-2xl bg-black/50 px-4 py-2">
          {["#4f8df5", "#e4433b", "#36c26a", "#f4b63f", "#8e6bd8", "#f06ca4", "#39c5cf"].map((color) => (
            <span key={color} className="h-3.5 w-3.5 rounded-full" style={{ background: color }} aria-hidden="true" />
          ))}
        </div>
      </div>
    </div>
  );
}
