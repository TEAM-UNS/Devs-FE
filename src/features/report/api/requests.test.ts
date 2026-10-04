import { beforeEach, describe, expect, it, vi } from 'vitest'
import { get } from '@/shared/api/http'
import { reportQueries } from './reportQueries'
import {
  fetchEarliestPostingDate,
  fetchMaxDecrease,
  fetchMaxIncrease,
  fetchPopularTechStack,
  fetchTechMentions,
  fetchWeeklyCollectedCount,
} from './requests'

vi.mock('@/shared/api/http', () => ({
  get: vi.fn(() => Promise.resolve({})),
}))

beforeEach(() => {
  vi.mocked(get).mockClear()
})

describe('주간 리포트 요청', () => {
  it.each([
    {
      name: '가장 많이 찾은 기술 스택 — 경로가 단수다',
      call: () => fetchPopularTechStack(2, 'WEEK', '2026-09-07'),
      path: '/report/popular-tech-stack',
      params: { major_id: 2, period: 'WEEK', base_date: '2026-09-07' },
    },
    {
      name: '최대 상승',
      call: () => fetchMaxIncrease('2026-09-07', 2),
      path: '/report/max-increase',
      params: { base_date: '2026-09-07', major_id: 2 },
    },
    {
      name: '최대 하락',
      call: () => fetchMaxDecrease('2026-09-07', 2),
      path: '/report/max-decrease',
      params: { base_date: '2026-09-07', major_id: 2 },
    },
    {
      name: '언급량',
      call: () => fetchTechMentions('2026-09-07', 2),
      path: '/report/tech-mentions',
      params: { base_date: '2026-09-07', major_id: 2 },
    },
    {
      name: '수집 공고 수 — 전공 필터가 없다',
      call: () => fetchWeeklyCollectedCount('2026-09-07'),
      path: '/report/weekly-collected-count',
      params: { base_date: '2026-09-07' },
    },
  ])('$name', async ({ call, path, params }) => {
    await call()

    expect(get).toHaveBeenCalledWith(path, params)
  })

  it('가장 오래된 공고 날짜는 파라미터 없이 부른다', async () => {
    await fetchEarliestPostingDate()

    expect(get).toHaveBeenCalledWith('/report/earliest-posting-date')
  })

  it('전공을 안 넘기면 major_id를 undefined로 둬 쿼리스트링에서 빠진다', async () => {
    await fetchMaxIncrease('2026-09-07')

    expect(get).toHaveBeenCalledWith('/report/max-increase', {
      base_date: '2026-09-07',
      major_id: undefined,
    })
  })
})

describe('reportQueries', () => {
  it('주차와 전공이 다르면 다른 캐시 키를 쓴다', () => {
    const base = reportQueries.techMentions('2026-09-07', 2).queryKey

    expect(reportQueries.techMentions('2026-08-31', 2).queryKey).not.toEqual(
      base,
    )
    expect(reportQueries.techMentions('2026-09-07', 1).queryKey).not.toEqual(
      base,
    )
    expect(reportQueries.techMentions('2026-09-07').queryKey).not.toEqual(base)
  })
})
