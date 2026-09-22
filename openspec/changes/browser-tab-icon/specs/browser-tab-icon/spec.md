# Spec Delta

## Purpose

Defines what the site's browser-tab icon must look like and how it is wired
up, so the icon stays legible and visually consistent with the product's
brand across browsers, tab sizes, and light/dark tab bars.

## ADDED Requirements

### Requirement: Icon reflects the product

The browser-tab icon SHALL be a purpose-made graphic that visually
represents the numerology product, not a generic or placeholder graphic
(e.g. a default framework/scaffold icon).

#### Scenario: Default scaffold icon is not present

- **WHEN** the site is loaded in a browser
- **THEN** the tab icon is not the default Vite/framework scaffold icon

### Requirement: Icon is legible at tab size

The browser-tab icon SHALL remain visually recognizable as a single, clear
glyph or symbol when rendered at typical browser-tab icon sizes (as small as
16×16 pixels).

#### Scenario: Icon renders as a recognizable shape at 16x16

- **WHEN** the tab icon is rendered at 16×16 pixels
- **THEN** its primary shape is still distinguishable (not a blur of
  overlapping fine detail)

### Requirement: Icon uses the product's brand colors

The browser-tab icon SHALL use colors drawn from the site's existing design
system (the indigo/gold and parchment/gold palette already used in the UI)
rather than unrelated or arbitrary colors.

#### Scenario: Icon palette matches the site theme

- **WHEN** the icon's colors are compared to the site's defined theme colors
- **THEN** every color used in the icon corresponds to a color already
  defined in the site's theme

### Requirement: Icon is legible on both light and dark tab bars

The browser-tab icon SHALL remain visible and recognizable when displayed on
both light-colored and dark-colored browser tab bars.

#### Scenario: Icon visible on a light tab bar

- **WHEN** the tab icon is displayed on a light-colored browser tab bar
- **THEN** the icon's shape is clearly visible against that background

#### Scenario: Icon visible on a dark tab bar

- **WHEN** the tab icon is displayed on a dark-colored browser tab bar
- **THEN** the icon's shape is clearly visible against that background

### Requirement: Icon is served as a scalable vector image

The site SHALL serve the browser-tab icon as an SVG referenced via a
`<link rel="icon">` tag, so it renders sharply at any tab size without a
fixed-resolution raster asset.

#### Scenario: Icon link references an SVG file

- **WHEN** the page's `<head>` is inspected
- **THEN** it contains a `<link rel="icon">` tag pointing to an `.svg` file
