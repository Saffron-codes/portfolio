// Roles in display order (most recent first). `end` is null for single-month roles.
const experience = [
  {
    id: "freelance",
    role: "Software Engineer",
    company: "Freelance",
    location: "Remote (Leeds, UK)",
    start: "Nov 2023",
    end: "Present",
    bullets: [
      "Build cross-platform mobile apps end to end in Flutter and Dart, owning the UI, business logic, backend and data layer.",
      "Develop REST APIs with FastAPI (Python).",
      "Design and manage databases for app backends using PostgreSQL and Supabase.",
    ],
  },
  {
    id: "code-clause",
    role: "Flutter Developer Intern",
    company: "Code Clause",
    location: "Delhi, India",
    start: "Jul 2023",
    end: null,
    bullets: [
      "Developed Android applications in Flutter and Dart.",
      "Designed app screens and UI layouts with Flutter widgets, following Material Design guidelines.",
    ],
  },
  {
    id: "nevee",
    role: "Bare Metal Programmer",
    company: "Nevee Technologies",
    location: "Keelkattalai, Chennai",
    start: "May 2023",
    end: null,
    bullets: [
      "Programmed the KL25 (ARM Cortex-M0) microcontroller in Embedded C.",
      "Studied the KL25 microcontroller architecture and worked directly with its registers and peripherals, without an operating system.",
    ],
  },
  {
    id: "oasis",
    role: "Android Developer Intern",
    company: "Oasis Infobyte",
    location: "Delhi, India",
    start: "Apr 2023",
    end: null,
    bullets: [
      "Developed Android applications in Java.",
      "Learned core Android app development concepts, including activities, layouts and the app lifecycle.",
    ],
  },
];

export default experience;
