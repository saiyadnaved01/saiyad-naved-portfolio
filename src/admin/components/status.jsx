import { useState, useCallback, useRef } from 'react'

export function useStatus() {
  const [status, setStatus] = useState(null)
  const timer = useRef(null)

  const show = useCallback((type, text) => {
    setStatus({ type, text })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus(null), 3500)
  }, [])

  return [status, show]
}

export function StatusBanner({ status }) {
  if (!status) return null
  return (
    <div
      className={`text-xs px-3 py-2.5 rounded-lg mb-4 border ${
        status.type === 'error'
          ? 'border-red-500/40 text-red-400 bg-red-500/10'
          : 'border-acc2/40 text-acc2 bg-acc2/10'
      }`}
    >
      {status.text}
    </div>
  )
}
