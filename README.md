# NTPU Days-Off Calendar

A focused Apple Calendar subscription for National Taipei University students. It removes the noise of unrelated observances and shows only dates from NTPU's official calendar that affect whether students have classes.

- **Academic year 115 coverage:** August 1, 2026–July 31, 2027
- **Open the calendar:** <https://joshua-fy-hsu.github.io/ntpu-days-off-calendar/>

## Why this project exists

Apple's default holiday calendars include many observances that are not days off in Taiwan. This project provides a smaller, student-focused calendar based on NTPU's published academic schedule.

The website supports Traditional Chinese and English. Changing the website language also changes the calendar used by the Subscribe and Download buttons, so event names and descriptions match the selected language.

## What is included

- Public holidays and observed holidays recognized by NTPU
- University-wide no-class days
- NTPU compensatory holidays, including anniversary and sports-day leave
- All-day events without alerts or notifications

Ordinary weekends, summer and winter vacations, examinations, registration periods, academic deadlines, and activities affecting only some students are excluded.

## Using the calendar

Open the [subscription website](https://joshua-fy-hsu.github.io/ntpu-days-off-calendar/), choose 中文 or English, and select **Add to Apple Calendar**. A subscription is recommended because later corrections can synchronize automatically according to Apple's refresh schedule. The `.ics` download remains available for manual import.

## Data and accuracy

The [official NTPU Academic Affairs calendar](https://fms.ntpu.edu.tw/filedownload/16276) is the primary source. Each event in `data/academic-year-115.json` records its source page, and generated calendars use stable identifiers to prevent duplicate events after updates.

This is an independent student project, not an official NTPU service. If information differs, follow NTPU's latest announcement.

## Development

The project requires Node.js 20 or newer and has no third-party runtime dependencies.

```powershell
npm run check
```

This command regenerates the bilingual, Traditional Chinese, and English feeds in `calendar/` and `docs/`, then runs the complete test suite. Update the structured data first; never edit generated `.ics` files manually.

## License

Released under the [MIT License](LICENSE).
