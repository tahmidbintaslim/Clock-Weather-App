import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatGmtOffset, isNightAt } from "../src/lib/time.ts";

const utc = (iso: string) => new Date(`${iso}Z`);
const seconds = (iso: string) => utc(iso).getTime() / 1000;

describe("formatGmtOffset", () => {
  const january = utc("2026-01-15T12:00:00");
  const july = utc("2026-07-15T12:00:00");

  for (const [zone, expected] of [
    ["Asia/Kolkata", "GMT+5:30"],
    ["Asia/Colombo", "GMT+5:30"],
    ["Asia/Kathmandu", "GMT+5:45"],
    ["Asia/Kabul", "GMT+4:30"],
    ["Asia/Tehran", "GMT+3:30"],
    ["Asia/Dhaka", "GMT+6"],
    ["America/Caracas", "GMT-4"],
    ["UTC", "GMT+0"],
  ] as const) {
    it(`${zone} is ${expected}`, () => {
      assert.equal(formatGmtOffset(zone, january), expected);
      assert.equal(formatGmtOffset(zone, july), expected);
    });
  }

  it("follows daylight saving time", () => {
    assert.equal(formatGmtOffset("Europe/London", january), "GMT+0");
    assert.equal(formatGmtOffset("Europe/London", july), "GMT+1");
    assert.equal(formatGmtOffset("America/Santiago", january), "GMT-3");
    assert.equal(formatGmtOffset("America/Santiago", july), "GMT-4");
  });
});

describe("isNightAt with sunrise and sunset", () => {
  // Dhaka (UTC+6), 2026-10-19: sunrise 05:52, sunset 17:28 local. In UTC the
  // sunrise falls on the previous day, so the day span wraps UTC midnight.
  const dhaka = { sunrise: seconds("2026-10-18T23:52:00"), sunset: seconds("2026-10-19T11:28:00") };

  it("is day at noon", () => {
    assert.equal(isNightAt("Asia/Dhaka", utc("2026-10-19T06:00:00"), dhaka), false);
  });

  it("is night after sunset, before the 18:00 fallback", () => {
    assert.equal(isNightAt("Asia/Dhaka", utc("2026-10-19T11:45:00"), dhaka), true);
  });

  it("is night before sunrise and late in the evening", () => {
    assert.equal(isNightAt("Asia/Dhaka", utc("2026-10-18T23:30:00"), dhaka), true);
    assert.equal(isNightAt("Asia/Dhaka", utc("2026-10-19T17:00:00"), dhaka), true);
  });

  it("stays right the next morning with day-old data", () => {
    assert.equal(isNightAt("Asia/Dhaka", utc("2026-10-20T00:10:00"), dhaka), false);
  });

  // London (UTC+1 in October), 2026-10-19: sunrise 07:30, sunset 17:55 local.
  const london = { sunrise: seconds("2026-10-19T06:30:00"), sunset: seconds("2026-10-19T16:55:00") };

  it("is night before sunrise, after the 06:00 fallback", () => {
    assert.equal(isNightAt("Europe/London", utc("2026-10-19T06:00:00"), london), true);
  });

  it("is day between sunrise and sunset, night after", () => {
    assert.equal(isNightAt("Europe/London", utc("2026-10-19T11:00:00"), london), false);
    assert.equal(isNightAt("Europe/London", utc("2026-10-19T16:30:00"), london), false);
    assert.equal(isNightAt("Europe/London", utc("2026-10-19T17:30:00"), london), true);
  });
});

describe("isNightAt without usable sun times", () => {
  for (const sun of [undefined, null, { sunrise: 0, sunset: 0 }, { sunrise: 200, sunset: 100 }]) {
    it(`falls back to 18:00-06:00 local for ${JSON.stringify(sun)}`, () => {
      assert.equal(isNightAt("Asia/Dhaka", utc("2026-10-18T23:00:00"), sun), true); // 05:00
      assert.equal(isNightAt("Asia/Dhaka", utc("2026-10-19T06:00:00"), sun), false); // 12:00
      assert.equal(isNightAt("Asia/Dhaka", utc("2026-10-19T12:00:00"), sun), true); // 18:00
    });
  }
});
