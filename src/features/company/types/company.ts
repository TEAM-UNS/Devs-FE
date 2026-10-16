/* 화면에서 쓰는 모양. 필드 이름은 Swagger 응답(CompanyResponse 등)과 맞춰 두어 연동 때 그대로 넘길 수 있게 한다 */

/** GET /company 목록의 기업 한 개. 로고는 아직 서버에 없다(백엔드 요청 예정) */
export interface Company {
  id: number
  name: string
  description: string
  logoUrl?: string
}

/** 기업별 인기 스택 (GET /company/compare/top-skills) */
export interface CompanyTopSkills {
  companyId: number
  name: string
  skills: { rank: number; skillName: string; percentage: number }[]
}

/** 공통 요구 기술 (GET /company/compare/common-skills) */
export interface CommonSkill {
  skillName: string
  companyCount: number
  totalCompanyCount: number
}

/** 기술스택 언급량 (GET /company/compare/skill-mentions) */
export interface SkillMention {
  skillName: string
  counts: { companyId: number; postingCount: number }[]
}

/** 회사 매칭률 (GET /company/compare/match-rates) */
export interface CompanyMatchRate {
  companyId: number
  name: string
  matchRate: number
}

/** 채용 공고 수 (GET /company/compare/posting-counts) */
export interface CompanyPostingCount {
  companyId: number
  name: string
  postingCount: number
}
