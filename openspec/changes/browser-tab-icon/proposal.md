# Proposal

## Why

The site's browser-tab icon (`public/favicon.svg`) is still the default Vite
scaffold icon — a purple gradient blob unrelated to the product. It clashes
with the mystical numerology design system (deep indigo/gold dark theme,
warm parchment light theme, Noto Serif TC) applied to the rest of the UI, and
gives no visual hint of what the site does when a user is scanning browser
tabs.

## What Changes

- Replace `public/favicon.svg` with a new icon that reflects the numerology
  product: a single glyph legible at 16×16–32px tab size, using the
  product's existing brand colors instead of arbitrary new ones.
- Keep the icon as a single SVG referenced via the existing
  `<link rel="icon" type="image/svg+xml">` tag — no new icon formats,
  manifest, or additional `<link>` tags unless a design constraint requires
  one (e.g. an `apple-touch-icon` fallback), which will be called out
  explicitly in design.md if needed.
- No changes to app behavior, routing, or any in-page UI — this is a static
  asset swap plus its markup reference.

## Capabilities

### New Capabilities
- `browser-tab-icon`: Defines what the site's browser-tab icon must look
  like and how it's wired up (format, sizing/legibility, brand-color
  consistency, light/dark tab-bar legibility).

### Modified Capabilities
_None — no existing specs in this project yet._

## Impact

- `public/favicon.svg` — replaced with new artwork.
- `index.html` — `<link rel="icon">` reference verified/updated if the
  filename or additional link tags change.
- No code, dependency, or build changes expected.
