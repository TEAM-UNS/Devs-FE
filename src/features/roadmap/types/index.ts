/* 서버 응답(GET /roadmap) 모양 그대로 둔다. API를 붙일 때 목데이터만 바꾸면 되게 */

export interface RoadmapItem {
  itemId: number
  title: string
  description: string
  done: boolean
}

export interface RoadmapDay {
  dayNo: number
  weekNo: number
  locked: boolean
  allItemsDone: boolean
  /** 회고까지 마쳐 그날을 완료했는지 */
  completed: boolean
  retrospect: string | null
  items: RoadmapItem[]
}

export interface Roadmap {
  roadmapId: number
  status: string
  /** 목표 직무 이름 ('frontend') */
  fieldName: string
  summary: string
  /** 0~100 */
  learningRate: number
  days: RoadmapDay[]
}

/** 생성 흐름에서 고르는 직무. 서버 /majors 한 항목과 같은 모양 */
export interface RoadmapMajor {
  id: number
  /** 'FRONTEND' 같은 서버 코드 */
  major: string
  techStacks: { id: number; name: string }[]
}
