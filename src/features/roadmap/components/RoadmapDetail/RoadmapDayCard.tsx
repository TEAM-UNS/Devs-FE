import { Button } from '@/shared/components/Button'
import { Checkbox } from '@/shared/components/Checkbox'
import { CheckIcon, LockIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'
import type { RoadmapDay } from '../../types'
import type { DayState } from '../../utils/roadmapDay'

interface RoadmapDayCardProps {
  readonly day: RoadmapDay
  readonly state: DayState
  /** 잠긴 날 안내 문구 */
  readonly lockedMessage: string
  readonly onComplete: () => void
}

// Day 앞 점 — Figma 580:3805/3806. 오늘은 보라에 글로우
const DOT =
  'size-3 rounded-full border-[0.4px] border-white/30 shadow-[inset_0_0_2px_rgba(255,255,255,0.25),inset_0_2px_2px_rgba(255,255,255,0.25),inset_0_-3px_4px_rgba(0,0,0,0.35)]'

/** 로드맵 하루 — 머리줄(완료 체크·점 + Day N)과 점선 옆 카드. Figma 2079:11270 */
export function RoadmapDayCard({
  day,
  state,
  lockedMessage,
  onComplete,
}: RoadmapDayCardProps) {
  const past = state === 'past'

  return (
    <li className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {past ? (
          <CheckIcon className="size-6 text-gray-400" />
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              DOT,
              'mx-1.5',
              state === 'current'
                ? 'bg-primary-400 shadow-[0_0_8px_rgba(188,114,244,0.6)]'
                : 'bg-gray-200',
            )}
          />
        )}
        <h3 className={cn('text-h3', past ? 'text-gray-400' : 'text-white')}>
          Day {day.dayNo}
        </h3>
      </div>

      {/* 점선은 Figma에서 점 가운데(6px)를 지나 아래로 이어진다 */}
      <div className="ml-1.5 flex border-l border-dashed border-element pl-4">
        {state === 'locked' ? (
          <div className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-container p-6 text-body-lg text-gray-300">
            <LockIcon className="size-6" />
            {lockedMessage}
          </div>
        ) : (
          <div
            className={cn(
              'flex flex-1 flex-col gap-6 rounded-sm bg-container p-6',
              state === 'current' && 'border border-gray-200',
            )}
          >
            <ul className="flex flex-col gap-5">
              {day.items.map((item) => (
                <li key={item.itemId}>
                  {/* 지난 날은 고칠 수 없게 막는다. Checkbox의 비활성 글자색은 회색이라
                      Figma(지난 날도 흰 제목)에 맞게 덮어쓴다 */}
                  <Checkbox
                    defaultChecked={item.done}
                    disabled={past}
                    // TODO: API 연동 — PATCH /roadmap/items/{itemId} { done }
                    label={<span className="text-white">{item.title}</span>}
                    description={
                      item.description && (
                        <span className="whitespace-pre-line text-gray-300">
                          {item.description}
                        </span>
                      )
                    }
                  />
                </li>
              ))}
            </ul>

            {state === 'current' && day.allItemsDone && (
              <div className="flex items-center justify-between border-t border-element pt-4">
                <p className="text-body-sm text-gray-400">
                  Day {day.dayNo} 학습 완료! [로드맵 완료]를 누르고 회고를
                  작성해 보세요.
                </p>
                <Button size="sm" disabled={day.completed} onClick={onComplete}>
                  {day.completed ? '회고 작성 완료' : '로드맵 완료'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  )
}
