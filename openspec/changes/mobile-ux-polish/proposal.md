# Proposal

## Why

A user-provided mobile screenshot (~390px viewport) shows the digit-
frequency grid's overlapping circle/triangle/square marks rendered at
sizes that crowd or nearly touch adjacent cells (most visibly digit 1,
whose largest circle/triangle layer approaches the width of a single
grid column), and a large empty vertical gap between the grid and the
"下載截圖" (download screenshot) button below it. The shapes are drawn
at fixed pixel sizes (`ResultNumber.tsx`'s `Circles`/`Triangles`/
`Squares`, e.g. `48 * (i + 1)` for circles) that don't scale down for
narrow viewports the way the surrounding text already does (e.g.
`text-2xl sm:text-3xl`).

## What Changes

- Scale the digit-grid's circle/triangle/square marks down at narrow
  viewports so the largest layer for any digit fits comfortably inside
  its grid cell without crowding neighboring cells, using the same
  mobile-first breakpoint pattern already used elsewhere in the app
  (e.g. `sm:` prefixes).
- Audit and, where undersized, enlarge the tap targets for the primary
  interactive controls (birthdate input's clear button, the digit-grid
  cells, the download-screenshot button, the energy-table dialog's close
  controls) to meet a ~44×44px minimum, a widely-used mobile touch-target
  guideline — without changing their desktop appearance.
- Reduce the vertical spacing between the digit-grid section and the
  download-screenshot button on narrow viewports, where the gap is
  visually disproportionate to the content above it.
- No change to any calculation logic, the screenshot-export feature's
  captured content, or the energy-table data/content.

## Capabilities

### New Capabilities
- `mobile-layout`: Defines viewport-width-dependent sizing rules for the
  digit-grid's frequency marks, minimum tap-target sizing for the app's
  interactive controls, and spacing behavior between the grid and the
  controls below it on narrow viewports.

### Modified Capabilities
_None — no existing specs in this project yet (prior changes have not
been archived, so `openspec list --specs` reports no specs)._

## Impact

- `src/components/ResultNumber.tsx` — circle/triangle/square size
  calculations become viewport-aware (or otherwise bounded to fit
  within a grid cell at narrow widths).
- `src/components/BirthdateInput.tsx` — clear ("×") button tap target.
- `src/App.tsx` — spacing between the grid section and the download
  button; download button's own tap target.
- `src/components/DigitEnergyDialog.tsx` — close control tap target.
- No changes to `src/lib/numerology.ts`, `src/lib/digitEnergy.ts`, or
  calculation/data logic.
