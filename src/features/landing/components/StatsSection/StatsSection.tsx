import { STATS, type Stat } from '../../constants/content'
import { useCountUp } from '../../hooks/useCountUp'
import { useInView } from '../../hooks/useInView'

/**
 * 수치 카드 하나. 화면에 들어오면 숫자가 0부터 올라간다 (Figma 818:7730 주석)
 * 모바일은 왼쪽 정렬 세로, 패드는 라벨·숫자를 한 줄로, PC는 가운데 세로 (2555:13316 · 2555:12781)
 */
function StatCard({ label, value, start }: Stat & { start: boolean }) {
  const current = useCountUp(value, start)

  return (
    <div className="flex h-[123px] flex-col justify-center gap-3 rounded-md bg-element px-8 md:h-14 md:flex-row md:items-center md:px-0 lg:h-38 lg:flex-1 lg:flex-col lg:gap-1">
      <p className="text-body-md font-semibold text-gray-400">{label}</p>
      {/* 올라가는 숫자는 스크린리더에 매 프레임 읽히지 않게 숨기고 최종값만 읽힌다 */}
      <p className="text-h2 text-white tabular-nums">
        <span aria-hidden="true">{current.toLocaleString()}+ 개</span>
        <span className="sr-only">{value.toLocaleString()}+ 개</span>
      </p>
    </div>
  )
}

/** "그래서, Devs를 사용해야 합니다" — 서비스 규모 수치 */
export function StatsSection() {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      className="mt-[100px] bg-gray-50 px-8 py-12 md:p-20 lg:mt-40"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 md:flex-row md:items-center">
        <h2 className="text-h1 whitespace-nowrap text-white">
          그래서,
          <br />
          Devs를
          <br />
          사용해야 합니다.
        </h2>
        <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          {STATS.map((stat, index) => (
            // 1·3번 라벨이 같아 라벨을 키로 쓸 수 없다
            <StatCard key={index} {...stat} start={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
