import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ALLOWED_CITIES,
  CACHE_OK,
  PLACEHOLDER_API_KEY,
  handleWeatherRequest,
  toWeatherPayload,
} from "../api/weather.ts";
import { COUNTRY_OPTIONS } from "../src/data/countries.ts";

const KEY = "test-key-not-a-real-key";

const OPENWEATHER_BODY = {
  weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01n" }],
  main: { temp: 27.4, feels_like: 31.2, humidity: 80 },
  sys: { country: "BD", sunrise: 1760831340, sunset: 1760873160 },
  timezone: 21600,
  name: "Dhaka",
};

function request(query: string, method = "GET"): Request {
  return new Request(`http://localhost/api/weather${query}`, { method });
}

function fakeFetch(response: () => Response | Promise<Response>) {
  const calls: URL[] = [];
  const impl = (async (input: string | URL | Request) => {
    calls.push(new URL(input instanceof Request ? input.url : input));
    return response();
  }) as typeof fetch;
  return { calls, impl };
}

function failingFetch(): typeof fetch {
  return (async () => {
    throw new Error("fetch must not be called");
  }) as typeof fetch;
}

describe("ALLOWED_CITIES", () => {
  it("matches the city list the picker offers", () => {
    const offered = new Set(COUNTRY_OPTIONS.map((zone) => zone.city));
    assert.deepEqual([...ALLOWED_CITIES].sort(), [...offered].sort());
  });
});

describe("handleWeatherRequest", () => {
  it("rejects methods other than GET", async () => {
    const res = await handleWeatherRequest(request("?q=Dhaka,BD", "POST"), {
      apiKey: KEY,
      fetchImpl: failingFetch(),
    });
    assert.equal(res.status, 405);
    assert.equal(res.headers.get("allow"), "GET");
    assert.equal(res.headers.get("cache-control"), "no-store");
  });

  for (const query of [
    "",
    "?q=Dhaka,BD&appid=x",
    "?q=Dhaka,BD&q=Bangkok,TH",
    "?units=imperial",
    "?q=",
    "?q=Atlantis,XX",
    "?q=dhaka,bd",
    "?q=Dhaka,BD%00",
  ]) {
    it(`rejects ${JSON.stringify(query)} without calling OpenWeather`, async () => {
      const res = await handleWeatherRequest(request(query), { apiKey: KEY, fetchImpl: failingFetch() });
      assert.equal(res.status, 400);
      const body = (await res.json()) as { code: string; error: string };
      assert.equal(body.code, "bad_request");
      assert.ok(!body.error.includes("Atlantis"), "user input is not echoed");
    });
  }

  for (const apiKey of [undefined, "", "   ", PLACEHOLDER_API_KEY]) {
    it(`answers 503 when the key is ${JSON.stringify(apiKey)}`, async () => {
      const res = await handleWeatherRequest(request("?q=Dhaka,BD"), { apiKey, fetchImpl: failingFetch() });
      assert.equal(res.status, 503);
      assert.equal(((await res.json()) as { code: string }).code, "not_configured");
    });
  }

  it("returns the fields the app uses and lets the CDN cache them", async () => {
    const upstream = fakeFetch(() => Response.json(OPENWEATHER_BODY));
    const res = await handleWeatherRequest(request("?q=Buenos%20Aires%2CAR"), {
      apiKey: KEY,
      fetchImpl: upstream.impl,
    });

    assert.equal(res.status, 200);
    assert.equal(res.headers.get("cache-control"), CACHE_OK);
    assert.match(CACHE_OK, /s-maxage=600/);

    assert.equal(upstream.calls.length, 1);
    const url = upstream.calls[0];
    assert.ok(url);
    assert.equal(url.origin + url.pathname, "https://api.openweathermap.org/data/2.5/weather");
    assert.equal(url.searchParams.get("q"), "Buenos Aires,AR");
    assert.equal(url.searchParams.get("units"), "metric");
    assert.equal(url.searchParams.get("appid"), KEY);

    const text = await res.text();
    assert.ok(!text.includes(KEY), "the key never reaches the browser");
    assert.deepEqual(JSON.parse(text), {
      temp: 27.4,
      feelsLike: 31.2,
      description: "clear sky",
      main: "clear",
      sunrise: 1760831340,
      sunset: 1760873160,
    });
  });

  it("passes a 404 through as not_found", async () => {
    const upstream = fakeFetch(() => new Response("{}", { status: 404 }));
    const res = await handleWeatherRequest(request("?q=Dhaka,BD"), { apiKey: KEY, fetchImpl: upstream.impl });
    assert.equal(res.status, 404);
    assert.equal(((await res.json()) as { code: string }).code, "not_found");
  });

  it("answers 502 on an upstream error and logs no key", async () => {
    const logged: string[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => {
      logged.push(args.map(String).join(" "));
    };
    try {
      const upstream = fakeFetch(() => new Response("{}", { status: 401 }));
      const res = await handleWeatherRequest(request("?q=Dhaka,BD"), { apiKey: KEY, fetchImpl: upstream.impl });
      assert.equal(res.status, 502);
      assert.equal(res.headers.get("cache-control"), "no-store");
      assert.ok(!(await res.text()).includes(KEY));
    } finally {
      console.error = original;
    }
    assert.ok(logged.length > 0);
    assert.ok(logged.every((line) => !line.includes(KEY)));
  });

  it("answers 502 when OpenWeather does not respond", async () => {
    const res = await handleWeatherRequest(request("?q=Dhaka,BD"), {
      apiKey: KEY,
      fetchImpl: (async () => {
        throw new TypeError("network down");
      }) as typeof fetch,
    });
    assert.equal(res.status, 502);
  });

  it("answers 502 when OpenWeather sends something else", async () => {
    const upstream = fakeFetch(() => new Response("<html>", { status: 200 }));
    const res = await handleWeatherRequest(request("?q=Dhaka,BD"), { apiKey: KEY, fetchImpl: upstream.impl });
    assert.equal(res.status, 502);
  });
});

describe("toWeatherPayload", () => {
  it("falls back to temp when feels_like is missing", () => {
    const payload = toWeatherPayload({ ...OPENWEATHER_BODY, main: { temp: 10 }, sys: {} });
    assert.equal(payload?.feelsLike, 10);
    assert.equal(payload?.sunrise, 0);
    assert.equal(payload?.sunset, 0);
  });

  it("rejects a body without a condition or temperature", () => {
    assert.equal(toWeatherPayload({ main: { temp: 1 }, weather: [] }), null);
    assert.equal(toWeatherPayload({ main: {}, weather: [{ main: "Rain" }] }), null);
    assert.equal(toWeatherPayload(null), null);
  });
});
