import type { NumerologyResult } from '../lib/numerology'

export function NumerologySummary({ result }: { result: NumerologyResult }) {
  const showMinor = result.minorKind !== 'none'
  const minorLabel = result.minorKind === 'master' ? '卓越數' : '中間數'

  return (
    <div className="flex justify-center text-center text-4xl">
      <div className="w-1/3 space-y-2">
        <p>後天數</p>
        <p className="font-bold text-green-600">{result.major}</p>
      </div>
      {showMinor ? (
        <div className="w-1/3 space-y-2">
          <p>{minorLabel}</p>
          <p>{result.minor}</p>
        </div>
      ) : null}
      <div className="w-1/3 space-y-2">
        <p>主命數</p>
        <p className="font-bold text-red-600">{result.patch}</p>
      </div>
    </div>
  )
}
