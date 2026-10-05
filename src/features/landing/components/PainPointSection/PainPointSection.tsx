import bubble01 from '@/assets/landing/bubble-01.svg'
import bubble02 from '@/assets/landing/bubble-02.svg'
import bubble03 from '@/assets/landing/bubble-03.svg'
import { cn } from '@/shared/utils/cn'
import { PAIN_POINTS } from '../../constants/content'
import { useInView } from '../../hooks/useInView'

// 카드마다 말풍선 모양(꼬리 위치)·자리·등장 순서가 달라 인덱스로 맞춘다
// 등장 순서는 Figma 818:7701 주석대로 01 → 03 → 02
const CARD_LAYOUT = [
  { bubble: bubble01, position: 'top-[50px] left-0', delay: '' },
  {
    bubble: bubble02,
    position: 'top-0 left-[371px]',
    delay: '[--fade-delay:600ms]',
  },
  {
    bubble: bubble03,
    position: 'top-[50px] left-[753px]',
    delay: '[--fade-delay:300ms]',
  },
] as const

/** 문제 제기 — 취준생이 던지는 질문 세 개를 말풍선으로 */
export function PainPointSection() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section className="mx-auto mt-40 flex w-[1153px] flex-col items-center gap-16">
      <div className="flex w-[715px] flex-col gap-3 text-center">
        <h2 className="text-h2 text-white">
          설마, 아직도 &apos;카더라&apos; 소문만 믿고 지원서를 쓰고 계신가요?
        </h2>
        <p className="text-body-md text-gray-400">
          지원의 기준이 모호했다면 이제 데이터로 확인하세요. 전공과 보유 스택에
          맞춘 채용 시장의 진짜 정답을 공개합니다.
        </p>
      </div>

      <div ref={ref} className="relative h-[321px] w-full">
        {PAIN_POINTS.map(({ number, question, answer }, index) => {
          const { bubble, position, delay } = CARD_LAYOUT[index]
          return (
            <article
              key={number}
              className={cn(
                'absolute h-[271px] w-[400px] pt-[26px] pl-[59px] whitespace-nowrap',
                position,
                // 들어오기 전엔 숨겨 둔다. 모션을 줄인 사용자에겐 처음부터 보인다
                'motion-safe:opacity-0',
                inView && cn('motion-safe:animate-fade-up', delay),
              )}
            >
              {/* 말풍선 SVG에 그림자 여백이 포함돼 있어 박스보다 크게 깐다 */}
              <div className="absolute inset-[-4.43%_-3%]">
                <img src={bubble} alt="" className="size-full" />
              </div>
              <div className="relative flex flex-col gap-1.5">
                <span className="text-body-lg font-semibold text-primary-400">
                  {number}
                </span>
                <h3 className="text-h3 text-white">
                  {question[0]}
                  <br />
                  {question[1]}
                </h3>
              </div>
              <p className="relative mt-3 text-body-md text-gray-400">
                {answer.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
