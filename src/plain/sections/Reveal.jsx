import { useReveal } from "../../hooks/useReveal";

/**
 * Fade + 16 px rise when it scrolls into view (once). `delay` in ms staggers siblings.
 * With `group`, direct children marked `data-reveal-item` stagger themselves by `--i`.
 */
export default function Reveal({ as: Tag = "div", delay = 0, group = false, className = "", style, children, ...props }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`${group ? "reveal-group " : ""}${className}`} style={{ "--delay": delay, ...style }} {...props}>
      {children}
    </Tag>
  );
}
