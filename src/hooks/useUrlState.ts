import { useCallback, useState } from 'react'

/**
 * State synced to a URL query parameter via `history.pushState`, so results
 * stay shareable/bookmarkable without a full navigation or server round-trip.
 */
export function useUrlState(key: string) {
  const [value, setValue] = useState(
    () => new URLSearchParams(window.location.search).get(key) ?? '',
  )

  const update = useCallback(
    (next: string) => {
      setValue(next)
      const params = new URLSearchParams(window.location.search)
      if (next) {
        params.set(key, next)
      } else {
        params.delete(key)
      }
      const query = params.toString()
      window.history.pushState({}, '', query ? `?${query}` : '?')
    },
    [key],
  )

  return [value, update] as const
}
