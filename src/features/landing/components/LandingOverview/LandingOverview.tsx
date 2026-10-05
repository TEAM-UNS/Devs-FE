import { ClosingCta } from '../ClosingCta'
import { FaqSection } from '../FaqSection'
import { FeatureSection } from '../FeatureSection'
import { HeroSection } from '../HeroSection'
import { LandingFooter } from '../LandingFooter'
import { LandingHeader } from '../LandingHeader'
import { LogoMarquee } from '../LogoMarquee'
import { PainPointSection } from '../PainPointSection'
import { StatsSection } from '../StatsSection'

/**
 * 랜딩 전체 조립 (Figma 818:7664)
 * 디자인이 1440 폭 하나뿐이라 그보다 좁아지면 가로 스크롤로 둔다
 * 배경 원과 로고 띠가 화면 밖까지 뻗어 있어 가로 넘침은 잘라낸다
 * 배경 시작색 #141518은 랜딩에만 쓰여 토큰이 없다
 */
export function LandingOverview() {
  return (
    <div className="relative min-h-full min-w-[1440px] overflow-x-clip bg-linear-to-b from-[#141518] to-black">
      <LandingHeader />
      <main>
        <HeroSection />
        <PainPointSection />
        <StatsSection />
        <FeatureSection />
        <LogoMarquee />
        <ClosingCta />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  )
}
