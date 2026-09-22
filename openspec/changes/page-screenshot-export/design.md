# Design

## Context

All page content already lives under one wrapper element in
`src/App.tsx` (`<div className="mx-auto max-w-2xl space-y-6 ...">`
containing the header, input card, result summary, and digit grid). The
site's visuals rely heavily on CSS custom properties for theming — DaisyUI
theme tokens (`--color-primary`, `--color-base-100`, etc., defined in
`src/index.css`) and, in `ResultNumber.tsx`, inline SVG strokes set via
`stroke="var(--color-info)"` and friends (see proposal.md for motivation).
Any capture approach must resolve these CSS variables correctly, including
inside inline SVGs, in both the light and dark theme.

## Goals / Non-Goals

**Goals:**
- Pick one screenshot library and confirm it works with this project's
  CSS-variable-driven theming (including inline SVG `stroke="var(...)"`)
  before implementation starts.
- Keep the capture client-side only — no server round-trip, no new
  backend.

**Non-Goals:**
- No configurable capture region, image format choice, or share-to-social
  integration — a single "download PNG of everything visible" button, per
  proposal.md.
- No support for browsers without Canvas/Blob APIs (i.e. no fallback for
  effectively unsupported browsers) — out of scope for a small personal
  numerology tool.

## Decisions

**Library: `html-to-image`, not `html2canvas`.**
`html2canvas` (last major work several years old) has long-standing,
still-open issues with modern CSS custom properties and `var(...)` inside
inline SVG attributes — exactly what `ResultNumber.tsx`'s circle/triangle
strokes use. `html-to-image` (actively maintained, framework-agnostic,
zero peer-dependency constraints) has better and more current support for
CSS variables and inline SVG, and is the pattern most commonly recommended
for exactly this "export a themed React component tree to PNG" use case.
`modern-screenshot` (a newer fork of `html-to-image`) was considered but
rejected to avoid pulling in a less-established fork for a small feature.

Method: `toPng(node)` on the existing root content wrapper in `App.tsx`,
producing a data URL that gets set as an `<a download>` link's `href` and
programmatically clicked — no new canvas UI, no visible intermediate
state.

**Capture target: the existing root content wrapper, via a `ref`.**
Rather than introducing a new dedicated "export view" component, attach a
`ref` to `App.tsx`'s existing outer content `<div>` (already contains
header, inputs, summary, and grid per proposal.md's "What Changes"). This
guarantees the capture always matches exactly what the tasks.md
verification tasks will check against — there's no second layout to keep
in sync with the first.

**Button placement and visibility: reuse the existing `result`
conditional.** The download button renders inside the same `{result ? ...
: null}` block already gating the summary section in `App.tsx`, so its
visibility rule is identical to the summary's — no new state needed to
satisfy the spec's "only after a result exists" requirement.

**Failure handling: try/catch around the async capture call, surfaced via
existing UI patterns.** `toPng()` returns a Promise and can reject (e.g. a
tainted-canvas security error, though unlikely here since all assets are
same-origin). Wrap the call in try/catch; on rejection, show a short
inline error message near the button (reusing the site's existing
`text-error`/`text-base-content` text-color tokens) rather than a native
`alert()`, consistent with the rest of the UI's styling. The page and all
other functionality remain fully interactive regardless of capture
success or failure (per spec.md's "capture failure does not break the
page" requirement).

**Filename: static, descriptive.** e.g. `numbers-of-life.png`. Not
worth deriving a dynamic name (e.g. from the entered name) for a v1 of
this feature — the proposal only asks for "a screenshot," not a specific
naming scheme, and adding one would introduce sanitization/edge-case
scope not covered by any spec requirement.

## Revised during implementation

Two issues surfaced only by actually downloading and pixel-sampling the
output PNG (not visible from reading the code):

**1. Tailwind `/opacity` utilities produce `oklab()`/`oklch()` colors that
`html-to-image` cannot resolve.** Every element inside the capture target
using a Tailwind opacity modifier (`bg-base-200/50`, `text-base-content/60`,
`border-primary/30`, etc. — DaisyUI 5's theme colors resolve through
`oklab()` under those modifiers) rendered as flat gray in the captured
image instead of the intended tinted color, even though the live page
displayed correctly. Fixed by adding a small set of pre-mixed `rgba()`
custom properties to `src/index.css` (`--capture-base-200-50`,
`--capture-base-content-{30,40,60,70}`, `--capture-primary-{30,40}`,
each with a light and a `prefers-color-scheme: dark` value) and swapping
every `/opacity`-modified Tailwind class *inside the capture target* for
the equivalent `bg-[var(--capture-...)]` / `text-[var(--capture-...)]`
arbitrary-value class. Scope: only elements inside `App.tsx`'s
`captureRef` div and the components it renders (`NumerologySummary`,
`ResultNumber`, `BirthdateInput`) were changed — opacity utilities outside
the capture target (e.g. the download button's own styling) were left
alone, since they're never rendered through `toPng()`.

**2. The capture target itself has no opaque background, so the output
PNG has a transparent background.** `captureRef` was attached to the
inner content wrapper (`max-w-2xl` div), but the page's `bg-base-100`
background lives on its *parent* element, outside the captured subtree.
The resulting PNG was correctly colored but fully transparent outside the
card shapes — confirmed by checking the PNG's color type (6 = RGBA) and
sampling background pixels (alpha ~128 instead of 255). This technically
matched "no oklab bug" but still violated spec.md's "captured image
reflects on-screen appearance" requirement, since a transparent PNG does
not look like the solid-background page a user sees. Fixed by adding
`bg-base-100` directly to the `captureRef` element, so the capture target
carries its own opaque background independent of its parent.

Both fixes were verified by decoding the actual downloaded PNG (not just
re-reading the DOM) and sampling pixel RGBA values against the expected
theme colors in both light and dark mode, per the updated tasks.md 4.2.

**Pre-existing build warning, unrelated to this change.** `npm run build`
prints two "Unexpected token Delim('.')" CSS-optimizer warnings whose
context lines mention `--capture-...`-looking selectors. Confirmed via
`git stash` that both warnings are byte-for-byte identical (down to the
literal `--capture-...` placeholder text) on the pre-existing
`browser-tab-icon` commit, before any of this change's code existed —
they come from Lightning CSS's own internal diagnostic tooling, not from
`--capture-*` custom properties or the `bg-[var(--capture-...)]`
arbitrary-value classes added here. Left unaddressed as out of scope for
this change.

**Post-ship fix: `toPng()` clones the captured element's computed
`margin`, which reintroduces the page's `mx-auto` centering offset inside
the independent capture canvas.** Discovered after this change had
already shipped, when a user testing on a wide browser window (the
digit-energy-table feature's development prompted a fresh manual test)
reported a large blank region on the left side of the downloaded PNG.
Root cause, confirmed by inspecting `html-to-image`'s source
(`clone-node.js`'s `cloneCSSStyle`): it copies the source element's full
`getComputedStyle().cssText` onto the clone, including the concrete
pixel `margin-left`/`margin-right` that `mx-auto` resolves to for
centering the element in the *original* page. That margin still applies
once the clone is placed inside `toPng()`'s own single-element SVG
canvas, shifting the rendered content right by exactly that many pixels
— invisible at a narrow viewport (where the centering margin happens to
be ~0), but a wide left-side transparent gap at any viewport
meaningfully wider than the `max-w-2xl` content (confirmed
reproducible starting around 900px and worse at 1440px, a realistic
desktop browser width). This also explains why this change's own
verification (task 4.1/4.2) missed it: testing was done at narrow
viewport widths (672-900px) where the offset from centering margin
happens to be small or zero. Fixed in `App.tsx`'s `handleDownload` by
passing `toPng(captureRef.current, { style: { margin: '0' } })` —
`html-to-image`'s `options.style` is applied to the clone after the
computed-style copy, so it reliably overrides the inherited margin.
Verified via pixel sampling of the actual downloaded PNG at 672/900/
1200/1440px viewport widths, in both light and dark mode.

## Risks / Trade-offs

- **[Risk]** `toPng()` reads computed styles synchronously at capture
  time; CSS color functions it cannot resolve (see "Revised during
  implementation" above) can silently produce wrong captured colors even
  though the on-screen page looks correct, and this is not detectable by
  reading source code — only by decoding the actual output image →
  **Mitigation**: tasks.md's verification step decodes the downloaded PNG
  and samples pixel colors programmatically rather than only visually
  inspecting it, since a transparent-background PNG can look
  indistinguishable from an opaque one in some viewers.
- **[Risk]** Capturing the full scrollable content (not just the visible
  viewport) could produce a very tall image on short viewports, which is
  fine per spec.md's "full page content" requirement but worth noting so
  it isn't mistaken for a bug during review.
- **[Trade-off]** Adds one new runtime dependency (`html-to-image`) for a
  feature usable without any dependency via manual OS screenshots — judged
  acceptable given proposal.md's stated goal of removing that friction
  (cropping out browser chrome, discoverability for less technical users).
