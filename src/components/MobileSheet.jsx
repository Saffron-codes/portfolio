import { useEffect, useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";

/**
 * Full-screen sheet for phones. Slides up, swipe down on the header (or tap ✕ / press Esc) to close.
 * `tone` picks a header style that matches the object the section belongs to.
 */
export default function MobileSheet({ title, tone = "paper", onClose, children }) {
  const sheet = useRef(null);
  const drag = useRef({ startY: 0, dy: 0, active: false });
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    sheet.current?.focus({ preventScroll: true });
  }, []);

  const onTouchStart = (event) => {
    drag.current = { startY: event.touches[0].clientY, dy: 0, active: true };
  };
  const onTouchMove = (event) => {
    if (!drag.current.active) return;
    const dy = Math.max(0, event.touches[0].clientY - drag.current.startY);
    drag.current.dy = dy;
    setOffset(dy);
  };
  const onTouchEnd = () => {
    const { dy } = drag.current;
    drag.current.active = false;
    if (dy > 110) onClose();
    else setOffset(0);
  };

  const tones = {
    paper: "bg-[#f6efe0] text-ink",
    desktop: "bg-[#1f2535] text-white",
    editor: "bg-[#181825] text-[#cdd6f4]",
    night: "bg-night-900 text-cream",
    phone: "bg-sage-600 text-white",
    cream: "bg-cream text-ink",
  };

  return (
    <div
      ref={sheet}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      className="fixed inset-0 z-30 flex flex-col bg-cream text-ink shadow-2xl outline-none transition-transform duration-200 motion-reduce:transition-none dark:bg-night-900 dark:text-cream"
      style={{ transform: `translateY(${offset}px)`, transitionProperty: offset ? "none" : undefined }}
    >
      <header
        className={`flex items-center justify-between px-4 pb-3 pt-3 ${tones[tone] ?? tones.paper}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <span className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-current opacity-40" aria-hidden="true" />
        <h2 className="mt-1 text-base font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <FaXmark size={16} aria-hidden="true" />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
