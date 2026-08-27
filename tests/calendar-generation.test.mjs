import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildCalendar, foldLine, generateCalendars } from "../src/generate-calendar.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(await readFile(path.join(projectRoot, "data", "academic-year-115.json"), "utf8"));
const calendars = {
  bilingual: buildCalendar(data, "bilingual"),
  zh: buildCalendar(data, "zh"),
  en: buildCalendar(data, "en"),
};

test("each variant contains every approved event", () => {
  for (const calendar of Object.values(calendars)) {
    assert.equal((calendar.match(/BEGIN:VEVENT/g) ?? []).length, 20);
  }
});

test("language variants use distinct, stable UIDs", () => {
  assert.match(calendars.bilingual, /UID:2026-mid-autumn-festival@ntpu-days-off-calendar/);
  assert.match(calendars.zh, /UID:2026-mid-autumn-festival\.zh@ntpu-days-off-calendar/);
  assert.match(calendars.en, /UID:2026-mid-autumn-festival\.en@ntpu-days-off-calendar/);
});

test("Chinese feed contains Chinese-only event text", () => {
  assert.match(calendars.zh, /SUMMARY:中秋節放假/);
  assert.doesNotMatch(calendars.zh, /Mid-Autumn Festival Holiday/);
  assert.match(calendars.zh, new RegExp(`X-WR-CALNAME:${data.calendar.nameZh}`));
});

test("English feed contains English-only event text", () => {
  assert.match(calendars.en, /SUMMARY:Mid-Autumn Festival Holiday/);
  assert.doesNotMatch(calendars.en, /中秋節放假/);
  assert.match(calendars.en, new RegExp(`X-WR-CALNAME:${data.calendar.nameEn}`));
});

test("legacy feed remains bilingual", () => {
  assert.match(calendars.bilingual, /SUMMARY:中秋節放假 \/ Mid-Autumn Festival Holiday/);
});

test("events are all-day and do not include alarms", () => {
  for (const calendar of Object.values(calendars)) {
    assert.equal((calendar.match(/DTSTART;VALUE=DATE:/g) ?? []).length, 20);
    assert.equal((calendar.match(/DTEND;VALUE=DATE:/g) ?? []).length, 20);
    assert.doesNotMatch(calendar, /BEGIN:VALARM/);
  }
});

test("ordinary weekends and school vacations are not added", () => {
  assert.doesNotMatch(calendars.bilingual, /Summer Vacation|Winter Vacation|暑假|寒假/);
  assert.equal(data.events.some((event) => event.type === "weekend"), false);
});

test("multi-day Lunar New Year uses an exclusive end date", () => {
  assert.match(
    calendars.bilingual,
    /UID:2027-lunar-new-year@ntpu-days-off-calendar[\s\S]*?DTSTART;VALUE=DATE:20270204[\s\S]*?DTEND;VALUE=DATE:20270211/,
  );
});

test("generated calendars use CRLF and folded lines stay within 75 octets", () => {
  for (const calendar of Object.values(calendars)) {
    assert.equal(calendar.replaceAll("\r\n", "").includes("\n"), false);
    for (const line of calendar.split("\r\n")) {
      assert.ok(Buffer.byteLength(line, "utf8") <= 75, `line too long: ${line}`);
    }
  }
  assert.match(foldLine("DESCRIPTION:" + "測試".repeat(40)), /\r\n /);
});

test("build writes matching calendar and Pages copies for all variants", async () => {
  await generateCalendars();
  for (const filename of ["ntpu-115.ics", "ntpu-115-zh.ics", "ntpu-115-en.ics"]) {
    const calendarCopy = await readFile(path.join(projectRoot, "calendar", filename), "utf8");
    const pagesCopy = await readFile(path.join(projectRoot, "docs", filename), "utf8");
    assert.equal(calendarCopy, pagesCopy);
  }
});
