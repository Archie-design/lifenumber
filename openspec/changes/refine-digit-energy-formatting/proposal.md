# Proposal

## Why

The digit 1-9 energy-table content in `src/lib/digitEnergy.ts` was
transcribed from photographed reference tables across several sessions.
Re-checking the transcription against the source photos (`reference/
IMG_4547.JPG`, `IMG_4555.JPG`-`IMG_4560.JPG`, covering digits 1 and
4-9) shows two systematic fidelity gaps: many cells that have clearly
visible line breaks in the source were flattened into a single run-on
string (sometimes with a plain space standing in for the missing
`\n`), and punctuation width is inconsistent — most content correctly
uses full-width `、` and `，`, but several cells mix in half-width `(`,
`)`, `:`, `.` where the rest of that digit's table uses full-width
equivalents. Both issues reduce fidelity to the source material and
make the rendered dialog harder to read (paragraphs that should break
run together as a wall of text).

## What Changes

- Re-transcribe line breaks (`\n` in the `low`/`lesson`/`mid`/`high`
  string values) for every populated digit (1, 4-9) by comparing each
  cell against its reference photo, adding missing breaks where the
  source shows a clear visual line/paragraph split. Digits 2 and 3 have
  no source photo in this repo (`reference/` only holds digit 1's and
  4-9's); their existing line breaks are left as-is, since there is no
  material to re-verify them against.
- Normalize punctuation to full-width across all nine digits' content:
  replace half-width `(`, `)`, `:`, `;`, `!`, `?`, `,`, `.` used as
  Chinese-text punctuation with their full-width equivalents (`（`,
  `）`, `：`, `；`, `！`, `？`, `，`, `。`), matching the convention
  already used by the majority of the existing content. This does not
  apply to punctuation that is legitimately part of non-Chinese tokens
  (e.g. `SOP`, digit/decimal notation is re-expressed with full-width
  numbering per source formatting, not code syntax).
- No changes to the `DigitEnergyRow`/`DigitEnergyTable` types, the
  click-to-open-modal interaction, `DigitEnergyDialog`'s rendering
  logic, or which digits are populated — this is a content-only
  correction to existing rows, not a structural or behavioral change.

## Capabilities

### Modified Capabilities
- `digit-energy-table`: the existing requirement that a digit's table
  content matches its reference material is clarified/reinforced with
  explicit line-break and punctuation-width fidelity — the underlying
  `DIGIT_ENERGY_TABLES` values for digits 1 and 4-9 are corrected to
  match.

## Impact

- `src/lib/digitEnergy.ts` — cell text values updated (added `\n`
  breaks, normalized punctuation); no shape/type changes.
- `src/lib/digitEnergy.test.ts` — any assertion that hardcodes exact
  cell text or counts embedded `\n` occurrences needs updating to match
  the corrected strings.
- No changes to `DigitEnergyDialog.tsx`, `ResultNumber.tsx`, or any
  other component — `whitespace-pre-line` rendering already handles
  additional `\n`s correctly.
