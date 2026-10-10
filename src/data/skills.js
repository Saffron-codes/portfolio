// Skill groups in display order. Shown as keycap chips (plain view cards and the panel above the 3D keyboard).
const skills = [
  { id: "languages", label: "Languages", items: ["Dart", "TypeScript", "Python", "Java", "C", "Rust"] },
  { id: "mobile", label: "Mobile", items: ["Flutter", "React Native", "Android"] },
  { id: "desktop", label: "Desktop", items: ["Tauri"] },
  { id: "frontend", label: "Frontend", items: ["React", "Next.js"] },
  {
    id: "backend",
    label: "Backend & Databases",
    items: ["Node.js", "Express.js", "FastAPI", "REST APIs", "PostgreSQL", "Supabase", "Firebase"],
  },
  { id: "tools", label: "Tools & Other", items: ["Git", "GitHub", "GitHub Actions", "OpenAI GPT API", "Embedded C"] },
];

export default skills;
