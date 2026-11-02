/* 하루·로드맵 완료 축하 컨페티. Figma에는 연출이 없어 브랜드 보라 계열로 정했다
   로드맵 화면에서만 쓰므로 누를 때 불러와 초기 번들에 넣지 않는다 */

// primary-400·500·600·700 + 흰색
const COLORS = ['#aa5ef1', '#bc72f4', '#ce9af7', '#e1c4fb', '#ffffff']

/** 하루를 마쳤을 때 짧게 한 번, 로드맵을 끝냈을 때(finale) 양옆에서 길게 터뜨린다 */
export async function celebrate(finale: boolean): Promise<void> {
  // 움직임 줄이기 설정이면 불러오지도 않는다
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  /* 연출이 실패해도 하루 완료는 이미 끝났다. 배포 직후 옛 청크가 없어 불러오기에 실패하는 경우
     에러를 올리지 않고 조용히 넘긴다 */
  const loaded = await import('canvas-confetti').catch(() => null)
  if (!loaded) return
  const confetti = loaded.default
  const base = { colors: COLORS }

  if (!finale) {
    void confetti({
      ...base,
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    })
    return
  }

  const end = Date.now() + 1500
  const frame = () => {
    void confetti({
      ...base,
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
    })
    void confetti({
      ...base,
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
  void confetti({
    ...base,
    particleCount: 160,
    spread: 100,
    startVelocity: 45,
    origin: { y: 0.55 },
  })
}
