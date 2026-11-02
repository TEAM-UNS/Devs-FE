import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { MyRetrospects } from './MyRetrospects'

const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }))
vi.mock('../../hooks/useToggleLike', () => ({
  useToggleLike: () => ({ mutate, isPending: false }),
}))

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/my/retrospects']}>
      <Routes>
        <Route path="/my/retrospects" element={<MyRetrospects />} />
        <Route path="/my" element={<p>마이페이지</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('MyRetrospects', () => {
  it('내 회고 몰아보기 머리말과 내가 쓴 회고 카드를 그린다', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: '내 회고 몰아보기' }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: /회고 보기$/ }).length,
    ).toBeGreaterThan(0)
    // 내 회고는 익명이 아니라 '내 로드맵'으로 부른다
    expect(screen.getAllByText('내 로드맵 - Day6').length).toBeGreaterThan(0)
    expect(screen.queryByText(/익명 러너/)).not.toBeInTheDocument()
  })

  it('내 회고의 좋아요는 개수만 보여주고 누를 수 없다', async () => {
    renderPage()

    expect(screen.queryAllByRole('button', { name: /^좋아요/ })).toHaveLength(0)

    await userEvent.click(
      screen.getAllByRole('button', { name: /회고 보기$/ })[0],
    )
    const dialog = screen.getByRole('dialog')
    expect(
      within(dialog).queryByRole('button', { name: /^좋아요/ }),
    ).not.toBeInTheDocument()
    expect(mutate).not.toHaveBeenCalled()
  })

  it('주소로 바로 열었으면 돌아가기로 마이페이지에 간다', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: '돌아가기' }))

    expect(screen.getByText('마이페이지')).toBeInTheDocument()
  })
})
