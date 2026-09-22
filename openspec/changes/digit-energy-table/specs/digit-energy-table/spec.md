# Spec Delta

## Purpose

Lets a user tap a digit in the digit-frequency grid to see that number's
documented low/lesson/mid/high energy-level table, turning the grid from
a pure frequency display into an interpretive numerology reference.

## ADDED Requirements

### Requirement: Digit energy data is keyed by digit, independent of frequency

The system SHALL hold energy-table content separately from the
digit-frequency calculation, keyed by digit (1-9), so that a digit's
frequency counts (circle/triangle/square marks) and whether it has
energy-table content are independent facts.

#### Scenario: A digit with zero frequency marks can still have table data

- **WHEN** digit 1 has no circle, triangle, or square marks for the
  entered birthdate
- **THEN** tapping digit 1 still opens its energy-table dialog, because
  table content does not depend on frequency counts

### Requirement: Each populated digit's table has four levels and five rows

For a digit that has energy-table content, the system SHALL provide
exactly four columns — 低階 (low), 修功課 (lesson), 中階 (mid), 高階
(high) — each containing five row entries, matching the reference
material's structure.

#### Scenario: Digit 1's table has the documented content

- **WHEN** the digit-1 energy table is loaded
- **THEN** it contains 5 rows, each with non-empty text for 低階, 修功課,
  中階, and 高階

### Requirement: Tapping a digit with table data opens a modal

Tapping any cell in the digit-frequency grid for a digit that has
energy-table content SHALL open a modal dialog displaying that digit's
title and its full low/lesson/mid/high table. This SHALL work regardless
of the digit's current circle/triangle/square frequency marks.

#### Scenario: Tapping digit 1 opens its table

- **WHEN** the user taps the digit-1 cell in the grid
- **THEN** a modal opens showing "1號 自信與領導" and its 5-row
  low/lesson/mid/high table

#### Scenario: The modal can be dismissed

- **WHEN** the modal is open and the user clicks outside it or a close
  control
- **THEN** the modal closes and the page returns to its prior state

### Requirement: Tapping a digit with no table data does nothing

Tapping a cell for a digit that has no energy-table content SHALL NOT
open a modal, show any visual feedback, or produce an error.

#### Scenario: Tapping an unpopulated digit is a no-op

- **WHEN** the user taps a cell for a digit that has no energy-table
  content (e.g. digit 2, before it is populated)
- **THEN** no modal opens and nothing visibly changes on the page
