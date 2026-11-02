import { cn } from '@/shared/utils/cn'
import type { Retrospect } from '../../types'
import { RetrospectCard } from '../RetrospectCard'

interface RetrospectRowProps {
  readonly retrospects: readonly Retrospect[]
  /** 'right'면 왼쪽→오른쪽으로 흐른다 */
  readonly direction: 'left' | 'right'
  /** 줄마다 출발 위치를 어긋나게 하는 비율 (0~1) */
  readonly offset: number
  readonly onOpen: (retrospect: Retrospect) => void
  /** 내 회고 — 제목을 '내 로드맵'으로 부르고 좋아요는 개수만 보여준다 */
  readonly mine?: boolean
}

/* 한 바퀴 절반(원본 묶음)이 화면(1196px)보다 짧으면 끝에서 빈 칸이 보인다
   카드 한 장 + 간격 = 392px라 4장이면 넘는다 */
const MIN_CARDS_PER_HALF = 4
// 카드 한 장이 지나가는 시간. 디자인에 값이 없어 '느리게'(Figma 주석)에 맞춰 정한 임시 값
const SECONDS_PER_CARD = 8

/**
 * 흐르는 회고 한 줄 — 랜딩 로고 띠(LogoMarquee)와 같은 방식
 * 묶음을 두 번 이어 붙이고 절반만큼 옮겨 이음매 없이 돈다. 마우스를 올리면 멈춘다
 * 끝의 pr-8은 마지막 카드 뒤 간격 — 없으면 절반 지점이 간격 하나만큼 어긋나 튄다
 */
export function RetrospectRow({
  retrospects,
  direction,
  offset,
  onOpen,
  mine,
}: RetrospectRowProps) {
  const repeat = Math.ceil(MIN_CARDS_PER_HALF / retrospects.length)
  const half = Array.from({ length: repeat }, () => retrospects).flat()
  const duration = half.length * SECONDS_PER_CARD

  return (
    <ul
      className={cn(
        'flex w-max gap-8 pr-8 hover:[animation-play-state:paused]',
        direction === 'right'
          ? 'motion-safe:animate-marquee-right'
          : 'motion-safe:animate-marquee-left',
      )}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${-duration * offset}s`,
      }}
    >
      {[...half, ...half].map((retrospect, index) => (
        <li key={index}>
          {/* 같은 회고가 여러 번 놓인다. inert는 클릭까지 막는데, 오른쪽으로 흐르는 줄은
              복사본부터 화면에 보여서 처음엔 아무 카드도 안 눌린다 → 복사본은 읽기·Tab에서만 뺀다 */}
          <RetrospectCard
            retrospect={retrospect}
            onOpen={() => onOpen(retrospect)}
            duplicate={index >= retrospects.length}
            mine={mine}
          />
        </li>
      ))}
    </ul>
  )
}
