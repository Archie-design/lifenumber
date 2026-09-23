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

  it('digit 4 has 2 rows, fully populated', () => {
    const table = DIGIT_ENERGY_TABLES[4]
    expect(table).toBeDefined()
    expect(table!.rows).toHaveLength(2)
    for (const row of table!.rows) {
      expect(row.low?.length).toBeGreaterThan(0)
      expect(row.lesson?.length).toBeGreaterThan(0)
      expect(row.mid?.length).toBeGreaterThan(0)
      expect(row.high?.length).toBeGreaterThan(0)
    }
  })

  it('digit 5 has 3 rows, with mid duplicated across rows 2 and 3', () => {
    const table = DIGIT_ENERGY_TABLES[5]
    expect(table).toBeDefined()
    expect(table!.rows).toHaveLength(3)
    expect(table!.rows[1].mid).toBe(table!.rows[2].mid)
    expect(table!.rows[1].mid?.length).toBeGreaterThan(0)
  })

  it('digit 6 has 3 rows, fully populated', () => {
    const table = DIGIT_ENERGY_TABLES[6]
    expect(table).toBeDefined()
    expect(table!.rows).toHaveLength(3)
    for (const row of table!.rows) {
      expect(row.low?.length).toBeGreaterThan(0)
      expect(row.lesson?.length).toBeGreaterThan(0)
      expect(row.mid?.length).toBeGreaterThan(0)
      expect(row.high?.length).toBeGreaterThan(0)
    }
  })

  it('digit 7 has 4 rows, with mid and high identical across all rows', () => {
    const table = DIGIT_ENERGY_TABLES[7]
    expect(table).toBeDefined()
    expect(table!.rows).toHaveLength(4)
    const mids = table!.rows.map((row) => row.mid)
    const highs = table!.rows.map((row) => row.high)
    expect(new Set(mids).size).toBe(1)
    expect(new Set(highs).size).toBe(1)
    expect(mids[0]?.length).toBeGreaterThan(0)
    expect(highs[0]?.length).toBeGreaterThan(0)
  })

  it('digit 8 has 3 rows, fully populated', () => {
    const table = DIGIT_ENERGY_TABLES[8]
    expect(table).toBeDefined()
    expect(table!.rows).toHaveLength(3)
    for (const row of table!.rows) {
      expect(row.low?.length).toBeGreaterThan(0)
      expect(row.lesson?.length).toBeGreaterThan(0)
      expect(row.mid?.length).toBeGreaterThan(0)
      expect(row.high?.length).toBeGreaterThan(0)
    }
  })

  it('digit 9 has 6 rows, with mid duplicated across rows 3-4 and row 5 having only low', () => {
    const table = DIGIT_ENERGY_TABLES[9]
    expect(table).toBeDefined()
    expect(table!.rows).toHaveLength(6)
    expect(table!.rows[2].mid).toBe(table!.rows[3].mid)
    expect(table!.rows[2].mid?.length).toBeGreaterThan(0)
    expect(table!.rows[2].high).toBeUndefined()
    expect(table!.rows[3].high?.length).toBeGreaterThan(0)
    const row5 = table!.rows[4]
    expect(row5.low?.length).toBeGreaterThan(0)
    expect(row5.lesson).toBeUndefined()
    expect(row5.mid).toBeUndefined()
    expect(row5.high).toBeUndefined()
  })
})
