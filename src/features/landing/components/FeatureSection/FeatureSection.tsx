import { Chip } from '@/shared/components/Chip'
import { cn } from '@/shared/utils/cn'
import { FEATURES, type Feature } from '../../constants/content'
import { SectionBadge } from '../SectionBadge'

/**
 * 기능 하나 — PC는 설명과 화면 캡처를 나란히 두고 행마다 좌우가 번갈아 바뀐다
 * 패드·모바일은 설명 위, 캡처 아래로 쌓고 번갈아 두지 않는다 (Figma 2555:12911 · 2555:13332)
 * 가로 배치는 폭이 1280으로 고정이라 xl(1280)부터 한다. 1024~1279는 잘리지 않게 쌓아 둔다
 */
function FeatureRow({
  badge,
  title,
  description,
  tags,
  image,
  imageBoxClass,
  imageFirst,
}: Feature) {
  return (
    <div className="flex flex-col gap-12 xl:flex-row xl:items-center">
      <div
        className={cn(
          'flex flex-1 flex-col gap-12',
          imageFirst && 'xl:order-last',
        )}
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start gap-5">
            <SectionBadge>{badge}</SectionBadge>
            {/* 모바일 24 · 패드 32 · PC 36(display-sm). 좁으면 글자 단위로 끊기지 않게 어절로 줄바꿈 */}
            <h3 className="text-[24px] leading-[1.2] font-semibold break-keep text-white md:text-[32px] lg:text-display-sm">
              {title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
          </div>
          <p className="text-body-lg break-keep text-gray-400">{description}</p>
        </div>
        {/* 모바일 시안에는 기술 칩이 없다 */}
        <ul className="flex flex-wrap gap-3 max-md:hidden">
          {tags.map((tag) => (
            <li key={tag}>
              <Chip icon="#">{tag}</Chip>
            </li>
          ))}
        </ul>
      </div>

      {/* 캡처 위쪽만 보이게 위에 맞춰 자르고, 아래로 갈수록 검게 덮는다 */}
      <div
        className={cn(
          'relative w-full shrink-0 overflow-hidden rounded-sm bg-canvas xl:h-115',
          imageBoxClass,
        )}
      >
        <img
          src={image}
          alt={`${badge} 화면`}
          loading="lazy"
          className="size-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 via-51% to-black" />
      </div>
    </div>
  )
}

/** 기능 소개 4개 */
export function FeatureSection() {
  return (
    <section className="mx-auto mt-[100px] flex w-full flex-col gap-15 px-8 md:gap-30 lg:mt-30 xl:w-[1280px] xl:px-0">
      {FEATURES.map((feature) => (
        <FeatureRow key={feature.badge} {...feature} />
      ))}
    </section>
  )
}
