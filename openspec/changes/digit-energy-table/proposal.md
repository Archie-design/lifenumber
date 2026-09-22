# Proposal

## Why

The 1-9 digit-frequency grid currently only visualizes *how often* each
digit appears (circles/triangles/square counts) but gives no insight into
what each number *means*. Numerology practice associates each root number
with a documented set of low/mid/high-level behavioral patterns and a
"lesson to work on" — content the user already has (a reference photo,
`reference/IMG_4547.JPG`, transcribed for digit 1: "自信與領導" /
Confidence & Leadership). Surfacing this content when a user taps a digit
turns the grid from a pure statistics display into an actual interpretive
tool.

## What Changes

- Add a structured data source holding each digit's energy-level table
  (low/lesson/mid/high columns, 5 rows each, per digit 1-9). Only digit 1
  is populated in this change; digits 2-9 are absent from the dataset.
- Make each cell in the digit-frequency grid clickable, regardless of
  whether it currently shows any circle/triangle/square marks.
- Clicking a digit that has data opens a modal dialog showing that
  digit's title and its low/lesson/mid/high table, styled with the
  existing DaisyUI theme (reusing `success`/`neutral`/`accent`-style
  semantic coloring for the level columns rather than introducing a new
  palette).
- Clicking a digit with no data in the dataset does nothing — no dialog,
  no visual feedback, no console error.
- No changes to the numerology calculation logic, the digit-frequency
  counting logic, or the screenshot-export feature.

## Capabilities

### New Capabilities
- `digit-energy-table`: Defines the data shape for a digit's energy-level
  table, which digits currently have content, and the click-to-open-modal
  interaction on the digit-frequency grid.

### Modified Capabilities
_None — no existing specs in this project yet (prior changes have not
been archived, so `openspec list --specs` reports no specs)._

## Impact

- `src/lib/` — new data module holding the per-digit table content
  (digit 1 populated, 2-9 absent by design — not stubbed with empty
  tables, so the "no data" behavior is a true absence check, not an
  empty-table render).
- `src/components/ResultNumber.tsx` — becomes clickable when data exists
  for its digit; no visual/behavior change when it doesn't.
- New component: a modal/dialog for displaying the table (DaisyUI
  `<dialog class="modal">` pattern, matching the project's existing
  DaisyUI usage).
- No changes to `src/lib/numerology.ts`, the screenshot-export feature,
  or the birthdate input flow.
