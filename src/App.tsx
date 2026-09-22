import { useEffect, useMemo, useRef } from 'react'
import { BirthdateInput } from './components/BirthdateInput'
import { NumerologySummary } from './components/NumerologySummary'
import { ResultNumber } from './components/ResultNumber'
import { useUrlState } from './hooks/useUrlState'
import {
  calculateDigitFrequencies,
  calculateNumerology,
  isValidBirthdate,
} from './lib/numerology'

function App() {
  const [name, setName] = useUrlState('name')
  const [birthdate, setBirthdate] = useUrlState('d')
  const inputRef = useRef<HTMLInputElement>(null)

  const isValid = isValidBirthdate(birthdate)

  useEffect(() => {
    if (isValid) inputRef.current?.blur()
  }, [isValid])

  const result = useMemo(
    () => (isValid ? calculateNumerology(birthdate) : null),
    [isValid, birthdate],
  )

  const digitFrequencies = useMemo(
    () => (result ? calculateDigitFrequencies(birthdate, result) : []),
    [result, birthdate],
  )

  return (
    <div className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <header className="mb-10 text-center">
          <p className="font-display text-sm tracking-[0.3em] text-primary uppercase">
            Numerology
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold text-base-content sm:text-5xl">
            生命靈數
          </h1>
          <p className="mt-3 text-sm text-base-content/60">
            輸入你的西元生日，探索專屬的數字命盤
          </p>
        </header>

        <div className="space-y-6">
          <section className="rounded-box border border-base-300 bg-base-200/50 p-6 shadow-sm sm:p-8">
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-center text-sm font-medium text-base-content/70">
                  姓名
                </span>
                <input
                  type="text"
                  placeholder="請輸入姓名"
                  className="input input-bordered w-full rounded-field bg-base-100 text-center text-2xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-center text-sm font-medium text-base-content/70">
                  西元生日
                </span>
                <BirthdateInput
                  ref={inputRef}
                  value={birthdate}
                  onChange={setBirthdate}
                />
              </label>
            </div>
          </section>

          {result ? (
            <section className="animate-[reveal_300ms_ease-out] rounded-box border border-primary/30 bg-base-200/50 p-6 shadow-sm sm:p-8">
              <NumerologySummary result={result} />
            </section>
          ) : null}

          {digitFrequencies.length > 0 ? (
            <section className="animate-[reveal_300ms_ease-out] rounded-box border border-base-300 bg-base-200/50 p-4 shadow-sm sm:p-6">
              <div className="grid grid-cols-3">
                {digitFrequencies.map((frequency) => (
                  <ResultNumber key={frequency.digit} {...frequency} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default App
