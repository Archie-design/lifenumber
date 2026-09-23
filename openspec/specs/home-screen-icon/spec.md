# home-screen-icon Specification

## Purpose
Lets a user add the site to their phone's home screen with a designed
icon (not a generic browser placeholder) and a standalone, app-like
launch experience instead of opening inside full browser chrome.

## Requirements

### Requirement: A designed icon is served at the sizes iOS and Android request for home-screen install

The system SHALL provide icon assets at 180×180 (`apple-touch-icon`),
192×192, and 512×512 pixels, all derived from the same chosen design (a
3×3 grid of small circle/triangle/square marks on the dark-theme
background), so that adding the site to a home screen on iOS or Android
shows this icon rather than a browser-generated placeholder.

#### Scenario: Adding to home screen on iOS shows the designed icon

- **WHEN** a user on iOS Safari uses "Add to Home Screen"
- **THEN** the resulting home-screen icon is the 3×3 grid design, not a
  screenshot crop or blank tile

#### Scenario: Installing as a PWA on Android shows the designed icon

- **WHEN** a user on Android Chrome installs the site (via the install
  prompt or "Add to Home Screen")
- **THEN** the resulting icon uses the 192×192 or 512×512 asset from the
  manifest, matching the same 3×3 grid design

### Requirement: A web app manifest declares standalone display and matching theme colors

The system SHALL serve a web app manifest (`public/manifest.webmanifest`)
declaring the app's name, a `display: standalone` mode, and
`theme_color`/`background_color` values matching the dark theme's exact
`src/index.css` hex values, so an installed/launched instance looks like
a standalone app rather than a browser tab and uses colors consistent
with the rest of the product.

#### Scenario: Launching the installed app hides browser chrome

- **WHEN** a user opens the app from its home-screen icon after
  installing
- **THEN** it launches without the browser's URL bar/tab chrome
  (standalone display mode), per the manifest's `display` value

#### Scenario: Manifest colors match the existing dark theme, not new values

- **WHEN** the manifest's `theme_color` and `background_color` are
  inspected
- **THEN** both values exactly match colors already defined in
  `numerology-dark` in `src/index.css`, not new/arbitrary hex values

### Requirement: The existing browser-tab favicon is unaffected

Adding home-screen icon support SHALL NOT change the existing browser
tab favicon (`public/favicon.svg`) or its `<link rel="icon">` tag in
`index.html`.

#### Scenario: Browser tab icon still shows the original favicon after this change

- **WHEN** the site is loaded in a desktop or mobile browser tab (not
  installed to home screen)
- **THEN** the tab icon is unchanged from `public/favicon.svg`'s
  existing ring-and-dot design
