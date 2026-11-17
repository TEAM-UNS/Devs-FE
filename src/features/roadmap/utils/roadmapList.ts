import type { RoadmapSummary } from '../types'

/**
 * 가장 최근에 만든 로드맵 — 사이드바 진행도가 이 로드맵 기준이다
 * id는 만든 순서대로 커진다. 목록 정렬과 date의 뜻은 응답에 정해져 있지 않아 기대지 않는다
 */
export function latestRoadmap(
  roadmaps: readonly RoadmapSummary[],
): RoadmapSummary | undefined {
  return roadmaps.reduce<RoadmapSummary | undefined>(
    (latest, roadmap) =>
      !latest || roadmap.roadmapId > latest.roadmapId ? roadmap : latest,
    undefined,
  )
}
