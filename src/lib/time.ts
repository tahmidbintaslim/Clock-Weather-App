const DAY_SECONDS = 24 * 60 * 60;

/** Sunrise and sunset as Unix time in seconds, as OpenWeather sends them. */
export interface SunTimes {
  sunrise: number;
  sunset: number;
}

/**
 * The UTC offset of an IANA time zone at a given instant, from Intl, so zones
 * with half and quarter hours come out right: "GMT+5:30" (Kolkata),
 * "GMT+5:45" (Kathmandu), "GMT-3", and "GMT+0" for UTC itself.
 */
export function formatGmtOffset(timeZone: string, date: Date = new Date()): string {
  const name = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;
  if (!name || name === "GMT" || name === "UTC") return "GMT+0";
  return name;
}

function localHour(timeZone: string, date: Date): number {
  const hour = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", hourCycle: "h23" })
    .formatToParts(date)
    .find((part) => part.type === "hour")?.value;
  return Number(hour ?? 12);
}

function hasSunTimes(sun: SunTimes | null | undefined): sun is SunTimes {
  return (
    !!sun &&
    sun.sunrise > 0 &&
    sun.sunset > sun.sunrise &&
    sun.sunset - sun.sunrise < DAY_SECONDS
  );
}

/**
 * Whether it is night in a city. With OpenWeather's sunrise and sunset it is
 * night outside that span; the times of day are compared modulo 24 hours, so
 * the answer holds after midnight and while the data is a day or two old.
 * Without them (no weather yet, or none sent) it falls back to 18:00 to 06:00
 * local time.
 */
export function isNightAt(timeZone: string, date: Date, sun?: SunTimes | null): boolean {
  if (hasSunTimes(sun)) {
    const timeOfDay = (seconds: number) => ((seconds % DAY_SECONDS) + DAY_SECONDS) % DAY_SECONDS;
    const now = timeOfDay(Math.floor(date.getTime() / 1000));
    const rise = timeOfDay(sun.sunrise);
    const set = timeOfDay(sun.sunset);
    const isDay = rise < set ? now >= rise && now < set : now >= rise || now < set;
    return !isDay;
  }
  const hour = localHour(timeZone, date);
  return hour < 6 || hour >= 18;
}
