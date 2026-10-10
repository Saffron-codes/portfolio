import { createContext, useContext } from "react";

/** Theme/time/motion state shared by everything inside the Canvas (R3F 8 does not bridge outer contexts). */
export const SceneContext = createContext({
  theme: "light",
  lightsOn: true,
  sky: "day",
  isNight: false,
  reducedMotion: false,
});

export function useScene() {
  return useContext(SceneContext);
}
