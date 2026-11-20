import { HERO_DESCRIPTION, HERO_TITLE } from '../../constants/content'
import { CtaLink } from '../CtaLink'

/** 마무리 CTA — 히어로 카피를 다시 보여주고 메인으로 보낸다 */
export function ClosingCta() {
  return (
    <section className="mx-auto mt-[131px] flex w-full max-w-[765px] flex-col items-center gap-[100px] text-center md:mt-[141px] lg:mt-[250px]">
      <div className="flex flex-col gap-8">
        <p className="text-h2 text-white">아직도 망설이고 있나요?</p>
        <div className="flex flex-col gap-1.5">
          {/* 모바일 32 · 패드 40 · PC 48. 모바일은 Figma(2555:13500)처럼 좌우 여백 없이 폭을 꽉 채운다 */}
          <h2 className="text-[32px] leading-[1.2] font-semibold text-white md:text-[40px] lg:text-display-md">
            {HERO_TITLE[0]}
            <br />
            {HERO_TITLE[1]}
          </h2>
          <p className="text-body-sm text-gray-400 md:text-body-lg">
            {/* 히어로와 달리 모바일도 강제로 끊지 않고 폭에 맞게 줄바꿈한다 */}
            {HERO_DESCRIPTION.join(' ')}
          </p>
        </div>
      </div>
      <CtaLink cta="start" location="closing">
        무료로 시작하기
      </CtaLink>
    </section>
  )
}
