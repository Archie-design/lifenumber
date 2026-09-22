const BIRTHDATE_PATTERN =
  /^(?:18|19|20)\d{2}\/(?:0[1-9]|1[0-2])\/(?:0[1-9]|[1-2]\d|3[0-1])$/

export function isValidBirthdate(value: string): boolean {
  return BIRTHDATE_PATTERN.test(value)
}

function sumDigits(value: string): number {
  return value
    .split('')
    .reduce((total, digit) => total + Number(digit), 0)
}

export type MinorKind = 'master' | 'reduced' | 'none'

export interface NumerologyResult {
  /** Sum of every digit in the birthdate (後天數). */
  major: number
  /** Digit-sum of `major` (中間數), or -1 when it reduces to a single digit. */
  minor: number
  /** Whether `minor` is a master number (11/22/33/...), a normal two-digit
   * reduction, or absent because it was already a single digit. */
  minorKind: MinorKind
  /** Digit-sum of `minor` (主命數) — the final root number. */
  patch: number
}

/**
 * Computes the three numerology numbers from a `YYYY/MM/DD` birthdate.
 * Caller must validate the format with `isValidBirthdate` first.
 */
export function calculateNumerology(birthdate: string): NumerologyResult {
  const digitsOnly = birthdate.split('/').join('')
  const major = sumDigits(digitsOnly)
  const majorDigitSum = sumDigits(String(major))

  const isMaster =
    String(majorDigitSum).length === 2 &&
    String(majorDigitSum)[0] === String(majorDigitSum)[1]
  const isSingleDigit = majorDigitSum < 10

  const minor = isSingleDigit ? -1 : majorDigitSum
  const minorKind: MinorKind = isSingleDigit
    ? 'none'
    : isMaster
      ? 'master'
      : 'reduced'
  const patch = sumDigits(String(majorDigitSum))

  return { major, minor, minorKind, patch }
}

export interface DigitFrequency {
  digit: number
  /** Occurrences of `digit` in the raw birthdate. */
  birthdateCount: number
  /** Occurrences of `digit` across major (and minor, when shown). */
  reducedCount: number
  /** Whether `digit` is the final root number (主命數). */
  isRoot: boolean
}

/**
 * Builds the 1-9 digit-frequency grid used for the visualization: how often
 * each digit appears in the raw birthdate vs. in the reduced (major/minor)
 * numbers, and which digit is the final root.
 */
export function calculateDigitFrequencies(
  birthdate: string,
  result: NumerologyResult,
): DigitFrequency[] {
  const birthdateCounts = new Map<number, number>()
  for (const char of birthdate.split('/').join('')) {
    const digit = Number(char)
    birthdateCounts.set(digit, (birthdateCounts.get(digit) ?? 0) + 1)
  }

  const reducedCounts = new Map<number, number>()
  const countDigitsOf = (value: number) => {
    for (const char of String(value)) {
      const digit = Number(char)
      reducedCounts.set(digit, (reducedCounts.get(digit) ?? 0) + 1)
    }
  }
  countDigitsOf(result.major)
  if (result.minorKind !== 'none') countDigitsOf(result.minor)

  return Array.from({ length: 9 }, (_, index) => {
    const digit = index + 1
    return {
      digit,
      birthdateCount: birthdateCounts.get(digit) ?? 0,
      reducedCount: reducedCounts.get(digit) ?? 0,
      isRoot: digit === result.patch,
    }
  })
}
