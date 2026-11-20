import { useId, useState } from 'react'
import { ChevronDownIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'
import { FAQS, type Faq } from '../../constants/content'

/**
 * 질문 하나. 눌러서 답변을 펼치고 접는다
 * <details>는 높이 전환을 브라우저마다 다르게 지원해서 직접 만든다
 * grid 행을 0fr ↔ 1fr로 바꾸면 내용 높이를 몰라도 높이가 부드럽게 바뀐다
 */
function FaqItem({ question, answer }: Faq) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="border-b border-gray-100 px-9 py-6">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-start justify-between gap-3 text-left text-body-lg text-white md:items-center"
      >
        {/* 모바일은 질문이 줄바꿈되어 화살표를 첫 줄에 맞춘다 */}
        <span className="break-keep">Q. {question}</span>
        <ChevronDownIcon
          className={cn(
            'size-6 shrink-0 text-gray-300 motion-safe:transition-transform motion-safe:duration-normal motion-safe:ease-standard',
            open && 'rotate-180',
          )}
        />
      </button>
      {/* 접힌 동안에는 inert로 포커스·스크린리더에서 뺀다. 높이만 0이라 내용은 남아 있다 */}
      <div
        id={panelId}
        inert={!open}
        className={cn(
          'grid motion-safe:transition-[grid-template-rows] motion-safe:duration-normal motion-safe:ease-standard',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <p className="pt-5 text-body-lg text-gray-400">A. {answer}</p>
        </div>
      </div>
    </div>
  )
}

/** 자주 묻는 질문 — 처음엔 모두 접힌 채로 시작한다 */
export function FaqSection() {
  return (
    <section className="mx-5 mt-[100px] rounded-md bg-gray-50 px-5 py-12 md:mx-10 lg:mx-20 lg:mt-52 lg:p-20">
      <h2 className="text-center text-[24px] leading-[1.2] font-semibold text-white md:text-[32px] lg:text-display-sm">
        자주 묻는 질문
      </h2>
      <div className="mt-12">
        {FAQS.map((faq) => (
          <FaqItem key={faq.question} {...faq} />
        ))}
      </div>
    </section>
  )
}
