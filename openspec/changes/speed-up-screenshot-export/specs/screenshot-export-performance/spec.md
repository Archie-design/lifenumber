# Spec Delta

## Purpose

Defines the performance budget for the screenshot-download feature's
capture step, and requires the output image to remain visually
equivalent whether or not font-embedding is performed.

## ADDED Requirements

### Requirement: Screenshot capture completes quickly

The screenshot capture step (from click to the resulting image data
being ready for download) SHALL typically complete within 1 second on a
standard broadband connection, not the multi-second delay caused by
scanning and embedding web font CSS.

#### Scenario: Capture completes well under the prior ~8 second delay

- **WHEN** the user clicks the download-screenshot control
- **THEN** the image capture step completes in around 1 second or less,
  not the several-second delay previously caused by font-embedding

### Requirement: Output image text remains visually correct

Skipping font embedding SHALL NOT change how text appears in the
captured image — the same fonts (Noto Serif TC / Noto Sans TC) already
rendered on screen SHALL still appear in the downloaded PNG.

#### Scenario: Downloaded image still uses the site's fonts

- **WHEN** a screenshot is downloaded
- **THEN** headings and body text in the resulting PNG visually match
  the fonts shown on the live page, not a generic fallback font
