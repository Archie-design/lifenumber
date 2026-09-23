# Spec Delta

## Purpose

Defines how the digit-frequency grid's marks, interactive tap targets,
and section spacing must adapt at narrow (mobile) viewport widths so the
app stays comfortable to read and operate by touch, without changing its
appearance on larger screens.

## ADDED Requirements

### Requirement: Digit-grid marks fit within their cell at narrow widths

At viewport widths typical of a mobile phone (roughly 320-480px), the
largest circle/triangle/square mark rendered for any digit SHALL fit
within its grid cell's width without visually overlapping the
neighboring cell's content.

#### Scenario: A digit with three stacked circle layers doesn't crowd its neighbor

- **WHEN** the grid is viewed at a 390px-wide viewport and a digit has 3
  circle marks (its largest, most crowded case)
- **THEN** that digit's largest circle does not visually overlap the
  content of the grid cell to its right or left

### Requirement: Primary interactive controls meet a minimum tap-target size

Each of the app's primary interactive controls — the birthdate input's
clear button, a digit-grid cell that has energy-table content, the
download-screenshot button, and the energy-table dialog's close controls
— SHALL have a tappable area of at least 44×44 CSS pixels.

#### Scenario: The birthdate clear button is easy to tap

- **WHEN** the birthdate clear ("×") button is displayed
- **THEN** its tappable area is at least 44×44 pixels, even though its
  visible glyph is smaller

#### Scenario: A populated digit-grid cell is easy to tap

- **WHEN** a digit-grid cell has energy-table content (and is therefore
  clickable)
- **THEN** its tappable area is at least 44×44 pixels

### Requirement: Grid-to-controls spacing is proportionate on narrow viewports

The vertical space between the digit-frequency grid section and the
download-screenshot button below it SHALL be visually proportionate to
the surrounding section spacing at narrow viewport widths, not a
noticeably larger gap than the spacing between other adjacent sections.

#### Scenario: Gap below the grid matches other section gaps at mobile width

- **WHEN** the page is viewed at a 390px-wide viewport with a result
  showing
- **THEN** the vertical gap between the grid section and the download
  button is not noticeably larger than the gap between the other
  result sections above it
