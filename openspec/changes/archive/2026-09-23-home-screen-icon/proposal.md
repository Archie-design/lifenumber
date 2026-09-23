# Proposal

## Why

The site currently only has a browser-tab favicon (`public/favicon.svg`,
added by the `browser-tab-icon` change) and no PWA manifest or
`apple-touch-icon`. A user who adds the site to their phone's home screen
today gets a generic browser-generated placeholder (often a screenshot
crop or blank tile), not a designed icon, and the launched page shows
full browser chrome instead of a standalone app-like window. The user
has chosen a concrete icon design ("方案三・九宮格縮影" — a 3×3 abstract
echo of the digit-frequency grid's circle/triangle/square marks) from a
set of options and wants it wired up for proper home-screen installs on
iOS and Android.

## What Changes

- Add a new home-screen icon asset derived from the chosen design (a 3×3
  grid of small circle, triangle, and square marks on the dark-theme
  background), rendered at the concrete pixel sizes iOS/Android actually
  request (180×180 `apple-touch-icon`, 192×192 and 512×512 for the web
  manifest), since neither platform reliably accepts a raw SVG for this
  purpose the way a browser tab favicon does.
- Add `public/manifest.webmanifest` (name, short name, theme/background
  colors matching the dark theme, icon entries, `display: standalone`,
  start URL).
- Add `<link rel="apple-touch-icon">`, `<link rel="manifest">`, and a
  `<meta name="theme-color">` tag to `index.html`.
- No changes to the existing browser-tab favicon (`public/favicon.svg`)
  or its `<link rel="icon">` tag — this change is additive, for the
  home-screen/installed-app icon only.

## Capabilities

### New Capabilities
- `home-screen-icon`: Defines the home-screen/PWA icon asset, the web
  app manifest, and the `index.html` wiring that lets a user install the
  site to their phone's home screen with a designed icon and app-like
  launch behavior.

## Impact

- `public/` — new manifest file and new icon raster(s)/SVG at the
  required sizes.
- `index.html` — new `<link>`/`<meta>` tags; no changes to the existing
  favicon `<link>`.
- No changes to `src/`, the numerology calculation logic, or any
  existing component.
