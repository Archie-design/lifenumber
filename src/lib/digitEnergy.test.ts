import { describe, expect, it } from 'vitest'
import { DIGIT_ENERGY_TABLES } from './digitEnergy'

describe('DIGIT_ENERGY_TABLES', () => {
  it('digit 1 has exactly 5 rows, each with non-empty text in every column', () => {
    const table = DIGIT_ENERGY_TABLES[1]
    expect(table).toBeDefined()
    expect(table!.rows).toHaveLength(5)
    for (const row of table!.rows) {
      expect(row.low?.length).toBeGreaterThan(0)
      expect(row.lesson?.length).toBeGreaterThan(0)
      expect(row.mid?.length).toBeGreaterThan(0)
      expect(row.high?.length).toBeGreaterThan(0)
    }
  })

  it('digit 2 has 4 rows, with row 4 missing mid and high', () => {
    const table = DIGIT_ENERGY_TABLES[2]
    expect(table).toBeDefined()
    expect(table!.rows).toHaveLength(4)
    const lastRow = table!.rows[3]
    expect(lastRow.low?.length).toBeGreaterThan(0)
    expect(lastRow.lesson?.length).toBeGreaterThan(0)
    expect(lastRow.mid).toBeUndefined()
    expect(lastRow.high).toBeUndefined()
  })

  it('digit 3 has 4 rows, with row 2 missing mid', () => {
    const table = DIGIT_ENERGY_TABLES[3]
    expect(table).toBeDefined()
    expect(table!.rows).toHaveLength(4)
    const secondRow = table!.rows[1]
    expect(secondRow.low?.length).toBeGreaterThan(0)
    expect(secondRow.lesson?.length).toBeGreaterThan(0)
    expect(secondRow.mid).toBeUndefined()
    expect(secondRow.high?.length).toBeGreaterThan(0)
  })

  it('has no entry for unpopulated digits', () => {
    for (const digit of [4, 5, 6, 7, 8, 9]) {
      expect(DIGIT_ENERGY_TABLES[digit]).toBeUndefined()
    }
  })
})
