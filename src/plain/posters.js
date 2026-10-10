/** Static posters of the desk (captured from the default camera view), picked by theme. */
export const POSTERS = {
  light: "/assets/desk-poster-light.webp",
  dark: "/assets/desk-poster-dark.webp",
};

export function posterFor(theme) {
  return theme === "dark" ? POSTERS.dark : POSTERS.light;
}
