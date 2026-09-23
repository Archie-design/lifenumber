import { memo } from 'react'
import { DIGIT_ENERGY_TABLES } from '../lib/digitEnergy'
import type { DigitFrequency } from '../lib/numerology'

// Layers beyond this simply aren't drawn — a birthdate can in principle
// repeat a digit far more than 3 times (e.g. 1911/11/11), and at any
// fixed scale that many stacked layers either stays too large on mobile
// or forces 1-2-layer digits (the common case) into illegibility.
const MAX_RENDERED_LAYERS = 3

function Circles({ count }: { count: number }) {
  return Array.from({ length: Math.min(count, MAX_RENDERED_LAYERS) }, (_, i) => {
    const size = 48 * (i + 1)
    const radius = size / 2
    return (
      <svg
        key={i}
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute top-1/2 left-1/2"
        style={{
          transform:
            'translate(-50%, -50%) scale(var(--grid-mark-scale))',
        }}
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

// An equilateral triangle's visual centroid sits 1/3 of the way up from its
// base, not at the bounding-box center — so the polygon is inset within a
// taller viewBox and shifted up to align its centroid with the box center.
function Triangles({ count }: { count: number }) {
  return Array.from({ length: Math.min(count, MAX_RENDERED_LAYERS) }, (_, i) => {
    const size = 0.8 * (i + 1) * 75 + 15
    const box = size * 1.2
    const half = box / 2
    const top = box * 0.1
    const bottom = top + size
    const left = half - size / 2
    const right = half + size / 2
    return (
      <svg
        key={i}
        height={box}
        width={box}
        viewBox={`0 0 ${box} ${box}`}
        className="absolute top-1/2 left-1/2"
        style={{
          transform:
            'translate(-50%, -50%) scale(var(--grid-mark-scale))',
        }}
      >
        <polygon
          points={`${half} ${top}, ${right} ${bottom}, ${left} ${bottom}`}
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
        className="absolute top-1/2 left-1/2"
        style={{
          transform:
            'translate(-50%, -50%) scale(var(--grid-mark-scale))',
        }}
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
  onSelect,
}: DigitFrequency & { onSelect?: (digit: number) => void }) {
  const squareCount = isRoot ? 1 : 0
  const hasShapes = birthdateCount + reducedCount + squareCount > 0
  const hasEnergyTable = DIGIT_ENERGY_TABLES[digit] !== undefined

  return (
    <div
      className={`relative flex min-h-36 items-center justify-center sm:min-h-40 ${
        hasEnergyTable ? 'cursor-pointer' : ''
      }`}
      onClick={hasEnergyTable ? () => onSelect?.(digit) : undefined}
    >
      <p
        className={`font-display z-10 text-2xl sm:text-3xl ${
          hasShapes ? 'font-bold text-base-content' : 'font-normal text-[var(--capture-base-content-30)]'
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
