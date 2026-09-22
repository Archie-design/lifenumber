import { toPng } from 'html-to-image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BirthdateInput } from './components/BirthdateInput'
import { DigitEnergyDialog } from './components/DigitEnergyDialog'
import { NumerologySummary } from './components/NumerologySummary'
import { ResultNumber } from './components/ResultNumber'
import { useUrlState } from './hooks/useUrlState'
import { DIGIT_ENERGY_TABLES } from './lib/digitEnergy'
import {
  calculateDigitFrequencies,
  calculateNumerology,
  isValidBirthdate,
} from './lib/numerology'

function App() {
  const [name, setName] = useUrlState('name')
  const [birthdate, setBirthdate] = useUrlState('d')
  const inputRef = useRef<HTMLInputElement>(null)
  const captureRef = useRef<HTMLDivElement>(null)
  const energyDialogRef = useRef<HTMLDialogElement>(null)
  const [captureError, setCaptureError] = useState(false)
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null)

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

  const handleDownload = async () => {
    if (!captureRef.current) return
    setCaptureError(false)
    try {
      // html-to-image copies the captured element's computed margin onto
      // the clone it renders into an independent SVG canvas. This
      // element's `mx-auto` centering margin then still applies inside
      // that canvas, shifting the whole capture right by that many
      // pixels (visible as a transparent gap on the left) whenever the
      // viewport is wider than the element — override it to zero so the
      // capture always starts flush at the canvas origin.
      const dataUrl = await toPng(captureRef.current, {
        style: { margin: '0' },
      })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'numbers-of-life.png'
      link.click()
    } catch {
      setCaptureError(true)
    }
  }

  const handleSelectDigit = (digit: number) => {
    setSelectedDigit(digit)
    energyDialogRef.current?.showModal()
  }

  const selectedTable = selectedDigit ? DIGIT_ENERGY_TABLES[selectedDigit] : undefined

  return (
    <div className="min-h-screen bg-base-100">
      <div
        ref={captureRef}
        className="mx-auto max-w-2xl bg-base-100 px-4 py-10 sm:py-14"
      >
        <header className="mb-10 text-center">
          <p className="font-display text-sm tracking-[0.3em] text-primary uppercase">
            Numerology
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold text-base-content sm:text-5xl">
            生命靈數
          </h1>
          <p className="mt-3 text-sm text-[var(--capture-base-content-60)]">
            輸入你的西元生日，探索專屬的數字命盤
          </p>
        </header>

        <div className="space-y-6">
          <section className="rounded-box border border-base-300 bg-[var(--capture-base-200-50)] p-6 shadow-sm sm:p-8">
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-center text-sm font-medium text-[var(--capture-base-content-70)]">
                  姓名
                </span>
                <input
                  type="text"
                  placeholder="請輸入姓名"
                  className="input input-bordered w-full rounded-field bg-base-100 text-center text-2xl transition-shadow focus:outline-none focus:ring-2 focus:ring-[var(--capture-primary-40)]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-center text-sm font-medium text-[var(--capture-base-content-70)]">
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
            <section className="animate-[reveal_300ms_ease-out] rounded-box border border-[var(--capture-primary-30)] bg-[var(--capture-base-200-50)] p-6 shadow-sm sm:p-8">
              <NumerologySummary result={result} />
            </section>
          ) : null}

          {digitFrequencies.length > 0 ? (
            <section className="animate-[reveal_300ms_ease-out] rounded-box border border-base-300 bg-[var(--capture-base-200-50)] p-4 shadow-sm sm:p-6">
              <div className="grid grid-cols-3">
                {digitFrequencies.map((frequency) => (
                  <ResultNumber
                    key={frequency.digit}
                    {...frequency}
                    onSelect={handleSelectDigit}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      {result ? (
        <div className="mx-auto max-w-2xl px-4 pb-10 text-center">
          <button
            type="button"
            onClick={handleDownload}
            className="btn btn-outline btn-primary"
          >
            下載截圖
          </button>
          {captureError ? (
            <p className="mt-2 text-sm text-error">截圖失敗，請再試一次</p>
          ) : null}
        </div>
      ) : null}

      <DigitEnergyDialog
        ref={energyDialogRef}
        table={selectedTable}
        onClose={() => setSelectedDigit(null)}
      />
    </div>
  )
}

export default App
