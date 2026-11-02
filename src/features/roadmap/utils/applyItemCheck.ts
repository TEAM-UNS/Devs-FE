import type { Roadmap, RoadmapItemCheckResponse } from '../types'

/** 체크 응답을 로드맵에 반영한다 — 그 항목, 그날의 전부 완료 여부, 학습률 (원본 불변) */
export function applyItemCheck(
  roadmap: Roadmap,
  { itemId, done, dayAllItemsDone, learningRate }: RoadmapItemCheckResponse,
): Roadmap {
  return {
    ...roadmap,
    learningRate,
    days: roadmap.days.map((day) =>
      day.items.some((item) => item.itemId === itemId)
        ? {
            ...day,
            allItemsDone: dayAllItemsDone,
            items: day.items.map((item) =>
              item.itemId === itemId ? { ...item, done } : item,
            ),
          }
        : day,
    ),
  }
}
