import type { ReactNode } from 'react'
import { Button } from '@/shared/components/Button'
import { ArrowIcon } from '@/shared/components/icons'
import { RoadmapStepper } from '../RoadmapStepper'

interface StepLayoutProps {
  readonly step: number
  readonly title: string
  readonly description: string
  /** 없으면 '이전'을 숨긴다 (1단계) */
  readonly onPrevious?: () => void
  readonly nextLabel: string
  /** 다음 버튼 오른쪽 화살표. 마지막 단계(생성하기)엔 없다 */
  readonly nextArrow?: boolean
  readonly nextDisabled?: boolean
  readonly onNext: () => void
  readonly children: ReactNode
}

// 다음 단계 화살표 — 오른쪽(›)은 왼쪽 셰브론을 뒤집어 쓴다
const NEXT_ARROW = <ArrowIcon className="size-6 rotate-180" />

/** 생성 단계 공통 틀 — 이전 · 단계 표시줄 · 제목 · 본문 · 오른쪽 아래 고정 다음 버튼 */
export function StepLayout({
  step,
  title,
  description,
  onPrevious,
  nextLabel,
  nextArrow = true,
  nextDisabled = false,
  onNext,
  children,
}: StepLayoutProps) {
  return (
    <div className="flex h-full flex-col items-center gap-9">
      <div className="relative flex w-full shrink-0 justify-center">
        {onPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            className="absolute top-1/2 left-2 flex -translate-y-1/2 items-center gap-1 text-body-md font-semibold text-gray-300 hover:text-gray-400"
          >
            <ArrowIcon className="size-6" />
            이전
          </button>
        )}
        <RoadmapStepper current={step} />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-6">
        <div className="flex shrink-0 flex-col items-center gap-1 text-center">
          <h2 className="text-h2 text-white">{title}</h2>
          <p className="text-body-md text-gray-400">{description}</p>
        </div>
        {children}
      </div>

      <Button
        disabled={nextDisabled}
        onClick={onNext}
        endIcon={nextArrow ? NEXT_ARROW : undefined}
        className="fixed right-12 bottom-[42px] enabled:drop-shadow-[0_0_4px_rgba(188,114,244,0.6)]"
      >
        {nextLabel}
      </Button>
    </div>
  )
}
