export const CHENNAI_TZ = "Asia/Kolkata";

/** Hour (0–23) and minute right now in Chennai. */
export function getChennaiTime(date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: CHENNAI_TZ,
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).formatToParts(date);
    const get = (type) => Number(parts.find((p) => p.type === type)?.value ?? 0);
    return { hour: get("hour") % 24, minute: get("minute") };
  } catch {
    return { hour: date.getHours(), minute: date.getMinutes() };
  }
}

/** Sky phase for the window: dawn 5–7, day 7–17, sunset 17–19, night otherwise. */
export function skyPhaseForHour(hour) {
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 17) return "day";
  if (hour >= 17 && hour < 19) return "sunset";
  return "night";
}

export function getChennaiSkyPhase(date = new Date()) {
  return skyPhaseForHour(getChennaiTime(date).hour);
}
