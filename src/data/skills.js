// Skill groups in display order. Each group becomes one keyboard row in the scene.
const skills = [
  { id: "languages", label: "Languages", items: ["Dart", "TypeScript", "Python", "Java", "C"] },
  { id: "mobile", label: "Mobile", items: ["Flutter", "React Native", "Android"] },
  { id: "frontend", label: "Frontend", items: ["React", "Next.js"] },
  {
    id: "backend",
    label: "Backend & Databases",
    items: ["Node.js", "Express.js", "FastAPI", "REST APIs", "PostgreSQL", "Supabase", "Firebase"],
  },
  { id: "tools", label: "Tools & Other", items: ["Git", "GitHub", "OpenAI GPT API", "Embedded C"] },
];

export default skills;
