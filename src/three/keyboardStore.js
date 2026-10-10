/** Tiny event bus so DOM key presses and section opens can animate the 3D keycaps. */
const listeners = new Set();

function emit(event) {
  listeners.forEach((fn) => fn(event));
}

export const keyboardEvents = {
  /** Press one keycap by its label (e.g. "A", "Space", "Enter"). */
  press(label) {
    emit({ type: "press", label });
  },
  /** Press every key in a left-to-right ripple. */
  ripple() {
    emit({ type: "ripple" });
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

/** Map a DOM KeyboardEvent.key to a keycap label on the 75% layout. */
export function labelForKey(key) {
  if (key.length === 1) {
    if (key === " ") return "Space";
    return key.toUpperCase();
  }
  const map = {
    Enter: "Enter",
    Backspace: "Backspace",
    Shift: "Shift",
    Control: "Ctrl",
    Alt: "Alt",
    Meta: "Win",
    Tab: "Tab",
    Escape: "Esc",
    CapsLock: "Caps",
    ArrowUp: "Up",
    ArrowDown: "Down",
    ArrowLeft: "Left",
    ArrowRight: "Right",
    Delete: "Del",
    Home: "Home",
    End: "End",
    PageUp: "PgUp",
    PageDown: "PgDn",
  };
  if (map[key]) return map[key];
  if (/^F\d{1,2}$/.test(key)) return key;
  return null;
}
