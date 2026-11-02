import { useEffect, useRef } from 'react'

/**
 * 목록 끝에 둔 요소가 보일 때마다 onReach를 부른다. 무한 스크롤의 다음 페이지 요청용
 * 랜딩의 useInView는 한 번 보이면 끝이라 여러 번 불러야 하는 여기엔 맞지 않는다
 *
 * @param onReach 끝이 보였을 때 할 일
 * @param enabled false면 관찰하지 않는다 (다음 페이지가 없거나 받는 중일 때)
 * @returns 목록 끝 요소에 걸 ref
 */
export function useReachEnd<T extends Element>(
  onReach: () => void,
  enabled: boolean,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const target = ref.current
    if (!target || !enabled) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onReach()
    })
    observer.observe(target)

    return () => observer.disconnect()
  }, [onReach, enabled])

  return ref
}
