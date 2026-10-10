import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

function readStoredTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

function systemTheme() {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

/**
 * Light/dark theme. Default comes from prefers-color-scheme; an explicit
 * choice is remembered in localStorage (guarded, storage may be unavailable).
 */
export function useTheme() {
  const [theme, setThemeState] = useState(() => readStoredTheme() ?? systemTheme());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Follow the OS preference while the visitor has not made an explicit choice.
  useEffect(() => {
    if (readStoredTheme()) return undefined;
    let media;
    try {
      media = window.matchMedia("(prefers-color-scheme: dark)");
    } catch {
      return undefined;
    }
    const onChange = (event) => setThemeState(event.matches ? "dark" : "light");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable, keep the in-memory value */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, isDark: theme === "dark", setTheme, toggleTheme };
}
