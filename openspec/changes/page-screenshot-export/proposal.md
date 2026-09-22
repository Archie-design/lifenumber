# Proposal

## Why

Users who get their numerology reading have no way to save or share it other
than a manual OS-level screenshot (which many mobile users don't know how to
crop, and which includes browser chrome). A built-in "save as image" button
lets them capture and share their result directly from the page.

## What Changes

- Add a "下載截圖" (download screenshot) button that appears once a
  numerology result is showing.
- Clicking it captures the full visible page content — header/title, the
  name and birthdate inputs, the result summary, and the digit-frequency
  grid — as a single PNG image and triggers a browser download.
- No new page, route, or backend involved — this is a client-side-only
  capture of existing DOM content.

## Capabilities

### New Capabilities
- `page-screenshot-export`: Defines the button's visibility, what content
  the captured image must include, its output format, and the download
  behavior.

### Modified Capabilities
_None — no existing specs in this project yet (an unrelated prior change,
`browser-tab-icon`, has not been archived, so `openspec list --specs`
reports no specs)._

## Impact

- `src/App.tsx` — new button and a ref/target wrapping the capturable
  content.
- New dependency: a client-side DOM-to-image capture library (exact choice
  and rationale in design.md).
- No backend, routing, or existing capability changes.
