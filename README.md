# Converge 2026

Marketing site for **Converge 2026**, a two-day conference across Design, Engineering, and Product tracks. Built as part of a web development internship.

## Features

- Day 1 / Day 2 toggle and Design / Engineering / Product track tabs
- Per-track schedule with shared (cross-track) sessions
- Session detail modal — abstract, speaker, room, and time, with an "Add to Calendar" link (Google Calendar)
- Responsive layout

## Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com/)
- TypeScript
- Global CSS per component (no CSS Modules)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Project structure

```
app/
  page.tsx         # Home page — day/track tabs, schedule, session modal
  globals.css       # Base styles, tokens, header/track/schedule/modal styles
  Footer.tsx        # Site footer
  footer.css         # Footer styles
```

## Conventions

- Component stylesheets (e.g. `footer.css`) are imported from the **page file**, not from within the component itself, to avoid CSS cascade conflicts from double-importing.
- Track accent colors resolve through a single `--track` CSS variable, set per track via `[data-track="..."]`, rather than duplicated per-track class names.
- Session times are stored as 24-hour `"HH:MM"` strings and formatted for display — never hand-typed as 12-hour strings.
