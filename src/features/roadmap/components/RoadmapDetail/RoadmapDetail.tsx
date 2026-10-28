import { useState } from 'react'
import type { Roadmap, RoadmapDay } from '../../types'
import { currentDayNo, dayState, lockedMessage } from '../../utils/roadmapDay'
import { RetrospectModal } from '../RetrospectModal'
import { RoadmapProgressBar } from '../RoadmapProgressBar'
import { RoadmapDayCard } from './RoadmapDayCard'

interface RoadmapDetailProps {
  readonly roadmap: Roadmap
}

/** 로드맵 상세 — 학습률은 위에 고정하고 Day 목록만 스크롤한다. Figma 574:3600 */
export function RoadmapDetail({ roadmap }: RoadmapDetailProps) {
  // 회고 모달을 연 날. null이면 닫힘
  const [retrospectDay, setRetrospectDay] = useState<RoadmapDay | null>(null)
  const today = currentDayNo(roadmap.days)
  // TODO: '사용자의'는 Figma 문구 그대로. 사용자 이름을 넣을지 확인 필요
  const title = `사용자의 ${roadmap.fieldName} 로드맵`

  return (
    <div className="flex h-full flex-col gap-12">
      <div className="flex shrink-0 items-center gap-3">
        <span className="shrink-0 text-body-lg text-white">현재 학습률</span>
        <RoadmapProgressBar value={roadmap.learningRate} label="현재 학습률" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <h2 className="text-h2 text-white">{title}</h2>
          <p className="text-body-md text-gray-400">{roadmap.summary}</p>
        </div>
        <ol className="flex flex-col gap-5">
          {roadmap.days.map((day) => (
            <RoadmapDayCard
              key={day.dayNo}
              day={day}
              state={dayState(day, today)}
              lockedMessage={lockedMessage(day.dayNo, today)}
              onComplete={() => setRetrospectDay(day)}
            />
          ))}
        </ol>
      </div>

      {retrospectDay && (
        <RetrospectModal
          title={`${title} Day${retrospectDay.dayNo}`}
          onClose={() => setRetrospectDay(null)}
          onSubmit={() => {
            // TODO: API 연동 — POST /roadmap/days/{dayNo}/complete { retrospect }
            setRetrospectDay(null)
          }}
        />
      )}
    </div>
  )
}
