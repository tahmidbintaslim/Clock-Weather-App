import type { Zone } from "../data/countries";

/** Query parameter for a shareable list: ?cities=Santiago,CL;Dhaka,BD */
export const CITIES_PARAM = "cities";
/** localStorage key; the value is a JSON array of OpenWeather city queries. */
export const CITIES_STORAGE_KEY = "cities";

/**
 * Maps city queries ("Dhaka,BD", any case) to the picker's zones, in order.
 * Unknown entries and repeats are dropped, and the list stops at `max`.
 */
export function resolveCities(entries: readonly string[], options: readonly Zone[], max: number): Zone[] {
  const byCity = new Map(options.map((zone) => [zone.city.toLowerCase(), zone]));
  const zones: Zone[] = [];
  for (const entry of entries) {
    if (zones.length >= max) break;
    const zone = byCity.get(entry.trim().toLowerCase());
    if (zone && !zones.includes(zone)) zones.push(zone);
  }
  return zones;
}

export function parseCitiesParam(value: string): string[] {
  return value.split(";").map((entry) => entry.trim()).filter(Boolean);
}

/** The ?cities= value for a list of zones, with commas left readable. */
export function formatCitiesParam(zones: readonly Zone[]): string {
  return zones.map((zone) => encodeURIComponent(zone.city).replace(/%2C/gi, ",")).join(";");
}

export function serializeCities(zones: readonly Zone[]): string {
  return JSON.stringify(zones.map((zone) => zone.city));
}

function parseStoredCities(stored: string | null): string[] | null {
  if (!stored) return null;
  try {
    const value: unknown = JSON.parse(stored);
    return Array.isArray(value) && value.every((entry) => typeof entry === "string") ? value : null;
  } catch {
    return null;
  }
}

export interface InitialCitiesInput {
  /** location.search */
  search: string;
  /** The saved localStorage value, or null. */
  stored: string | null;
  options: readonly Zone[];
  defaults: readonly Zone[];
  max: number;
}

/**
 * The cities to show on load: a ?cities= link wins, then the list saved in
 * this browser (an empty saved list stays empty), then the defaults. Entries
 * the picker does not offer are ignored.
 */
export function initialCities({ search, stored, options, defaults, max }: InitialCitiesInput): Zone[] {
  const param = new URLSearchParams(search).get(CITIES_PARAM);
  if (param !== null) {
    const fromLink = resolveCities(parseCitiesParam(param), options, max);
    if (fromLink.length > 0) return fromLink;
  }

  const saved = parseStoredCities(stored);
  if (saved) {
    if (saved.length === 0) return [];
    const fromStorage = resolveCities(saved, options, max);
    if (fromStorage.length > 0) return fromStorage;
  }

  return defaults.slice(0, max);
}

/**
 * Path, query and hash of `href` with ?cities= set to `zones`, or removed
 * when there are none. Other query parameters and the hash are kept.
 */
export function urlWithCities(href: string, zones: readonly Zone[]): string {
  const url = new URL(href);
  const params = new URLSearchParams(url.search);
  params.delete(CITIES_PARAM);
  const query = [params.toString(), zones.length > 0 ? `${CITIES_PARAM}=${formatCitiesParam(zones)}` : ""]
    .filter(Boolean)
    .join("&");
  return `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
}
