// Projects in display order. `image` may be a local path or a remote URL;
// the UI shows a styled placeholder if it is missing or fails to load.
const projects = [
  {
    id: "nomad",
    title: "Nomad",
    description:
      "Cross-platform desktop focus timer for Windows, macOS and Linux. Set work and break lengths, press Start, and it quietly keeps time from the system tray. No accounts, no cloud, no analytics.",
    stack: ["Tauri", "Rust", "React", "TypeScript", "Zustand", "Tailwind CSS"],
    links: [
      { label: "GitHub", url: "https://github.com/Saffron-codes/nomad" },
      { label: "Download", url: "https://github.com/Saffron-codes/nomad/releases/tag/v1.0.0" },
    ],
    // Add public/assets/nomad.webp, then set: image: "/assets/nomad.webp"
    image: null,
    badge: "v1.0.0",
  },
  {
    id: "svik",
    title: "Svik",
    description:
      "All-in-one social media platform with a Flutter client and a Node.js backend; in active development.",
    stack: ["Flutter", "Dart", "Node.js"],
    links: [
      { label: "Website", url: "https://svik.netlify.app/" },
      { label: "GitHub", url: "https://github.com/svikapp/svik" },
    ],
    image: "/assets/svik.webp",
    badge: "In development",
  },
  {
    id: "ai-circuit-builder",
    title: "AI Circuit Builder",
    description:
      "AI-powered tool that generates small to intermediate electronic circuits from text prompts.",
    stack: ["PostgreSQL", "Express.js", "React", "Node.js", "OpenAI GPT"],
    links: [{ label: "Live", url: "https://acb-u0bu.onrender.com/" }],
    // Add public/assets/ai-circuit-builder.webp, then set: image: "/assets/ai-circuit-builder.webp"
    image: null,
  },
  {
    id: "note-warden",
    title: "Note Warden",
    description:
      "Note-taking app that lets students organise notes into separate collections.",
    stack: ["Flutter", "Dart"],
    links: [{ label: "GitHub", url: "https://github.com/Saffron-codes/note_warden" }],
    image:
      "https://raw.githubusercontent.com/Saffron-codes/note_warden/dev/assets/Note%20Warden.png",
  },
  {
    id: "deskpulse",
    title: "Deskpulse",
    description:
      "Customisable smart desk display that shows a personal mini dashboard (clock, local weather, stock prices or any data available through an API), configured from A to Z through a connected phone.",
    // TODO: confirm the real stack for Deskpulse.
    stack: ["Embedded", "IoT"],
    links: [{ label: "GitHub", url: "https://github.com/Saffron-codes/deskpulse" }],
    // Add public/assets/deskpulse.webp, then set: image: "/assets/deskpulse.webp"
    image: null,
  },
  {
    id: "love-calculator",
    title: "Love Calculator",
    description:
      "Simple Flutter app that calculates a love percentage between two names.",
    stack: ["Flutter", "Dart"],
    links: [{ label: "GitHub", url: "https://github.com/Saffron-codes/love_calculator_app" }],
    image: "/assets/love_calculator.webp",
  },
];

export default projects;
