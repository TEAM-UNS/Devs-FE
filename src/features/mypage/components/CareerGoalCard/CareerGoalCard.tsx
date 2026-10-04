import { ArrowIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'
import type { CareerGoal } from '../../types'

interface CareerGoalCardProps {
  readonly goals: CareerGoal[]
}

/**
 * 커리어 목표 관리 카드. 줄마다 수정 화면으로 들어가는 입구다
 *
 * @param props.goals 목표 직무·기업·관심 스택
 * @returns 목표 세 줄이 담긴 카드
 */
export function CareerGoalCard({ goals }: CareerGoalCardProps) {
  return (
    <section className="rounded-sm bg-container px-8 py-6">
      <h2 className="text-body-lg font-semibold text-gray-1000">
        커리어 목표 관리
      </h2>

      <ul className="mt-2">
        {goals.map((goal, index) => (
          <li
            key={goal.id}
            className={cn(
              'flex items-center gap-4 py-4',
              // 마지막 줄 아래에는 구분선을 두지 않는다
              index < goals.length - 1 && 'border-b border-element',
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="text-body-sm text-gray-300">{goal.label}</p>
              {/* 값이 길면 줄바꿈 대신 말줄임한다 — 줄 높이가 흔들리면 구분선 간격이 깨진다 */}
              <p className="truncate text-body-md text-gray-1000">
                {goal.value}
              </p>
            </div>

            {/* TODO: 각 수정 화면이 생기면 연결한다 */}
            <button
              type="button"
              aria-label={`${goal.label} 수정`}
              className="flex size-6 shrink-0 items-center justify-center text-gray-400 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary-500"
            >
              <ArrowIcon className="size-6 rotate-180" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
