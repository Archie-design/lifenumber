# Design

## Context

The site currently ships the unmodified Vite scaffold icon at
`public/favicon.svg`, referenced by a single `<link rel="icon"
type="image/svg+xml">` tag in `index.html` (see proposal.md - Why). The
product's design system (`src/index.css`) already defines two DaisyUI
themes with fixed hex values:

- **Light** (`numerology-light`): base `#fdfaf4` (parchment), primary
  `#1e1b4b` (deep indigo), accent `#a16207` (gold)
- **Dark** (`numerology-dark`): base `#0f0f23` (night sky), primary
  `#ca8a04` (gold), secondary `#a78bfa` (violet)

The product's most distinctive visual motif is the 1–9 digit-frequency grid
(`src/components/ResultNumber.tsx`): each cell overlays circles, triangles,
and a square to represent digit frequency. This is the one visual element a
user would recognize as "this app" at a glance.

## Goals / Non-Goals

**Goals:**
- Pick one concrete icon concept and exact color values before drawing,
  so implementation is a direct execution step, not a design exploration.
- Keep the icon a single static SVG — no build-time generation, no
  runtime theme-switching logic for the favicon itself (browsers don't
  reliably support `prefers-color-scheme` inside a favicon SVG across all
  target browsers, so we design one version that works on both tab-bar
  colors rather than relying on that).

**Non-Goals:**
- No app icon / PWA manifest / `apple-touch-icon` — out of scope unless a
  future change adds installability; not needed for a browser-tab icon.
- No animated or interactive favicon.
- No redesign of the in-app `ResultNumber` grid component itself — the
  favicon is a new, independent asset inspired by it, not a shared
  component or generated from the same code.

## Decisions

**Icon concept: a single ring with a center dot, not a letter/wordmark.**
A "生" character or a literal "9" glyph would be harder to render legibly
at 16px and less unique than a shape drawn from the product's own grid
visualization. Alternative considered: a generic mystical symbol (star,
moon) — rejected because it doesn't tie back to *this* product's specific
mechanic and would look like any other numerology/astrology site.

**Revised during implementation:** the original concept called for three
concentric/overlapping shapes (circle + triangle + square, mirroring a
busy `ResultNumber` cell). Rendered and tested at actual 16×16 size (see
Risks below), three overlapping stroked outlines merged into an
indistinguishable dark smear — the tab-size legibility requirement cannot
be met with that much detail at that size, regardless of stroke width.
Simplified to two shapes: one ring (echoing the grid's circle marks) with
a solid center dot (echoing the grid's square/root marker) — the minimum
that still reads as "a marked/highlighted number" rather than a generic
badge, and stays crisp at 16px.

**Color values: use the dark theme's palette, fixed (not theme-switching).**
Rationale: the dark theme's `#0f0f23` background with `#ca8a04` (gold) and
`#a78bfa` (violet)/`#5dade2` (info blue) strokes gives the strongest
contrast at small sizes on both light and dark tab bars — a dark-background
icon with bright strokes reads clearly on a light tab bar (icon appears as
a dark badge) and blends naturally on a dark tab bar. Using the light
theme's pale parchment background risked disappearing on light tab bars
(satisfies the "legible on both light and dark tab bars" requirement).

Exact values used, taken directly from `numerology-dark` in
`src/index.css` (no new colors introduced):
- Background fill (rounded square badge): `#0f0f23`
- Ring stroke: `#5dade2` (dark-theme info)
- Center dot fill: `#ca8a04` (dark-theme primary/gold)

(The `#52d68a` success green from the original three-shape concept is no
longer used, since the triangle it belonged to was dropped — see the
concept revision above.)

**Format: single SVG file, same filename.**
Replace `public/favicon.svg` in place rather than adding a new file and
changing the `<link>` `href` — keeps the diff minimal and avoids a second
place to update if the filename changes later. No change to `index.html`
is needed unless the implementer finds the existing `<link>` tag
insufficient (e.g. wants to add a `sizes` attribute), which is expected to
be unnecessary for a single-SVG favicon in modern browsers.

## Risks / Trade-offs

- **[Risk]** A single fixed-color icon (not theme-aware) may look
  slightly mismatched on a browser tab bar using the *opposite* extreme
  theme (e.g. a pure-white tab bar) → **Mitigation**: the dark-navy
  background with a thin implicit border from the shape strokes keeps the
  icon self-contained as a "badge" rather than relying on the tab bar
  background, so it stays legible regardless of tab bar color.
- **[Risk]** Multiple overlapping stroked shapes look cluttered at 16px
  regardless of stroke width → **Materialized**: confirmed during
  implementation (see Decisions above) and resolved by dropping to two
  shapes (ring + dot).
- **[Risk]** An SVG favicon with a hardcoded `width`/`height` attribute
  does not scale down to the size a `<link rel="icon">` consumer requests
  — it renders at its native size and gets cropped instead of scaled
  → **Mitigation**: omit `width`/`height` on the root `<svg>` element and
  rely on `viewBox` alone, confirmed by rendering the file inside
  differently-sized containers.
