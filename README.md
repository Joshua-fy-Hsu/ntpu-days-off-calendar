# NTPU Days-Off Calendar

An independent Apple Calendar subscription containing official holidays, NTPU-wide no-class days, and compensatory holidays for National Taipei University academic year 115 (August 1, 2026 to July 31, 2027).

## Development

The project uses Node.js built-in modules and has no runtime dependencies.

```powershell
npm run build
npm test
```

`npm run build` reads `data/academic-year-115.json` and generates identical calendar files at `calendar/ntpu-115.ics` and `docs/ntpu-115.ics`. The `docs/` directory is the GitHub Pages site.

## Data policy

The official NTPU Academic Affairs calendar is the primary source. Every event records its source page. Update the structured data first, regenerate the calendar, and run the tests; do not edit generated `.ics` files manually.

This project is not an official NTPU service. Always consult NTPU announcements for last-minute changes.

