import { useEffect, useState } from "react";

const ENDPOINT =
  "https://api.open-meteo.com/v1/forecast?latitude=13.08&longitude=80.27&current=temperature_2m,weather_code,is_day,cloud_cover,precipitation";
const CACHE_KEY = "chennai-weather";
const CACHE_TTL = 15 * 60 * 1000;

export const STATES = ["clear", "cloudy", "fog", "rain", "thunderstorm"];

/** Used when nothing has loaded (or the fetch failed): clear, no temperature. */
export const CLEAR_WEATHER = { state: "clear", label: "clear", intensity: "none", temperature: null, isDay: true, code: 0, cloudCover: 10, precipitation: 0 };

/** WMO weather code → our five states and a short label. */
/**
 * `intensity` drives how heavy the rain looks: Chennai monsoon rain is usually "heavy".
 * For the dry codes (0–3) the cloud-cover percentage decides the label, so "mildly sunny"
 * afternoons read as "partly cloudy" rather than a flat "clear" or "overcast".
 */
export function mapWeatherCode(code, cloudCover = null) {
  if (code >= 0 && code <= 3) {
    const cover = cloudCover ?? [5, 20, 55, 95][code];
    if (cover < 25) return { state: "clear", label: "clear", intensity: "none" };
    if (cover < 55) return { state: "clear", label: "partly cloudy", intensity: "none" };
    if (cover < 85) return { state: "cloudy", label: "mostly cloudy", intensity: "none" };
    return { state: "cloudy", label: "overcast", intensity: "none" };
  }
  if (code === 45 || code === 48) return { state: "fog", label: "misty", intensity: "none" };
  if ([51, 53, 55, 56, 57].includes(code)) return { state: "rain", label: "drizzle", intensity: "light" };
  if ([61, 66, 80].includes(code)) return { state: "rain", label: "light rain", intensity: "medium" };
  if ([63, 81].includes(code)) return { state: "rain", label: "rain", intensity: "heavy" };
  if ([65, 67, 82].includes(code)) return { state: "rain", label: "heavy rain", intensity: "heavy" };
  if (code >= 71 && code <= 77) return { state: "rain", label: "sleet", intensity: "medium" };
  if (code === 85 || code === 86) return { state: "rain", label: "showers", intensity: "medium" };
  if (code === 95) return { state: "thunderstorm", label: "thunderstorm", intensity: "heavy" };
  if (code === 96 || code === 99) return { state: "thunderstorm", label: "thunderstorm with hail", intensity: "heavy" };
  return { state: "clear", label: "clear", intensity: "none" };
}

function normalize(current) {
  const code = Number(current?.weather_code ?? 0);
  const cloudCover = typeof current?.cloud_cover === "number" ? current.cloud_cover : null;
  const mapped = mapWeatherCode(code, cloudCover);
  const raining = mapped.state === "rain" || mapped.state === "thunderstorm";
  return {
    ...mapped,
    code,
    temperature: typeof current?.temperature_2m === "number" ? current.temperature_2m : null,
    isDay: current?.is_day !== 0,
    cloudCover: cloudCover ?? (raining ? 100 : [5, 20, 55, 95][code] ?? 50),
    precipitation: typeof current?.precipitation === "number" ? current.precipitation : 0,
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

/** Dev: `?weather=` clear | partly | mostly | cloudy | fog | drizzle | rain | heavyrain | thunderstorm. */
const DEV_PRESETS = {
  clear: { code: 0, temperature: 34, cloudCover: 5 },
  partly: { code: 2, temperature: 33, cloudCover: 45 },
  mostly: { code: 3, temperature: 32, cloudCover: 72 },
  cloudy: { code: 3, temperature: 31, cloudCover: 97 },
  fog: { code: 45, temperature: 24, cloudCover: 100 },
  drizzle: { code: 51, temperature: 28, cloudCover: 90 },
  rain: { code: 61, temperature: 27, cloudCover: 100 },
  heavyrain: { code: 65, temperature: 25, cloudCover: 100 },
  thunderstorm: { code: 95, temperature: 25, cloudCover: 100 },
};

function devOverride() {
  if (!import.meta.env.DEV) return null;
  const forced = new URLSearchParams(window.location.search).get("weather");
  const preset = DEV_PRESETS[forced];
  if (!preset) return null;
  return { ...mapWeatherCode(preset.code, preset.cloudCover), code: preset.code, temperature: preset.temperature, isDay: true, cloudCover: preset.cloudCover, precipitation: 0 };
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
