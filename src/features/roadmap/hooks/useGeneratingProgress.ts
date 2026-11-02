import { useEffect, useState } from 'react'
import { followProgress, targetProgress } from '../utils/generatingProgress'
import { loadGeneratingStartedAt } from '../utils/generatingStartedAt'

const TICK_MS = 100

/**
 * 생성 대기 화면에 그릴 진행률(정수 0~100). 이 로드맵의 생성 화면을 처음 본 때부터 시간을 잰다
 * 나갔다 오면 0부터 다시 오르지 않고 저장해 둔 시작 시각의 추정치에서 바로 이어 그린다
 */
export function useGeneratingProgress(
  roadmapId: number,
  serverProgress: number,
  completed: boolean,
): number {
  const [startedAt] = useState(() => loadGeneratingStartedAt(roadmapId))
  const [shown, setShown] = useState(() =>
    targetProgress(0, Date.now() - startedAt, false),
  )

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
