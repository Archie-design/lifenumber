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

## 5. Expand to digits 2-3, loosen row/cell shape

- [x] 5.1 Update `DigitEnergyRow` so `low`/`lesson`/`mid`/`high` are all
      optional, and verify `npx tsc -b` passes with no type errors
      (digit 1's existing entry should still typecheck unchanged)
- [x] 5.2 Add digit 2 ("合作與協調", 4 rows) and digit 3 ("表達與改革",
      4 rows) to `DIGIT_ENERGY_TABLES` per design.md's confirmed
      transcription, including their blank cells as omitted fields (not
      empty strings), and verify `npx tsc -b` passes
- [x] 5.3 Update `DigitEnergyDialog` to filter each row to only its
      populated `LEVEL_LABELS` entries before rendering, and verify a
      row with a missing cell (e.g. digit 2's row 4) shows only its
      populated columns, not an empty label with blank content, per
      spec.md "Digit 2's table has 4 rows with some cells absent"
- [x] 5.4 Update `digitEnergy.test.ts`: replace the digit-1-specific
      "exactly 5 rows, all cells non-empty" assertion with a
      shape-agnostic check, add assertions for digit 2's row 4 (missing
      中階/高階) and digit 3's row 2 (missing 中階), and update the
      "unpopulated digit" test to use digit 4 instead of digit 2 (now
      populated); verify `npm test` passes
- [x] 5.5 With a birthdate entered, click digits 2 and 3 in the grid and
      verify each dialog shows the correct title and row content
      matching design.md's transcription, and verify digit 2's row 4 /
      digit 3's row 2 render without empty-looking cells, in both light
      and dark mode
- [x] 5.6 Run `npm test`, `npx tsc -b`, `npx oxlint`, and `npm run build`
      and verify all pass with no new errors or warnings

## 6. Expand to digits 4-9, complete the dataset

- [x] 6.1 Add digits 4 ("穩定與程序", 2 rows), 5 ("自由與規範", 3 rows),
      6 ("付出與真愛", 3 rows), 7 ("真理與信任", 4 rows), 8
      ("豐富與權力", 3 rows), and 9 ("靈性與智慧", 6 rows) to
      `DIGIT_ENERGY_TABLES` per design.md's confirmed transcription,
      duplicating merged-source-cell text into each affected row per the
      new spec requirement, and verify `npx tsc -b` passes
- [x] 6.2 Update `digitEnergy.test.ts`: remove the now-incorrect
      "has no entry for unpopulated digits" test (digits 4-9 are now
      populated), and add assertions for each new digit's row count and
      at least one representative populated/absent-cell or merged-cell
      pair (e.g. digit 5's row 2/3 `mid` sharing identical text, digit
      7's `mid`/`high` identical across all 4 rows, digit 9's row 3
      `high` absent while row 4's is populated, digit 9's row 5 having
      only `low`); verify `npm test` passes
- [x] 6.3 With a birthdate entered, click digits 4 through 9 in the grid
      and verify each dialog shows the correct title and row content
      matching design.md's transcription, paying particular attention to
      digits 5, 7, and 9's merged-cell rows rendering the duplicated text
      correctly (not blank, not visually merged) in both light and dark
      mode
- [x] 6.4 Run `npm test`, `npx tsc -b`, `npx oxlint`, and `npm run build`
      and verify all pass with no new errors or warnings
