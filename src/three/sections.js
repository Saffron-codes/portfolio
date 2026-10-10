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
  { object: "chair", label: "Office chair" },
  { object: "door", label: "Door" },
];

/** A second line under the hover label for objects that are real products on the desk. */
export const DETAILS = {
  phone: "Samsung Galaxy S24",
  keyboard: "Kreo 75% mechanical",
  monitor: "22-inch monitor",
  laptop: "15.6-inch laptop on a stand",
  deskpulse: "my own desk display",
};

/** Objects that only show a label on hover (nothing opens). */
export const INFO = {
  mouse: { label: "Dell mouse", detail: "wired, matte, does the job" },
  earbudsCase: { label: "realme earbuds", detail: "in their zip pouch" },
  glassesCase: { label: "Specs case", detail: "Lenskart hard case" },
  penHolder: { label: "Pen holder", detail: "pens, a box cutter and a screwdriver" },
  steelTin: { label: "Steel tin", detail: "bits and bobs" },
};

/** Tab order for the accessible button list. */
export const TAB_ORDER = [...SECTIONS.map((s) => s.object), "resumeSheet", "switchboard", "chair", "door"];

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
