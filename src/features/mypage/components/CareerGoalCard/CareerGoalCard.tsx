import { Link } from 'react-router-dom'
import { ArrowIcon } from '@/shared/components/icons'
import { ROUTES } from '@/shared/constants'
import { cn } from '@/shared/utils/cn'

interface CareerGoalCardProps {
  /** 목표 직무(내 전공) 표기. 없으면 빈 문자열 */
  readonly majors: string
  readonly skills: string[]
  /** 내가 쓴 회고 개수. 모르면 — */
  readonly retrospectCount?: number
}

// 값이 없는 줄
const EMPTY = '—'

const ARROW_CLASS =
  'flex size-6 shrink-0 items-center justify-center text-gray-400 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary-500'

interface RowProps {
  readonly label: string
  readonly value: string
  /** 화살표로 갈 곳 */
  readonly to: string
  /** 화살표의 스크린리더 이름 */
  readonly action?: string
  readonly last?: boolean
}

function Row({ label, value, to, action = '수정', last }: RowProps) {
  return (
    <li
      className={cn(
        'flex items-start justify-between gap-4 py-4',
        !last && 'border-b border-element',
      )}
    >
      <div className="flex min-w-0 flex-col">
        <span className="text-body-sm text-gray-300">{label}</span>
        <span className="truncate text-body-md font-semibold text-gray-1000">
          {value}
        </span>
      </div>
      <Link to={to} aria-label={`${label} ${action}`} className={ARROW_CLASS}>
        <ArrowIcon className="size-6 rotate-180" />
      </Link>
    </li>
  )
}

/**
 * 내 커리어 관리 카드 — Figma 659:4119 (제목은 Figma의 로드맵 관리에서 바꿨다)
 * 목표직무·관심 스택은 내 정보로 채우고 각 수정 화면으로 보낸다
 * 내 회고 보기는 내 회고 몰아보기(/my/retrospects)로 보낸다
 */
export function CareerGoalCard({
  majors,
  skills,
  retrospectCount,
}: CareerGoalCardProps) {
  return (
    <section className="flex flex-col gap-2 rounded-sm bg-container px-8 py-6">
      <h2 className="text-body-lg font-semibold text-gray-1000">
        내 커리어 관리
      </h2>
      <ul className="flex flex-col">
        <Row label="목표직무" value={majors || EMPTY} to={ROUTES.myMajorEdit} />
        <Row
          label="관심 스택"
          value={skills.length > 0 ? skills.join(', ') : EMPTY}
          to={ROUTES.myTechStackEdit}
        />
        <Row
          label="내 회고 보기"
          value={retrospectCount === undefined ? EMPTY : `${retrospectCount}개`}
          to={ROUTES.myRetrospects}
          action="열기"
          last
        />
      </ul>
    </section>
  )
}
