import devsLogo from '@/assets/chat/devs-logo.svg'
import { ChatComposer } from '../ChatComposer'

const SUGGESTED_QUESTIONS = [
  '백엔드 중 가장 인기있는 기술 스택',
  '최근 한달 간 급하락중인 기술 스택',
  '로드맵 생성 기준은 무엇인가요?',
] as const

interface ChatIntroProps {
  readonly question: string
  readonly error?: string
  readonly onQuestionChange: (value: string) => void
  readonly onQuestionSubmit: () => void
  readonly onSuggestionSelect: (question: string) => void
}

interface SuggestedQuestionButtonProps {
  readonly question: string
  readonly onSelect: (question: string) => void
}

function SuggestedQuestionButton({
  question,
  onSelect,
}: SuggestedQuestionButtonProps) {
  function handleClick() {
    onSelect(question)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="h-8 rounded-full border border-element bg-container px-5 text-body-sm text-gray-400 focus-visible:outline-2 focus-visible:outline-primary-500"
    >
      {question}
    </button>
  )
}

/** 대화를 시작하기 전 보여주는 챗봇 첫 화면 */
export function ChatIntro({
  question,
  error,
  onQuestionChange,
  onQuestionSubmit,
  onSuggestionSelect,
}: ChatIntroProps) {
  return (
    <section className="flex min-w-0 flex-1 items-center justify-center bg-canvas px-4 md:px-10">
      <div className="flex w-full max-w-[700px] -translate-y-[30px] flex-col items-center gap-12">
        <img src={devsLogo} alt="Devs" className="h-8 w-[168px]" />

        <div className="flex w-full flex-col gap-4">
          <ChatComposer
            value={question}
            error={error}
            onChange={onQuestionChange}
            onSubmit={onQuestionSubmit}
          />

          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-between">
            {SUGGESTED_QUESTIONS.map((question) => (
              <SuggestedQuestionButton
                key={question}
                question={question}
                onSelect={onSuggestionSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
