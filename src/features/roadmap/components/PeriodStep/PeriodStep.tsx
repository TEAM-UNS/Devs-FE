import { WEEK_PRESETS } from '../../constants/create'
import { SelectionSummary } from '../SelectionSummary'
import { StepLayout } from '../StepLayout'
import { WeekWheel } from '../WeekWheel'

interface PeriodStepProps {
  readonly summary: readonly (readonly string[])[]
  /** 고른 기간(주). MIN_WEEKS~MAX_WEEKS */
  readonly weeks: number
  /** 휠·버튼·프리셋으로 바꾼 기간을 올린다 */
  readonly onWeeksChange: (weeks: number) => void
  readonly onPrevious: () => void
  readonly onNext: () => void
}

/**
 * 3단계 로드맵 기간 — Figma 562:4550
 * 숫자 드럼(휠·버튼·키보드)과 프리셋. 프리셋을 누르면 드럼이 그 값까지 굴러간다(Figma 주석)
 */
export function PeriodStep({
  summary,
  weeks,
  onWeeksChange,
  onPrevious,
  onNext,
}: PeriodStepProps) {
  return (
    <StepLayout
      step={3}
      title="로드맵 기간 설정"
      description="목표 달성까지 투자할 수 있는 기간을 설정해 주세요. 최소 1주부터 가능합니다."
      onPrevious={onPrevious}
      nextLabel="기간 설정 완료"
      onNext={onNext}
    >
      <SelectionSummary groups={summary} />

      <div className="flex flex-1 flex-col items-center justify-between pt-[124px] pb-28">
        <WeekWheel weeks={weeks} onChange={onWeeksChange} />

        <div className="flex flex-col items-center gap-3">
          <ul className="flex gap-2">
            {WEEK_PRESETS.map((preset) => (
              <li key={preset}>
                <button
                  type="button"
                  onClick={() => onWeeksChange(preset)}
                  className="rounded-full bg-element px-5 py-1.5 text-body-lg font-semibold text-gray-400"
                >
                  {preset}주
                </button>
              </li>
            ))}
          </ul>
          {/* Figma 562:4544 — 토큰에 없는 #6a6a6a */}
          <p className="text-body-md text-[#6a6a6a]">
            프리셋을 선택하거나 마우스 휠·버튼으로 기간을 조절하세요.
          </p>
        </div>
      </div>
    </StepLayout>
  )
}
