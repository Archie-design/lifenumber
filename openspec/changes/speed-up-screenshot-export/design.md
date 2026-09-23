# Design

## Context

`App.tsx`'s `handleDownload` calls `html-to-image`'s `toPng(captureRef.current,
{ style: { margin: '0' } })` (see `openspec/changes/page-screenshot-export/`
for that feature's original design, and its `design.md`'s "Post-ship fix"
section for the `margin: '0'` addition). Measured directly with
`performance.now()` around the call, capture takes ~8.4 seconds on this
project's real Google Fonts setup (Noto Serif TC + Noto Sans TC, per
`src/index.css`).

## Goals / Non-Goals

**Goals:**
- Cut capture time to roughly what a plain DOM-to-canvas render should
  cost (order of 100ms), confirmed by direct measurement, not guesswork.
- Confirm the fix doesn't regress the output image's font rendering.

**Non-Goals:**
- No change to what content is captured, the output format, or the
  download filename — this is purely a performance fix.
- No change to the site's font-loading strategy itself (already
  addressed separately by trimming unused Noto Sans TC weights) — this
  fix is scoped to the screenshot capture step only.

## Decisions

**Use `html-to-image`'s built-in `skipFonts: true` option, not a custom
font-handling workaround.** Root-caused via the library's own source
(`embed-webfonts.js`): by default, `toPng()` walks every stylesheet on
the page, re-fetches external CSS (including the Google Fonts `@import`),
parses out `@font-face` rules, and attempts to match/download/base64-embed
each referenced font file into the output SVG. Noto's CJK subsetting
means that CSS contains a very large number of `unicode-range`-partitioned
rules, making the scan disproportionately expensive for this project's
fonts specifically (confirmed: the same call with `skipFonts: true` took
~80ms instead of ~8400ms — about 100x faster).

Font embedding exists to let the intermediate SVG be viewed standalone
(e.g. saved as `.svg`) without relying on the browser's already-loaded
fonts. This feature always converts straight through to a PNG data URL
(`toPng`, not `toSvg`) for immediate download, so that use case never
applies — the browser renders the canvas using whatever font is already
active on the page at capture time, with or without embedding. Verified
by visually comparing captures with and without `skipFonts: true`: both
render the same Noto Serif TC headings and Noto Sans TC body text
correctly.

**No fallback or loading-state change.** Since the fix reduces capture
time by two orders of magnitude, the existing synchronous
try/catch-wrapped call in `handleDownload` (no loading spinner today)
remains adequate — a ~100ms operation doesn't need a loading indicator
the way an ~8 second one arguably did. Adding one is out of scope here
since the delay that motivated it is gone.

## Risks / Trade-offs

- **[Trade-off]** If a user's system somehow lacks the Noto fonts (e.g.
  fonts failed to load over a broken connection), a non-embedded capture
  would fall back to the browser's default font for that script, whereas
  an embedded one might have still rendered Noto correctly if the font
  file itself had loaded even though the page render looked broken →
  accepted, since this is a narrow edge case (fonts failing while the
  rest of the page's content loaded successfully) and the 100x speedup
  benefits every normal capture.
