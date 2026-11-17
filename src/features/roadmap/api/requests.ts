import axios from 'axios'
import { del, get, patch, post } from '@/shared/api'
import type {
  Roadmap,
  RoadmapCreateRequest,
  RoadmapCreateResponse,
  RoadmapItemCheckResponse,
  RoadmapStatusResponse,
  RoadmapSummary,
} from '../types'

/** 내 로드맵 목록. 하나도 없을 때 404로 와도 빈 목록으로 본다 — 에러로 올리면 전역 QueryCache가 토스트를 띄운다 */
export async function fetchMyRoadmaps(): Promise<RoadmapSummary[]> {
  try {
    return await get<RoadmapSummary[]>('/roadmap')
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return []
    throw error
  }
}

/** 로드맵 하나의 학습률·Day별 항목 */
export async function fetchRoadmap(roadmapId: number): Promise<Roadmap> {
  return get<Roadmap>(`/roadmap/${roadmapId}`)
}

/** 로드맵 삭제 (204) */
export async function deleteRoadmap(roadmapId: number): Promise<void> {
  return del<void>(`/roadmap/${roadmapId}`)
}

/** 로드맵 생성 요청. 서버는 접수만 하고(202) AI 서버가 주 단위로 채운다 */
export async function createRoadmap(
  body: RoadmapCreateRequest,
): Promise<RoadmapCreateResponse> {
  return post<RoadmapCreateResponse>('/roadmap', body)
}

/** 생성 진행률 조회 */
export async function fetchRoadmapStatus(
  roadmapId: number,
): Promise<RoadmapStatusResponse> {
  return get<RoadmapStatusResponse>(`/roadmap/${roadmapId}/status`)
}

/** 학습 항목 체크·해제 */
export async function checkRoadmapItem(
  itemId: number,
  done: boolean,
): Promise<RoadmapItemCheckResponse> {
  return patch<RoadmapItemCheckResponse>(`/roadmap/items/${itemId}`, { done })
}

/** 하루 완료 + 회고. 그날 항목을 모두 체크해야 한다 (204) */
export async function completeRoadmapDay(
  roadmapId: number,
  dayNo: number,
  retrospect: string,
): Promise<void> {
  return post<void>(`/roadmap/${roadmapId}/days/${dayNo}/complete`, {
    retrospect,
  })
}
