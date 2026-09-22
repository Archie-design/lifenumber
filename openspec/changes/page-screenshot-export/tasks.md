# Tasks

## 1. Setup

- [x] 1.1 Add `html-to-image` to `package.json` dependencies and verify
      `npm install` succeeds with no peer-dependency warnings

## 2. Capture wiring

- [x] 2.1 Attach a `ref` to `App.tsx`'s existing root content wrapper
      (header + inputs + result summary + digit grid) and verify the ref
      resolves to that element at runtime (e.g. via a temporary console
      log or React DevTools)
- [x] 2.2 Add a download button inside the existing `{result ? ... :
      null}` block so it only renders once a result exists, and verify it
      is absent with no/invalid birthdate and present once a valid
      birthdate is entered (per spec.md "Download button appears only
      once a result exists")
- [x] 2.3 Wire the button's click handler to call `html-to-image`'s
      `toPng()` on the ref'd element, convert the result to an `<a
      download="numbers-of-life.png">` click, and verify clicking the
      button downloads a `.png` file without navigating or reloading the
      page (per spec.md "Download produces a PNG file")

## 3. Error handling

- [x] 3.1 Wrap the capture call in try/catch and render a short inline
      error message (using the site's existing error text color token) on
      failure, and verify — by temporarily forcing `toPng()` to reject —
      that the rest of the page remains fully interactive after a failed
      capture (per spec.md "Capture failure does not break the page")

## 4. Verify against spec

- [x] 4.1 Download a screenshot with a name and birthdate entered and
      verify the resulting PNG visually contains the header, name field,
      birthdate field, result summary numbers, and digit-frequency grid
      (per spec.md "Captured image includes the full page content")
- [x] 4.2 Compare a downloaded screenshot against the live page in both
      light and dark mode and verify the image's colors match what is
      currently on screen, including the digit-grid's CSS-variable-driven
      SVG strokes (per spec.md "Captured image reflects on-screen
      appearance" and design.md's noted capture risk)
- [x] 4.3 Run `npm test`, `npx tsc -b`, `npx oxlint`, and `npm run build`
      and verify all pass with no new errors or warnings
