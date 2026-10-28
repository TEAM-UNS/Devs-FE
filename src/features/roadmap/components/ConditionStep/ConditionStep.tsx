import { COMMENT_MAX_LENGTH } from '../../constants/create'
import { SelectionSummary } from '../SelectionSummary'
import { StepLayout } from '../StepLayout'

interface ConditionStepProps {
  readonly summary: readonly (readonly string[])[]
  readonly comment: string
  readonly onCommentChange: (comment: string) => void
  readonly onPrevious: () => void
  readonly onSubmit: () => void
}

/** 4단계 로드맵 조건 — 추가 의견(선택). Figma 1988:7516 */
export function ConditionStep({
  summary,
  comment,
  onCommentChange,
  onPrevious,
  onSubmit,
}: ConditionStepProps) {
  return (
    <StepLayout
      step={4}
      title="로드맵 조건 설정"
      description="로드맵에 반영할 추가 의견이 있다면 작성해 주세요. (선택)"
      onPrevious={onPrevious}
      nextLabel="로드맵 생성하기"
      nextArrow={false}
      onNext={onSubmit}
    >
      <SelectionSummary groups={summary} />
      <textarea
        aria-label="추가 의견"
        value={comment}
        onChange={(event) => onCommentChange(event.currentTarget.value)}
        maxLength={COMMENT_MAX_LENGTH}
        placeholder="추가 의견을 작성해주세요."
        className="mt-2 h-[300px] w-[1056px] max-w-full shrink-0 resize-none rounded-md border border-element bg-container px-6 py-5 text-body-md text-white outline-none placeholder:text-gray-300 focus:border-gray-300"
      />
    </StepLayout>
  )
}
