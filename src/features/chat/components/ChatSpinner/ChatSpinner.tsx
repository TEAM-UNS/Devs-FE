import { useEffect, useState } from 'react'
import spinner02 from '@/assets/chat/spinner-02.svg'
import spinner03 from '@/assets/chat/spinner-03.svg'
import spinner04 from '@/assets/chat/spinner-04.svg'
import spinner05 from '@/assets/chat/spinner-05.svg'
import spinner06 from '@/assets/chat/spinner-06.svg'
import spinner07 from '@/assets/chat/spinner-07.svg'
import spinner08 from '@/assets/chat/spinner-08.svg'
import spinner09 from '@/assets/chat/spinner-09.svg'
import spinner10 from '@/assets/chat/spinner-10.svg'
import spinner11 from '@/assets/chat/spinner-11.svg'
import spinner12 from '@/assets/chat/spinner-12.svg'
import spinner13 from '@/assets/chat/spinner-13.svg'

/* 1번 프레임(가운데 큰 점)은 회전 동작과 이어지지 않아, 반복에 넣으면 한 바퀴마다 툭 튀어 보인다.
   2~13번은 위쪽 점에서 시작해 같은 모양으로 끝나 매끄럽게 반복된다 */
const SPINNER_FRAMES = [
  spinner02,
  spinner03,
  spinner04,
  spinner05,
  spinner06,
  spinner07,
  spinner08,
  spinner09,
  spinner10,
  spinner11,
  spinner12,
  spinner13,
] as const

const FRAME_DURATION_MS = 120

/** Figma에서 추출한 프레임을 순서대로 보여주는 응답 대기 표시 */
export function ChatSpinner() {
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFrameIndex(
        (currentIndex) => (currentIndex + 1) % SPINNER_FRAMES.length,
      )
    }, FRAME_DURATION_MS)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div role="status" aria-label="답변 생성 중" className="size-9">
      <img src={SPINNER_FRAMES[frameIndex]} alt="" />
    </div>
  )
}
