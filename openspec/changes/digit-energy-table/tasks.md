# Tasks

## 1. Data module

- [x] 1.1 Create `src/lib/digitEnergy.ts` with the `DigitEnergyRow`,
      `DigitEnergyTable` types and `DIGIT_ENERGY_TABLES` map (per
      design.md), populated with digit 1's confirmed 5-row content, and
      verify `npx tsc -b` passes with no type errors
- [x] 1.2 Write a unit test asserting `DIGIT_ENERGY_TABLES[1]` has
      exactly 5 rows with non-empty `low`/`lesson`/`mid`/`high` text on
      every row, and that `DIGIT_ENERGY_TABLES[2]` (and other
      unpopulated digits) is `undefined`, and verify `npm test` passes

## 2. Modal component

- [x] 2.1 Create a `DigitEnergyDialog` component using DaisyUI's native
      `<dialog class="modal">` pattern (per design.md), accepting a
      `DigitEnergyTable` and an open/close ref-based API, and verify it
      renders the digit's title and a 5-row low/lesson/mid/high layout
      when manually mounted with digit 1's data
- [x] 2.2 Style the level columns using existing theme tokens — 低階 in
      a cautionary tone, 修功課 in accent/primary, 中階 in default
      base-content, 高階 in success green (per design.md) — and verify
      visually in both light and dark mode
- [x] 2.3 Implement the responsive layout: stacked labeled blocks per
      row below `sm:`, a true 4-column grid at `sm:` and above, and
      verify by resizing the viewport that content stays readable
      without horizontal scrolling at a typical mobile width (~375px)
- [x] 2.4 Wire close behavior — clicking outside the dialog and an
      explicit close control both close it — and verify both interactions
      work and the page returns to its prior state (per spec.md "The
      modal can be dismissed")

## 3. Grid wiring

- [x] 3.1 In `ResultNumber.tsx`, look up `DIGIT_ENERGY_TABLES[digit]` and
      only attach an `onClick` (opening the dialog) and a pointer cursor
      when an entry exists; verify a cell with data is clickable
      regardless of its current circle/triangle/square marks, per
      spec.md "A digit with zero frequency marks can still have table
      data"
- [x] 3.2 Verify a cell for an unpopulated digit (e.g. digit 2) has no
      click handler, no cursor change, and clicking it produces no
      dialog, no visual change, and no console error, per spec.md
      "Tapping an unpopulated digit is a no-op"

## 4. Verify against spec

- [x] 4.1 With a birthdate entered, click digit 1 in the grid and verify
      the dialog shows "1號 自信與領導" and the full 5-row table matching
      the confirmed transcription, including row 5's "修：臣服心、當先鋒"
      lesson text exactly as transcribed
- [x] 4.2 Run `npm test`, `npx tsc -b`, `npx oxlint`, and `npm run build`
      and verify all pass with no new errors or warnings (the two
      pre-existing Lightning CSS warnings documented in
      `openspec/changes/page-screenshot-export/design.md` are expected
      and unrelated to this change)
