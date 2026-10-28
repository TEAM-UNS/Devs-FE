import axios from 'axios'
import { get, patch, post } from '@/shared/api'
import type {
  Roadmap,
  RoadmapCreateRequest,
  RoadmapCreateResponse,
  RoadmapItemCheckResponse,
  RoadmapStatusResponse,
} from '../types'

/** 내 로드맵 조회. 아직 만들지 않았으면(404) null — 에러로 올리면 전역 QueryCache가 토스트를 띄운다 */
export async function fetchMyRoadmap(): Promise<Roadmap | null> {
  try {
    return await get<Roadmap>('/roadmap')
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

/** 로드맵 생성 요청. 서버는 접수만 하고(202) AI 서버가 주 단위로 채운다. 기존 로드맵은 지워진다 */
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
  dayNo: number,
  retrospect: string,
): Promise<void> {
  return post<void>(`/roadmap/days/${dayNo}/complete`, { retrospect })
}
