import { useEffect, useState } from "react";
import { getChennaiSkyPhase } from "../lib/chennaiTime";

const PHASES = ["dawn", "day", "sunset", "night"];

function devOverride() {
  if (!import.meta.env.DEV) return null;
  const forced = new URLSearchParams(window.location.search).get("sky");
  return PHASES.includes(forced) ? forced : null;
}

/**
 * Chennai time-of-day phase, recomputed on every minute boundary.
 * `minute` is a counter that increments each minute (a cheap dependency for redraws).
 * Dev: `?sky=night` (dawn|day|sunset|night) forces a phase.
 */
export function useSky() {
  const [sky, setSky] = useState(() => devOverride() ?? getChennaiSkyPhase());
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    let interval = 0;
    const tick = () => {
      setSky(devOverride() ?? getChennaiSkyPhase());
      setMinute((m) => m + 1);
    };
    const now = new Date();
    const untilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, untilNextMinute);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return { sky, minute };
}
