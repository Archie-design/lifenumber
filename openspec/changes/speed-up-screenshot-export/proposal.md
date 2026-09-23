# Proposal

## Why

Downloading the numerology result as a screenshot takes close to 10
seconds — reported by a user as feeling "very slow." Measured directly
(via the `toPng()` call in `handleDownload`), the capture itself takes
~8.4 seconds. Root-caused to `html-to-image`'s default font-embedding
step: it scans every stylesheet on the page (including the Google Fonts
`@import` for Noto Serif/Sans TC), re-fetches the CSS, and attempts to
match/download/base64-embed the underlying font files. Because Noto's
CJK character set is large, that CSS is partitioned into a very large
number of `unicode-range` subsets, making the scan-and-match step
disproportionately slow. Measured with the library's own `skipFonts`
option enabled, the same capture completes in ~80ms — roughly 100x
faster — with no visible difference in the output PNG (browsers already
render canvas text using whatever font is currently applied on screen;
embedding is only needed to preserve font fidelity when the SVG
intermediate is opened standalone, which this feature never does since
it always converts straight to a PNG data URL).

## What Changes

- Pass `skipFonts: true` to the `toPng()` call in `App.tsx`'s
  `handleDownload`, skipping the expensive font-scan-and-embed step
  entirely.
- No visual, layout, or file-format change to the downloaded image —
  this is a pure performance fix to an existing feature.

## Capabilities

### New Capabilities
- `screenshot-export-performance`: Defines the time budget for the
  screenshot capture step and confirms output-image equivalence with
  and without font embedding.

### Modified Capabilities
_None — no existing specs in this project yet (prior changes have not
been archived, so `openspec list --specs` reports no specs). This is a
performance change to the existing screenshot-download feature
(originally added in the unarchived `page-screenshot-export` change),
not a change to that feature's user-facing behavior contract._

## Impact

- `src/App.tsx` — one-line addition to the existing `toPng()` call's
  options object in `handleDownload`.
- No new dependencies, no changes to `src/lib/`, `src/components/`, or
  any other capability.
