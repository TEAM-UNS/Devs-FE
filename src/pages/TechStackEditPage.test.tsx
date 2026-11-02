import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { UserMyQueryResponse } from '@/shared/api'
import { MOCK_MAJORS } from '@/test/fixtures/majors'
import { renderWithQuery } from '@/test/renderWithQuery'
import TechStackEditPage from './TechStackEditPage'

const mocks = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn() }))

vi.mock('@/shared/api/http', () => ({
  get: mocks.get,
  post: vi.fn(),
  put: mocks.put,
}))

const ME: UserMyQueryResponse = {
  name: '홍길동',
  email: 'test@example.com',
  personalHistory: 'NO_EXPERIENCE',
  majors: [{ majorId: 1, majorName: '백엔드' }],
  techStacks: [{ skillId: 101, skillName: 'Spring' }],
}

function renderPage() {
  return renderWithQuery(
    <MemoryRouter initialEntries={['/my/tech-stack']}>
      <Routes>
        <Route path="/my/tech-stack" element={<TechStackEditPage />} />
        <Route path="/my" element={<p>마이페이지</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TechStackEditPage', () => {
  beforeEach(() => {
    mocks.get.mockReset()
    mocks.get.mockImplementation((path: string) => {
      if (path === '/majors') return Promise.resolve(MOCK_MAJORS)
      if (path === '/user/my') return Promise.resolve(ME)
      return Promise.reject(new Error(`요청하지 않아야 할 경로: ${path}`))
    })
    mocks.put.mockReset()
    mocks.put.mockResolvedValue(undefined)
  })

  it('내 전공의 스택만 보여주고 지금 고른 스택을 미리 골라 둔다', async () => {
    renderPage()

    expect(
      await screen.findByRole('button', { name: 'Spring' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Node.js' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    // 다른 전공(FRONTEND)의 스택은 서버가 받지 않으니 보이지 않는다
    expect(screen.queryByRole('button', { name: 'React' })).toBeNull()
  })

  it('수정 완료를 누르면 PUT /user/tech-stack으로 보내고 사용자 정보를 다시 받은 뒤 마이페이지로 간다', async () => {
    renderPage()

    await userEvent.click(
      await screen.findByRole('button', { name: 'Node.js' }),
    )
    await userEvent.click(screen.getByRole('button', { name: '수정 완료' }))

    expect(await screen.findByText('마이페이지')).toBeInTheDocument()
    expect(mocks.put).toHaveBeenCalledWith('/user/tech-stack', {
      skillIds: [101, 102],
    })
    expect(
      mocks.get.mock.calls.filter(([path]) => path === '/user/my'),
    ).toHaveLength(2)
  })
})
