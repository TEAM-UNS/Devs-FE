import type { RoadmapStatus } from '../types'

/** 서버가 아직 로드맵을 만드는 중인지 */
export function isGenerating(status: RoadmapStatus): boolean {
  return status === 'pending' || status === 'generating'
}
