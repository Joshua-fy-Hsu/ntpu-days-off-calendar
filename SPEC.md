# NTPU Days-Off Calendar — Academic Year 115

## Purpose

Create an Apple Calendar subscription for National Taipei University (NTPU) students that shows only dates that affect whether students have classes during academic year 115.

## Coverage

- NTPU academic year 115 only
- August 1, 2026 through July 31, 2027
- First and second semesters

## Included Events

- Official holidays observed by NTPU
- Compensatory holidays observed by NTPU
- NTPU-specific university-wide no-class or campus-closure days
- Official make-up class or working days, clearly identified as not being days off

## Excluded Events

- Ordinary Saturdays and Sundays
- Summer and winter vacations
- Semester start and end dates
- Course-selection and registration periods
- Midterm and final examinations
- Administrative meetings
- Academic deadlines
- Observances that do not result in a day off or class-schedule change

## Event Format

- Separate Traditional Chinese and English calendar feeds served through one bilingual website
- Each feed uses event names and descriptions in its selected language only
- All-day events
- No notifications or alerts
- `Asia/Taipei` time zone
- Stable event identifiers so updates do not create duplicate events
- Event descriptions that identify the event type and official source when useful

Example event names:

- `和平紀念日補假 / Peace Memorial Day Observed`
- `全校停課 / University-wide No Classes`
- `補行上課 / Make-up Class Day`

## Authoritative Source

The official NTPU Academic Affairs calendar is the primary source:

<https://carrier.ntpu.edu.tw/oaa/files?descent=true&inline=1&tag=%E8%A1%8C%E4%BA%8B%E6%9B%86>

Taiwan government calendar information may be used to verify holidays already reflected in NTPU's schedule. If NTPU publishes a correction, the calendar must follow the latest official NTPU version.

## Distribution

GitHub Pages will host:

- A public information page
- Traditional Chinese and English calendar files, such as `ntpu-115-zh.ics` and `ntpu-115-en.ics`
- An in-page language switch that changes all interface text and selects the matching calendar feed
- An **Add to Apple Calendar** subscription link
- A direct-download option
- The source, last-updated date, and disclaimer

The subscription will be read-only. Updating the hosted `.ics` file will allow Apple Calendar subscribers to receive corrections automatically, subject to Apple's refresh schedule.

## Disclaimer

This calendar is an independent student convenience tool and is not an official NTPU service. Users should consult official NTPU announcements for last-minute changes.
