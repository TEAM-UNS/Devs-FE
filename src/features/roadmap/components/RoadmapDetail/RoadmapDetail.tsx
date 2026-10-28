import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { userQueries } from '@/shared/api'
import { useCompleteRoadmapDay } from '../../hooks/useRoadmapMutations'
import type { Roadmap } from '../../types'
import { currentDayNo, dayState, lockedMessage } from '../../utils/roadmapDay'
import { RetrospectModal } from '../RetrospectModal'
import { RoadmapProgressBar } from '../RoadmapProgressBar'
import { RoadmapDayCard } from './RoadmapDayCard'

interface RoadmapDetailProps {
  readonly roadmap: Roadmap
}

/** 로드맵 상세 — 학습률은 위에 고정하고 Day 목록만 스크롤한다. Figma 574:3600 */
export function RoadmapDetail({ roadmap }: RoadmapDetailProps) {
  // 회고 모달을 연 날의 번호. null이면 닫힘
  const [retrospectDayNo, setRetrospectDayNo] = useState<number | null>(null)
  const complete = useCompleteRoadmapDay()
  const me = useQuery(userQueries.me())
  const today = currentDayNo(roadmap.days)
  // 이름을 아직 모르거나 직무가 지워졌으면 빼고 부른다
  const owner = me.data ? `${me.data.name}의` : '내'
  const title = [owner, roadmap.fieldName, '로드맵'].filter(Boolean).join(' ')

  return (
    <div className="flex h-full flex-col gap-12">
      <div className="flex shrink-0 items-center gap-3">
        <span className="shrink-0 text-body-lg text-white">현재 학습률</span>
        <RoadmapProgressBar value={roadmap.learningRate} label="현재 학습률" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <h2 className="text-h2 text-white">{title}</h2>
          {roadmap.summary && (
            <p className="text-body-md text-gray-400">{roadmap.summary}</p>
          )}
        </div>
        <ol className="flex flex-col gap-5">
          {roadmap.days.map((day) => (
            <RoadmapDayCard
              key={day.dayNo}
              day={day}
              state={dayState(day, today)}
              lockedMessage={lockedMessage(day.dayNo, today)}
              onComplete={() => setRetrospectDayNo(day.dayNo)}
            />
          ))}
        </ol>
      </div>

      {retrospectDayNo !== null && (
        <RetrospectModal
          title={`${title} Day${retrospectDayNo}`}
          submitting={complete.isPending}
          onClose={() => setRetrospectDayNo(null)}
          // 실패하면 모달을 그대로 두어 쓴 회고를 잃지 않게 한다. 토스트는 공통 MutationCache
          onSubmit={(retrospect) =>
            complete.mutate(
              { dayNo: retrospectDayNo, retrospect },
              { onSuccess: () => setRetrospectDayNo(null) },
            )
          }
        />
      )}
    </div>
  )
}
