import { useEffect, useState } from 'react'
import { followProgress, targetProgress } from '../utils/generatingProgress'

const TICK_MS = 100

/**
 * 생성 대기 화면에 그릴 진행률(정수 0~100). 화면에 들어온 때부터 시간을 잰다
 * 나갔다 오면 추정치는 처음부터지만, 서버 값보다 낮게 그리지는 않는다
 */
export function useGeneratingProgress(
  serverProgress: number,
  completed: boolean,
): number {
  const [startedAt] = useState(() => Date.now())
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      const target = targetProgress(
        serverProgress,
        Date.now() - startedAt,
        completed,
      )
      setShown((previous) => followProgress(previous, target))
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [serverProgress, completed, startedAt])

  return Math.floor(shown)
}
