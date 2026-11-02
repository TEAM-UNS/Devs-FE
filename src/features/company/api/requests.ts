import { get } from '@/shared/api'
import type {
  CommonSkillListResponse,
  CompanyListResponse,
  CompanyMatchRateListResponse,
  CompanyPostingCountListResponse,
  CompanyTopSkillListResponse,
  SkillMentionListResponse,
} from '../types'

const PAGE_SIZE = 20

/** 기업 목록 한 페이지. 검색어가 비면 전체를 id 순으로 */
export function fetchCompanies(
  keyword: string,
  page: number,
): Promise<CompanyListResponse> {
  return get<CompanyListResponse>('/company', {
    keyword: keyword || undefined,
    page,
    size: PAGE_SIZE,
  })
}

/** 비교 API 경로(`/company/compare/{kind}`)별 응답 */
interface CompareResponses {
  'top-skills': CompanyTopSkillListResponse
  'common-skills': CommonSkillListResponse
  'skill-mentions': SkillMentionListResponse
  'match-rates': CompanyMatchRateListResponse
  'posting-counts': CompanyPostingCountListResponse
}

export type CompareKind = keyof CompareResponses

/**
 * 비교 API 5개. 경로만 다르고 고른 기업 id를 받는 모양이 같다
 * axios는 배열을 `company_ids[]=3&company_ids[]=4`로 보내는데 Spring이 이 형식을 못 읽어 쉼표로 잇는다
 */
export function fetchCompare<K extends CompareKind>(
  kind: K,
  ids: readonly number[],
): Promise<CompareResponses[K]> {
  return get<CompareResponses[K]>(`/company/compare/${kind}`, {
    company_ids: ids.join(','),
  })
}
