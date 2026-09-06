import type { MentionBar } from '../../types'

interface MentionChartProps {
  bars: readonly MentionBar[]
}

/*
 * ECharts를 쓰지 않는다. 이 차트에는 축선·격자·툴팁·확대가 없고, 막대 폭(20)과
 * 그룹 폭(80)이 고정이며 값이 다섯 개뿐이다. div로 그리면 캔버스를 띄우지 않아
 * 리포트 청크가 가벼워지고, 주석에 적힌 "아래에서 위로" 진입 애니메이션도
 * height 트랜지션 한 줄로 끝난다. 축·툴팁이 필요해지면 그때 useEChart로 바꾼다.
 */

// 막대 — 폭 20, 위쪽만 radius 2 (Figma 335:2355).
const BAR = 'w-5 rounded-t-xs'

/* 진입 애니메이션은 '이번 주' 막대에만 붙는다 — 지난 주(회색)는 정지 상태다
   (Figma 335:2392 주석 "…(이번 주만)"). 막대가 아래 정렬이라 높이가 자라면 위로 올라간다. */
const CURRENT_BAR = `${BAR} animate-bar-grow motion-reduce:animate-none`

/* 이번 주 막대의 그라데이션. 스톱은 Figma 그대로이고 색은 토큰을 참조한다
   (#e1c4fb=primary-700 · #ce9af7=primary-600 · #aa5ef1=primary-400 · #7726bf=primary-200). */
const CURRENT_STOPS = [
  'var(--color-primary-700) 0%',
  'var(--color-primary-600) 15%',
  'var(--color-primary-400) 58%',
  'var(--color-primary-200) 100%',
].join(', ')

/**
 * 막대 높이에 맞는 그라데이션 각도(deg).
 *
 * 수직(180deg)이 아니다. Figma의 그라데이션 변환은 **정규화 좌표계**에 걸려 있어서,
 * 모든 막대가 같은 변환을 써도 화면상 각도는 막대가 높을수록 더 기운다
 * (20px → 194° · 90px → 228°). CSS 각도는 픽셀 기준이라 막대마다 계산한다.
 *
 * 변환의 기울기는 ∇t=(-0.170, 0.680)이고 막대 폭이 20이므로
 * 세로에서 기운 각 = atan((0.170/20) ÷ (0.680/h)) = atan(h / 80).
 *
 * @param heightPx 막대 높이(px). 플롯 안쪽이 100px이라 값(0~100)이 곧 픽셀 높이다
 */
function gradientAngle(heightPx: number): number {
  return 180 + (Math.atan(heightPx / 80) * 180) / Math.PI
}

// 그룹·라벨이 같은 80px 열을 쓰고 가운데로 모인다 → 막대와 라벨이 항상 맞물린다.
const COLUMN = 'flex w-20 justify-center'

/**
 * 주요 기술 언급량 — 기술별로 지난 주(회색)·이번 주(보라) 막대를 나란히 세운다.
 *
 * @param bars 기술별 지난 주·이번 주 비율(0~100)
 */
export function MentionChart({ bars }: MentionChartProps) {
  return (
    <section className="flex flex-col gap-1.5">
      <header className="flex items-center justify-between gap-4">
        <h3 className="text-body-sm text-gray-1000">주요 기술 언급량</h3>

        <ul className="flex items-center gap-2">
          <li className="flex items-center gap-1.5 text-body-xs text-gray-500">
            <span className="size-1.5 rounded-full bg-element" />
            지난 주
          </li>
          <li className="flex items-center gap-1.5 text-body-xs text-gray-500">
            <span className="size-1.5 rounded-full bg-primary-400" />
            이번 주
          </li>
        </ul>
      </header>

      <div className="flex flex-col gap-1.5">
        {/* 안쪽 100 + 세로 패딩 24 = Figma 박스 124 (335:2355) */}
        <div className="flex h-25 justify-center rounded-sm bg-canvas px-6 py-3 box-content">
          {bars.map(({ name, last, current }) => (
            <div key={name} className={`${COLUMN} items-end gap-2.5`}>
              {/* 값은 높이로만 드러나므로 스크린리더용 문구를 따로 붙인다 */}
              <span
                className={`${BAR} bg-element`}
                style={{ height: `${last}%` }}
                role="img"
                aria-label={`${name} 지난 주 ${last}`}
              />
              <span
                className={CURRENT_BAR}
                style={{
                  height: `${current}%`,
                  backgroundImage: `linear-gradient(${gradientAngle(current).toFixed(1)}deg, ${CURRENT_STOPS})`,
                }}
                role="img"
                aria-label={`${name} 이번 주 ${current}`}
              />
            </div>
          ))}
        </div>

        <ul className="flex justify-center px-6">
          {bars.map(({ name }) => (
            <li
              key={name}
              className={`${COLUMN} truncate text-body-xs text-gray-500`}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
