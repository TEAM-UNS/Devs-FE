import { STATS, type Stat } from '../../constants/content'
import { useCountUp } from '../../hooks/useCountUp'
import { useInView } from '../../hooks/useInView'

/** 수치 카드 하나. 화면에 들어오면 숫자가 0부터 올라간다 (Figma 818:7730 주석) */
function StatCard({ label, value, start }: Stat & { start: boolean }) {
  const current = useCountUp(value, start)

  return (
    <div className="flex h-38 flex-1 flex-col items-center justify-center gap-1 rounded-md bg-element">
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
    <section ref={ref} className="mt-40 bg-gray-50 p-20">
      <div className="mx-auto flex max-w-[1280px] items-center gap-12">
        <h2 className="text-h1 whitespace-nowrap text-white">
          그래서,
          <br />
          Devs를
          <br />
          사용해야 합니다.
        </h2>
        <div className="flex flex-1 gap-4">
          {STATS.map((stat, index) => (
            // 1·3번 라벨이 같아 라벨을 키로 쓸 수 없다
            <StatCard key={index} {...stat} start={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
