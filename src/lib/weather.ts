import type { WeatherErrorBody, WeatherPayload } from "../../api/weather";

export type WeatherInfo = WeatherPayload;

/** Why a weather lookup failed, as far as the UI needs to know. */
export type WeatherFailure = "not-configured" | "not-found" | "unavailable";

export class WeatherRequestError extends Error {
  readonly failure: WeatherFailure;

  constructor(failure: WeatherFailure, message: string) {
    super(message);
    this.name = "WeatherRequestError";
    this.failure = failure;
  }
}

function failureFor(body: unknown): WeatherFailure {
  const code = (body as Partial<WeatherErrorBody> | null)?.code;
  if (code === "not_configured") return "not-configured";
  if (code === "not_found") return "not-found";
  return "unavailable";
}

function isWeatherInfo(body: unknown): body is WeatherInfo {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof (body as WeatherInfo).temp === "number" &&
    typeof (body as WeatherInfo).main === "string"
  );
}

/**
 * Current weather for an OpenWeather city query such as "Dhaka,BD", read
 * through this app's /api/weather function. The browser never sees the key.
 */
export async function fetchWeather(city: string): Promise<WeatherInfo> {
  let response: Response;
  try {
    response = await fetch(`/api/weather?q=${encodeURIComponent(city)}`, {
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new WeatherRequestError("unavailable", "Network error");
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new WeatherRequestError(failureFor(body), `Weather request failed with HTTP ${response.status}`);
  }
  if (!isWeatherInfo(body)) {
    throw new WeatherRequestError("unavailable", "Weather response was not weather data");
  }
  return body;
}

export function failureOf(error: unknown): WeatherFailure {
  return error instanceof WeatherRequestError ? error.failure : "unavailable";
}

/** Hint shown under "Weather unavailable" for each kind of failure. */
export function weatherFailureHint(failure: WeatherFailure | undefined): string {
  switch (failure) {
    case "not-configured":
      return "Set OPENWEATHER_API_KEY on the server (see the README)";
    case "not-found":
      return "OpenWeather has no data for this city";
    default:
      return "Check your internet connection and try refreshing";
  }
}
