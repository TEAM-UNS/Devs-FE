import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { majorQueries } from '@/shared/api'
import { Button } from '@/shared/components/Button'
import { signupStep4Schema, type SignupStep4Input } from '../../types'
import { MajorListStatus } from '../MajorListStatus'
import { toMajorOption } from '../SignupStep3/majors'
import { TechStackSection } from './TechStackSection'
import type { TechStackGroup } from './techStacks'

// 패널은 Figma에서 높이 280px 고정이고 그룹이 그보다 길다 → 안에서 세로 스크롤된다.
// py-5 = 스크롤바 트랙을 위아래 20px씩 들여놓기 위한 여백 (아래 SCROLL_STYLES 참고).
const PANEL_STYLES =
  'flex h-70 flex-col rounded-md border border-element bg-container py-5'

// 스크롤은 패널이 아니라 이 안쪽 요소가 맡는다. 네이티브 스크롤바는 스크롤 요소의 경계에
// 붙으므로, Figma처럼 막대를 패널 안쪽으로 들여놓으려면 스크롤 요소 자체를 들여야 한다.
// 세로 20px(패널 py-5): Figma 막대가 패널 위에서 20px 내려와 시작한다.
// 오른쪽 21px(mr): 막대가 패널 우변에서 21px 안쪽이다.
// 컨텐츠 여백은 스크롤 범위에 포함돼야 하므로 스크롤 요소 안쪽에 둔다 —
// 위아래 12px(20+12=32), 오른쪽 11px(21+막대 4+11=36), 왼쪽 36px.
const SCROLL_STYLES = [
  'scrollbar-slim min-h-0 flex-1 overflow-y-auto',
  'mr-[21px] py-3 pl-9 pr-[11px]',
].join(' ')

// 미선택 그룹에 넘길 빈 배열 — 렌더마다 새로 만들면 memo가 깨진다 (react-perf).
const NO_TAGS: string[] = []

type Selection = SignupStep4Input['techStacks']

interface SignupStep4Props {
  /** 3단계에서 고른 전공 id 목록 — 이 전공들의 기술 스택만 노출한다 */
  majors?: string[]
  /** 검증 통과 시 호출 (마지막 단계) */
  onSubmit: (data: SignupStep4Input) => void
  /** 제출 중이면 버튼을 잠근다 */
  pending?: boolean
  /** 제출 버튼 문구. 회원가입 밖(온보딩)에서도 쓰므로 밖에서 정한다 */
  submitLabel?: string
}

/**
 * 회원가입 4단계(마지막) — 전공별 기술 스택 선택.
 * 3단계와 같은 이유로(커스텀 선택 컨트롤) 로컬 상태 + Zod safeParse로 검증한다.
 */
export function SignupStep4({
  majors,
  onSubmit,
  pending,
  submitLabel = '회원가입',
}: SignupStep4Props) {
  const [techStacks, setTechStacks] = useState<Selection>({})
  // 기본은 전부 펼침. 접힌 것만 담으면 노출 그룹이 바뀌어도 초기화가 필요 없다.
  const [closed, setClosed] = useState<string[]>([])

  const majorList = useQuery(majorQueries.list())
  const { data } = majorList

  // 헤더 라벨은 3단계 카드와 같은 표기표를 써서 두 단계가 같은 이름을 보이게 한다.
  // TechStackSection이 memo라 배열 identity를 유지해야 해서 useMemo를 둔다.
  const groups = useMemo<TechStackGroup[]>(() => {
    const categories = data?.categories ?? []
    const selected = majors ?? []

    return categories
      .filter((category) => selected.includes(String(category.id)))
      .map((category) => ({
        majorId: String(category.id),
        label: toMajorOption(category).label,
        tags: category.tech_stacks.map((stack) => ({
          id: String(stack.id),
          label: stack.name,
        })),
      }))
  }, [data, majors])

  const handleToggleOpen = useCallback((majorId: string) => {
    setClosed((prev) =>
      prev.includes(majorId)
        ? prev.filter((id) => id !== majorId)
        : [...prev, majorId],
    )
  }, [])

  const handleToggleTag = useCallback((majorId: string, tagId: string) => {
    setTechStacks((prev) => {
      const current = prev[majorId] ?? []
      const next = current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId]
      return { ...prev, [majorId]: next }
    })
  }, [])

  const isValid = signupStep4Schema.safeParse({ techStacks }).success

  const handleSubmit = useCallback(() => {
    const result = signupStep4Schema.safeParse({ techStacks })
    if (result.success) onSubmit(result.data)
  }, [techStacks, onSubmit])

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <span className="text-body-md text-white">기술 스택 선택</span>
        <div className={PANEL_STYLES}>
          <div className={SCROLL_STYLES}>
            <MajorListStatus
              pending={majorList.isPending}
              failed={majorList.isError}
              onRetry={majorList.refetch}
            />
            <div className="flex flex-col gap-8">
              {groups.map((group) => (
                <TechStackSection
                  key={group.majorId}
                  group={group}
                  selected={techStacks[group.majorId] ?? NO_TAGS}
                  open={!closed.includes(group.majorId)}
                  onToggleOpen={handleToggleOpen}
                  onToggleTag={handleToggleTag}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Button
        type="button"
        variant="primary"
        disabled={!isValid || pending}
        onClick={handleSubmit}
        className="w-full"
      >
        {submitLabel}
      </Button>
    </div>
  )
}
