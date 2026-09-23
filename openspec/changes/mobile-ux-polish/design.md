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
`sm:` and above, applied via a CSS `transform: scale(var(--grid-mark-scale))`
on each shape's `<svg>` (chosen over resizing the `width`/`height`
attributes directly, since `transform` scales around the element's
existing centered position without needing to recompute the
`inset-0 m-auto` centering math per breakpoint).

**Revised during implementation: layer count needed a cap, not just a
scale.** The original 0.65 ratio was derived from the screenshot's
`1991/09/18` example (3 circle layers, ~144px) as the assumed worst
case. Actually enumerating every possible birthdate found this
significantly understated the true range: `birthdateCount` (circles)
can reach 7 for a date like `1911/11/11` (336px raw), and
`reducedCount` (triangles) can reach 2 — both well beyond the assumed
case, and 7 layers at any fixed scale factor either stays too large on
mobile or shrinks 1-2-layer digits (the common case) into illegibility.
Confirmed with the user: cap the number of *rendered* layers at 3 for
circles and triangles (squares are already capped at 1 by `isRoot`
being boolean) — layers 4+ for a digit simply aren't drawn, rather than
drawn at a shrinking or unbounded size. This keeps the existing 0.65
scale meaningful (its worst case, 3 layers, is now the *actual* worst
case) and preserves the "busier digit reads as busier" property up to
the point where more layers would stop being visually distinguishable
anyway. Implemented as `Math.min(count, 3)` in `Circles`/`Triangles`
before generating their layer arrays.

**Revised during implementation: `inset-0 m-auto` centering breaks down
when a scaled shape's un-scaled `width`/`height` attribute approaches
or exceeds its container's size — switched to `top-1/2 left-1/2` plus a
`translate(-50%, -50%)` in the same `transform` as the scale.** After
capping layers at 3, the largest circle (144px raw, from `48 * 3`)
still measurably mis-centered inside its ~108px-wide mobile grid cell:
measured via `getBoundingClientRect()`, its rendered center sat ~18px
right of the cell's actual center, re-creating the neighbor-overlap
problem the layer cap was meant to fix. Root cause: `position: absolute`
with `inset: 0` (`top/right/bottom/left: 0`) together with an explicit
`width`/`height` attribute is an over-constrained box — when the
element's width exceeds its containing block's available space (as it
briefly does pre-scale, since the SVG's `width` attribute sets its
*layout* box size before `transform: scale()` is applied as a purely
visual effect), the spec resolves the conflict by collapsing one side's
`auto` margin asymmetrically rather than splitting the overflow evenly,
so `margin-left`/`margin-right` don't end up equal even though both are
`auto`. `top: 50%; left: 50%; transform: translate(-50%, -50%) scale(...)`
sidesteps this entirely — the element's own box size never factors into
where its center lands, so this can't recur regardless of how large a
future shape's base formula gets. Re-verified: all layer sizes (including
the capped 144px circle) now center exactly on the cell's actual center
point at a 390px viewport, confirmed via `getBoundingClientRect()`
sampling, not just visual inspection.

**Tap targets: fix only what's actually under 44px, leave the rest
alone.** Per Context above, the grid cells already meet the baseline.
Only the DaisyUI `.btn` instances (download button, dialog close
button) are under it. Rather than fighting DaisyUI's `--size-field`
globally (which would resize every future `.btn` in the app, an
unbounded blast radius), apply a minimum height directly to these two
specific buttons via Tailwind's `min-h-11` (44px) utility, scoped to
exactly the elements the proposal calls out.

**Revised during implementation: the birthdate clear button was
actually under 44px, and fixing it uncovered a second, unplanned
inconsistency.** Context above assumed the clear button's `inset-y-0`
made it span "the ~48px input height" — measured directly, DaisyUI's
`.input` resolves through the same `--size-field: .25rem` × 10 = 2.5rem
(40px) mechanism as `.btn`, not 48px. The clear button was therefore
40px tall, under the baseline, contradicting design.md's original
Context claim. Fixed by adding `min-h-11` to the birthdate `<input>`
itself (the clear button's `inset-y-0` then follows it up to 44px
automatically, no separate change needed on the button). This in turn
left the birthdate input 44px tall next to the still-40px "姓名" (name)
input immediately above it — a visible height mismatch between two
inputs in the same form that this proposal didn't originally call out.
Confirmed with the user: apply `min-h-11` to the name input as well, so
both inputs stay visually consistent (the name input isn't itself a
correctness requirement from spec.md, since it's not one of the
controls proposal.md listed, but leaving it mismatched would be a
regression introduced by this change).

**Grid-to-button gap: reduce the button wrapper's top spacing on narrow
viewports, not the grid section's internal padding.** Shrinking the
grid section's own `p-4` would reduce breathing room around the
marks themselves (working against the "marks shouldn't crowd" goal
above). Instead, add explicit `pt-2 sm:pt-0` to the download button
wrapper, pulling the button visibly closer to the grid on narrow
viewports while leaving desktop spacing (`sm:` and above) exactly as it
is today.

**Revised during implementation: the actual gap source was the capture
container's `py-10`, not `space-y-6`/section padding as originally
analyzed.** Measured before any fix: the gap was 48px, not accountable
by `space-y-6` (24px) alone. The download button wrapper sits *outside*
`captureRef`'s div (per the screenshot-export feature's design — the
button must never be part of the captured image), and that capture
container has its own `py-10` (40px) bottom padding, which was the
actual dominant contributor (40px + the button wrapper's own `pt-2`
(8px) = 48px, matching the measurement). Fixed by splitting the capture
container's `py-10` into `pt-10 pb-4` (keeping the top/header spacing
unchanged, shrinking only the bottom edge that borders the button) —
`pb-4` (16px) + the button wrapper's `pt-2` (8px) = 24px, now matching
the 24px gap between the app's other sections exactly. The button
wrapper's `pt-2 sm:pt-0` from the original plan was kept as-is; only the
capture container's padding needed the fix.

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
