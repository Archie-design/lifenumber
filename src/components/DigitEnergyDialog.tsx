import { forwardRef } from 'react'
import type { DigitEnergyTable } from '../lib/digitEnergy'

const LEVEL_LABELS = [
  { key: 'low', label: '低階', colorClassName: 'text-error' },
  { key: 'lesson', label: '修功課', colorClassName: 'text-primary' },
  { key: 'mid', label: '中階', colorClassName: 'text-base-content' },
  { key: 'high', label: '高階', colorClassName: 'text-success' },
] as const

export const DigitEnergyDialog = forwardRef<
  HTMLDialogElement,
  { table: DigitEnergyTable | undefined; onClose: () => void }
>(function DigitEnergyDialog({ table, onClose }, ref) {
  return (
    <dialog ref={ref} className="modal" onClose={onClose}>
      {table ? (
        <div className="modal-box max-w-3xl">
          <h2 className="font-display text-center text-2xl font-semibold text-base-content">
            {table.digit}號 {table.title}
          </h2>

          <div className="mt-6 space-y-6 sm:space-y-4">
            {table.rows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-3 border-b border-base-300 pb-4 last:border-none sm:grid-cols-4 sm:gap-4 sm:pb-4"
              >
                {LEVEL_LABELS.map(({ key, label, colorClassName }) => (
                  <div key={key}>
                    <p
                      className={`text-xs font-medium tracking-wide ${colorClassName}`}
                    >
                      {label}
                    </p>
                    <p className="mt-1 text-sm text-base-content">
                      {row[key]}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button type="submit" className="btn">
                關閉
              </button>
            </form>
          </div>
        </div>
      ) : null}
      <form method="dialog" className="modal-backdrop">
        <button type="submit">close</button>
      </form>
    </dialog>
  )
})
