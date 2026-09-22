# Tasks

## 1. Draw the icon

- [x] 1.1 Create a square-viewBox SVG containing one circle, one triangle,
      and one square nested/overlapping (per design.md's concept), using
      only the exact `numerology-dark` colors from `src/index.css`
      (`#0f0f23` background, `#5dade2` circle, `#52d68a` triangle,
      `#ca8a04` square) and verify the file is valid SVG (opens correctly
      in a browser tab)
- [x] 1.2 Render the SVG at 16×16 and 32×32 (e.g. open the raw file and
      zoom the browser out, or use a local favicon preview) and verify the
      three shapes remain individually distinguishable, adjusting stroke
      widths if they blur together at 16×16

## 2. Wire it up

- [x] 2.1 Replace `public/favicon.svg` with the new icon and verify
      `index.html`'s existing `<link rel="icon" type="image/svg+xml"
      href="/favicon.svg">` still resolves to it (no markup change
      expected)
- [x] 2.2 Run the dev server and verify the browser tab shows the new icon
      instead of the old purple-blob scaffold icon

## 3. Verify against spec

- [x] 3.1 Compare the rendered tab icon against a light-colored browser tab
      bar and a dark-colored one (e.g. toggle OS/browser theme) and verify
      the icon stays visible and recognizable on both, per
      `specs/browser-tab-icon/spec.md`'s light/dark legibility scenarios
- [x] 3.2 Confirm every color used in the final SVG matches a color defined
      in `src/index.css`'s theme blocks (no new/arbitrary hex values) and
      verify `npm run build` completes with no new console errors
