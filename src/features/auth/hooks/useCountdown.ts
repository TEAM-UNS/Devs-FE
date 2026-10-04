import { useCallback, useEffect, useState } from 'react'

/** 초 단위 카운트다운 훅 — `start(seconds)`로 시작해 매초 감소, 0에서 멈춘다. */
export function useCountdown(): {
  secondsLeft: number
  start: (seconds: number) => void
} {
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [secondsLeft])

  const start = useCallback((seconds: number) => {
    setSecondsLeft(seconds)
  }, [])

  return { secondsLeft, start }
}
