# Tasks

## 1. Scale down grid marks on narrow viewports

- [x] 1.1 Add a `--grid-mark-scale` custom property to `src/index.css`
      (0.65 below `sm:`, 1 at `sm:` and above, per design.md) alongside
      the existing `--capture-*` responsive variables
- [x] 1.2 Apply `--grid-mark-scale` to the size calculations in
      `ResultNumber.tsx`'s `Circles`, `Triangles`, and `Squares`, and
      verify at a 390px viewport that digit 1's 3-layer circle case no
      longer visually overlaps the neighboring grid cell, per spec.md
      "A digit with three stacked circle layers doesn't crowd its
      neighbor"
- [x] 1.3 Verify at `sm:` and above (e.g. 768px+) that grid marks render
      at their original (unscaled) size, matching the current desktop
      appearance exactly

## 2. Bring under-sized controls up to the 44px tap-target baseline

- [x] 2.1 Add `min-h-11` to the download-screenshot button in `App.tsx`
      and verify its rendered height is at least 44px
- [x] 2.2 Add `min-h-11` to the energy-table dialog's close button in
      `DigitEnergyDialog.tsx` and verify its rendered height is at least
      44px
- [x] 2.3 Verify the birthdate clear button and digit-grid cells already
      meet 44×44px (per design.md's Context) and confirm no change is
      needed there, per spec.md "The birthdate clear button is easy to
      tap" and "A populated digit-grid cell is easy to tap" — grid cells
      already met it; the clear button did not (measured 40px, not the
      assumed 48px) and was fixed via `min-h-11` on the birthdate input,
      per design.md's "Revised during implementation"

## 3. Tighten grid-to-button spacing on narrow viewports

- [x] 3.1 Replace the download button wrapper's `pb-10` with
      `pt-2 sm:pt-0 pb-10` in `App.tsx` and verify at a 390px viewport
      that the visual gap between the grid section and the button is no
      longer noticeably larger than the gap between the other result
      sections, per spec.md "Gap below the grid matches other section
      gaps at mobile width" — the button wrapper's own padding wasn't
      the dominant gap source; the capture container's `py-10` was (see
      design.md's "Revised during implementation"). Fixed by splitting
      it into `pt-10 pb-4`. Measured gap is now 24px, matching the gap
      between other sections exactly.
- [x] 3.2 Verify at `sm:` and above that the grid-to-button spacing is
      visually unchanged from before this change

## 4. Verify against spec

- [x] 4.1 With a birthdate producing multiple busy digits (e.g.
      1991/09/18, matching the screenshot's date) entered at a 390px
      viewport, visually confirm the full grid section — all 9 cells —
      reads clearly with no shape crossing into a neighboring cell
- [x] 4.2 Confirm the screenshot-export feature (from the unarchived
      `page-screenshot-export` change) still captures correctly after
      these layout changes — download a screenshot at a narrow viewport
      and verify it matches the on-screen layout
- [x] 4.3 Run `npm test`, `npx tsc -b`, `npx oxlint`, and `npm run build`
      and verify all pass with no new errors or warnings (the two
      pre-existing Lightning CSS warnings documented in
      `openspec/changes/page-screenshot-export/design.md` are expected
      and unrelated to this change)
