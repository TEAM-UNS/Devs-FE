import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { majorLabel, majorQueries } from '@/shared/api'
import { ROUTES } from '@/shared/constants'
import { roadmapQueries } from '../../api/roadmapQueries'
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
  const mine = useQuery(roadmapQueries.mine())
  const majors = useQuery(majorQueries.list())
  const create = useCreateRoadmap()

  const urlStep = parseStep(searchParams)
  const step = Math.min(urlStep, reachableStep(majorId, skillIds.length))

  // TODO: 로딩 화면은 스켈레톤(#65) 디자인 확인 후. 실패는 공통 에러 토스트
  if (mine.isPending || mine.isError) return null

  /* 새로 만들면 서버가 기존 로드맵을 지운다. 경고할 화면이 없어서, 쓰고 있거나 만드는 중인 로드맵이
     있으면 생성 흐름에 들이지 않는다. 실패한 로드맵은 다시 만들 수 있게 둔다 */
  if (mine.data && mine.data.status !== 'failed') {
    return <Navigate to={ROUTES.roadmap} replace />
  }

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
      // 만드는 중 화면은 /roadmap이 그린다. 생성 흐름은 기록에서 지워 뒤로가기로 돌아오지 않게 한다
      { onSuccess: () => navigate(ROUTES.roadmap, { replace: true }) },
    )
  }

  switch (step) {
    case 1:
      return (
        <MajorStep
          majors={majorList}
          selectedId={majorId}
          onSelect={handleSelectMajor}
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
