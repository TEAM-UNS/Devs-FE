import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useToastStore } from '@/shared/stores/useToastStore'
import { renderWithQuery } from '@/test/renderWithQuery'
import { WeeklyReport } from './WeeklyReport'

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }))
vi.mock('@/shared/analytics', () => ({ trackEvent }))

const notFound = () =>
  new AxiosError('not found', 'ERR_BAD_REQUEST', undefined, undefined, {
    status: 404,
  } as AxiosResponse)

/* 상황별로 바꿔 끼우는 응답. 기본은 전부 데이터가 있는 주다 */
let earliestPostingDate: string | null = '2026-01-05'
let maxIncrease: () => Promise<unknown> = () =>
  Promise.resolve({ skillId: 1, skillName: 'Next.js', changeRate: 74.2 })

/* 경로를 하나도 빠짐없이 나열하고 나머지는 거부한다 — 남는 경로에 아무 응답이나 주면
   요청 경로가 틀려도 통과한다 */
vi.mock('@/shared/api/http', () => ({
  get: vi.fn((path: string) => {
    switch (path) {
      case '/user/my':
        return Promise.resolve({
          name: '홍길동',
          email: 'a@b.c',
          personalHistory: 'JUNIOR',
          majors: [
            { majorId: 2, majorName: '프론트엔드' },
            { majorId: 5, majorName: '백엔드' },
          ],
          techStacks: [],
        })
      case '/report/earliest-posting-date':
        return Promise.resolve({ earliestPostingDate })
      case '/report/popular-tech-stack':
        return Promise.resolve({
          majorId: 2,
          period: 'WEEK',
          baseDate: '2026-07-06',
          items: [
            {
              rank: 1,
              techStackId: 3,
              name: 'TypeScript',
              searchCount: 3123,
              previousSearchCount: 3091,
              changeCount: 32,
              changeRate: 1,
              trend: 'UP',
            },
          ],
        })
      case '/report/max-increase':
        return maxIncrease()
      case '/report/max-decrease':
        return Promise.resolve({
          skillId: 2,
          skillName: 'jQuery',
          changeRate: -12.5,
        })
      case '/report/tech-mentions':
        return Promise.resolve({
          mentions: [{ name: 'JavaScript', previous: 80, current: 100 }],
        })
      case '/report/weekly-collected-count':
        return Promise.resolve({ count: 19283 })
      default:
        return Promise.reject(new Error(`요청하지 않아야 할 경로: ${path}`))
    }
  }),
  post: vi.fn(),
}))

async function requestsTo(path: string) {
  const { get } = await import('@/shared/api/http')
  return vi
    .mocked(get)
    .mock.calls.filter(([called]) => called === path)
    .map(([, params]) => params as Record<string, unknown>)
}

/** 지금 주소의 쿼리스트링을 화면에 적어 둔다 — URL 반영을 확인하는 창구 */
function SearchProbe() {
  return <output data-testid="search">{useLocation().search}</output>
}

function renderReport(entry = '/report') {
  return renderWithQuery(
    <MemoryRouter initialEntries={[entry]}>
      <WeeklyReport />
      <SearchProbe />
    </MemoryRouter>,
  )
}

const search = () => screen.getByTestId('search').textContent

/** 가운데 카드. 이웃 카드는 같은 내용을 흐리게 그리므로 범위를 좁힌다 */
const currentCard = () =>
  within(document.querySelector('[data-surface=card]') as HTMLElement)

/** 선택된 칩의 라벨. 토글 칩은 `aria-pressed`로 선택을 드러낸다. */
function selectedChip() {
  return screen
    .getAllByRole('button', { pressed: true })
    .map((chip) => chip.textContent)
}

describe('WeeklyReport', () => {
  /* 주차 라벨은 '지금'에서 계산되는데 컴포넌트는 기준 시각을 받지 않으므로
     (weekRangeAt의 now 인자는 내부 호출까지 닿지 않는다) 여기서는 시계를 고정한다.
     Date만 가짜로 바꾼다 — setTimeout·rAF까지 가로채면 카드 이동(600ms)이 멈춘다.
     기준이 로컬 달력이라 날짜도 로컬 성분으로 만든다. 07-08(수) 정오가 속한 주는
     07-06(월)에 시작한다. */
  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 6, 8, 12))
    earliestPostingDate = '2026-01-05'
    maxIncrease = () =>
      Promise.resolve({ skillId: 1, skillName: 'Next.js', changeRate: 74.2 })
    useToastStore.setState({ toasts: [] })
    const { get } = await import('@/shared/api/http')
    vi.mocked(get).mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('주차·날짜 범위·전공 필터·푸터 문구를 렌더링한다', async () => {
    renderReport()

    expect(
      screen.getByRole('heading', { name: '7월 2주차' }),
    ).toBeInTheDocument()
    expect(screen.getByText('2026.07.06 ~ 2026.07.12')).toBeInTheDocument()

    // 칩은 '전체' + 내 전공(GET /user/my)이다
    for (const label of ['전체', '프론트엔드', '백엔드']) {
      expect(
        await screen.findByRole('button', { name: label }),
      ).toBeInTheDocument()
    }

    // 수집 건수는 천 단위 구분자를 붙여 보여준다.
    expect(
      await screen.findByText(/19,283개의 공고를 분석한 결과입니다/),
    ).toBeInTheDocument()
  })

  it('기본 주차는 이번 주이고 그 주 월요일을 base_date로 보낸다', async () => {
    renderReport()

    await waitFor(async () =>
      expect(await requestsTo('/report/weekly-collected-count')).toContainEqual(
        { base_date: '2026-07-06' },
      ),
    )
  })

  it('전공 필터는 처음에 전체가 선택돼 있고 하나만 선택되며 URL에 남는다', async () => {
    renderReport()

    expect(selectedChip()).toEqual(['전체'])

    await userEvent.click(
      await screen.findByRole('button', { name: '프론트엔드' }),
    )

    // 새로 고른 것만 남는다 — 다중 선택이 아니다.
    expect(selectedChip()).toEqual(['프론트엔드'])
    expect(search()).toBe('?major=2')

    // 전체로 돌아가면 쿼리에서 빠진다
    await userEvent.click(screen.getByRole('button', { name: '전체' }))
    expect(search()).toBe('')
  })

  it('전체에서는 major_id 없이, 전공을 고르면 major_id로 인기 기술 스택을 부른다', async () => {
    renderReport()

    await currentCard().findByText('Next.js')
    expect(await requestsTo('/report/popular-tech-stack')).toContainEqual({
      major_id: undefined,
      period: 'WEEK',
      base_date: '2026-07-06',
    })

    await userEvent.click(screen.getByRole('button', { name: '프론트엔드' }))

    expect(await currentCard().findByText('TypeScript')).toBeInTheDocument()
    expect(await requestsTo('/report/popular-tech-stack')).toContainEqual({
      major_id: 2,
      period: 'WEEK',
      base_date: '2026-07-06',
    })
    expect(await requestsTo('/report/tech-mentions')).toContainEqual({
      base_date: '2026-07-06',
      major_id: 2,
    })
  })

  it('최대 상승이 404면 에러 없이 그 카드만 빠지고 나머지는 보인다', async () => {
    maxIncrease = () => Promise.reject(notFound())
    renderReport()

    expect(await currentCard().findByText('jQuery')).toBeInTheDocument()
    expect(currentCard().getByText('JavaScript')).toBeInTheDocument()
    expect(
      currentCard().queryByText('이번주 최대 상승'),
    ).not.toBeInTheDocument()
    expect(useToastStore.getState().toasts).toEqual([])
  })

  it('한 구역이 늦어도 다른 구역은 먼저 보인다', async () => {
    maxIncrease = () => new Promise(() => {}) // 영영 도착하지 않는다
    renderReport()

    expect(await currentCard().findByText('jQuery')).toBeInTheDocument()
    expect(currentCard().queryByText('Next.js')).not.toBeInTheDocument()
  })

  it('URL 쿼리의 주차와 전공으로 시작한다', async () => {
    renderReport('/report?week=-1&major=5')

    expect(
      screen.getByRole('heading', { name: '6월 5주차' }),
    ).toBeInTheDocument()
    await waitFor(() => expect(selectedChip()).toEqual(['백엔드']))
  })

  it.each(['?week=abc', '?week=3', '?week=-999'])(
    '잘못된 주차(%s)는 이번 주로 본다',
    async (query) => {
      renderReport(`/report${query}`)

      // 하한 밖(-999)은 가장 오래된 공고 날짜가 도착해야 판단할 수 있다
      await waitFor(() =>
        expect(
          screen.getByRole('heading', { name: '7월 2주차' }),
        ).toBeInTheDocument(),
      )
    },
  )

  it('내 전공이 아닌 id는 전체로 본다', async () => {
    renderReport('/report?major=99')

    await screen.findByRole('button', { name: '프론트엔드' })
    expect(selectedChip()).toEqual(['전체'])
  })

  it('이웃 카드도 자기 주차로 요청하고, 갈 수 없는 미래 주차는 요청하지 않는다', async () => {
    renderReport()

    await waitFor(async () =>
      expect(await requestsTo('/report/tech-mentions')).toContainEqual({
        base_date: '2026-06-29',
        major_id: undefined,
      }),
    )
    expect(
      (await requestsTo('/report/tech-mentions')).map(
        ({ base_date }) => base_date,
      ),
    ).not.toContain('2026-07-13')
  })

  it('이전 주차로 넘기면 주차와 날짜가 함께 바뀐다', async () => {
    renderReport()

    await userEvent.click(screen.getByRole('button', { name: '이전 주차' }))

    // 카드가 옆자리로 옮겨간 뒤에야 주차가 바뀐다.
    expect(
      await screen.findByRole('heading', { name: '6월 5주차' }),
    ).toBeInTheDocument()
    expect(screen.getByText('2026.06.29 ~ 2026.07.05')).toBeInTheDocument()
    // 주차도 URL에 남아 뒤로가기·새로고침이 그 주를 다시 보여준다
    await waitFor(() => expect(search()).toBe('?week=-1'))
  })

  it('주차를 넘기면 방향과 이동한 주차를 이벤트로 남긴다', async () => {
    trackEvent.mockClear()
    renderReport()

    await userEvent.click(screen.getByRole('button', { name: '이전 주차' }))

    expect(trackEvent).toHaveBeenCalledWith('Report Week Changed', {
      direction: 'previous',
      week_offset: -1,
    })
  })

  it('가장 최근 주차에서는 다음으로 넘어갈 수 없다', () => {
    renderReport()

    // 아직 끝나지 않은 주는 집계가 없다.
    expect(screen.getByRole('button', { name: '다음 주차' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '이전 주차' })).toBeEnabled()
  })

  it('연달아 넘겨도 화살표의 포커스를 잃지 않는다', async () => {
    const { container } = renderReport()
    const settled = () =>
      waitFor(() =>
        expect(container.querySelector('div.touch-pan-y')).toHaveAttribute(
          'aria-busy',
          'false',
        ),
      )

    /* 넘길 때마다 본문은 다시 마운트되지만 주차 네비는 그대로 남아야 한다.
       네비까지 함께 마운트되면 키보드로 연달아 넘길 수 없다. */
    const previous = screen.getByRole('button', { name: '이전 주차' })
    previous.focus()

    await userEvent.click(previous)
    await settled()
    await userEvent.click(previous)
    await settled()

    expect(
      screen.getByRole('heading', { name: '6월 4주차' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '이전 주차' })).toHaveFocus()
  })

  it('가로로 충분히 밀면 주차가 넘어간다', async () => {
    const { container } = renderReport()
    const deck = container.querySelector('div.touch-pan-y') as HTMLElement

    // 오른쪽으로 밀면 왼쪽에 있던 이전 주차가 들어온다.
    fireEvent.pointerDown(deck, { clientX: 200, clientY: 300 })
    fireEvent.pointerMove(deck, { clientX: 320, clientY: 300 })
    fireEvent.pointerUp(deck, { clientX: 320, clientY: 300 })

    expect(
      await screen.findByRole('heading', { name: '6월 5주차' }),
    ).toBeInTheDocument()
  })

  it('조금만 밀거나 세로로 더 많이 움직이면 넘어가지 않는다', () => {
    const { container } = renderReport()
    const deck = container.querySelector('div.touch-pan-y') as HTMLElement

    // 임계값(60px) 미만
    fireEvent.pointerDown(deck, { clientX: 200, clientY: 300 })
    fireEvent.pointerMove(deck, { clientX: 240, clientY: 300 })
    fireEvent.pointerUp(deck, { clientX: 240, clientY: 300 })
    expect(
      screen.getByRole('heading', { name: '7월 2주차' }),
    ).toBeInTheDocument()

    // 세로 이동이 더 크면 세로 스크롤로 본다
    fireEvent.pointerDown(deck, { clientX: 200, clientY: 300 })
    fireEvent.pointerMove(deck, { clientX: 300, clientY: 500 })
    fireEvent.pointerUp(deck, { clientX: 300, clientY: 500 })
    expect(
      screen.getByRole('heading', { name: '7월 2주차' }),
    ).toBeInTheDocument()
  })

  it('가장 오래된 공고가 있는 주가 과거 하한이다', async () => {
    // 06-24(수)는 06-22(월)에 시작하는 주 = 이번 주(07-06)로부터 2주 전
    earliestPostingDate = '2026-06-24'
    const { container } = renderReport()

    const previous = screen.getByRole('button', { name: '이전 주차' })
    const deck = container.querySelector('div.touch-pan-y')
    await waitFor(async () =>
      expect(await requestsTo('/report/earliest-posting-date')).toHaveLength(1),
    )

    for (let i = 0; i < 2; i += 1) {
      await userEvent.click(previous)
      // 이동이 끝나야 다음 입력을 받는다 (이동 중 입력은 무시된다).
      await waitFor(() => expect(deck).toHaveAttribute('aria-busy', 'false'))
    }

    expect(
      screen.getByRole('heading', { name: '6월 4주차' }),
    ).toBeInTheDocument()
    expect(previous).toBeDisabled()
    expect(screen.getByRole('button', { name: '다음 주차' })).toBeEnabled()
  })

  it('공고가 하나도 없으면 이번 주에 머문다', async () => {
    earliestPostingDate = null
    renderReport()

    await waitFor(() =>
      expect(screen.getByRole('button', { name: '이전 주차' })).toBeDisabled(),
    )
  })
})
