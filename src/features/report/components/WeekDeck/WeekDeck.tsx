import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react'

interface WeekDeckProps {
  /** 왼쪽에 걸치는 이전 주차 카드 */
  previous: ReactNode
  /** 오른쪽에 걸치는 다음 주차 카드 */
  next: ReactNode
  /**
   * 주차 네비게이터. 넘겨도 다시 마운트되지 않는다 — 화살표에 포커스를 둔 채
   * 연달아 넘길 수 있어야 하기 때문이다.
   */
  header: ReactNode
  /** 직군 필터 칩 행. 카드만 움직이므로 함께 이동하지 않는다 */
  filters: ReactNode
  /** 이번 주차 카드. 넘길 때 옆자리로 나가는 것은 이것뿐이다 */
  children: ReactNode
  /** 카드 아래 안내 문구. 이동하지 않는다 */
  footer: ReactNode
  /** 넘기는 중인 방향. `null`이면 정지 상태다 */
  slidingTo?: -1 | 1 | null
  /** 이동이 끝났을 때 — 이 시점에 주차를 실제로 바꾼다 */
  onSlideEnd?: () => void
  /** 좌우로 스와이프했을 때. 왼쪽으로 밀면 +1(다음), 오른쪽으로 밀면 -1(이전) */
  onSwipe?: (direction: -1 | 1) => void
}

/* ── 자리 실측값 (Figma 335:2517 · 335:2275 · 329:1217) ──────────────────────
   가운데  978x650, 왼쪽 위 = ((무대폭 - 978) / 2, 138)
   이웃    972x682, 왼쪽 위 = 왼쪽(111 - 972, 459) · 오른쪽(무대폭 - 78, 208)
   회전 기준점이 왼쪽 위(origin-top-left)라 이동량은 왼쪽 위 좌표의 차이 그대로다. */
const CARD = { width: 978, height: 650, top: 138 }
const SIDE = { width: 972, height: 682, leftTop: 459, rightTop: 208 }

/** 왼쪽 이웃의 오른쪽 모서리가 무대 안으로 들어온 만큼 */
const LEFT_INSET = 111
/** 오른쪽 이웃의 왼쪽 모서리가 무대 안으로 들어온 만큼 */
const RIGHT_INSET = 78

/* 이웃 카드 안쪽 폭. 박스 폭(972 - 패딩 96)에서 고정해 둔다.
 **박스 크기가 애니메이션으로 변해도 글자는 다시 줄바꿈되지 않게** 하기 위한 값이다. */
const PREVIEW_BODY_WIDTH = SIDE.width - 96

/* 나가는 카드의 크기 배율. 흐름 안에 있는 요소라 width/height를 건드리면 아래 문구가
   밀려난다 — 그래서 이쪽만 transform으로 줄이고, **축마다 다른 배율(비등비)** 을 쓴다.
   들어오는 쪽과 반대의 선택이다. 나가는 카드는 이동하는 내내 블러가 4px까지 짙어지고
   실효 불투명도가 10%까지 떨어져 글자 왜곡이 보이지 않는 반면, 배율을 등비로 맞추면
   옆자리(972x682)보다 36px 짧게 도착해 교체 순간 아래 모서리가 튄다.
   들어오는 카드는 선명해지므로 정반대다 — 그쪽은 배율을 아예 쓰지 않는다. */
const TO_SIDE = { x: SIDE.width / CARD.width, y: SIDE.height / CARD.height }

/**
 * 자리 간 이동량. 무대 폭에 따라 달라져 CSS 변수로 넘긴다.
 *
 * @param deckWidth 무대 폭(px)
 * @param direction 넘기는 방향. +1이면 다음 주차
 */
function slideVars(deckWidth: number, direction: -1 | 1) {
  const cardLeft = (deckWidth - CARD.width) / 2
  const leftSlot = { x: LEFT_INSET - SIDE.width, y: SIDE.leftTop }
  const rightSlot = { x: deckWidth - RIGHT_INSET, y: SIDE.rightTop }

  // 다음(+1)이면 오른쪽 이웃이 들어오고 보던 카드는 왼쪽으로 나간다.
  const from = direction === 1 ? rightSlot : leftSlot
  const to = direction === 1 ? leftSlot : rightSlot

  return {
    incoming: {
      '--slide-x': `${cardLeft - from.x}px`,
      '--slide-y': `${CARD.top - from.y}px`,
      '--slide-w': `${CARD.width}px`,
      '--slide-h': `${CARD.height}px`,
    } as CSSProperties,
    outgoing: {
      '--slide-x': `${to.x - cardLeft}px`,
      '--slide-y': `${to.y - CARD.top}px`,
      '--slide-sx': TO_SIDE.x,
      '--slide-sy': TO_SIDE.y,
      '--slide-rotate': direction === 1 ? '-15deg' : '15deg',
    } as CSSProperties,
    // 반대쪽 이웃은 진행 방향으로 한 자리만큼 더 밀려나며 사라진다.
    leaving: {
      '--slide-x': `${direction === 1 ? -deckWidth : deckWidth}px`,
    } as CSSProperties,
  }
}

/* 스와이프로 인정할 최소 이동 거리(px). 손을 뗄 때만 판정한다(사용자 결정).
   세로 이동이 더 크면 무시한다 — 페이지 세로 스크롤을 뺏지 않기 위해서다. */
const SWIPE_THRESHOLD = 60

/* 드래그를 시작해도 되는 지점인지. 버튼·링크·입력 위에서 시작했다면 그쪽이 우선이다
   (여기서 기본 동작을 막으면 포커스가 가지 않는다). */
const CONTROLS = 'button, a, input, select, textarea, [role="button"]'

const startsOnControl = (target: EventTarget | null) =>
  target instanceof Element && target.closest(CONTROLS) !== null

/* 이웃 카드의 표면. 이번 주 카드와 **다르다** — 채움이 한 단계 밝은 #343a40(element)이고
   테두리·그림자가 없다. 패딩 48은 같아 안쪽 폭이 876이 된다.
   역량 패널도 여기서는 표면과 같은 #343a40이라 함께 덮어쓴다. */
const PREVIEW = [
  'pointer-events-none absolute h-[682px] w-[972px] origin-top-left',
  'overflow-hidden rounded-md bg-element p-12',
  '[&_[data-surface=panel]]:bg-element',
  'opacity-50 blur-[4px]',
].join(' ')

/* 이웃 카드 안의 내용은 표면보다 훨씬 흐리다. Figma는 내용 래퍼에 opacity 0.2를 따로
   걸어 두었고 루트의 0.5와 곱해져 실효 10%가 된다(실제 카드에는 투명 노드가 없다). */
const PREVIEW_BODY = 'opacity-20'

/* 내용 폭을 박스에서 떼어 고정한다 — 박스가 978x650으로 자라는 동안 글자가
   다시 줄바꿈되거나 늘어나지 않는다. 정지 상태의 폭(876)과 같은 값이라 보이는 건 그대로다. */
const PREVIEW_BODY_STYLE = { width: PREVIEW_BODY_WIDTH } as CSSProperties

/* 좌우 이웃 자리. 두 카드는 이 네 값만 다르고 마크업은 같다.
   왼쪽은 오른쪽 모서리가 아니라 **왼쪽**을 고정한다 — 회전·이동 기준점이 왼쪽 위인데
   오른쪽을 고정해 두면 폭이 변할 때 기준점이 따라 움직인다. */
const SLOTS = [
  {
    key: 'previous',
    left: LEFT_INSET - SIDE.width,
    top: SIDE.leftTop,
    rotate: '-rotate-[15deg]',
  },
  {
    key: 'next',
    left: `calc(100% - ${RIGHT_INSET}px)`,
    top: SIDE.rightTop,
    rotate: 'rotate-[15deg]',
  },
] as const

const MOTION_OFF = 'motion-reduce:animate-none'

/* 나가는 카드. 기하만 옮기면 도착하는 순간 겉모습이 툭 바뀌므로, 이웃 자리와 다른 것을
   **전부** 함께 바꾼다 — 표면 색·테두리·그림자, 역량 패널 색, 그리고 내용 밝기.
   내용 밝기(body-dim)를 빼먹으면 겉 투명도와 블러만 맞고 내용만 5배 밝은 채로 도착해,
   교체되는 순간 읽히던 글자가 한 프레임에 얼룩이 된다.
   집는 기준은 태그가 아니라 `data-*` 계약이다 — 태그는 바뀔 수 있다. */
const OUTGOING = [
  'origin-top-left animate-slide-out',
  '[&_[data-surface=card]]:animate-surface-dim',
  '[&_[data-surface=panel]]:animate-panel-dim',
  '[&_[data-card-body]]:animate-body-dim',
  MOTION_OFF,
].join(' ')

/**
 * 주차 카드를 담는 무대 — 이웃 주차 카드가 좌우에 기울어져 걸쳐 있고 바깥은 잘린다.
 *
 * 넘기면 **이웃 카드가 옆자리에서 가운데까지 실제로 이동**한다. 자리마다 위치·기울기·
 * 크기·투명도·블러가 모두 달라(위 실측값) 한 번에 함께 바뀐다. 이동량은 무대 폭에
 * 딸려 있어 폭을 재서 CSS 변수로 넘긴다.
 *
 * 이동이 **끝난 뒤에야** 주차를 바꾼다(`onSlideEnd`). 애니메이션의 끝 모습과 바뀐 뒤의
 * 모습이 같은 자리라 교체되는 순간이 보이지 않는다.
 *
 * @param previous 왼쪽에 걸칠 이전 주차 카드
 * @param next 오른쪽에 걸칠 다음 주차 카드
 * @param header 주차 네비게이터 (이동하지 않는다)
 * @param filters 직군 필터 칩 행 (이동하지 않는다)
 * @param children 이번 주차 카드 (이것만 이동한다)
 * @param footer 카드 아래 안내 문구 (이동하지 않는다)
 * @param slidingTo 넘기는 중인 방향
 * @param onSlideEnd 이동이 끝났을 때
 * @param onSwipe 좌우 스와이프로 주차를 넘길 때
 * @returns 좌우가 잘리는 무대 레이아웃
 */
export function WeekDeck({
  previous,
  next,
  header,
  filters,
  children,
  footer,
  slidingTo = null,
  onSlideEnd,
  onSwipe,
}: WeekDeckProps) {
  const deckRef = useRef<HTMLDivElement>(null)
  const [deckWidth, setDeckWidth] = useState(0)

  /* 자리 간 이동량이 무대 폭에 딸려 있어 재둔다. 창 크기가 바뀌면 다시 잰다. */
  useLayoutEffect(() => {
    const deck = deckRef.current
    if (!deck) return

    const measure = () => setDeckWidth(deck.offsetWidth)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(deck)

    return () => observer.disconnect()
  }, [])

  const vars = slidingTo && deckWidth ? slideVars(deckWidth, slidingTo) : null

  /* 누른 지점과 마지막 위치만 기억한다. 끌리는 동안 상태를 바꾸지 않아 리렌더가 없다. */
  const start = useRef<{ x: number; y: number } | null>(null)
  const last = useRef<{ x: number; y: number } | null>(null)

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (startsOnControl(event.target)) return

    /* 기본 동작(텍스트 선택 시작)을 막는다. 이게 없으면 마우스로 글자 위를 끌 때
       브라우저가 선택 제스처로 가져가며 pointercancel을 던져 스와이프가 성립하지 않는다.
       ⚠️ 대신 카드 위에서 드래그로 텍스트를 선택할 수 없다. */
    event.preventDefault()

    start.current = { x: event.clientX, y: event.clientY }
    last.current = start.current

    /* 포인터를 붙잡아 둔다. 이게 없으면 무대 밖(사이드바·화면 가장자리)에서 손을 뗐을 때
       pointerup이 다른 요소로 가서 스와이프가 통째로 무시된다.
       jsdom에는 이 API가 없어 조용히 넘긴다. */
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // 캡처를 지원하지 않는 환경
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (start.current) last.current = { x: event.clientX, y: event.clientY }
  }

  /* pointerup과 pointercancel을 같이 받는다. 취소되면 좌표가 비어 오므로 마지막 위치를 쓴다. */
  const finishSwipe = () => {
    const from = start.current
    const to = last.current
    start.current = null
    last.current = null
    if (!from || !to || !onSwipe) return

    const dx = to.x - from.x
    const dy = to.y - from.y
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return

    // 왼쪽으로 밀면 오른쪽에 있던 다음 주차가 들어온다.
    onSwipe(dx < 0 ? 1 : -1)
  }

  const incomingSlot = slidingTo === 1 ? 'next' : 'previous'

  const motion = (slot: 'previous' | 'next') => {
    if (!vars) return { style: {}, surface: '', body: '' }

    const isIncoming = slot === incomingSlot
    return {
      style: isIncoming ? vars.incoming : vars.leaving,
      /* 들어오는 카드는 안쪽 역량 패널 색까지 함께 바꿔야 도착할 때 안 튄다. */
      surface: isIncoming
        ? `animate-slide-in [&_[data-surface=panel]]:animate-panel-focus ${MOTION_OFF}`
        : `animate-slide-away ${MOTION_OFF}`,
      body: isIncoming ? `animate-body-focus ${MOTION_OFF}` : '',
    }
  }

  return (
    /* -m-10/p-10: 바깥 여백을 되돌려 잘리는 범위를 콘텐츠 영역 전체로 넓힌다.
       min-h: Figma의 클리핑 프레임(335:2840)이 여백 포함 1200x900, 즉 콘텐츠 영역 전체다.
       touch-pan-y: 세로 스크롤은 브라우저에 맡기고 가로만 우리가 가져간다. */
    <div
      ref={deckRef}
      /* 이동하는 동안은 내용이 바뀌는 중이라고 알린다. 보조기술이 중간 상태를 읽지 않게 하고,
         "넘어가는 중인지"를 밖에서 확인할 수 있는 신호도 된다. */
      aria-busy={slidingTo !== null}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishSwipe}
      onPointerCancel={finishSwipe}
      className="relative -m-10 min-h-[calc(100%+5rem)] touch-pan-y overflow-hidden p-10"
    >
      {SLOTS.map(({ key, left, top, rotate }) => {
        const { style, surface, body } = motion(key)
        return (
          <div
            key={key}
            aria-hidden="true"
            style={{ left, top, ...style }}
            className={`${PREVIEW} ${rotate} ${surface}`}
          >
            <div
              style={PREVIEW_BODY_STYLE}
              className={`${PREVIEW_BODY} ${body}`}
            >
              {key === 'previous' ? previous : next}
            </div>
          </div>
        )
      })}

      {/* 본문은 이웃 카드 위에 온다. 세로 간격은 Figma 335:2835(12) · 335:2836(6) 기준.
          움직이는 것은 카드뿐이라, 나가는 애니메이션도 카드에만 건다 — 칩 행에 걸면
          기준점이 카드 위쪽 44px에 잡혀 이웃 자리에 정확히 닿지 않는다. */}
      <div className="relative mx-auto flex max-w-[978px] flex-col">
        {header}
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-col gap-3">
            {filters}
            <div
              style={vars?.outgoing}
              className={vars ? OUTGOING : undefined}
              onAnimationEnd={(event) => {
                /* 카드 안의 막대·게이지 애니메이션도 animationend를 올려보낸다.
                   내 것만 받지 않으면 한 번 넘길 때 여러 번 불려 주차가 훌쩍 건너뛴다. */
                if (vars && event.target === event.currentTarget) onSlideEnd?.()
              }}
            >
              {children}
            </div>
          </div>

          {footer}
        </div>
      </div>
    </div>
  )
}
