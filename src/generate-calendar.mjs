import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(projectRoot, "data", "academic-year-115.json");
const outputPaths = [
  path.join(projectRoot, "calendar", "ntpu-115.ics"),
  path.join(projectRoot, "docs", "ntpu-115.ics")
];

function escapeText(value) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function formatDate(value) {
  return value.replaceAll("-", "");
}

function nextDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function foldLine(line) {
  const folded = [];
  let current = "";

  for (const character of line) {
    const candidate = current + character;
    if (Buffer.byteLength(candidate, "utf8") > 75) {
      folded.push(current);
      current = ` ${character}`;
    } else {
      current = candidate;
    }
  }

  folded.push(current);
  return folded.join("\r\n");
}

function validateData(data) {
  const { calendar, events } = data;
  const ids = new Set();

  if (!calendar || !Array.isArray(events) || events.length === 0) {
    throw new Error("Calendar metadata and at least one event are required.");
  }

  for (const event of events) {
    if (ids.has(event.id)) {
      throw new Error(`Duplicate event id: ${event.id}`);
    }
    ids.add(event.id);

    if (event.start < calendar.coverageStart || event.start > calendar.coverageEnd) {
      throw new Error(`Event outside academic-year coverage: ${event.id}`);
    }
    if (event.endExclusive && event.endExclusive <= event.start) {
      throw new Error(`Invalid end date for event: ${event.id}`);
    }
    for (const field of ["titleZh", "titleEn", "descriptionZh", "descriptionEn", "type"]) {
      if (!event[field]) {
        throw new Error(`Missing ${field} for event: ${event.id}`);
      }
    }
  }
}

export function buildCalendar(data) {
  validateData(data);
  const { calendar, events } = data;
  const stamp = `${calendar.publishedDate.replaceAll("-", "")}T000000Z`;
  const lines = [
    "BEGIN:VCALENDAR",
    "PRODID:-//NTPU Days-Off Calendar//Academic Year 115//EN",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(`${calendar.nameZh} / ${calendar.nameEn}`)}`,
    `X-WR-TIMEZONE:${calendar.timeZone}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
    "X-PUBLISHED-TTL:PT12H"
  ];

  for (const event of events) {
    const description = [
      event.descriptionZh,
      event.descriptionEn,
      `來源 / Source: ${calendar.sourceTitle}，第${event.sourcePage}頁 / page ${event.sourcePage}`,
      calendar.sourceUrl
    ].join("\n");

    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}@ntpu-days-off-calendar`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${formatDate(event.start)}`,
      `DTEND;VALUE=DATE:${formatDate(event.endExclusive ?? nextDate(event.start))}`,
      `SUMMARY:${escapeText(`${event.titleZh} / ${event.titleEn}`)}`,
      `DESCRIPTION:${escapeText(description)}`,
      `CATEGORIES:${event.type.toUpperCase().replaceAll("-", "_")},NTPU`,
      "STATUS:CONFIRMED",
      "TRANSP:TRANSPARENT",
      `URL:${calendar.sourceUrl}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}

export async function generateCalendar() {
  const data = JSON.parse(await readFile(dataPath, "utf8"));
  const calendar = buildCalendar(data);

  for (const outputPath of outputPaths) {
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, calendar, "utf8");
  }

  return { eventCount: data.events.length, outputPaths };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await generateCalendar();
  console.log(`Generated ${result.eventCount} events:`);
  for (const outputPath of result.outputPaths) {
    console.log(`- ${path.relative(projectRoot, outputPath)}`);
  }
}

