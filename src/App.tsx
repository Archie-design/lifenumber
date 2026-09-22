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
    <div className="app container mx-auto px-5">
      <div className="mx-auto max-w-3xl space-y-4 py-5">
        <div>
          <div className="text-center text-3xl">Your Name</div>
          <input
            type="text"
            className="input input-bordered w-full text-center text-3xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <h1 className="text-center text-3xl">西元生日</h1>
        <BirthdateInput ref={inputRef} value={birthdate} onChange={setBirthdate} />

        <div className="border py-2">
          {result ? <NumerologySummary result={result} /> : null}
        </div>

        <div className="-mx-2 flex flex-wrap text-center text-4xl">
          {digitFrequencies.map((frequency) => (
            <div key={frequency.digit} className="w-1/3 px-2 py-4">
              <ResultNumber {...frequency} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
