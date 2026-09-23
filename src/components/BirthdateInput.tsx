import { forwardRef, useState } from 'react'

interface BirthdateInputProps {
  value: string
  onChange: (value: string) => void
}

function formatWithMask(digits: string): string {
  const year = digits.slice(0, 4)
  const month = digits.slice(4, 6)
  const day = digits.slice(6, 8)
  return [year, month, day].filter(Boolean).join('/')
}

export const BirthdateInput = forwardRef<HTMLInputElement, BirthdateInputProps>(
  function BirthdateInput({ value, onChange }, ref) {
    const [isFocused, setIsFocused] = useState(false)

    return (
      <div className="relative">
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          placeholder="____/__/__"
          className="input input-bordered min-h-11 w-full rounded-field bg-base-100 text-center text-2xl tracking-wider transition-shadow focus:outline-none focus:ring-2 focus:ring-[var(--capture-primary-40)]"
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
            onChange(formatWithMask(digits))
          }}
        />
        {value.length > 0 && isFocused ? (
          <button
            type="button"
            aria-label="清除生日"
            // Mousedown fires before the input's blur, so the button is
            // still visible when the click completes.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-xl text-[var(--capture-base-content-40)] transition-colors hover:text-base-content"
          >
            ×
          </button>
        ) : null}
      </div>
    )
  },
)
