import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { get, put } from '@/shared/api/http'
import { renderWithQuery } from '@/test/renderWithQuery'
import { ReportSubscriptionCard } from './ReportSubscriptionCard'

vi.mock('@/shared/api/http', () => ({
  API_BASE_URL: 'https://api.test',
  get: vi.fn(),
  put: vi.fn(),
}))

const MAJORS = {
  categories: [
    { id: 1, major: 'BACKEND', techStacks: [] },
    { id: 2, major: 'FRONTEND', techStacks: [] },
    { id: 3, major: 'MOBILE', techStacks: [] },
  ],
}

// 분야별 구독 중이고 프론트엔드만 고른 상태
const SUBSCRIPTION = { totalReport: false, majorReport: true, majorIds: [2] }

const RESPONSES: Record<string, unknown> = {
  '/majors': MAJORS,
  '/user/report-subscription': SUBSCRIPTION,
}

beforeEach(() => {
  vi.mocked(get).mockReset()
  vi.mocked(get).mockImplementation((path) => Promise.resolve(RESPONSES[path]))
  vi.mocked(put).mockReset()
  vi.mocked(put).mockResolvedValue(undefined)
})

const allToggle = () => screen.getByRole('switch', { name: '전체 리포트 구독' })
const fieldToggle = () =>
  screen.getByRole('switch', { name: '분야별 리포트 구독' })
const chip = (name: string) => screen.getByRole('button', { name })

/* 저장이 끝나면 다시 조회해 서버 값으로 맞춘다. 가짜 GET은 저장을 반영하지 않으니
   누르자마자 바뀌는지는 저장이 끝나기 전에 본다 */
const keepSaving = () => vi.mocked(put).mockReturnValue(new Promise(() => {}))

async function renderCard() {
  renderWithQuery(<ReportSubscriptionCard />)
  await screen.findByRole('button', { name: '모바일' })
}

describe('ReportSubscriptionCard', () => {
  it('서버 값으로 토글과 분야를 그리고, 분야 이름은 한글로 쓴다', async () => {
    await renderCard()

    expect(allToggle()).not.toBeChecked()
    expect(fieldToggle()).toBeChecked()
    expect(chip('프론트엔드')).toHaveAttribute('aria-pressed', 'true')
    expect(chip('백엔드')).toHaveAttribute('aria-pressed', 'false')
  })

  it('전체 구독을 켜면 분야별을 끈 값으로 저장하고, 고른 분야는 그대로 보낸다', async () => {
    const user = userEvent.setup()
    keepSaving()
    await renderCard()

    await user.click(allToggle())

    expect(put).toHaveBeenCalledWith('/user/report-subscription', {
      totalReport: true,
      majorReport: false,
      majorIds: [2],
    })
    expect(allToggle()).toBeChecked()
    expect(fieldToggle()).not.toBeChecked()
  })

  it('분야를 누르면 바로 바뀌고 그 목록으로 저장한다', async () => {
    const user = userEvent.setup()
    keepSaving()
    await renderCard()

    await user.click(chip('모바일'))

    expect(chip('모바일')).toHaveAttribute('aria-pressed', 'true')
    expect(put).toHaveBeenCalledWith('/user/report-subscription', {
      ...SUBSCRIPTION,
      majorIds: [2, 3],
    })
  })

  it('저장이 끝나기 전에 또 누르면 앞 변경까지 담아 차례대로 저장한다', async () => {
    const user = userEvent.setup()
    let finishFirst = () => {}
    vi.mocked(put).mockReturnValueOnce(
      new Promise<void>((resolve) => {
        finishFirst = resolve
      }),
    )
    await renderCard()

    await user.click(chip('모바일'))
    await user.click(chip('백엔드'))

    // 첫 저장이 끝나기 전에는 두 번째를 보내지 않는다
    expect(put).toHaveBeenCalledTimes(1)
    expect(chip('모바일')).toHaveAttribute('aria-pressed', 'true')
    expect(chip('백엔드')).toHaveAttribute('aria-pressed', 'true')

    finishFirst()

    await waitFor(() => expect(put).toHaveBeenCalledTimes(2))
    expect(put).toHaveBeenLastCalledWith('/user/report-subscription', {
      ...SUBSCRIPTION,
      majorIds: [2, 3, 1],
    })
  })

  it('마지막 분야를 빼면 분야별 구독도 끈다', async () => {
    const user = userEvent.setup()
    keepSaving()
    await renderCard()

    await user.click(chip('프론트엔드'))

    expect(fieldToggle()).not.toBeChecked()
    expect(put).toHaveBeenCalledWith('/user/report-subscription', {
      totalReport: false,
      majorReport: false,
      majorIds: [],
    })
  })

  it('분야별 구독이 꺼져 있으면 키보드로도 분야를 바꿀 수 없다', async () => {
    const user = userEvent.setup()
    vi.mocked(get).mockImplementation((path) =>
      Promise.resolve(
        path === '/majors'
          ? MAJORS
          : { totalReport: true, majorReport: false, majorIds: [2] },
      ),
    )
    await renderCard()

    chip('모바일').focus()
    await user.keyboard('{Enter}')

    // 포인터만 막으면 키보드로 빠져나간다
    expect(chip('모바일')).toHaveAttribute('aria-pressed', 'false')
    expect(put).not.toHaveBeenCalled()
  })

  it('저장에 실패하면 누르기 전으로 되돌린다', async () => {
    const user = userEvent.setup()
    vi.mocked(put).mockRejectedValue(new Error('실패'))
    await renderCard()

    await user.click(chip('모바일'))

    await waitFor(() =>
      expect(chip('모바일')).toHaveAttribute('aria-pressed', 'false'),
    )
  })
})
