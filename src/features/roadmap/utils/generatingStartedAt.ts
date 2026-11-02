/* 생성 진행률 추정의 기준 시각. 서버가 생성 시작 시각을 주지 않아서, 생성 화면을 처음 본 시각을
   로드맵마다 저장해 둔다. 다른 화면에 갔다 오거나 새로고침해도 추정치가 이어진다 */
const keyOf = (roadmapId: number) =>
  `uns-roadmap-generating-started:${roadmapId}`

/** 저장된 시작 시각. 없으면 지금을 저장하고 돌려준다. 저장소를 못 쓰면 지금부터 잰다 */
export function loadGeneratingStartedAt(roadmapId: number): number {
  const now = Date.now()
  try {
    const saved = Number(localStorage.getItem(keyOf(roadmapId)))
    if (saved > 0 && saved <= now) return saved
    localStorage.setItem(keyOf(roadmapId), String(now))
  } catch {
    // 저장소가 막힌 환경(시크릿 모드 등)은 이 화면에서만 잰다
  }
  return now
}

/** 생성이 끝나면(완료·실패) 지운다 */
export function clearGeneratingStartedAt(roadmapId: number): void {
  try {
    localStorage.removeItem(keyOf(roadmapId))
  } catch {
    // 지우지 못해도 다음 생성은 새 로드맵 id라 섞이지 않는다
  }
}
