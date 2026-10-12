import { navigateTo } from "../hooks/useRoute";

/** An <a> to an in-app path that navigates without a reload. Modified clicks and new-tab opens still work. */
export default function RouteLink({ href, onClick, children, ...props }) {
  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (props.target && props.target !== "_self") return;
    event.preventDefault();
    navigateTo(href);
  };
  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
