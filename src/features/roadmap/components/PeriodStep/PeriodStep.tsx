import { ChevronDownIcon } from '@/shared/components/icons'
import { WEEK_PRESETS } from '../../constants/create'
import { SelectionSummary } from '../SelectionSummary'
import { StepLayout } from '../StepLayout'

interface PeriodStepProps {
  readonly summary: readonly (readonly string[])[]
  /** 고른 기간(주). MIN_WEEKS~MAX_WEEKS */
  readonly weeks: number
  /** 휠·버튼·프리셋으로 바꾼 기간을 올린다 */
  readonly onWeeksChange: (weeks: number) => void
  readonly onPrevious: () => void
  readonly onNext: () => void
}

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * 3단계 로드맵 기간 — Figma 562:4550
 * 마크업만 있다. 입력 로직은 TODO 참고
 */
export function PeriodStep({
  summary,
  weeks,
  onPrevious,
  onNext,
}: PeriodStepProps) {
  // TODO: 기간 입력 로직 (CLAUDE.md 소유 #5 — 직접 작성)
  //  - 숫자 영역 마우스 휠로 한 주씩 올리고 내리기
  //  - 위·아래 화살표 버튼
  //  - 프리셋 버튼: Figma 주석 "누르면 위에 기간이 돌아가는 애니메이션과 함께 맞춰짐"
  //  - 범위는 MIN_WEEKS~MAX_WEEKS, 바뀐 값은 onWeeksChange로 올린다
  //  - 위아래 숫자(이전·다음 주)를 범위 밖에서 어떻게 보일지

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
        <div className="flex w-[117px] flex-col gap-1">
          <span
            aria-hidden="true"
            className="w-[53px] text-center text-h2 text-gray-200"
          >
            {pad(weeks - 1)}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <output
                aria-label="로드맵 기간(주)"
                className="w-[53px] text-center text-display-md text-white"
              >
                {pad(weeks)}
              </output>
              <div className="flex w-6 flex-col text-gray-200">
                <button type="button" aria-label="한 주 늘리기">
                  <ChevronDownIcon className="size-6 rotate-180" />
                </button>
                <button type="button" aria-label="한 주 줄이기">
                  <ChevronDownIcon className="size-6" />
                </button>
              </div>
            </div>
            <span className="text-body-lg text-gray-400">주</span>
          </div>
          <span
            aria-hidden="true"
            className="w-[53px] text-center text-h2 text-gray-200"
          >
            {pad(weeks + 1)}
          </span>
          <span
            aria-hidden="true"
            className="w-[53px] text-center text-h4 text-gray-100"
          >
            {pad(weeks + 2)}
          </span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <ul className="flex gap-2">
            {WEEK_PRESETS.map((preset) => (
              <li key={preset}>
                <button
                  type="button"
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
