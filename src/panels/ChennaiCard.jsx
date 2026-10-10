import { useEffect, useState } from "react";
import { getChennaiTime } from "../lib/chennaiTime";

export const CHENNAI_DESIGN = { width: 1000, height: 600 };

function formatTime({ hour, minute }) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

/** Small card on the window glass. Weather joins in Phase 6. */
export default function ChennaiCard({ weather }) {
  const [time, setTime] = useState(() => formatTime(getChennaiTime()));
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(getChennaiTime())), 30_000);
    return () => clearInterval(id);
  }, []);
  const parts = [time];
  if (weather?.temperature != null) parts.push(`${Math.round(weather.temperature)}°C`);
  if (weather?.label) parts.push(weather.label);
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-3xl bg-night-900/80 px-16 py-10 text-center text-cream shadow-2xl ring-1 ring-white/10 backdrop-blur">
        <p className="text-xl uppercase tracking-[0.3em] text-cream/60">Chennai now</p>
        <p className="mt-3 text-6xl font-semibold">{parts.join(" · ")}</p>
        <p className="mt-3 text-2xl text-cream/70">where I work</p>
      </div>
    </div>
  );
}
