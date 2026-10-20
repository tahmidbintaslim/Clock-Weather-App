// GET /api/weather?q=<City>,<CC>
//
// Vercel function (Node.js runtime, Web Request/Response handler) that reads
// OpenWeather's current weather for one city. The API key stays on the
// server: it comes from OPENWEATHER_API_KEY, which has no VITE_ prefix, so
// Vite never inlines it into the browser bundle. `npm run dev` and
// `npm run preview` mount this same handler (see vite.config.ts).
//
// Keep this file free of local imports: Vercel compiles it on its own.

const UPSTREAM_URL = "https://api.openweathermap.org/data/2.5/weather";
const UPSTREAM_TIMEOUT_MS = 8000;

/** The value .env.example ships with. Treated the same as a missing key. */
export const PLACEHOLDER_API_KEY = "your_api_key_here";

/**
 * The OpenWeather queries the city picker offers (`city` in
 * src/data/countries.ts). Only these reach OpenWeather, so the function is not
 * an open proxy and the CDN cache holds at most one entry per city.
 * tests/weather-api.test.ts fails when the two lists drift apart.
 */
export const ALLOWED_CITIES: ReadonlySet<string> = new Set([
  "Kabul,AF", "Tirana,AL", "Algiers,DZ", "Buenos Aires,AR", "Yerevan,AM",
  "Sydney,AU", "Vienna,AT", "Baku,AZ", "Manama,BH", "Dhaka,BD", "Minsk,BY",
  "Brussels,BE", "La Paz,BO", "Brasilia,BR", "Sofia,BG", "Phnom Penh,KH",
  "Ottawa,CA", "Santiago,CL", "Beijing,CN", "Bogota,CO", "Zagreb,HR",
  "Prague,CZ", "Copenhagen,DK", "Quito,EC", "Cairo,EG", "Tallinn,EE",
  "Addis Ababa,ET", "Helsinki,FI", "Paris,FR", "Tbilisi,GE", "Berlin,DE",
  "Accra,GH", "Athens,GR", "Budapest,HU", "Reykjavik,IS", "New Delhi,IN",
  "Jakarta,ID", "Tehran,IR", "Baghdad,IQ", "Dublin,IE", "Jerusalem,IL",
  "Rome,IT", "Tokyo,JP", "Amman,JO", "Nur-Sultan,KZ", "Nairobi,KE",
  "Kuwait City,KW", "Riga,LV", "Beirut,LB", "Vilnius,LT", "Luxembourg,LU",
  "Kuala Lumpur,MY", "Mexico City,MX", "Rabat,MA", "Amsterdam,NL",
  "Wellington,NZ", "Abuja,NG", "Oslo,NO", "Islamabad,PK", "Lima,PE",
  "Manila,PH", "Warsaw,PL", "Lisbon,PT", "Doha,QA", "Bucharest,RO",
  "Moscow,RU", "Riyadh,SA", "Belgrade,RS", "Singapore,SG", "Bratislava,SK",
  "Ljubljana,SI", "Cape Town,ZA", "Seoul,KR", "Madrid,ES", "Colombo,LK",
  "Stockholm,SE", "Bern,CH", "Taipei,TW", "Bangkok,TH", "Ankara,TR",
  "Kyiv,UA", "Abu Dhabi,AE", "London,GB", "Washington,US", "Montevideo,UY",
  "Caracas,VE", "Hanoi,VN",
]);

// Vercel's CDN keeps a good answer for 10 minutes (OpenWeather refreshes
// current weather about that often) and may serve it for one more minute
// while it fetches a new one. Browsers do not cache it (max-age=0), so the
// Refresh button always asks the CDN.
const FRESH_SECONDS = 600;
export const CACHE_OK = cacheOk(FRESH_SECONDS);
const CACHE_NOT_FOUND = `public, max-age=0, s-maxage=${FRESH_SECONDS}`;
const CACHE_NONE = "no-store";

function cacheOk(sMaxAge: number): string {
  return `public, max-age=0, s-maxage=${sMaxAge}, stale-while-revalidate=60`;
}

// The CDN keys on the raw URL, so q=Dhaka,BD, q=Dhaka%2CBD and q=D%68aka,BD
// are separate CDN entries that all reach this function. Each function
// instance therefore keeps what OpenWeather said per city as well: a good
// answer or a 404 for 10 minutes, a failure for 30 seconds (so an outage or
// a used-up quota is not retried on every request). Concurrent requests for
// one city share a single upstream call. The map holds at most one entry per
// allowed city.
export const MEMO_OK_MS = FRESH_SECONDS * 1000;
export const MEMO_ERROR_MS = 30_000;

type UpstreamOutcome =
  | { kind: "ok"; payload: WeatherPayload }
  | { kind: "not_found" }
  | { kind: "error"; error: string };

interface MemoEntry {
  fetchedAt: number;
  expires: number;
  outcome: Promise<UpstreamOutcome>;
}

export type WeatherMemo = Map<string, MemoEntry>;

const instanceMemo: WeatherMemo = new Map();

export interface WeatherPayload {
  /** Air temperature, °C. */
  temp: number;
  /** OpenWeather's "feels like" temperature (main.feels_like), °C. */
  feelsLike: number;
  description: string;
  /** Condition group in lower case: "clear", "clouds", "rain", ... */
  main: string;
  /** Unix time in seconds (sys.sunrise). 0 when OpenWeather sends none. */
  sunrise: number;
  /** Unix time in seconds (sys.sunset). 0 when OpenWeather sends none. */
  sunset: number;
}

export type WeatherErrorCode =
  | "bad_request"
  | "method_not_allowed"
  | "not_configured"
  | "not_found"
  | "upstream_error";

export interface WeatherErrorBody {
  code: WeatherErrorCode;
  error: string;
}

export interface WeatherHandlerOptions {
  apiKey?: string | undefined;
  fetchImpl?: typeof fetch;
  /** Per-instance answers by city (see MEMO_OK_MS). Omit to always ask OpenWeather. */
  memo?: WeatherMemo | undefined;
  /** Clock in milliseconds, for tests. */
  now?: () => number;
}

function json(
  status: number,
  body: WeatherPayload | WeatherErrorBody,
  cacheControl: string,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl,
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function fail(
  status: number,
  code: WeatherErrorCode,
  error: string,
  cacheControl = CACHE_NONE,
  extraHeaders: Record<string, string> = {},
): Response {
  return json(status, { code, error }, cacheControl, extraHeaders);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function finiteNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/** Picks the fields the app uses out of an OpenWeather current-weather body. */
export function toWeatherPayload(data: unknown): WeatherPayload | null {
  if (!isRecord(data) || !isRecord(data.main) || !Array.isArray(data.weather)) {
    return null;
  }
  const condition: unknown = data.weather[0];
  if (!isRecord(condition) || typeof condition.main !== "string") return null;

  const temp = finiteNumber(data.main.temp);
  if (temp === undefined) return null;

  const sys = isRecord(data.sys) ? data.sys : {};
  return {
    temp,
    feelsLike: finiteNumber(data.main.feels_like) ?? temp,
    description: typeof condition.description === "string" ? condition.description : "",
    main: condition.main.toLowerCase(),
    sunrise: finiteNumber(sys.sunrise) ?? 0,
    sunset: finiteNumber(sys.sunset) ?? 0,
  };
}

/** One OpenWeather call for an allowed city. Never rejects. */
async function fetchUpstream(q: string, key: string, fetchImpl: typeof fetch): Promise<UpstreamOutcome> {
  const upstreamUrl = new URL(UPSTREAM_URL);
  upstreamUrl.searchParams.set("q", q);
  upstreamUrl.searchParams.set("units", "metric");
  upstreamUrl.searchParams.set("appid", key);

  let upstream: Response;
  try {
    upstream = await fetchImpl(upstreamUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    return { kind: "error", error: "OpenWeather did not respond." };
  }

  if (upstream.status === 404) return { kind: "not_found" };
  if (!upstream.ok) {
    // Log the status only: the upstream URL carries the key.
    console.error(`OpenWeather answered HTTP ${upstream.status}`);
    return { kind: "error", error: "OpenWeather returned an error." };
  }

  let payload: WeatherPayload | null;
  try {
    payload = toWeatherPayload(await upstream.json());
  } catch {
    payload = null;
  }
  if (!payload) return { kind: "error", error: "OpenWeather sent an unexpected response." };
  return { kind: "ok", payload };
}

/** The memo entry for `q`, reusing a live one or starting one upstream call. */
function lookup(
  q: string,
  key: string,
  fetchImpl: typeof fetch,
  memo: WeatherMemo | undefined,
  now: () => number,
): MemoEntry {
  const startedAt = now();
  const cached = memo?.get(q);
  if (cached && cached.expires > startedAt) return cached;

  const entry: MemoEntry = {
    fetchedAt: startedAt,
    expires: startedAt + MEMO_OK_MS,
    outcome: fetchUpstream(q, key, fetchImpl),
  };
  if (memo) {
    memo.set(q, entry);
    void entry.outcome.then((outcome) => {
      if (outcome.kind === "error") entry.expires = Math.min(entry.expires, now() + MEMO_ERROR_MS);
    });
  }
  return entry;
}

export async function handleWeatherRequest(
  request: Request,
  { apiKey, fetchImpl = fetch, memo, now = Date.now }: WeatherHandlerOptions = {},
): Promise<Response> {
  if (request.method !== "GET") {
    return fail(405, "method_not_allowed", "Use GET.", CACHE_NONE, { Allow: "GET" });
  }

  // Only one parameter, q, and only a city the picker offers. User input is
  // never echoed back in the error text.
  const { searchParams } = new URL(request.url);
  const names = [...searchParams.keys()];
  if (names.length !== 1 || names[0] !== "q") {
    return fail(400, "bad_request", 'Pass exactly one query parameter, "q", such as q=Dhaka,BD.');
  }
  const q = searchParams.get("q") ?? "";
  if (!ALLOWED_CITIES.has(q)) {
    return fail(400, "bad_request", "This city is not in the app's city list.");
  }

  const key = apiKey?.trim();
  if (!key || key === PLACEHOLDER_API_KEY) {
    return fail(503, "not_configured", "OPENWEATHER_API_KEY is not set on the server.");
  }

  const entry = lookup(q, key, fetchImpl, memo, now);
  const outcome = await entry.outcome;
  if (outcome.kind === "not_found") {
    return fail(404, "not_found", "OpenWeather has no data for this city.", CACHE_NOT_FOUND);
  }
  if (outcome.kind === "error") {
    return fail(502, "upstream_error", outcome.error);
  }
  // A memo hit is already some seconds old: shorten the CDN's copy to match,
  // so the browser never sees data more than about 11 minutes old.
  const ageSeconds = Math.floor((now() - entry.fetchedAt) / 1000);
  return json(200, outcome.payload, cacheOk(Math.max(1, FRESH_SECONDS - ageSeconds)));
}

export function GET(request: Request): Promise<Response> {
  return handleWeatherRequest(request, {
    apiKey: process.env.OPENWEATHER_API_KEY,
    memo: instanceMemo,
  });
}
