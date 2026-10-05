import { useEffect, useRef, useState } from 'react'

/**
 * 요소가 화면에 처음 들어온 순간을 알려준다. 진입 애니메이션을 한 번만 틀 때 쓴다
 * 한 번 보이면 다시 false로 돌아가지 않는다 — 스크롤을 오르내릴 때마다 반복되면 산만하다
 *
 * @param threshold 요소가 이만큼 보여야 들어온 것으로 본다 (0~1)
 * @returns 대상에 걸 ref와 진입 여부
 */
export function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const target = ref.current
    if (!target || inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 관찰을 시작할 때 오는 첫 콜백은 조금만 걸쳐도 isIntersecting이 true라 비율도 본다
        if (!entry.isIntersecting || entry.intersectionRatio < threshold) return
        setInView(true)
        observer.disconnect()
      },
      { threshold },
    )
    observer.observe(target)

    return () => observer.disconnect()
  }, [inView, threshold])

  return { ref, inView }
}
