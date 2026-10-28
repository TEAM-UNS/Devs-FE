import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { majorLabel } from '@/shared/api'
import { MIN_WEEKS } from '../../constants/create'
import { MOCK_GENERATING_PROGRESS, MOCK_MAJORS } from '../../constants/mock'
import { STEP_PARAM, parseStep, reachableStep } from '../../utils/createStep'
import { ConditionStep } from '../ConditionStep'
import { MajorStep } from '../MajorStep'
import { PeriodStep } from '../PeriodStep'
import { RoadmapGenerating } from '../RoadmapGenerating'
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
  const [submitted, setSubmitted] = useState(false)

  const urlStep = parseStep(searchParams)
  const step = Math.min(urlStep, reachableStep(majorId, skillIds.length))

  if (submitted) {
    // TODO: API 연동 — POST /roadmap 후 GET /roadmap/{id}/status로 진행률을 받는다
    return <RoadmapGenerating progress={MOCK_GENERATING_PROGRESS} />
  }

  if (step !== urlStep) {
    return <Navigate to={{ search: `?${STEP_PARAM}=${step}` }} replace />
  }

  const goTo = (next: number) => setSearchParams({ [STEP_PARAM]: String(next) })

  const major = MOCK_MAJORS.find(({ id }) => id === majorId)
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

  switch (step) {
    case 1:
      return (
        <MajorStep
          majors={MOCK_MAJORS}
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
          onSubmit={() => setSubmitted(true)}
        />
      )
  }
}
