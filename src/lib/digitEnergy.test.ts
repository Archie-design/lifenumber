import { describe, expect, it } from 'vitest'
import { DIGIT_ENERGY_TABLES } from './digitEnergy'

describe('DIGIT_ENERGY_TABLES', () => {
  it('has exactly 5 rows for digit 1, each with non-empty text in every column', () => {
    const table = DIGIT_ENERGY_TABLES[1]
    expect(table).toBeDefined()
    expect(table!.rows).toHaveLength(5)
    for (const row of table!.rows) {
      expect(row.low.length).toBeGreaterThan(0)
      expect(row.lesson.length).toBeGreaterThan(0)
      expect(row.mid.length).toBeGreaterThan(0)
      expect(row.high.length).toBeGreaterThan(0)
    }
  })

  it('has no entry for unpopulated digits', () => {
    for (const digit of [2, 3, 4, 5, 6, 7, 8, 9]) {
      expect(DIGIT_ENERGY_TABLES[digit]).toBeUndefined()
    }
  })
})
