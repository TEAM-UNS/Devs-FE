import heroScreen from '@/assets/landing/hero-screen.webp'
import glowTopRight from '@/assets/landing/glow-1.svg'
import glowLeft from '@/assets/landing/glow-2.svg'
import glassLeft from '@/assets/landing/glass-left.webp'
import glassRight from '@/assets/landing/glass-right.webp'
import { HERO_DESCRIPTION, HERO_TITLE } from '../../constants/content'
import { CtaLink } from '../CtaLink'

/**
 * 첫 화면 — 카피·CTA와 맥북 속 대시보드
 * 맥북 아래쪽은 섹션 높이(PC·패드 1000, 모바일 600)에서 잘리고 위로 깔린 그라데이션에 묻히는 게 디자인이다
 * 모바일은 배경 원·유리 구슬이 없고 맥북을 줄인다 (Figma 2555:13264). 패드는 PC와 같은 px에 오른쪽 구슬만 옮긴다 (2551:12653)
 */
export function HeroSection() {
  return (
    <section className="relative h-[600px] overflow-hidden bg-black md:h-[1000px]">
      {/* 배경 원은 Figma에서 회전된 채 놓여 있어 회전값까지 그대로 옮긴다 */}
      <div className="absolute top-[-664px] right-[-689px] flex max-md:hidden size-[1373px] items-center justify-center">
        <img
          src={glowTopRight}
          alt=""
          className="size-[976px] max-w-none rotate-[-140.81deg]"
        />
      </div>
      <div className="absolute top-[179px] left-[-643px] flex max-md:hidden size-[1469px] items-center justify-center">
        <img
          src={glowLeft}
          alt=""
          className="size-[1044px] max-w-none rotate-[-140.81deg]"
        />
      </div>
      {/* 유리 구슬은 원만 내보내면 검게 나와서 히어로 전체 export에서 잘라 썼다
          테두리가 안 잘리게 사방 8px 여유를 둬서 Figma 원보다 8px씩 크다 */}
      <img
        src={glassLeft}
        alt=""
        className="absolute top-[5px] left-[309px] size-[137px] max-md:hidden"
      />

      {/* 맥북 화면. 테두리 #4a5568은 Figma 디바이스 목업 고유색이라 토큰이 없다
          모바일은 520×337로 줄인다. 화면 위 여백도 같은 비율로 31 → 15 */}
      <div className="absolute top-[311px] left-1/2 h-[337px] w-[520px] -translate-x-1/2 motion-safe:animate-device-rise md:top-[391px] md:h-[744px] md:w-[1147px]">
        <div className="size-full rounded-t-[28px] rounded-b-xs border-2 border-[#4a5568] bg-black pt-[15px] md:pt-[31px]">
          <img
            src={heroScreen}
            alt="Devs 대시보드 화면"
            className="mx-auto h-[292px] w-[491px] object-cover md:h-[645px] md:w-[1083px]"
          />
        </div>
      </div>

      {/* Figma 배경 블러는 채움이 진한 만큼만 먹는다. CSS backdrop-blur는 투명한 곳까지
          똑같이 흐려서, 같은 그라데이션 마스크로 블러가 아래쪽에만 걸리게 한다 */}
      <div className="absolute inset-x-0 top-16 h-[536px] bg-linear-to-b md:h-[936px] from-transparent from-27% to-black/80 to-91%" />
      <div className="absolute inset-x-0 top-16 h-[536px] backdrop-blur-[3px] md:h-[936px] [mask-image:linear-gradient(to_bottom,transparent_27%,black_91%)]" />
      {/* 패드는 오른쪽 구슬이 절반쯤 화면 밖으로 나간다 (Figma 원 right -51 · top 295, 여백 8px만큼 바깥으로) */}
      <img
        src={glassRight}
        alt=""
        className="absolute top-[287px] right-[-59px] size-[189px] max-md:hidden lg:top-[407px] lg:right-[84px]"
      />

      <div className="absolute top-24 left-1/2 flex w-full max-w-[765px] -translate-x-1/2 flex-col gap-1.5 px-5 text-center">
        {/* 제목은 모바일 24 · 패드 40 · PC 48(display-md). 24·40은 디스플레이 스케일 밖이라 값으로 둔다 */}
        <h1 className="text-[24px] leading-[1.2] font-semibold text-white md:text-[40px] lg:text-display-md">
          {HERO_TITLE[0]}
          <br />
          {HERO_TITLE[1]}
        </h1>
        <p className="text-body-sm text-gray-400 md:text-body-lg">
          {HERO_DESCRIPTION[0]} <br className="md:hidden" />
          {HERO_DESCRIPTION[1]}
        </p>
        {/* 로그인은 헤더에 있어 히어로는 시작하기 하나만 둔다
            글 바로 아래 흐름에 둬서 좁은 폭에서 제목이 더 줄바꿈돼도 버튼과 겹치지 않는다
            간격은 Figma 버튼 위치(모바일 245 · 패드·PC 295)에서 글 묶음 끝과 묶음 간격(6)을 뺀 값 */}
        <div className="mt-[37px] md:mt-[64px] lg:mt-[45px]">
          <CtaLink cta="start" location="hero">
            무료로 시작하기
          </CtaLink>
        </div>
      </div>
    </section>
  )
}
