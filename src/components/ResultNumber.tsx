import { memo } from 'react'
import type { DigitFrequency } from '../lib/numerology'

function Circles({ count }: { count: number }) {
  return Array.from({ length: count }, (_, i) => {
    const size = 32 * (i + 1)
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
          stroke="#3498db"
          fill="none"
          strokeWidth={2}
        />
      </svg>
    )
  })
}

function Triangles({ count }: { count: number }) {
  return Array.from({ length: count }, (_, i) => {
    const size = 0.8 * (i + 1) * 50 + 10
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
          stroke="#2ecc71"
          fill="none"
          strokeWidth={2}
        />
      </svg>
    )
  })
}

function Squares({ count }: { count: number }) {
  return Array.from({ length: count }, (_, i) => {
    const size = 1.2 * (i + 1) * 50
    return (
      <svg
        key={i}
        height={size}
        width={size}
        viewBox="0 0 50 50"
        className="absolute"
      >
        <polygon
          points="2 2, 48 2, 48 48, 2 48"
          stroke="#c0392b"
          fill="none"
          strokeWidth={2}
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

  return (
    <div className="relative flex items-center justify-center aspect-square">
      <p className="z-10 text-2xl font-bold">{digit}</p>
      <Circles count={birthdateCount} />
      <Triangles count={reducedCount} />
      <Squares count={squareCount} />
    </div>
  )
})
