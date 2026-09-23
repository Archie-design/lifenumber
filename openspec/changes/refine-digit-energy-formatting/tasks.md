# Tasks

## 1. Fix the line breaks confirmed during photo comparison

**Scope note**: A systematic cell-by-cell re-verification of every row
against its source photo (the original plan for this section) turned
out to need a reliable "deliberate break vs. natural text-wrap" signal
that neither eyeballing nor a pixel-based measurement script could
produce consistently — page-fold shadows in the photos are visually
and pixel-wise indistinguishable from printed grid lines, and even a
carefully tuned glyph-width filter still misjudged a hand-verified test
case. Rather than guess at the remaining cells and risk introducing new
transcription errors (the same failure mode already hit once with
digit 9 in the prior change), this section is narrowed to only the
specific spots already confirmed with high confidence by direct visual
comparison during the propose phase. Everything else in `digitEnergy.ts`
keeps its existing line breaks (or lack thereof) unchanged.

- [x] 1.1 Digit 4, row 1 `lesson`: change
      `'找到安全感，給別人安定、程序SOP之建立\n給別人信任可靠形象 自己才能得安定 誠信給別人安定'`
      to `'找到安全感，給別人安定、程序SOP之建立\n給別人信任可靠形象\n自己才能得安定\n誠信給別人安定'`
      (the two spaces become `\n`, per the confirmed photo comparison in
      design.md), and verify `npx tsc -b` passes
- [x] 1.1b Digit 4, row 1 `high`: change
      `'組織能力強整合力規劃力行政管理力穩定可靠'` (no separators at all) to
      `'組織能力強\n整合力\n規劃力\n行政管理力\n穩定可靠'` — confirmed during
      apply by direct photo comparison (5 distinct short lines, same
      style as this digit's row-2 `high` which already has `\n`s), and
      verify `npx tsc -b` passes
- [x] 1.2 Digit 5, row 1 `lesson`: change
      `'修：自律、遵守、程序\n修靜功法：打拳、抄經、感恩冥想 長期堅持某樣功法堅持到底\n▲若5越多：...'`
      to `'修：自律、遵守、程序\n修靜功法：\n打拳、抄經、感恩冥想\n長期堅持某樣功法堅持到底\n▲若5越多：...'`
      (confirmed photo comparison shows "修靜功法：" / "打拳、抄經、感恩冥想" /
      "長期堅持某樣功法堅持到底" as three separate lines), and verify
      `npx tsc -b` passes
- [x] 1.3 Digit 6, row 1 `lesson`: change the space between
      "而不是為得到別人給予的價值" and "利他與自利合一" and the space between
      "利他與自利合一" and "透過愛心、關懷別人..." both to `\n` (confirmed
      photo comparison shows a paragraph gap then two separate lines),
      and verify `npx tsc -b` passes

## 2. Normalize punctuation width (all nine digits)

- [x] 2.1 Replace half-width `(`/`)`/`:`/`;`/`!`/`?`/`,` used as
      Chinese-text punctuation with their full-width equivalents
      (`（`/`）`/`：`/`；`/`！`/`？`/`，`) across all nine digits'
      `low`/`lesson`/`mid`/`high`/`title` values, including the four
      confirmed spots from design.md (digit 3's `mid` and row-2
      `lesson`, digit 4's row-1 `low`, digit 7's row-1 `low`, digit 9's
      row-1 `lesson`), and verify `npx tsc -b` passes
- [x] 2.2 Leave digit 8's row-1 `high` "1."/"2." numbering as
      half-width-period-after-digit per design.md's explicit exception
      (matches the source photo's own typographic choice) — do not
      full-width this one, and note in the commit/PR why it's excluded
- [x] 2.3 Re-run the half-width-punctuation grep from design.md's
      Context section across `src/lib/digitEnergy.ts` and confirm zero
      remaining matches outside the digit-8 exception

## 3. Update tests and verify

- [x] 3.1 Update `src/lib/digitEnergy.test.ts` for any assertion that
      hardcodes exact cell text affected by the line-break or
      punctuation changes, and verify `npm test` passes — no assertions
      hardcode the affected strings (they check row counts and
      defined/undefined only), so no changes were needed; `npm test`
      passes (17/17)
- [x] 3.2 With a birthdate entered, click through all nine digits in
      the grid and visually confirm the corrected paragraphs render as
      separate lines (not run together) and punctuation looks correct,
      in both light and dark mode — verified digits 4, 5, 6 (the ones
      with actual line-break changes) via Playwright screenshots in
      both color schemes; digits 1-3, 7-9 only had punctuation-width
      changes (no layout change to visually re-verify)
- [x] 3.3 Run `npm test`, `npx tsc -b`, `npx oxlint`, and `npm run
      build` and verify all pass with no new errors or warnings — all
      pass; the 2 Lightning CSS warnings during build are the
      pre-existing, documented, unrelated ones
