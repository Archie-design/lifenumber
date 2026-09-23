# Design

## Context

Reviewed against the user's mobile screenshot and the current source:

- `ResultNumber.tsx`'s circle/triangle/square marks use fixed pixel
  formulas (`48 * (i + 1)` for circles, `0.8 * (i + 1) * 75 + 15` for
  triangles, `1.2 * (i + 1) * 75` for squares) that don't scale down at
  narrow widths, unlike the surrounding text (`text-2xl sm:text-3xl`).
  At a typical ~390px phone width, a 3-layer circle (digit 1's case in
  the screenshot) reaches ~144px wide — close to or exceeding a single
  grid column's actual content width once the app's padding chain
  (`px-4` page + `p-4`/`sm:p-6` grid section) is subtracted.
- The grid-to-button gap is `space-y-6` (24px, between the grid
  `<section>` and its siblings) plus the download button wrapper's own
  `pb-10` (40px) and the grid section's own `p-4`/`sm:p-6` internal
  padding — these compound to a visually large gap at narrow widths
  where there's less content on screen to "absorb" it.
- Checked against a 44×44px minimum tap-target guideline (a common
  mobile accessibility baseline, not project-specific): the birthdate
  clear button (`w-11` = 44px, `inset-y-0` spanning the ~48px input
  height) and grid cells (`min-h-36` = 144px, well over a third of any
  narrow viewport width per column) already meet it. DaisyUI's default
  `.btn` height resolves to 40px (`--size-field: .25rem` × 10 = 2.5rem),
  which is what the download button and the energy-dialog's close
  button both use — under the 44px baseline.

## Goals / Non-Goals

**Goals:**
- Make the grid legible and non-overlapping at realistic phone widths
  (~320-480px) without changing how it looks at `sm:` and above.
- Bring every primary control up to the 44px tap-target baseline,
  touching only the ones actually below it.
- Tighten the grid-to-button gap on narrow viewports specifically,
  without touching desktop spacing.

**Non-Goals:**
- No redesign of the grid's visual language (still circles/triangles/
  square, same colors) — only their size scales.
- No change to which controls exist or what they do.
- No change to spacing between sections *other than* the grid-to-button
  gap called out in proposal.md.

## Decisions

**Grid marks: scale down via a viewport-aware size multiplier, not a
breakpoint-swapped fixed size.** Rather than duplicating the
circle/triangle/square size formulas for a `sm:` variant (SVG dimensions
can't be expressed as Tailwind classes the way text size can), introduce
a single multiplier applied to each shape's existing size formula,
driven by a CSS custom property that changes at the `sm:` breakpoint —
consistent with how `--capture-*` custom properties already vary by
media query in `src/index.css`. Concretely: `0.65` below `sm:`, `1` at
`sm:` and above, applied via `calc()` in each shape's inline size
calculation. This keeps the *relative* proportions between layers
identical (so a digit's "busiest" case still reads as visually busier
than a single-mark digit) while capping the largest case to fit a
narrow column: 0.65 × the existing 3-layer-circle formula brings ~144px
down to ~94px, comfortably inside a ~100-110px-wide mobile grid column.

**Tap targets: fix only what's actually under 44px, leave the rest
alone.** Per Context above, the clear button and grid cells already
meet the baseline — touching them would be scope creep with no user-
visible benefit. Only the DaisyUI `.btn` instances (download button,
dialog close button) are under it. Rather than fighting DaisyUI's
`--size-field` globally (which would resize every future `.btn` in the
app, an unbounded blast radius), apply a minimum height directly to
these two specific buttons via Tailwind's `min-h-11` (44px) utility,
scoped to exactly the elements the proposal calls out.

**Grid-to-button gap: reduce the button wrapper's top spacing on narrow
viewports, not the grid section's internal padding.** Shrinking the
grid section's own `p-4` would reduce breathing room around the
marks themselves (working against the "marks shouldn't crowd" goal
above). Instead, replace the download button wrapper's `pb-10` (bottom
padding only, no top spacing of its own — the visual gap currently
comes entirely from the preceding `space-y-6` plus that section's `p-4`/
`p-6`) with an explicit `pt-2 sm:pt-0 pb-10`, pulling the button visibly
closer to the grid on narrow viewports while leaving desktop spacing
(`sm:` and above) exactly as it is today.

## Risks / Trade-offs

- **[Risk]** Scaling grid marks down via a CSS custom property
  multiplier adds one more piece of viewport-conditional state to
  `src/index.css`, alongside the existing `--capture-*` variables →
  **Mitigation**: name it distinctly (e.g. `--grid-mark-scale`) and
  keep it colocated with the other responsive custom properties for
  discoverability, rather than introducing a second pattern.
- **[Trade-off]** A shared scale multiplier (rather than per-shape
  tuning) means all three shape types shrink by the same ratio; if a
  future digit's data produces an unusually large single-shape case
  (e.g. many square marks, which don't currently occur since a digit
  has at most one square/root mark), it isn't individually re-tuned →
  accepted since today's actual worst case (3 circles) is the one
  driving the 0.65 ratio, and squares are capped at 1 by design
  (`isRoot` is boolean).
