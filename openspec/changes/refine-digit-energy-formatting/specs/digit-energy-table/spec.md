# Spec Delta

## ADDED Requirements

### Requirement: Cell text preserves the source material's line breaks and full-width punctuation

For every populated digit whose reference photo is available in this
project (`reference/`), each cell's text in `DIGIT_ENERGY_TABLES` SHALL
reproduce the line breaks visible in that cell's source material as
embedded `\n` characters, rather than joining separate lines with a
space or no separator. Punctuation used as Chinese-text punctuation
(commas, colons, parentheses, and similar marks separating clauses)
SHALL use full-width characters (`，` `：` `（` `）` etc.), matching
the convention already used by the surrounding text, rather than
half-width ASCII equivalents. This does not apply to non-Chinese
tokens embedded in the text (e.g. an acronym like `SOP`) or to digits
used as numbering, which follow the source material's own formatting.

#### Scenario: A cell with multiple source lines renders as multiple paragraphs

- **WHEN** a digit's reference photo shows a cell's text broken across
  two or more distinct lines (not merely wrapped for width)
- **THEN** that cell's string value in `DIGIT_ENERGY_TABLES` contains a
  `\n` between each line's text, and the dialog (via
  `whitespace-pre-line`) renders each as a separate paragraph

#### Scenario: Punctuation is full-width throughout a digit's table

- **WHEN** any cell in a populated digit's table contains punctuation
  separating Chinese clauses
- **THEN** that punctuation uses the full-width form (e.g. `，` not
  `,`, `：` not `:`, `（`/`）` not `(`/`)`)
