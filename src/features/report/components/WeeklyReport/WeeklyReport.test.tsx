import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { WeeklyReport } from './WeeklyReport'

/** 선택된 칩의 라벨. 토글 칩은 `aria-pressed`로 선택을 드러낸다. */
function selectedChip() {
  return screen
    .getAllByRole('button', { pressed: true })
    .map((chip) => chip.textContent)
}

describe('WeeklyReport', () => {
  it('주차·날짜 범위·직군 필터·푸터 문구를 렌더링한다', () => {
    render(<WeeklyReport />)

    expect(
      screen.getByRole('heading', { name: '7월 2주차' }),
    ).toBeInTheDocument()
    expect(screen.getByText('2026.07.06 ~ 2026.07.12')).toBeInTheDocument()

    for (const label of ['전체', 'FE', 'BE', 'Security']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }

    // 수집 건수는 천 단위 구분자를 붙여 보여준다.
    expect(
      screen.getByText(/19,283개의 공고를 분석한 결과입니다/),
    ).toBeInTheDocument()
  })

  it('직군 필터는 처음에 전체가 선택돼 있고 하나만 선택된다', async () => {
    render(<WeeklyReport />)

    expect(selectedChip()).toEqual(['전체'])

    await userEvent.click(screen.getByRole('button', { name: 'FE' }))

    // 새로 고른 것만 남는다 — 다중 선택이 아니다.
    expect(selectedChip()).toEqual(['FE'])
  })

  it('이전 주차로 넘기면 주차와 날짜가 함께 바뀐다', async () => {
    render(<WeeklyReport />)

    await userEvent.click(screen.getByRole('button', { name: '이전 주차' }))

    // 카드가 옆자리로 옮겨간 뒤에야 주차가 바뀐다.
    expect(
      await screen.findByRole('heading', { name: '6월 5주차' }),
    ).toBeInTheDocument()
    expect(screen.getByText('2026.06.29 ~ 2026.07.05')).toBeInTheDocument()
  })

  it('가장 최근 주차에서는 다음으로 넘어갈 수 없다', () => {
    render(<WeeklyReport />)

    // 아직 끝나지 않은 주는 집계가 없다.
    expect(screen.getByRole('button', { name: '다음 주차' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '이전 주차' })).toBeEnabled()
  })

  it('연달아 넘겨도 화살표의 포커스를 잃지 않는다', async () => {
    const { container } = render(<WeeklyReport />)
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
    const { container } = render(<WeeklyReport />)
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
    const { container } = render(<WeeklyReport />)
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

  it('과거 하한에 닿으면 이전으로 더 갈 수 없다', async () => {
    const { container } = render(<WeeklyReport />)

    const previous = screen.getByRole('button', { name: '이전 주차' })
    const deck = container.querySelector('div.touch-pan-y')

    for (let i = 0; i < 8; i += 1) {
      await userEvent.click(previous)
      // 이동이 끝나야 다음 입력을 받는다 (이동 중 입력은 무시된다).
      await waitFor(() => expect(deck).toHaveAttribute('aria-busy', 'false'))
    }

    expect(previous).toBeDisabled()
    expect(screen.getByRole('button', { name: '다음 주차' })).toBeEnabled()
    /* 8번을 넘겨야 하한에 닿는데, 테스트 환경에는 애니메이션이 없어 매번 대비용
       타임아웃(600ms)만큼 기다린다 → 기본 제한 5초로는 모자란다. */
  }, 15_000)
})
