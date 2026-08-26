import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildCalendar, foldLine } from "../src/generate-calendar.mjs";

const data = JSON.parse(
  await readFile(new URL("../data/academic-year-115.json", import.meta.url), "utf8")
);
const calendar = buildCalendar(data);

test("generates the verified event set", () => {
  assert.equal(data.events.length, 20);
  assert.equal((calendar.match(/BEGIN:VEVENT/g) ?? []).length, 20);
  assert.equal((calendar.match(/END:VEVENT/g) ?? []).length, 20);
});

test("uses unique stable event identifiers", () => {
  const uids = [...calendar.matchAll(/^UID:(.+)$/gm)].map((match) => match[1].trim());
  assert.equal(uids.length, 20);
  assert.equal(new Set(uids).size, uids.length);
  assert.ok(uids.every((uid) => uid.endsWith("@ntpu-days-off-calendar")));
});

test("creates bilingual all-day events without alerts", () => {
  assert.equal((calendar.match(/^DTSTART;VALUE=DATE:/gm) ?? []).length, 20);
  assert.equal((calendar.match(/^DTEND;VALUE=DATE:/gm) ?? []).length, 20);
  assert.equal((calendar.match(/^SUMMARY:.* \/ /gm) ?? []).length, 20);
  assert.doesNotMatch(calendar, /BEGIN:VALARM/);
});

test("includes special weekend events but excludes ordinary or partial no-class weekends", () => {
  assert.match(calendar, /DTSTART;VALUE=DATE:20261010/);
  assert.match(calendar, /DTSTART;VALUE=DATE:20261128/);
  assert.doesNotMatch(calendar, /DTSTART;VALUE=DATE:20261031/);
  assert.doesNotMatch(calendar, /DTSTART;VALUE=DATE:20261107/);
});

test("uses an exclusive end date for the Lunar New Year range", () => {
  assert.match(
    calendar,
    /UID:2027-lunar-new-year@ntpu-days-off-calendar[\s\S]*?DTSTART;VALUE=DATE:20270204[\s\S]*?DTEND;VALUE=DATE:20270211/
  );
});

test("serializes with CRLF and folds every physical line to 75 UTF-8 octets or fewer", () => {
  assert.equal(calendar.replaceAll("\r\n", "").includes("\n"), false);
  for (const line of calendar.split("\r\n")) {
    assert.ok(Buffer.byteLength(line, "utf8") <= 75, `Line is too long: ${line}`);
  }
});

test("foldLine preserves Unicode content after unfolding", () => {
  const line = "SUMMARY:臺北大學115學年度放假日曆 / NTPU Academic Year 115 Days Off";
  assert.equal(foldLine(line).replaceAll("\r\n ", ""), line);
});

test("committed and published calendar files match generated output", async () => {
  const committed = await readFile(new URL("../calendar/ntpu-115.ics", import.meta.url), "utf8");
  const published = await readFile(new URL("../docs/ntpu-115.ics", import.meta.url), "utf8");
  assert.equal(committed, calendar);
  assert.equal(published, calendar);
});
