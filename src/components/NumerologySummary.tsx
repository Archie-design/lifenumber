import type { NumerologyResult } from '../lib/numerology'

function ResultColumn({
  label,
  value,
  colorClassName,
  emphasized = false,
}: {
  label: string
  value: number
  colorClassName: string
  emphasized?: boolean
}) {
  return (
    <div className="flex-1 space-y-2 px-2 text-center">
      <p className="text-xs font-medium tracking-wide text-[var(--capture-base-content-60)] sm:text-sm">
        {label}
      </p>
      <p
        className={`font-display text-4xl sm:text-5xl ${emphasized ? 'font-bold' : 'font-medium'} ${colorClassName}`}
      >
        {value}
      </p>
    </div>
  )
}

export function NumerologySummary({ result }: { result: NumerologyResult }) {
  const showMinor = result.minorKind !== 'none'
  const minorLabel = result.minorKind === 'master' ? '卓越數' : '中間數'

  return (
    <div className="flex items-center justify-center divide-x divide-base-300">
      <ResultColumn label="後天數" value={result.major} colorClassName="text-success" emphasized />
      {showMinor ? (
        <ResultColumn label={minorLabel} value={result.minor} colorClassName="text-secondary" />
      ) : null}
      <ResultColumn label="主命數" value={result.patch} colorClassName="text-error" emphasized />
    </div>
  )
}
