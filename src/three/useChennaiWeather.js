import { useEffect, useState } from "react";

const ENDPOINT =
  "https://api.open-meteo.com/v1/forecast?latitude=13.08&longitude=80.27&current=temperature_2m,weather_code,is_day";
const CACHE_KEY = "chennai-weather";
const CACHE_TTL = 15 * 60 * 1000;

export const STATES = ["clear", "cloudy", "fog", "rain", "thunderstorm"];

/** Used when nothing has loaded (or the fetch failed): clear, no temperature. */
export const CLEAR_WEATHER = { state: "clear", label: "clear", temperature: null, isDay: true, code: 0 };

/** WMO weather code → our five states and a short label. */
export function mapWeatherCode(code) {
  if (code === 0 || code === 1) return { state: "clear", label: "clear" };
  if (code === 2) return { state: "cloudy", label: "partly cloudy" };
  if (code === 3) return { state: "cloudy", label: "overcast" };
  if (code === 45 || code === 48) return { state: "fog", label: "foggy" };
  if ([51, 53, 55, 56, 57].includes(code)) return { state: "rain", label: "drizzle" };
  if ([61, 66, 80].includes(code)) return { state: "rain", label: "light rain" };
  if ([63, 65, 67, 81, 82].includes(code)) return { state: "rain", label: "rain" };
  if (code >= 71 && code <= 77) return { state: "rain", label: "sleet" };
  if (code === 85 || code === 86) return { state: "rain", label: "showers" };
  if (code === 95 || code === 96 || code === 99) return { state: "thunderstorm", label: "thunderstorm" };
  return { state: "clear", label: "clear" };
}

function normalize(current) {
  const code = Number(current?.weather_code ?? 0);
  return {
    ...mapWeatherCode(code),
    code,
    temperature: typeof current?.temperature_2m === "number" ? current.temperature_2m : null,
    isDay: current?.is_day !== 0,
  };
}

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { savedAt, data } = JSON.parse(raw);
    if (Date.now() - savedAt > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    /* ignore */
  }
}

function devOverride() {
  if (!import.meta.env.DEV) return null;
  const forced = new URLSearchParams(window.location.search).get("weather");
  if (!STATES.includes(forced)) return null;
  const labels = { clear: "clear", cloudy: "overcast", fog: "foggy", rain: "light rain", thunderstorm: "thunderstorm" };
  return { state: forced, label: labels[forced], temperature: 29, isDay: true, code: 0 };
}

/**
 * Live Chennai weather from Open-Meteo (no key), cached in sessionStorage for 15 minutes.
 * Falls back to clear silently. Dev: `?weather=rain` (clear|cloudy|fog|rain|thunderstorm).
 */
export function useChennaiWeather() {
  const [weather, setWeather] = useState(() => devOverride() ?? readCache() ?? CLEAR_WEATHER);

  useEffect(() => {
    if (devOverride()) return undefined;
    let cancelled = false;
    const load = async () => {
      const cached = readCache();
      if (cached) {
        if (!cancelled) setWeather(cached);
        return;
      }
      try {
        const response = await fetch(ENDPOINT);
        if (!response.ok) return;
        const json = await response.json();
        const next = normalize(json.current);
        writeCache(next);
        if (!cancelled) setWeather(next);
      } catch {
        /* keep the previous value; clear by default */
      }
    };
    load();
    const id = setInterval(load, CACHE_TTL);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return weather;
}
