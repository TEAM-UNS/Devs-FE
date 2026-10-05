import { AxiosError, type AxiosResponse } from 'axios'
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

  it('인기 기술 스택도 전공 없이 부를 수 있게 열어 둔다', async () => {
    await fetchPopularTechStack(undefined, 'WEEK', '2026-09-07')

    expect(get).toHaveBeenCalledWith('/report/popular-tech-stack', {
      major_id: undefined,
      period: 'WEEK',
      base_date: '2026-09-07',
    })
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

/** 서버가 그 상태 코드로 응답한 axios 에러 */
const httpError = (status: number) =>
  new AxiosError('failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
  } as AxiosResponse)

describe('최대 상승·하락의 404', () => {
  it.each([
    { name: '최대 상승', call: () => fetchMaxIncrease('2026-09-07') },
    { name: '최대 하락', call: () => fetchMaxDecrease('2026-09-07') },
  ])(
    '$name — 404는 해당 기술이 없다는 뜻이라 null로 돌려준다',
    async ({ call }) => {
      vi.mocked(get).mockRejectedValueOnce(httpError(404))

      await expect(call()).resolves.toBeNull()
    },
  )

  it('404가 아닌 실패는 그대로 던져 전역 에러 토스트가 뜨게 둔다', async () => {
    const error = httpError(500)
    vi.mocked(get).mockRejectedValueOnce(error)

    await expect(fetchMaxIncrease('2026-09-07')).rejects.toBe(error)
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
