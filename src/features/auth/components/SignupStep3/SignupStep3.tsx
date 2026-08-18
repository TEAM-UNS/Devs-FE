import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/shared/components/Button'
import { ArrowIcon } from '@/shared/components/icons'
import { majorQueries } from '../../api'
import {
  MAX_MAJORS,
  signupStep3Schema,
  type SignupStep3Input,
} from '../../types'
import { CareerSelect } from './CareerSelect'
import { MajorSelector } from './MajorSelector'
import { toMajorOption } from './majors'

const NEXT_ICON = <ArrowIcon className="size-full rotate-180" />

type CareerType = SignupStep3Input['careerType']

interface SignupStep3Props {
  /** 검증 통과 시 호출 */
  onNext: (data: SignupStep3Input) => void
}

/**
 * 회원가입 3단계 — 전공(다중선택)·경력 선택.
 * 커스텀 선택 컨트롤(카드·세그먼트·Dropdown)이라 로컬 상태 + Zod safeParse로 검증한다.
 */
export function SignupStep3({ onNext }: SignupStep3Props) {
  const [majors, setMajors] = useState<string[]>([])
  const [careerType, setCareerType] = useState<CareerType | undefined>()
  const [careerLevel, setCareerLevel] = useState<string | undefined>()

  const { data } = useQuery(majorQueries.list())
  // 선택지는 서버 목록에서 오고, 라벨·아이콘만 표기표에서 잇는다.
  const majorOptions = data?.categories.map(toMajorOption) ?? []

  const handleToggleMajor = useCallback((id: string) => {
    setMajors((prev) => {
      if (prev.includes(id)) return prev.filter((m) => m !== id)
      if (prev.length >= MAX_MAJORS) return prev // 최대 초과 시 무시
      return [...prev, id]
    })
  }, [])

  const handleCareerType = useCallback((type: CareerType) => {
    setCareerType(type)
    // '경력 없음'으로 바꾸면 연차 선택을 비운다.
    if (type === 'none') setCareerLevel(undefined)
  }, [])

  const isValid = signupStep3Schema.safeParse({
    majors,
    careerType,
    careerLevel,
  }).success

  const handleSubmit = useCallback(() => {
    const result = signupStep3Schema.safeParse({
      majors,
      careerType,
      careerLevel,
    })
    if (result.success) onNext(result.data)
  }, [majors, careerType, careerLevel, onNext])

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <MajorSelector
          majors={majorOptions}
          selected={majors}
          onToggle={handleToggleMajor}
        />
        <CareerSelect
          careerType={careerType}
          careerLevel={careerLevel}
          onCareerTypeChange={handleCareerType}
          onCareerLevelChange={setCareerLevel}
        />
      </div>
      <Button
        type="button"
        variant="primary"
        disabled={!isValid}
        endIcon={NEXT_ICON}
        onClick={handleSubmit}
        className="w-full"
      >
        다음
      </Button>
    </div>
  )
}
