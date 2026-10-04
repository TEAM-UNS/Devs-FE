/*
 * 4단계가 그리는 그룹 모양. 목록 자체는 `GET /majors` 응답에서 만들고(SignupStep4),
 * 여기서는 화면이 기대하는 형태만 정의한다.
 */

export interface TechTag {
  /** 서버 기술 스택 id를 문자열로 담는다 — 선택 스키마가 `string[]`이라 그대로 맞춘다 */
  id: string
  /** 칩 라벨 */
  label: string
}

export interface TechStackGroup {
  /** 서버 전공 id를 문자열로 담는다 */
  majorId: string
  /** 그룹 헤더 라벨 */
  label: string
  /** 선택 가능한 기술 스택 */
  tags: TechTag[]
}
