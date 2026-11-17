import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Navigate,
  generatePath,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { majorLabel, majorQueries } from '@/shared/api'
import { ROUTES } from '@/shared/constants'
import { MIN_WEEKS } from '../../constants/create'
import { useCreateRoadmap } from '../../hooks/useRoadmapMutations'
import { STEP_PARAM, parseStep, reachableStep } from '../../utils/createStep'
import { ConditionStep } from '../ConditionStep'
import { MajorStep } from '../MajorStep'
import { PeriodStep } from '../PeriodStep'
import { StackStep } from '../StackStep'

/**
 * 로드맵 생성 흐름. 단계는 URL(`?step=2`)에 두어 뒤로가기가 단계 단위로 동작하고,
 * 고른 값은 여기 state에 둔다 — 새로고침하면 사라지므로 빈 채로 뒤 단계에 들어오면 앞으로 돌려보낸다
 */
export function RoadmapCreate() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [majorId, setMajorId] = useState<number | null>(null)
  const [skillIds, setSkillIds] = useState<number[]>([])
  const [weeks, setWeeks] = useState(MIN_WEEKS)
  const [comment, setComment] = useState('')
  const navigate = useNavigate()
  const majors = useQuery(majorQueries.list())
  const create = useCreateRoadmap()

  const urlStep = parseStep(searchParams)
  const step = Math.min(urlStep, reachableStep(majorId, skillIds.length))

  if (step !== urlStep) {
    return <Navigate to={{ search: `?${STEP_PARAM}=${step}` }} replace />
  }

  const goTo = (next: number) => setSearchParams({ [STEP_PARAM]: String(next) })

  // TODO: 직무 목록 로딩·실패 화면은 디자인 확인 후. 지금은 빈 목록 + 공통 에러 토스트
  const majorList = majors.data?.categories ?? []
  const major = majorList.find(({ id }) => id === majorId)
  const stacks = major?.techStacks ?? []
  const summary = [
    major ? [majorLabel(major.major)] : [],
    stacks.filter(({ id }) => skillIds.includes(id)).map(({ name }) => name),
  ]

  const handleSelectMajor = (id: number) => {
    // 스택은 직무에 딸려 있어서 직무를 바꾸면 고른 스택을 비운다
    if (id !== majorId) setSkillIds([])
    setMajorId(id)
  }

  const handleToggleSkill = (id: number) => {
    setSkillIds((current) =>
      current.includes(id)
        ? current.filter((skillId) => skillId !== id)
        : [...current, id],
    )
  }

  const handleSubmit = () => {
    if (majorId === null) return
    create.mutate(
      {
        majorId,
        skillIds,
        targetWeeks: weeks,
        additionalComment: comment.trim() || undefined,
      },
      /* 만드는 중 화면은 새 로드맵의 상세 주소가 그린다. 로드맵은 여러 개 가질 수 있어 기존 것과 상관없이 만든다
         생성 흐름은 기록에서 지워 뒤로가기로 돌아오지 않게 한다 */
      {
        onSuccess: ({ roadmapId }) =>
          navigate(
            generatePath(ROUTES.roadmapDetail, {
              roadmapId: String(roadmapId),
            }),
            { replace: true },
          ),
      },
    )
  }

  switch (step) {
    case 1:
      return (
        <MajorStep
          majors={majorList}
          selectedId={majorId}
          onSelect={handleSelectMajor}
          // 로드맵이 여러 개라 목록에서 들어온다. 1단계에서 나가면 목록으로 돌아간다 (Figma 1단계엔 '이전'이 없다)
          onPrevious={() => navigate(ROUTES.roadmap)}
          onNext={() => goTo(2)}
        />
      )
    case 2:
      return (
        <StackStep
          stacks={stacks}
          selectedIds={skillIds}
          onToggle={handleToggleSkill}
          onPrevious={() => goTo(1)}
          onNext={() => goTo(3)}
        />
      )
    case 3:
      return (
        <PeriodStep
          summary={summary}
          weeks={weeks}
          onWeeksChange={setWeeks}
          onPrevious={() => goTo(2)}
          onNext={() => goTo(4)}
        />
      )
    default:
      return (
        <ConditionStep
          summary={summary}
          comment={comment}
          onCommentChange={setComment}
          onPrevious={() => goTo(3)}
          submitting={create.isPending || create.isSuccess}
          onSubmit={handleSubmit}
        />
      )
  }
}
