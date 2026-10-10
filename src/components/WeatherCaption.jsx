import { useEffect, useState } from "react";
import { getChennaiTime } from "../lib/chennaiTime";

function formatTime({ hour, minute }) {
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

/** Always-visible one-liner: "3:01 PM · 32°C · overcast in Chennai". Updates with the live data. */
export default function WeatherCaption({ weather, className = "" }) {
  const [time, setTime] = useState(() => formatTime(getChennaiTime()));
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(getChennaiTime())), 30_000);
    return () => clearInterval(id);
  }, []);
  const parts = [time];
  if (weather?.temperature != null) parts.push(`${Math.round(weather.temperature)}°C`);
  parts.push(`${weather?.label ?? "clear"} in Chennai`);
  return (
    <p className={`pointer-events-none text-xs text-ink/70 dark:text-cream/70 ${className}`} aria-live="polite">
      {parts.join(" · ")}
    </p>
  );
}
