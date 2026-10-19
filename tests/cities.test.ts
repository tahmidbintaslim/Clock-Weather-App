import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatCitiesParam,
  initialCities,
  parseCitiesParam,
  resolveCities,
  serializeCities,
  urlWithCities,
} from "../src/lib/cities.ts";
import { COUNTRY_OPTIONS, type Zone } from "../src/data/countries.ts";

const zone = (city: string): Zone => {
  const found = COUNTRY_OPTIONS.find((option) => option.city === city);
  assert.ok(found, `${city} is in the picker`);
  return found;
};

const DEFAULTS = [zone("Santiago,CL"), zone("Dhaka,BD"), zone("Bangkok,TH")];
const base = { options: COUNTRY_OPTIONS, defaults: DEFAULTS, max: 3 };
const cities = (zones: Zone[]) => zones.map((z) => z.city);

describe("resolveCities", () => {
  it("keeps order, ignores case, drops unknown entries and repeats, and caps the list", () => {
    const zones = resolveCities(
      ["tokyo,jp", "Atlantis,XX", "Tokyo,JP", " Paris,FR ", "Lima,PE", "Oslo,NO"],
      COUNTRY_OPTIONS,
      3,
    );
    assert.deepEqual(cities(zones), ["Tokyo,JP", "Paris,FR", "Lima,PE"]);
  });
});

describe("?cities= links", () => {
  it("round-trips through the URL, spaces included", () => {
    const zones = [zone("Buenos Aires,AR"), zone("New Delhi,IN"), zone("Dhaka,BD")];
    const value = formatCitiesParam(zones);
    assert.equal(value, "Buenos%20Aires,AR;New%20Delhi,IN;Dhaka,BD");

    const parsed = new URLSearchParams(`?cities=${value}`).get("cities") ?? "";
    assert.deepEqual(cities(resolveCities(parseCitiesParam(parsed), COUNTRY_OPTIONS, 3)), cities(zones));
  });

  it("sets the parameter and keeps other parameters and the hash", () => {
    const next = urlWithCities("https://example.test/?theme=x&cities=Old,XX#top", [zone("Kyiv,UA"), zone("Doha,QA")]);
    assert.equal(next, "/?theme=x&cities=Kyiv,UA;Doha,QA#top");
  });

  it("removes the parameter when no city is left", () => {
    assert.equal(urlWithCities("https://example.test/?cities=Doha,QA", []), "/");
    assert.equal(urlWithCities("https://example.test/app?a=1&cities=Doha,QA#x", []), "/app?a=1#x");
  });
});

describe("initialCities", () => {
  const saved = serializeCities([zone("Tokyo,JP")]);

  it("uses the defaults on a first visit", () => {
    assert.deepEqual(initialCities({ ...base, search: "", stored: null }), DEFAULTS);
  });

  it("restores the list saved in this browser", () => {
    assert.deepEqual(cities(initialCities({ ...base, search: "", stored: saved })), ["Tokyo,JP"]);
  });

  it("keeps an empty saved list empty", () => {
    assert.deepEqual(initialCities({ ...base, search: "", stored: "[]" }), []);
  });

  it("prefers a ?cities= link over the saved list", () => {
    const zones = initialCities({ ...base, search: "?cities=Lima,PE;Oslo,NO", stored: saved });
    assert.deepEqual(cities(zones), ["Lima,PE", "Oslo,NO"]);
  });

  it("accepts a link whose separators were percent-encoded", () => {
    const zones = initialCities({ ...base, search: "?cities=Lima%2CPE%3BKuala+Lumpur%2CMY", stored: null });
    assert.deepEqual(cities(zones), ["Lima,PE", "Kuala Lumpur,MY"]);
  });

  it("falls back when the link or the saved value is unusable", () => {
    assert.deepEqual(cities(initialCities({ ...base, search: "?cities=Atlantis,XX", stored: saved })), ["Tokyo,JP"]);
    assert.deepEqual(cities(initialCities({ ...base, search: "?cities=", stored: null })), cities(DEFAULTS));
    for (const stored of ["not json", "{}", "[1,2]", '["Atlantis,XX"]']) {
      assert.deepEqual(initialCities({ ...base, search: "", stored }), DEFAULTS, stored);
    }
  });
});
