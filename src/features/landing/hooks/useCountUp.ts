import { useEffect, useState } from 'react'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/**
 * `start`가 켜지면 0에서 `target`까지 숫자를 올린다
 * 끝으로 갈수록 느려지게 해서 마지막 자리가 굴러가다 멈추는 느낌을 낸다
 *
 * @param duration 올라가는 데 걸리는 시간(ms)
 */
export function useCountUp(target: number, start: boolean, duration = 1500) {
  const [reduceMotion] = useState(
    () =>
      typeof window.matchMedia === 'function' &&
      window.matchMedia(REDUCED_MOTION).matches,
  )
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start || reduceMotion) return

    let frame = 0
    const startedAt = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [start, reduceMotion, target, duration])

  return reduceMotion ? target : value
}
