import { memo } from 'react'
import type { DigitFrequency } from '../lib/numerology'

function Circles({ count }: { count: number }) {
  return Array.from({ length: count }, (_, i) => {
    const size = 48 * (i + 1)
    const radius = size / 2
    return (
      <svg
        key={i}
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute"
      >
        <circle
          cx={radius}
          cy={radius}
          r={radius - 2}
          stroke="var(--color-info)"
          fill="none"
          strokeWidth={2}
          opacity={0.85}
        />
      </svg>
    )
  })
}

function Triangles({ count }: { count: number }) {
  return Array.from({ length: count }, (_, i) => {
    const size = 0.8 * (i + 1) * 75 + 15
    const half = size / 2
    const edge = size - 3
    return (
      <svg
        key={i}
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute"
      >
        <polygon
          points={`${half} 0, ${edge} ${edge}, 0 ${edge}`}
          stroke="var(--color-success)"
          fill="none"
          strokeWidth={2}
          opacity={0.85}
        />
      </svg>
    )
  })
}

function Squares({ count }: { count: number }) {
  return Array.from({ length: count }, (_, i) => {
    const size = 1.2 * (i + 1) * 75
    return (
      <svg
        key={i}
        height={size}
        width={size}
        viewBox="0 0 75 75"
        className="absolute"
      >
        <polygon
          points="3 3, 72 3, 72 72, 3 72"
          stroke="var(--color-error)"
          fill="none"
          strokeWidth={3}
        />
      </svg>
    )
  })
}

export const ResultNumber = memo(function ResultNumber({
  digit,
  birthdateCount,
  reducedCount,
  isRoot,
}: DigitFrequency) {
  const squareCount = isRoot ? 1 : 0
  const hasShapes = birthdateCount + reducedCount + squareCount > 0

  return (
    <div className="relative flex min-h-36 items-center justify-center sm:min-h-40">
      <p
        className={`font-display z-10 text-2xl sm:text-3xl ${
          hasShapes ? 'font-bold text-base-content' : 'font-normal text-base-content/30'
        }`}
      >
        {digit}
      </p>
      <Circles count={birthdateCount} />
      <Triangles count={reducedCount} />
      <Squares count={squareCount} />
    </div>
  )
})
