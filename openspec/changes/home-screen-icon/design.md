# Design

## Context

`public/favicon.svg` (added by `browser-tab-icon`) already establishes
the visual language: a dark `numerology-dark`-theme background with
strokes in the theme's exact hex colors, no new colors introduced. That
change explicitly scoped out PWA/home-screen icons as a non-goal — this
change fills that gap.

The user reviewed 6 candidate icon concepts (published as an Artifact
during this session) and chose "方案三・九宮格縮影": a 3×3 arrangement
of small circle, triangle, and square marks on the dark-theme
background — a direct visual echo of `ResultNumber.tsx`'s
circle/triangle/square overlay grid, scaled down into an abstract
pattern rather than a literal 1:1 reproduction of any specific
birthdate's grid.

Home-screen icons differ from the browser-tab favicon in a way that
matters technically: iOS Safari's "Add to Home Screen" and Android
Chrome's install prompt do not reliably accept a raw SVG the way a
`<link rel="icon" type="image/svg+xml">` tab favicon does — both
platforms expect raster (PNG) assets at specific pixel sizes, referenced
via `<link rel="apple-touch-icon">` (iOS) and a web app manifest's
`icons` array (Android/other installable-web-app-capable browsers).

## Goals / Non-Goals

**Goals:**
- Ship PNG icon rasters at the sizes iOS/Android actually request:
  180×180 (`apple-touch-icon`), 192×192 and 512×512 (manifest `icons`).
- Add a minimal, correct web app manifest with `display: standalone`
  and theme colors taken directly from `numerology-dark`.
- Keep the existing browser-tab favicon completely untouched.

**Non-Goals:**
- No service worker / offline caching — `display: standalone` and a
  manifest alone are enough for a home-screen icon and app-like launch;
  offline support is a separate, larger feature not requested here.
- No iOS splash-screen image set (`apple-touch-startup-image` per
  device size) — out of scope; the default white/blank flash on launch
  is acceptable for this change.
- No maskable-icon variant (Android's adaptive-icon safe-zone padding)
  — the chosen design's marks sit centered with enough margin that a
  standard (non-maskable) icon entry is sufficient; revisit only if a
  future check shows Android cropping marks at the edges.

## Decisions

**Rasterize via Playwright/Chromium screenshot, not a native SVG
library.** This machine has no `rsvg-convert`, `inkscape`, or Python
`cairosvg` available (checked during this session), and installing one
is unnecessary — the project's dev workflow already uses Playwright via
`npx playwright` for pixel-level UI verification. The same approach
renders the source SVG in a headless browser at an exact viewport size
and screenshots it, producing pixel-perfect PNGs at 180/192/512 without
adding a new build dependency or asset pipeline. This is a one-time
manual generation step (the icon design is finalized, not
regenerated on every build), consistent with how `favicon.svg` itself
is a hand-authored, checked-in static file rather than build-generated.

**Keep one source SVG, generate PNGs from it, check in both.** The
source SVG (`public/icon-source.svg` or similar, at a 100×100 or
512×512 viewBox) is the single design source of truth; the three PNGs
are derived artifacts checked into `public/` alongside it so no build
step is needed to produce them (matches the project's existing
"static assets in `public/`" pattern — see `favicon.svg`,
`noto-sans-tc-*.woff2`).

**Manifest colors: reuse `numerology-dark`'s exact values, no new
hex.** `theme_color` and `background_color` both use `#0f0f23`
(the dark theme's `--color-base-100`), matching the icon's own
background and keeping the installed app's OS-level chrome (status bar
tint, splash background) visually consistent with the in-app dark
theme. This mirrors `browser-tab-icon`'s established rule of reusing
theme tokens rather than introducing new colors.

**`start_url` and `scope`: root path, relative.** `"start_url": "/"`
and `"scope": "/"` — the app has no sub-routes or deep-linkable pages
today, so root-scoped is correct and requires no change if that
changes later (manifest fields are additive).

## Risks / Trade-offs

- **[Risk]** A Playwright-rendered screenshot of an SVG on a plain
  background could pick up subpixel anti-aliasing artifacts or an
  incorrect background if the viewport/device-scale-factor isn't set
  precisely to the target pixel size → **Mitigation**: set the Chromium
  viewport to the exact target size (e.g. 512×512) with
  `deviceScaleFactor: 1` and screenshot only the SVG's own bounding
  box, then visually diff against the source SVG opened directly, per
  tasks.md's verification step.
- **[Trade-off]** No maskable-icon/safe-zone variant means Android's
  adaptive-icon system may crop the icon's outer marks slightly on some
  launchers → accepted per Non-Goals; the chosen design already has
  generous margin around the 3×3 mark grid, and this is revisited only
  if verification on an actual Android device/emulator shows a problem.
