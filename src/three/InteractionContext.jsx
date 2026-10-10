import { createContext, useContext } from "react";

/** Hover/active state and callbacks, provided inside the Canvas by Experience. */
export const InteractionContext = createContext({
  hovered: null,
  active: null,
  setHovered: () => {},
  select: () => {},
});

export function useInteraction() {
  return useContext(InteractionContext);
}
