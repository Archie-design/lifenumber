# Tasks

## 1. Apply the fix

- [x] 1.1 Add `skipFonts: true` to the `toPng()` options in `App.tsx`'s
      `handleDownload` and verify `npx tsc -b` passes with no type errors

## 2. Verify against spec

- [x] 2.1 Measure capture time before/after (e.g. via
      `performance.now()` around the `toPng()` call, or observing the
      time between click and download) and verify it completes in
      around 1 second or less, per spec.md "Screenshot capture completes
      quickly"
- [x] 2.2 Download a screenshot and visually compare it against a
      screenshot taken before this change, in both light and dark mode,
      and verify heading (Noto Serif TC) and body (Noto Sans TC) text
      render with the same fonts in both, per spec.md "Output image text
      remains visually correct"
- [x] 2.3 Run `npm test`, `npx tsc -b`, `npx oxlint`, and `npm run build`
      and verify all pass with no new errors or warnings (the two
      pre-existing Lightning CSS warnings documented in
      `openspec/changes/page-screenshot-export/design.md` are expected
      and unrelated to this change)
