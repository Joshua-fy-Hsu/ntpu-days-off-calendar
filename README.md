# NTPU Days-Off Calendar

An independent Apple Calendar subscription containing official holidays, NTPU-wide no-class days, and compensatory holidays for National Taipei University academic year 115 (August 1, 2026 to July 31, 2027).

**Use the calendar:** <https://joshua-fy-hsu.github.io/ntpu-days-off-calendar/>

## Development

The project uses Node.js built-in modules and has no runtime dependencies.

```powershell
npm run build
npm test
```

`npm run build` reads `data/academic-year-115.json` and generates three calendar feeds in both `calendar/` and `docs/`: Traditional Chinese (`ntpu-115-zh.ics`), English (`ntpu-115-en.ics`), and the original bilingual feed (`ntpu-115.ics`) retained for existing subscribers. The `docs/` directory is a single bilingual GitHub Pages site. Its language switch updates all interface text and selects the matching feed for subscription and download.

## Data policy

The [official NTPU Academic Affairs calendar](https://fms.ntpu.edu.tw/filedownload/16276) is the primary source. Every event records its source page. Update the structured data first, regenerate the calendar, and run the tests; do not edit generated `.ics` files manually.

This project is not an official NTPU service. Always consult NTPU announcements for last-minute changes.
