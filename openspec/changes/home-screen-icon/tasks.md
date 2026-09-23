# Tasks

## 1. Draw the source icon

- [x] 1.1 Create `public/icon-source.svg` (square viewBox, e.g. 0 0 100
      100) implementing "方案三・九宮格縮影": a 3×3 arrangement of small
      circle, triangle, and square marks on a `#0f0f23` background,
      using only exact `numerology-dark` colors from `src/index.css`
      (matching the palette already used in the chosen option's
      preview), and verify the file is valid SVG (opens correctly in a
      browser)
- [x] 1.2 Render the SVG at 512×512 and 180×180 (open directly / zoom)
      and verify all three mark shapes stay individually distinguishable
      and none touch the canvas edge, adjusting stroke widths or margins
      if needed

## 2. Generate PNG rasters

- [x] 2.1 Using Playwright/Chromium (per design.md — no native SVG
      rasterizer is available on this machine), render `icon-source.svg`
      at exactly 180×180, 192×192, and 512×512 pixel viewports and save
      as `public/apple-touch-icon.png`, `public/icon-192.png`, and
      `public/icon-512.png`, and verify each file's actual pixel
      dimensions match its filename (e.g. via `sips -g pixelWidth
      -g pixelHeight`)
- [x] 2.2 Visually compare each generated PNG against the source SVG
      opened directly in a browser at the same size and verify no
      color shift, cropping, or background transparency issue

## 3. Add the manifest and wire up index.html

- [x] 3.1 Create `public/manifest.webmanifest` with `name`, `short_name`,
      `start_url: "/"`, `scope: "/"`, `display: "standalone"`,
      `theme_color`/`background_color` set to `#0f0f23` (matching
      `numerology-dark`'s `--color-base-100` exactly), and an `icons`
      array referencing `icon-192.png` and `icon-512.png` with correct
      `sizes`/`type`, and verify the file is valid JSON
- [x] 3.2 Add `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`,
      `<link rel="manifest" href="/manifest.webmanifest">`, and
      `<meta name="theme-color" content="#0f0f23">` to `index.html`,
      leaving the existing `<link rel="icon">` favicon tag unchanged,
      and verify `npm run build` completes with no new console errors

## 4. Verify against spec

- [x] 4.1 Run the dev server, open Chrome DevTools' Application panel
      (or `npx playwright` scripted check) and verify the manifest
      loads without errors, all three icon sizes resolve (200 status),
      and `display`/`theme_color`/`background_color` match design.md's
      values, per spec.md's manifest requirement
- [x] 4.2 Confirm via DevTools/inspection that the browser-tab favicon
      (`public/favicon.svg` via the existing `<link rel="icon">`) is
      still served unchanged, per spec.md's "existing favicon
      unaffected" requirement
- [x] 4.3 If a physical iOS or Android device (or simulator/emulator) is
      available, actually add the site to the home screen and verify
      the installed icon matches the chosen design and the app launches
      in standalone mode (no browser chrome); if unavailable, note this
      as unverified rather than claiming it was tested — **no physical
      device, simulator, or emulator is available in this environment,
      so this step is UNVERIFIED.** What was verified instead: the
      manifest is valid JSON with correct `display`/icon fields (task
      4.1), all icon URLs resolve with 200 (task 4.1), and the
      `<link rel="apple-touch-icon">`/`<link rel="manifest">` tags are
      present in the rendered page's `<head>` (task 4.1) — these are
      the inputs iOS/Android read to perform the install, but the
      actual on-device install/launch behavior itself has not been
      confirmed on a real device
- [x] 4.4 Run `npx tsc -b`, `npx oxlint`, and `npm run build` and verify
      all pass with no new errors or warnings — all pass; the 2
      Lightning CSS warnings during build are the pre-existing,
      documented, unrelated ones
