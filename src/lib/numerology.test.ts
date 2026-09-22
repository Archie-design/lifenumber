import { describe, expect, it } from 'vitest'
import {
  calculateDigitFrequencies,
  calculateNumerology,
  isValidBirthdate,
} from './numerology'

describe('isValidBirthdate', () => {
  it('accepts a well-formed, zero-padded date within 1800-2099', () => {
    expect(isValidBirthdate('1990/05/17')).toBe(true)
    expect(isValidBirthdate('1990/05/07')).toBe(true)
  })

  it('rejects a date until month and day are fully zero-padded', () => {
    // Single-digit month/day must not validate early — otherwise the input
    // is considered "complete" before the user finishes typing all 8 digits.
    expect(isValidBirthdate('1990/5/7')).toBe(false)
    expect(isValidBirthdate('1990/05/7')).toBe(false)
  })

  it('rejects malformed or out-of-range input', () => {
    expect(isValidBirthdate('')).toBe(false)
    expect(isValidBirthdate('1990/13/01')).toBe(false)
    expect(isValidBirthdate('1990/02/32')).toBe(false)
    expect(isValidBirthdate('2100/01/01')).toBe(false)
    expect(isValidBirthdate('____/__/__')).toBe(false)
  })
})

describe('calculateNumerology', () => {
  it('computes major/minor/patch for a typical date', () => {
    // 1+9+9+0+0+5+1+7 = 32 -> 3+2 = 5 (single digit, minor hidden) -> 5
    const result = calculateNumerology('1990/05/17')
    expect(result.major).toBe(32)
    expect(result.minorKind).toBe('none')
    expect(result.minor).toBe(-1)
    expect(result.patch).toBe(5)
  })

  it('flags a master number when the digit-sum is a repeated pair', () => {
    // 1980/01/19 -> 1+9+8+0+0+1+1+9 = 29 -> digit sum 2+9=11 -> repeated pair -> master
    const result = calculateNumerology('1980/01/19')
    expect(result.major).toBe(29)
    expect(result.minorKind).toBe('master')
    expect(result.minor).toBe(11)
    expect(result.patch).toBe(2) // digit sum of 11 -> 1+1=2
  })

  it('reduces a two-digit non-master minor down to a single-digit patch', () => {
    // 2000/12/31 -> 2+0+0+0+1+2+3+1 = 9 -> single digit, minor hidden
    const result = calculateNumerology('2000/12/31')
    expect(result.major).toBe(9)
    expect(result.minorKind).toBe('none')
    expect(result.patch).toBe(9)
  })

  it('shows a normal (non-master) minor when the digit-sum is two distinct digits', () => {
    // 1987/12/23 -> 1+9+8+7+1+2+2+3 = 33 -> repeated pair -> master, so pick another
    // 1986/12/23 -> 1+9+8+6+1+2+2+3 = 32 -> digit sum 3+2=5, single digit -> hidden
    // 2019/12/29 -> 2+0+1+9+1+2+2+9 = 26 -> digit sum 2+6=8, single -> hidden
    // 2039/12/29 -> 2+0+3+9+1+2+2+9 = 28 -> digit sum 2+8=10, distinct digits -> reduced
    const result = calculateNumerology('2039/12/29')
    expect(result.major).toBe(28)
    expect(result.minorKind).toBe('reduced')
    expect(result.minor).toBe(10)
    expect(result.patch).toBe(1)
  })
})

describe('calculateDigitFrequencies', () => {
  it('counts birthdate digits, reduced digits, and marks the root digit', () => {
    const birthdate = '1990/05/17'
    const result = calculateNumerology(birthdate)
    const frequencies = calculateDigitFrequencies(birthdate, result)

    expect(frequencies).toHaveLength(9)

    const digit1 = frequencies.find((f) => f.digit === 1)!
    // birthdate digits: 1,9,9,0,0,5,1,7 -> digit 1 appears twice
    expect(digit1.birthdateCount).toBe(2)
    // major = 32 -> digits 3,2 -> digit 1 not present
    expect(digit1.reducedCount).toBe(0)

    const digit5 = frequencies.find((f) => f.digit === 5)!
    expect(digit5.isRoot).toBe(true) // patch is 5
    expect(frequencies.filter((f) => f.isRoot)).toHaveLength(1)

    // digit 0 is excluded from the 1-9 grid
    expect(frequencies.some((f) => f.digit === 0)).toBe(false)
  })
})
