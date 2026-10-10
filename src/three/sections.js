/** Content sections and the desk object that opens each one. Order = shortcut number and tab order. */
export const SECTIONS = [
  { id: "about", object: "notebook", label: "About", shortcut: "1" },
  { id: "projects", object: "monitor", label: "Projects", shortcut: "2" },
  { id: "experience", object: "laptop", label: "Experience", shortcut: "3" },
  { id: "skills", object: "keyboard", label: "Skills", shortcut: "4" },
  { id: "contact", object: "phone", label: "Contact", shortcut: "5" },
  { id: "deskpulse", object: "deskpulse", label: "Deskpulse", shortcut: "6" },
  { id: "education", object: "certificate", label: "Education", shortcut: "7" },
  { id: "chennai", object: "window", label: "Chennai now", shortcut: "8" },
];

/** Objects that do something immediately instead of opening a section. */
export const ACTIONS = [
  { object: "resumeSheet", label: "Download resume" },
  { object: "switchboard", label: "Lights" },
];

/** Tab order for the accessible button list. */
export const TAB_ORDER = [...SECTIONS.map((s) => s.object), "resumeSheet", "switchboard"];

export const LABELS = Object.fromEntries([...SECTIONS, ...ACTIONS].map((entry) => [entry.object, entry.label]));

export function sectionForObject(object) {
  return SECTIONS.find((s) => s.object === object) ?? null;
}

export function sectionById(id) {
  return SECTIONS.find((s) => s.id === id) ?? null;
}

export function isInteractive(object) {
  return object in LABELS;
}
