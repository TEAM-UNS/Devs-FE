import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userQueries } from '@/shared/api'
import { trackEvent } from '@/shared/analytics'
import { Button } from '@/shared/components/Button'
import { TrophyIcon } from '@/shared/components/icons'
import { ROUTES } from '@/shared/constants'
import { useCompleteRoadmapDay } from '../../hooks/useRoadmapMutations'
import type { Roadmap } from '../../types'
import { celebrate } from '../../utils/celebrate'
import {
  canFinishRoadmap,
  currentDayNo,
  dayState,
  finishesRoadmap,
  lockedMessage,
} from '../../utils/roadmapDay'
import { FinishModal } from '../FinishModal'
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
  /* 마지막 날이 열리면 제목 옆 '로드맵 완주'가 마지막 날 완료를 맡는다 (Figma 2398:31785)
     완주 모달에서 쓴 마지막 회고는 완주 회고 API가 생기기 전까지 마지막 날 회고로 보낸다 */
  const finishable = canFinishRoadmap(roadmap.days)
  const lastDay = roadmap.days.at(-1)
  // 완주 모달 단계. retrospect = 마지막 회고, done = 새 로드맵 안내
  const [finishStep, setFinishStep] = useState<'retrospect' | 'done' | null>(
    null,
  )
  const navigate = useNavigate()
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
        {/* 완주 버튼은 패드·PC에서 제목 오른쪽, 모바일은 제목 아래 폭 가득 (Figma 2398:31837) */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-3">
          <div className="flex min-w-0 flex-col gap-2">
            <h2 className="text-h2 text-white">{title}</h2>
            {roadmap.summary && (
              <p className="text-body-md text-gray-400">{roadmap.summary}</p>
            )}
          </div>
          {finishable && lastDay && (
            <Button
              startIcon={<TrophyIcon className="size-6" />}
              /* 마지막 날 할 일을 다 했을 때만 회고를 받는다
                 이미 마쳤거나, 할 일이 남아 서버가 그날 완료를 거절하면 안내로 바로 간다 */
              onClick={() =>
                setFinishStep(
                  !lastDay.completed && lastDay.allItemsDone
                    ? 'retrospect'
                    : 'done',
                )
              }
              className="shrink-0 max-md:w-full"
            >
              로드맵 완주
            </Button>
          )}
        </div>
        <ol className="flex flex-col gap-5">
          {roadmap.days.map((day) => (
            <RoadmapDayCard
              key={day.dayNo}
              day={day}
              state={dayState(day, today)}
              lockedMessage={lockedMessage(day.dayNo, today)}
              onComplete={
                finishable && day.dayNo === lastDay?.dayNo
                  ? undefined
                  : () => setRetrospectDayNo(day.dayNo)
              }
            />
          ))}
        </ol>
      </div>

      {finishStep === 'retrospect' && lastDay && (
        <RetrospectModal
          title={`“${title}” 로드맵 완주를 축하합니다!`}
          description="이번 여정을 통해 얻은 배움이나 소감을 간단히 기록해 보세요. 마지막 회고도 익명으로 게시판에 공유돼요. (선택 작성)"
          placeholder={
            '마지막 회고에요.\n가장 뿌듯했던 순간이나, 다음 로드맵에서 보완하고 싶은 점을 자유롭게 적어주세요.'
          }
          submitting={complete.isPending}
          onClose={() => setFinishStep(null)}
          onSubmit={(retrospect) =>
            complete.mutate(
              { dayNo: lastDay.dayNo, retrospect },
              {
                onSuccess: () => {
                  setFinishStep('done')
                  trackEvent('Roadmap Day Completed', {
                    day_no: lastDay.dayNo,
                    wrote_retrospect: retrospect.trim() !== '',
                    finished_roadmap: true,
                  })
                  void celebrate(true)
                },
              },
            )
          }
        />
      )}

      {finishStep === 'done' && (
        <FinishModal
          onClose={() => setFinishStep(null)}
          onConfirm={() => navigate(ROUTES.roadmapNew)}
        />
      )}

      {retrospectDayNo !== null && (
        <RetrospectModal
          title={`${title} Day${retrospectDayNo}`}
          submitting={complete.isPending}
          onClose={() => setRetrospectDayNo(null)}
          // 실패하면 모달을 그대로 두어 쓴 회고를 잃지 않게 한다. 토스트는 공통 MutationCache
          onSubmit={(retrospect) =>
            complete.mutate(
              { dayNo: retrospectDayNo, retrospect },
              {
                onSuccess: () => {
                  setRetrospectDayNo(null)
                  const finished = finishesRoadmap(
                    roadmap.days,
                    retrospectDayNo,
                  )
                  // 회고 본문·길이는 보내지 않는다 (개인정보·고유값)
                  trackEvent('Roadmap Day Completed', {
                    day_no: retrospectDayNo,
                    wrote_retrospect: retrospect.trim() !== '',
                    finished_roadmap: finished,
                  })
                  // 이번 날로 모든 날을 마쳤으면 로드맵 완료로 크게 터뜨린다
                  void celebrate(finished)
                },
              },
            )
          }
        />
      )}
    </div>
  )
}
