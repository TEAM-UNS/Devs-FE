import type {
  CommonSkill,
  Company,
  CompanyMatchRate,
  CompanyPostingCount,
  CompanyTopSkills,
  SkillMention,
} from './company'

/* 서버 응답 본문. 백엔드 CompanyController 기준 */

/** GET /company — 20개씩, page는 0부터 */
export interface CompanyListResponse {
  companies: Company[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

/** GET /company/compare/top-skills — 기업당 3개 */
export interface CompanyTopSkillListResponse {
  companies: CompanyTopSkills[]
}

/** GET /company/compare/common-skills — 두 곳 이상이 요구한 기술 중 3개 */
export interface CommonSkillListResponse {
  skills: CommonSkill[]
}

/** GET /company/compare/skill-mentions — 언급이 많은 기술 3개 */
export interface SkillMentionListResponse {
  skills: SkillMention[]
}

/** GET /company/compare/match-rates — 로그인한 사용자의 기술 스택 기준 */
export interface CompanyMatchRateListResponse {
  companies: CompanyMatchRate[]
}

/** GET /company/compare/posting-counts */
export interface CompanyPostingCountListResponse {
  companies: CompanyPostingCount[]
}
