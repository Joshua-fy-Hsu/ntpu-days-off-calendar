# Repository Guidelines

## Project Structure & Module Organization

`SPEC.md` defines the authoritative scope for the NTPU academic year 115 calendar. Files are organized by purpose:

- `data/`: verified event records and official-source metadata.
- `src/`: scripts that transform verified dates into iCalendar feeds.
- `calendar/`: generated bilingual, Chinese, and English feed copies.
- `docs/`: GitHub Pages site, client-side language switch, and public feeds.
- `tests/`: generator, iCalendar, and website-language regression tests.

Do not manually diverge generated `.ics` files from their source data. Record the official NTPU source and last-verified date alongside calendar data.

## Build, Test, and Development Commands

Use the committed Node.js scripts; the project has no third-party runtime dependencies:

- `npm run build`: generate all three feeds in both `calendar/` and `docs/`.
- `npm test`: validate event content and iCalendar formatting with `node:test`.
- `npm run check`: regenerate the calendar and run the full test suite.

Update this guide and the main README whenever commands change.

## Coding Style & Naming Conventions

Use UTF-8 for all files and preserve Traditional Chinese text exactly. Use two-space indentation for JSON, YAML, JavaScript, and CSS. Prefer descriptive `camelCase` identifiers in scripts and lowercase kebab-case filenames, such as `ntpu-115.ics`.

Calendar events must be available as separate Traditional Chinese and English feeds, remain all-day and alert-free, and use stable language-specific UIDs. Treat `Asia/Taipei` as the project time zone. Keep source comments concise and explain decisions rather than restating code.

## Testing Guidelines

Tests should verify date ranges, language-specific content, unique and stable UIDs, excluded weekends, valid iCalendar serialization, and website feed selection. Name tests after behavior, for example `calendar-generation.test.mjs`. Include a regression test for every corrected date or parsing bug. Before release, also inspect the generated file in Apple Calendar on a real device.

## Commit & Pull Request Guidelines

Use the repository's established short, imperative Conventional Commit messages (`feat:`, `fix:`, and `docs:`), such as `feat: generate academic year 115 calendar` or `fix: correct make-up class date`.

Pull requests should describe the change, cite the official NTPU source, list verification performed, and call out calendar events added, removed, or changed. Include screenshots only for visible GitHub Pages changes. Never commit credentials, private student data, or unverified calendar dates.
