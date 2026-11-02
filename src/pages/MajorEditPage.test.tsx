import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { UserMyQueryResponse } from '@/shared/api'
import { MOCK_MAJORS } from '@/test/fixtures/majors'
import { renderWithQuery } from '@/test/renderWithQuery'
import { toMajorOption } from '@/features/auth/components/SignupStep3/majors'
import MajorEditPage from './MajorEditPage'

/* 전송 계층만 막는다. 요청 함수·훅은 실제로 돌려 PUT 경로·본문과 재조회까지 본다 */
const mocks = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn() }))

vi.mock('@/shared/api/http', () => ({
  get: mocks.get,
  post: vi.fn(),
  put: mocks.put,
}))

const BACKEND = toMajorOption(MOCK_MAJORS.categories[0])
const FRONTEND = toMajorOption(MOCK_MAJORS.categories[1])

const ME: UserMyQueryResponse = {
  name: '홍길동',
  email: 'test@example.com',
  personalHistory: 'JUNIOR',
  majors: [{ majorId: 1, majorName: '백엔드' }],
  techStacks: [{ skillId: 101, skillName: 'Spring' }],
}

function renderPage() {
  return renderWithQuery(
    <MemoryRouter initialEntries={['/my/major']}>
      <Routes>
        <Route path="/my/major" element={<MajorEditPage />} />
        <Route path="/my" element={<p>마이페이지</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('MajorEditPage', () => {
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

  it('지금 전공과 경력을 미리 골라 둔다', async () => {
    renderPage()

    expect(
      await screen.findByRole('button', { name: BACKEND.label }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '경력 있음' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('수정 완료를 누르면 PUT /user/major로 보내고 사용자 정보를 다시 받은 뒤 마이페이지로 간다', async () => {
    renderPage()

    await userEvent.click(
      await screen.findByRole('button', { name: FRONTEND.label }),
    )
    await userEvent.click(screen.getByRole('button', { name: '수정 완료' }))

    expect(await screen.findByText('마이페이지')).toBeInTheDocument()
    expect(mocks.put).toHaveBeenCalledWith('/user/major', {
      personalHistory: 'JUNIOR',
      majorIds: [1, 2],
    })
    // 무효화로 /user/my를 한 번 더 받아야 마이페이지가 새 값을 보여준다
    expect(
      mocks.get.mock.calls.filter(([path]) => path === '/user/my'),
    ).toHaveLength(2)
  })

  it('저장이 실패하면 화면에 남는다', async () => {
    mocks.put.mockRejectedValueOnce(new Error('boom'))
    renderPage()

    await screen.findByRole('button', { name: BACKEND.label })
    await userEvent.click(screen.getByRole('button', { name: '수정 완료' }))

    expect(
      await screen.findByRole('button', { name: '수정 완료' }),
    ).toBeEnabled()
    expect(screen.queryByText('마이페이지')).toBeNull()
  })
})
