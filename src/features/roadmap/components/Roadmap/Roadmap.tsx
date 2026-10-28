import { MOCK_ROADMAP } from '../../constants/mock'
import { RoadmapDetail } from '../RoadmapDetail'

/** 내 로드맵 화면 */
export function Roadmap() {
  // TODO: API 연동 — GET /roadmap. 로드맵이 없으면 생성 흐름(ROUTES.roadmapNew)으로 보낼지 정해야 한다
  return <RoadmapDetail roadmap={MOCK_ROADMAP} />
}
