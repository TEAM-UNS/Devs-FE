import { cn } from '@/shared/utils/cn'
import { COMPANY_LOGOS } from '../../constants/content'
import { SectionBadge } from '../SectionBadge'

// 한 줄 = 로고 12개 × 4. 앞 절반과 뒤 절반이 같아야 -50% 이동이 이음매 없이 반복된다
const TRACK = Array.from({ length: 4 }, () => COMPANY_LOGOS).flat()

interface LogoRowProps {
  /** 'right'면 왼쪽→오른쪽, 'left'면 오른쪽→왼쪽으로 흐른다 */
  direction: 'left' | 'right'
}

/**
 * 로고 한 줄
 * 호버하면 그 줄이 멈추고 가리킨 로고만 딤이 걷힌다 (Figma 818:7811 주석)
 * 끝의 pr-6은 마지막 로고 뒤 간격 — 이게 없으면 절반 지점이 간격 하나만큼 어긋나 이음매가 튄다
 */
function LogoRow({ direction }: LogoRowProps) {
  return (
    <ul
      className={cn(
        'flex w-max gap-6 pr-6 hover:[animation-play-state:paused]',
        direction === 'right'
          ? 'motion-safe:animate-marquee-right'
          : 'motion-safe:animate-marquee-left',
      )}
    >
      {TRACK.map((logo, index) => (
        <li
          key={index}
          className="group relative size-16 shrink-0 overflow-hidden rounded-sm"
        >
          <img src={logo} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-black/45 group-hover:opacity-0 motion-safe:transition-opacity motion-safe:duration-fast motion-safe:ease-standard" />
        </li>
      ))}
    </ul>
  )
}

/** 분석 중인 기업 로고 띠 */
export function LogoMarquee() {
  return (
    <section className="mt-[220px] flex flex-col items-center">
      <div className="flex w-[587px] flex-col items-center gap-8 text-center">
        <SectionBadge className="font-normal">
          네카라쿠배부터 유니콘 스타트업까지
        </SectionBadge>
        <div className="flex flex-col gap-2">
          <h2 className="text-h1 text-white">
            <span className="text-primary-500">120개 이상</span> IT 기업의
            실시간 기술 스택 분석 중
          </h2>
          <p className="text-body-md text-gray-400">
            내가 목표로 하는 기업의 최신 채용 스택과 내 매칭률을 지금
            확인해보세요.
          </p>
        </div>
      </div>
      {/* 로고는 이름 없이 그림만 있어 읽어줄 정보가 없다. 카피가 내용을 대신한다 */}
      <div
        className="mt-[67px] flex w-full flex-col gap-6 overflow-hidden"
        aria-hidden="true"
      >
        <LogoRow direction="right" />
        <LogoRow direction="left" />
      </div>
    </section>
  )
}
