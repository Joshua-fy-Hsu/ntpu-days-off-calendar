# Repository Guidelines

## Project Structure & Module Organization

This repository is currently specification-first. `SPEC.md` defines the authoritative scope for the NTPU academic year 115 calendar. Keep future implementation files organized by purpose:

- `calendar/ntpu-115.ics`: generated subscription calendar.
- `src/`: scripts that transform verified NTPU dates into iCalendar data.
- `tests/`: automated tests and small input fixtures.
- `docs/`: GitHub Pages landing page and public calendar copy, if required.

Do not manually diverge generated `.ics` files from their source data. Record the official NTPU source and last-verified date alongside calendar data.

## Build, Test, and Development Commands

No build system or test runner has been added yet. Do not document or depend on commands that are not committed. After tooling is introduced, expose a small, predictable command set, such as:

- `npm run build`: generate the `.ics` file and website assets.
- `npm test`: validate event content and iCalendar formatting.
- `npm run lint`: check source formatting and static errors.

Update this guide and the main README whenever commands change.

## Coding Style & Naming Conventions

Use UTF-8 for all files and preserve Traditional Chinese text exactly. Use two-space indentation for JSON, YAML, JavaScript, and CSS. Prefer descriptive `camelCase` identifiers in scripts and lowercase kebab-case filenames, such as `ntpu-115.ics`.

Calendar events must be bilingual, all-day, alert-free, and use stable UIDs. Treat `Asia/Taipei` as the project time zone. Keep source comments concise and explain decisions rather than restating code.

## Testing Guidelines

Tests should verify date ranges, bilingual summaries, unique and stable UIDs, excluded weekends, and valid iCalendar serialization. Name tests after behavior, for example `calendar-generation.test.js`. Include a regression test for every corrected date or parsing bug. Until automated validation exists, inspect the generated file in Apple Calendar before release.

## Commit & Pull Request Guidelines

There is no repository history from which to infer an existing convention. Use short, imperative Conventional Commit messages, such as `feat: generate academic year 115 calendar` or `fix: correct make-up class date`.

Pull requests should describe the change, cite the official NTPU source, list verification performed, and call out calendar events added, removed, or changed. Include screenshots only for visible GitHub Pages changes. Never commit credentials, private student data, or unverified calendar dates.
