import heroScreen from '@/assets/landing/hero-screen.webp'
import glowTopRight from '@/assets/landing/glow-1.svg'
import glowLeft from '@/assets/landing/glow-2.svg'
import glassLeft from '@/assets/landing/glass-left.webp'
import glassRight from '@/assets/landing/glass-right.webp'
import { HERO_DESCRIPTION, HERO_TITLE } from '../../constants/content'
import { CtaLink } from '../CtaLink'

/**
 * 첫 화면 — 카피·CTA와 맥북 속 대시보드
 * 맥북 아래쪽은 섹션 높이(1000)에서 잘리고 위로 깔린 그라데이션에 묻히는 게 디자인이다
 */
export function HeroSection() {
  return (
    <section className="relative h-[1000px] overflow-hidden bg-black">
      {/* 배경 원은 Figma에서 회전된 채 놓여 있어 회전값까지 그대로 옮긴다 */}
      <div className="absolute top-[-664px] right-[-689px] flex size-[1373px] items-center justify-center">
        <img
          src={glowTopRight}
          alt=""
          className="size-[976px] max-w-none rotate-[-140.81deg]"
        />
      </div>
      <div className="absolute top-[179px] left-[-643px] flex size-[1469px] items-center justify-center">
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
        className="absolute top-[5px] left-[309px] size-[137px]"
      />

      {/* 맥북 화면. 테두리 #4a5568은 Figma 디바이스 목업 고유색이라 토큰이 없다 */}
      <div className="absolute top-[391px] left-1/2 h-[744px] w-[1147px] -translate-x-1/2 motion-safe:animate-device-rise">
        <div className="size-full rounded-t-[28px] rounded-b-xs border-2 border-[#4a5568] bg-black pt-[31px]">
          <img
            src={heroScreen}
            alt="Devs 대시보드 화면"
            className="mx-auto h-[645px] w-[1083px] object-cover"
          />
        </div>
      </div>

      {/* Figma 배경 블러는 채움이 진한 만큼만 먹는다. CSS backdrop-blur는 투명한 곳까지
          똑같이 흐려서, 같은 그라데이션 마스크로 블러가 아래쪽에만 걸리게 한다 */}
      <div className="absolute inset-x-0 top-16 h-[936px] bg-linear-to-b from-transparent from-27% to-black/80 to-91%" />
      <div className="absolute inset-x-0 top-16 h-[936px] backdrop-blur-[3px] [mask-image:linear-gradient(to_bottom,transparent_27%,black_91%)]" />
      <img
        src={glassRight}
        alt=""
        className="absolute top-[407px] right-[84px] size-[189px]"
      />

      <div className="absolute top-24 left-1/2 flex w-[765px] -translate-x-1/2 flex-col gap-1.5 text-center">
        {/* 56px는 디스플레이 스케일(64·48) 사이 값이라 토큰이 없다 */}
        <h1 className="text-[56px] leading-[1.2] font-semibold text-white">
          {HERO_TITLE[0]}
          <br />
          {HERO_TITLE[1]}
        </h1>
        <p className="text-body-lg text-gray-400">{HERO_DESCRIPTION}</p>
      </div>
      <div className="absolute top-[295px] left-1/2 flex -translate-x-1/2 gap-3">
        <CtaLink cta="login" location="hero" variant="outline">
          로그인
        </CtaLink>
        <CtaLink cta="signup" location="hero">
          무료로 시작하기
        </CtaLink>
      </div>
    </section>
  )
}
