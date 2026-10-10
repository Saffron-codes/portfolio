import { FaAward, FaBook, FaDesktop, FaFileArrowDown, FaKeyboard, FaLaptop, FaLightbulb, FaMobileScreen } from "react-icons/fa6";

const ITEMS = [
  { object: "monitor", label: "Projects", Icon: FaDesktop },
  { object: "laptop", label: "Work", Icon: FaLaptop },
  { object: "keyboard", label: "Skills", Icon: FaKeyboard },
  { object: "phone", label: "Contact", Icon: FaMobileScreen },
  { object: "notebook", label: "About", Icon: FaBook },
  { object: "certificate", label: "Degree", Icon: FaAward },
  { object: "resumeSheet", label: "Resume", Icon: FaFileArrowDown },
  { object: "switchboard", label: "Lights", Icon: FaLightbulb },
];

/** Sticky bottom dock for phones: one icon per desk object. */
export default function MobileDock({ onSelect, activeObject, isDark, buttonRefs }) {
  return (
    <nav aria-label="Desk objects" className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-cream/90 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-cream/10 dark:bg-night-900/90">
      <ul className="grid grid-cols-8">
        {ITEMS.map(({ object, label, Icon }) => {
          const current = activeObject === object;
          const text = label;
          const aria = object === "switchboard" ? (isDark ? "Turn the lights on" : "Turn the lights off") : object === "resumeSheet" ? "Download resume" : `Open ${label.toLowerCase()}`;
          return (
            <li key={object}>
              <button
                type="button"
                ref={(el) => {
                  if (buttonRefs) buttonRefs.current[object] = el;
                }}
                onClick={() => onSelect(object)}
                aria-current={current ? "true" : undefined}
                aria-label={aria}
                className={`flex w-full flex-col items-center gap-1 px-0.5 py-2 text-[9px] font-medium leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage-600 ${
                  current ? "text-sage-700 dark:text-sage-300" : "text-ink/70 dark:text-cream/70"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="max-w-full truncate" aria-hidden="true">{text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
