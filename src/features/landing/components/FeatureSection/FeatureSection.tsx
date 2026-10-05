import { Chip } from '@/shared/components/Chip'
import { cn } from '@/shared/utils/cn'
import { FEATURES, type Feature } from '../../constants/content'
import { SectionBadge } from '../SectionBadge'

/** 기능 하나 — 설명과 화면 캡처를 나란히. 행마다 좌우가 번갈아 바뀐다 */
function FeatureRow({
  badge,
  title,
  description,
  tags,
  image,
  imageWidthClass,
  imageFirst,
}: Feature) {
  return (
    <div className="flex items-center gap-12">
      <div
        className={cn(
          'flex flex-1 flex-col gap-12',
          imageFirst && 'order-last',
        )}
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start gap-5">
            <SectionBadge>{badge}</SectionBadge>
            <h3 className="text-display-sm text-white">
              {title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
          </div>
          <p className="text-body-lg text-gray-400">{description}</p>
        </div>
        <ul className="flex flex-wrap gap-3">
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
          'relative h-115 shrink-0 overflow-hidden rounded-sm bg-canvas',
          imageWidthClass,
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
    <section className="mx-auto mt-30 flex w-[1280px] flex-col gap-30">
      {FEATURES.map((feature) => (
        <FeatureRow key={feature.badge} {...feature} />
      ))}
    </section>
  )
}
