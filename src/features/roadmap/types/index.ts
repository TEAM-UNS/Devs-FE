/* 서버 응답·요청 모양 그대로 둔다 (Devs-BE roadmap/presentation/dto) */

/** pending·generating = 만드는 중, failed = AI 서버 요청 실패 */
export type RoadmapStatus = 'pending' | 'generating' | 'completed' | 'failed'

export interface RoadmapItem {
  itemId: number
  /** 잠긴 날의 항목은 내용 없이 id만 온다 */
  title: string | null
  description: string | null
  done: boolean
}

export interface RoadmapDay {
  dayNo: number
  weekNo: number
  locked: boolean
  allItemsDone: boolean
  /** 회고까지 마쳐 그날을 완료했는지. 완료한 날은 체크를 바꿀 수 없다 */
  completed: boolean
  retrospect: string | null
  items: RoadmapItem[]
}

/** GET /roadmap. 만드는 중이거나 실패했으면 days는 빈 배열 */
export interface Roadmap {
  roadmapId: number
  status: RoadmapStatus
  /** 목표 직무 한글 이름('백엔드'). 직무가 지워졌으면 null */
  fieldName: string | null
  summary: string | null
  /** 0~100 */
  learningRate: number
  days: RoadmapDay[]
}

/** POST /roadmap 본문 */
export interface RoadmapCreateRequest {
  majorId: number
  skillIds: number[]
  targetWeeks: number
  additionalComment?: string
}

/** POST /roadmap 응답 (202) */
export interface RoadmapCreateResponse {
  roadmapId: number
  status: RoadmapStatus
}

/** GET /roadmap/{roadmapId}/status */
export interface RoadmapStatusResponse {
  roadmapId: number
  status: RoadmapStatus
  generatedWeeks: number
  targetWeeks: number
  /** 0~100 */
  progress: number
  errorMessage: string | null
}

/** PATCH /roadmap/items/{itemId} 응답 */
export interface RoadmapItemCheckResponse {
  itemId: number
  done: boolean
  dayAllItemsDone: boolean
  learningRate: number
}
