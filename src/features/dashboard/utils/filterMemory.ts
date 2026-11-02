import type { CompanySize, RisingPeriod } from '../types'
import { COMPANY_SIZES, RISING_PERIODS } from './dashboardLabels'

/** 대시보드 필터 세 개. 전공이 없으면 전체 집계 */
export interface DashboardFilters {
  majorId?: number
  companySize: CompanySize
  period: RisingPeriod
}

/** 지금까지의 기본값 — 실험의 A */
export const DEFAULT_FILTERS: DashboardFilters = {
  majorId: undefined,
  companySize: 'STARTUP',
  period: 'MONTH',
}

/* 기기별로 마지막 선택을 남긴다. 로그인과 상관없이 같은 기기끼리 비교하는 실험이라 계정에 붙이지 않는다 */
const STORAGE_KEY = 'uns-dashboard-filters'

const isCompanySize = (value: unknown): value is CompanySize =>
  COMPANY_SIZES.some((size) => size.value === value)

const isPeriod = (value: unknown): value is RisingPeriod =>
  RISING_PERIODS.some((period) => period.value === value)

/**
 * 저장해 둔 마지막 선택. 없거나 모양이 어긋나면(값이 바뀐 옛 저장분 등) null
 * 전공 id가 지금 목록에 있는지는 목록을 받은 쪽에서 확인한다
 */
export function loadFilters(): DashboardFilters | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as Record<string, unknown>
    if (!isCompanySize(saved.companySize) || !isPeriod(saved.period)) {
      return null
    }
    return {
      majorId: typeof saved.majorId === 'number' ? saved.majorId : undefined,
      companySize: saved.companySize,
      period: saved.period,
    }
  } catch {
    return null
  }
}

/** 마지막 선택을 남긴다. 저장소를 못 쓰는 환경이면 조용히 넘어간다 */
export function saveFilters(filters: DashboardFilters): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
  } catch {
    // 시크릿 모드 등. 기억하지 못할 뿐 화면은 그대로 돈다
  }
}
