# Design

## Context

`src/lib/digitEnergy.ts` holds `DIGIT_ENERGY_TABLES`, hand-transcribed
from photographed reference tables across several prior sessions (see
`openspec/changes/archive/2026-09-23-digit-energy-table/`). Digit 1's
photo is `reference/IMG_4547.JPG`; digits 4-9's are `reference/
IMG_4555.JPG` through `IMG_4560.JPG`. Digits 2 and 3 have no source
photo present in this repo — they were transcribed in an earlier
session whose source material isn't available here.

Re-checking every photographed digit against its rendered/stored text
(see proposal.md - Why) surfaced two consistent fidelity gaps:

**1. Missing line breaks.** Many source cells have visually distinct
lines — either separate sentences/clauses the author put on their own
line, or a blank-line-separated second paragraph — that got flattened
into one continuous string, sometimes with a literal space where a
`\n` should be. Concrete confirmed examples from re-checking the
photos:

- Digit 4, row 1 `lesson`: currently `'找到安全感，給別人安定、程序SOP之建立\n給別人信任可靠形象 自己才能得安定 誠信給別人安定'` — the photo shows "給別人信任可靠形象" / "自己才能得安定" / "誠信給別人安定" as three separate lines, not space-joined.
- Digit 5, row 1 `lesson`: currently has `'修靜功法：打拳、抄經、感恩冥想 長期堅持某樣功法堅持到底'` — the photo shows "修靜功法：" then "打拳、抄經、感恩冥想" then "長期堅持某樣功法堅持到底" as distinct lines.
- Digit 6, row 1 `lesson`: currently has `'...而不是為得到別人給予的價值\n利他與自利合一 透過愛心、...'` — the photo shows a blank-line gap then "利他與自利合一" and "透過愛心、關懷別人、來安撫別人的心靈傷口、以身教宣導愛的真諦" as two separate lines, not space-joined.
- Digit 7: nearly every cell in the photo has 3-6 distinct lines (e.g.
  row 1 `low` and `lesson` are dense multi-line paragraphs); the
  current transcription for several of these cells has zero `\n` at
  all, joining everything into one run-on sentence.
- Digit 8: same pattern as digit 7 — most cells have 2-4 visible lines
  in the photo not reflected as `\n` in the current strings (e.g. row 1
  `lesson`'s "物質追求是必經過程、不須排斥" / "在物質豐盛後，才體悟豐富、滿足是精神上內在的感受、而非外在" / "轉而學習內在感恩、知足、而得到真豐盛" are three lines in the photo, and are three `\n`-joined segments in code today — this one is already correct and serves as the reference pattern for the others in that digit that aren't).
- Digit 9, row 1 `lesson`: three distinct lines in the photo, correctly
  three `\n`-segments already — again the reference pattern to match
  elsewhere.

This shows the fix is uneven, not a wholesale rewrite: some cells
already have correct `\n` placement (they should be left alone), while
others need it added. Each cell must be individually re-compared to
its source photo rather than pattern-matched in bulk.

**2. Half-width punctuation.** A `grep` across the string literals
found these half-width marks mixed into otherwise full-width Chinese
punctuation:

- `(`/`)` in digit 3's `mid` ("佳(歌、舞)"), digit 4's row 1 `low`
  ("猶豫不決(放怕飛、捏怕死)"), digit 7's row 1 `low` ("真理(全相)"),
  digit 9's row 1 `lesson` ("辨識方向(智慧)")
- `:` in digit 3's row 2 `lesson` ("內吞:要修..." / "溝通太自我:要修...")
- `.` in digit 8's row 1 `high` ("1.簡單物質生活..." / "2.內在豐盛...")

The source photos show these consistently as full-width in the
surrounding table style (parentheses, colons) - full-width is the
correct target, not a stylistic toss-up.

## Goals / Non-Goals

**Goals:**
- Every populated digit's cell text matches its source photo's line
  breaks, for the 7 digits whose photo is in `reference/` (1, 4-9).
- All punctuation across all 9 digits (including 2-3, which have no
  photo to re-check but whose existing punctuation can still be
  normalized by inspection) uses full-width forms consistently.
- No behavioral, type, or rendering changes — `DigitEnergyDialog`
  already renders `\n` via `whitespace-pre-line`, so adding more of
  them requires no code change.

**Non-Goals:**
- Not re-verifying digits 2-3's line breaks or wording against source
  material (no photo available) — only their punctuation width is in
  scope, checked by inspection of the existing text alone.
- Not restructuring `DigitEnergyRow`/`DigitEnergyTable`, adding new
  digits, or changing merged-cell handling — all settled in the prior
  change.
- Not adding automated fidelity checks (e.g. an OCR diff against the
  photos) — this is a one-time manual correction pass, consistent with
  how the data was originally authored.

## Decisions

**Re-verify cell-by-cell against the photo, not by pattern-inference.**
Because some cells already have correct `\n` placement and others
don't (see Context), a blanket rule like "insert `\n` before every
enumerated clause" would both under- and over-fix. Each of the ~28
populated rows across digits 1 and 4-9 (5 + 2+3+3+4+3+6 rows) needs its
four cells individually compared against a crop of that row in its
source photo before editing.

**Full-width punctuation replacement is closed-set and mechanical.**
Unlike line breaks, punctuation-width fixes don't require photo
re-verification once the target character is known 1:1 (`(`→`（`,
`)`→`）`, `:`→`：`, `.`→`。` when used as a Chinese full-stop,
`,`→`，`, `;`→`；`, `?`→`？`, `!`→`！`). Digit 8's "1." / "2." numbering
is the one case needing judgment: the source photo shows plain
Arabic-numeral-plus-full-width-period numbering ("1." rendered as
"１．" is not what the photo shows — it shows ordinary "1." followed by
Chinese text), so this stays as digit + half-width period, matching
the source's own typographic choice rather than mechanically
full-widening it. This is the one explicit exception to the
punctuation rule and is called out in tasks.md so it isn't
"corrected" by mistake.

**Leave digits 2-3's wording/line-breaks untouched.** No source photo
exists in this repo for these two digits (confirmed via `ls
reference/`). Re-inventing line breaks without a source to check
against would risk introducing fidelity errors rather than fixing
them, so only their punctuation width (a closed-set mechanical fix) is
in scope for those two digits.

**Revised during apply: line-break fixes narrowed to the 3 spots
already confirmed with high confidence, not a full cell-by-cell
re-verification of digits 1 and 4-9.** The systematic re-verification
this design originally called for (comparing all ~28 rows × 4 cells
against their photos) requires reliably distinguishing a deliberate
line break from natural text-wrap. Attempting this during apply showed
neither eyeballing nor a pixel-based measurement script (comparing
each line's ink extent to the cell's likely right margin) could do
this reliably: page-fold shadows in the photos are visually and
pixel-wise close to indistinguishable from printed grid lines, and
even a carefully tuned glyph-width filter still misjudged a
hand-picked, high-confidence test case (digit 4's 高階 column). Rather
than guess at the remaining ~25 rows and risk repeating the exact
failure mode already hit once with digit 9's merged-cell misreading in
the prior change, the line-break portion of this change is narrowed to
only the 3 spots in Context above that were confirmed by direct visual
comparison during the propose phase (digit 4 row 1 `lesson`, digit 5
row 1 `lesson`, digit 6 row 1 `lesson`). The broader claims about
digit 7 and 8 having "nearly every cell" affected remain unverified
observations, not confirmed fixes, and are left as-is rather than
acted on without higher-confidence verification. Punctuation
normalization (Decision above) is unaffected — it's mechanical and
carries no such ambiguity.

## Risks / Trade-offs

- **[Risk]** Manually re-comparing ~28 rows × 4 cells against cropped
  photo regions is exactly the kind of manual transcription work that
  previously produced the digit-9 row 3-5 misreading (see the archived
  `digit-energy-table` change's design.md) → **Mitigation**: crop each
  row's full width (all four columns' grid lines visible together, not
  a single column in isolation) before editing, the same technique that
  caught and fixed that prior error; verify the corrected dialog
  rendering in the browser afterward, not just the source diff.
- **[Trade-off]** Digits 2-3 remain unverified against source material
  since no photo exists in this repo → accepted; flagged explicitly in
  proposal.md's Non-Goals rather than silently skipped.
