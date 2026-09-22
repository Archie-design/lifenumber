# Design

## Context

The digit-frequency grid (`src/components/ResultNumber.tsx`, rendered in
a loop from `src/App.tsx`) currently renders each digit 1-9 as a static
`<div>` with layered SVG shapes; it has no click handling at all. The
reference material (`reference/IMG_4547.JPG`, transcribed and confirmed
with the user) gives digit 1's table:

| | 低階 | 修功課 | 中階 | 高階 |
|---|---|---|---|---|
| 1 | 自卑、我不夠好、自我價值感低落 | 不評斷他人、不瞧不起他人、看到自己與別人的價值 | 自信心、平等心起而不自卑 | 自信十足就產生直覺力 |
| 2 | 愛面子、不認輸、驕傲、無法接受批評、好勝心強、愛當老大 | 承擔錯誤、輸得起、勇於面對挑戰 | 可面對錯誤、學會道歉 | 沒挫折感、有企圖心、勇氣、目標明確 |
| 3 | 自我意識中心、固執、獨斷、主觀、衝動、缺思考 | 接受他人意見、批評、修客觀 | 冷靜、思考、勇往直前、知道自己要什麼 | 接受不同聲音、第六感強 |
| 4 | 孤僻、獨行俠、寂寞、因不信任自己也不信任別人、與人太親近會怕、被發現自己不夠好而保持距離、退縮 | 獨立、不需要透過外在、別人證明而自立，找到自我價值 | 合群、不怕別人知道自己不完美 | 不依賴而獨當一面 |
| 5 | 因不想被領導，而領導別人，當老大才有自尊 | 修：臣服心、當先鋒 | 有衝勁、帶頭做、開拓力 | 領導他人走向人性光明、創造力能無中生有 |

Row 5's lesson-column text ("修：臣服心、當先鋒") intentionally keeps its
"修：" prefix, unlike rows 1-4 — confirmed with the user as a deliberate
transcription of the source material, not a formatting bug to normalize.

## Goals / Non-Goals

**Goals:**
- Pick a data shape that stores digit 1 today and adds digits 2-9 later
  as plain data edits, with zero code changes to the grid or modal
  components.
- Reuse the existing DaisyUI theme and typography (`font-display`,
  theme color tokens) rather than introducing new colors or fonts for
  the modal.

**Non-Goals:**
- No admin UI or CMS for editing table content — data ships as a static
  TypeScript module, edited by hand like the rest of the codebase.
- No animation/transition design beyond what DaisyUI's `<dialog>` modal
  provides by default.
- No changes to how frequency (circle/triangle/square) marks are
  computed or displayed — this change only adds a click layer on top.

## Decisions

**Data shape: a `Record<digit, DigitEnergyTable | undefined>`-style map,
not a fixed 9-tuple.** A plain object keyed `1` through `9`, where only
populated digits have an entry, makes "does digit N have data" a simple
existence check (`table !== undefined`) rather than a check against
placeholder/empty content. This directly satisfies spec.md's requirement
that an absent digit produce zero visual feedback — there's no empty
table to accidentally render.

```ts
export interface DigitEnergyRow {
  low: string     // 低階
  lesson: string  // 修功課
  mid: string     // 中階
  high: string    // 高階
}

export interface DigitEnergyTable {
  digit: number
  title: string   // e.g. "自信與領導"
  rows: DigitEnergyRow[]  // always 5 for a populated digit, per spec.md
}

export const DIGIT_ENERGY_TABLES: Partial<Record<number, DigitEnergyTable>> = {
  1: { digit: 1, title: '自信與領導', rows: [ /* 5 rows */ ] },
  // 2-9 added later as plain data entries
}
```

Lives in a new `src/lib/digitEnergy.ts`, parallel to the existing
`src/lib/numerology.ts` — both are pure data/logic modules with no React
dependency, matching the project's existing split between `lib/` (logic)
and `components/` (rendering).

**Modal implementation: native `<dialog>` via DaisyUI's `modal` classes,
not a hand-rolled overlay.** The project has no existing modal pattern.
DaisyUI 5 (already a dependency) ships a documented `<dialog class="modal">`
pattern that gets focus trapping, Escape-to-close, and click-outside-to-close
from the native `<dialog>` element for free — more reliable than a custom
`position: fixed` overlay with manual focus management, and it's the
idiomatic choice for a project already using DaisyUI throughout. Opened
via `dialogRef.current?.showModal()` on click; DaisyUI's `modal-backdrop`
form covers click-outside-to-close, and a `method="dialog"` form button
covers the explicit close control, per spec.md's "modal can be dismissed"
scenario.

**Click target: the whole `ResultNumber` cell, gated by data presence —
not a separate icon or affordance layered on top.** Per the user's
decision, every digit cell is clickable regardless of its current
circle/triangle/square marks; only presence in `DIGIT_ENERGY_TABLES`
gates whether a click does anything. `ResultNumber` looks up
`DIGIT_ENERGY_TABLES[digit]` itself and only wires an `onClick`/cursor
style when an entry exists — a digit with no data renders exactly as
today (no click handler attached at all, not a handler that's a no-op),
so there's no risk of an errant click handler intercepting something
else later.

**Level-column coloring: reuse existing semantic theme tokens, don't
invent new ones.** 低階 (low) uses the `error`/`warning`-toned text
already used elsewhere for cautionary content; 高階 (high) uses `success`
green, matching the existing digit-frequency grid's use of green for
"achieved" states; 中階 (mid) uses default `base-content`; 修功課 (lesson)
uses `accent`/`primary` to visually mark it as the actionable column
between low and mid. This mirrors the color logic already established in
`NumerologySummary.tsx` (`text-success`, `text-error` for major/patch
numbers) rather than introducing a parallel color scheme.

**Table layout responsiveness: stacked cards on narrow screens, not a
horizontally-scrolling 4-column table.** A literal 4-column HTML table at
the app's typical mobile width (~375-420px) would force either tiny
unreadable text or horizontal scrolling, which is poor mobile UX for
a screenshot-driven feature. Instead, each of the 5 rows renders as a
labeled stack of 低階/修功課/中階/高階 blocks on narrow screens
(`grid-cols-1` below `sm:`), switching to a true 4-column grid at `sm:`
and above — consistent with the rest of the app's existing mobile-first
responsive patterns (e.g. `sm:text-3xl` sizing already used throughout).

## Revised during implementation

**The `<dialog>` element must always be mounted, not conditionally
rendered on `selectedTable`.** The original plan implicitly assumed
`<DigitEnergyDialog table={selectedTable} ref={energyDialogRef} />` could
be wrapped in `{selectedTable ? ... : null}` (mirroring the rest of the
app's conditional-render style). In practice this breaks `showModal()`:
`handleSelectDigit` calls `setSelectedDigit(digit)` then immediately
`energyDialogRef.current?.showModal()` in the same synchronous handler,
but since the dialog only mounts *after* React processes the state
update, `energyDialogRef.current` is still `null` at the point
`showModal()` is called — confirmed via Playwright (the `<dialog>` existed
in the DOM with correct content but never gained the `open` attribute,
i.e. `showModal()` silently no-op'd on a null ref). Fixed by mounting
`<DigitEnergyDialog>` unconditionally (dialog element always in the DOM,
hidden by DaisyUI's own `.modal` visibility handling) and passing
`table: DigitEnergyTable | undefined` through to it, rendering "no table
content yet" (an empty modal-box) only in the narrow window before
`selectedDigit` state has propagated — which is not user-visible since
`showModal()` and the state update both originate from the same click.

## Risks / Trade-offs

- **[Trade-off]** Hand-editing a TypeScript data literal for digits 2-9
  later means each addition is a manual, unreviewed-by-tooling transcription
  step (same risk profile as this change's digit-1 transcription, which
  required two rounds of image re-crop/rotate to read correctly) →
  accepted since proposal.md explicitly scopes this change to digit 1
  only and treats a CMS/admin UI as non-goal.
- **[Risk]** DaisyUI's native `<dialog>` modal requires `showModal()` to
  be called imperatively (not just toggling a CSS class), which means the
  open/close state isn't purely declarative React state → **Mitigation**:
  wrap the imperative calls in a small custom hook or the dialog
  component itself, keeping `ResultNumber` and `App.tsx` free of direct
  DOM-imperative code, consistent with how `captureRef`/`toPng()` in
  `App.tsx` already isolates its one necessary imperative DOM interaction.
