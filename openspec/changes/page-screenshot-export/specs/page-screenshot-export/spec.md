# Spec Delta

## Purpose

Lets a user save their numerology reading as an image they can keep or
share, by capturing the page's visible content into a downloadable PNG.

## ADDED Requirements

### Requirement: Download button appears only once a result exists

The system SHALL show a screenshot-download control only after a valid
birthdate has produced a numerology result. It SHALL NOT be shown before a
result exists.

#### Scenario: No button before a result is calculated

- **WHEN** the page loads with no birthdate entered, or with an incomplete/
  invalid birthdate
- **THEN** no screenshot-download control is visible

#### Scenario: Button appears once a result is shown

- **WHEN** the user enters a complete, valid birthdate and the numerology
  result is displayed
- **THEN** a screenshot-download control becomes visible

### Requirement: Captured image includes the full page content

Triggering the download SHALL capture the page's visible content — the
header/title, the name and birthdate inputs, the result summary, and the
digit-frequency grid — as a single image, not just one section of the page.

#### Scenario: Capture includes every visible section

- **WHEN** the user clicks the download control while a result is showing
- **THEN** the resulting image contains the header, the name field, the
  birthdate field, the result summary numbers, and the digit-frequency grid

### Requirement: Captured image reflects on-screen appearance

The captured image SHALL visually match what is currently rendered on
screen, including the active color theme (light or dark) and the
entered name/birthdate values.

#### Scenario: Dark theme is preserved in the capture

- **WHEN** the page is displayed in dark mode and the user downloads the
  screenshot
- **THEN** the downloaded image shows the dark theme's colors, not the
  light theme's

### Requirement: Download produces a PNG file

Triggering the download SHALL produce a `.png` image file saved to the
user's device via the browser's normal download mechanism, without
navigating away from the page.

#### Scenario: Clicking download saves a PNG without navigation

- **WHEN** the user clicks the download control
- **THEN** a `.png` file download starts and the page does not navigate or
  reload

### Requirement: Capture failure does not break the page

If the image capture fails for any reason, the system SHALL leave the page
fully usable and SHALL indicate to the user that the download did not
succeed, rather than failing silently or leaving the page in a broken
state.

#### Scenario: Capture error is surfaced, not silent

- **WHEN** the capture process throws an error
- **THEN** the user sees an indication that the screenshot could not be
  created, and the rest of the page continues to function normally
