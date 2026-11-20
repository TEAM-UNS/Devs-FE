import bubble01 from '@/assets/landing/bubble-01.svg'
import bubble02 from '@/assets/landing/bubble-02.svg'
import bubble03 from '@/assets/landing/bubble-03.svg'
import { cn } from '@/shared/utils/cn'
import { PAIN_POINTS } from '../../constants/content'
import { useInView } from '../../hooks/useInView'

// 카드마다 말풍선 모양(꼬리 위치)·자리·등장 순서가 달라 인덱스로 맞춘다
// 등장 순서는 Figma 818:7701 주석대로 01 → 03 → 02
// 자리: 모바일은 한 줄로 쌓고(흐름 배치), 패드는 두 열 지그재그(2555:12742), PC는 가로 지그재그
const CARD_LAYOUT = [
  {
    bubble: bubble01,
    position: 'md:top-0 md:left-0 lg:top-[50px]',
    delay: '',
  },
  {
    bubble: bubble02,
    position: 'md:top-[201px] md:left-[289px] lg:top-0 lg:left-[371px]',
    delay: '[--fade-delay:600ms]',
  },
  {
    bubble: bubble03,
    position: 'md:top-[399px] md:left-[10px] lg:top-[50px] lg:left-[753px]',
    delay: '[--fade-delay:300ms]',
  },
] as const

/** 문제 제기 — 취준생이 던지는 질문 세 개를 말풍선으로 */
export function PainPointSection() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section className="mx-auto mt-[100px] flex w-full flex-col items-center gap-16 px-5 md:px-8 lg:mt-40 lg:w-[1153px] lg:px-0">
      <div className="flex w-full max-w-[715px] flex-col gap-3 text-center">
        {/* 모바일만 Figma(2555:13287)처럼 두 줄로 끊는다 */}
        <h2 className="text-h2 text-white">
          설마, 아직도 &apos;카더라&apos; 소문만 믿고{' '}
          <br className="md:hidden" />
          지원서를 쓰고 계신가요?
        </h2>
        <p className="text-body-sm text-gray-400 md:text-body-md">
          지원의 기준이 모호했다면 이제 데이터로 확인하세요.{' '}
          <br className="md:hidden" />
          전공과 보유 스택에 맞춘 채용 시장의 진짜 정답을 공개합니다.
        </p>
      </div>

      <div
        ref={ref}
        className="flex flex-col items-center gap-4 md:relative md:h-[670px] md:w-[689px] lg:h-[321px] lg:w-full"
      >
        {PAIN_POINTS.map(({ number, question, answer }, index) => {
          const { bubble, position, delay } = CARD_LAYOUT[index]
          return (
            <article
              key={number}
              className={cn(
                // 모바일은 320 폭 말풍선에 답변이 자동 줄바꿈된다
                'relative h-[268px] w-[320px] pt-[29px] pl-[25px] md:absolute md:h-[271px] md:w-[400px] md:pt-[26px] md:pl-[59px] md:whitespace-nowrap',
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
              {/* PC·패드는 Figma 줄바꿈 그대로, 모바일은 이어 붙여 폭에 맞게 어절로 줄바꿈한다 */}
              <p className="relative mt-3 text-body-md break-keep text-gray-400">
                {answer.map((line) => (
                  <span key={line} className="md:block">
                    {line}{' '}
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
