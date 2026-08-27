import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(projectRoot, "data", "academic-year-115.json");
const variants = [
  { language: "bilingual", filename: "ntpu-115.ics" },
  { language: "zh", filename: "ntpu-115-zh.ics" },
  { language: "en", filename: "ntpu-115-en.ics" },
];

const escapeText = (value) => String(value)
  .replace(/\\/g, "\\\\")
  .replace(/\r?\n/g, "\\n")
  .replace(/,/g, "\\,")
  .replace(/;/g, "\\;");

const toIcsDate = (value) => value.replaceAll("-", "");

const nextDate = (value) => {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
};

export const foldLine = (line) => {
  const encoder = new TextEncoder();
  const chunks = [];
  let current = "";

  for (const character of line) {
    const prefix = chunks.length === 0 ? "" : " ";
    if (encoder.encode(prefix + current + character).length > 75) {
      chunks.push(current);
      current = character;
    } else {
      current += character;
    }
  }

  chunks.push(current);
  return chunks.join("\r\n ");
};

const languageContent = (calendar, event, language) => {
  if (language === "zh") {
    return {
      calendarName: calendar.nameZh,
      prodIdLanguage: "ZH",
      uid: `${event.id}.zh@ntpu-days-off-calendar`,
      summary: event.titleZh,
      description: [
        event.descriptionZh,
        `資料來源：${calendar.sourceTitle}，第${event.sourcePage}頁`,
        calendar.sourceUrl,
      ].join("\n"),
    };
  }

  if (language === "en") {
    return {
      calendarName: calendar.nameEn,
      prodIdLanguage: "EN",
      uid: `${event.id}.en@ntpu-days-off-calendar`,
      summary: event.titleEn,
      description: [
        event.descriptionEn,
        `Source: ${calendar.sourceTitleEn}, page ${event.sourcePage}`,
        calendar.sourceUrl,
      ].join("\n"),
    };
  }

  return {
    calendarName: `${calendar.nameZh} / ${calendar.nameEn}`,
    prodIdLanguage: "EN",
    uid: `${event.id}@ntpu-days-off-calendar`,
    summary: `${event.titleZh} / ${event.titleEn}`,
    description: [
      event.descriptionZh,
      event.descriptionEn,
      `來源 / Source: ${calendar.sourceTitle}，第${event.sourcePage}頁 / page ${event.sourcePage}`,
      calendar.sourceUrl,
    ].join("\n"),
  };
};

export const buildCalendar = (data, language = "bilingual") => {
  if (!["bilingual", "zh", "en"].includes(language)) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const { calendar, events } = data;
  const first = languageContent(calendar, events[0], language);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `PRODID:-//NTPU Days-Off Calendar//Academic Year 115//${first.prodIdLanguage}`,
    `X-WR-CALNAME:${escapeText(first.calendarName)}`,
    `X-WR-TIMEZONE:${calendar.timeZone}`,
  ];

  for (const event of events) {
    const content = languageContent(calendar, event, language);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${content.uid}`,
      `DTSTAMP:${calendar.verifiedDate.replaceAll("-", "")}T000000Z`,
      `DTSTART;VALUE=DATE:${toIcsDate(event.start)}`,
      `DTEND;VALUE=DATE:${toIcsDate(event.endExclusive ?? nextDate(event.start))}`,
      `SUMMARY:${escapeText(content.summary)}`,
      `DESCRIPTION:${escapeText(content.description)}`,
      `CATEGORIES:${event.type}`,
      "STATUS:CONFIRMED",
      "TRANSP:TRANSPARENT",
      `URL:${calendar.sourceUrl}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return `${lines.map(foldLine).join("\r\n")}\r\n`;
};

export const generateCalendars = async () => {
  const data = JSON.parse(await readFile(dataPath, "utf8"));
  const outputDirectories = [path.join(projectRoot, "calendar"), path.join(projectRoot, "docs")];

  for (const directory of outputDirectories) {
    await mkdir(directory, { recursive: true });
  }

  const written = [];
  for (const variant of variants) {
    const calendar = buildCalendar(data, variant.language);
    for (const directory of outputDirectories) {
      const outputPath = path.join(directory, variant.filename);
      await writeFile(outputPath, calendar, "utf8");
      written.push(path.relative(projectRoot, outputPath));
    }
  }

  console.log(`Generated ${data.events.length} events in ${variants.length} language variants:`);
  for (const outputPath of written) console.log(`- ${outputPath}`);
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generateCalendars();
}
