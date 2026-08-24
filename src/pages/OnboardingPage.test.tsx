import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MOCK_MAJORS } from '@/test/fixtures/majors'
import { renderWithQuery } from '@/test/renderWithQuery'
import { toMajorOption } from '@/features/auth/components/SignupStep3/majors'
import OnboardingPage from './OnboardingPage'

/* 전송 계층만 막는다. 요청 함수와 훅은 실제로 돌려서 두 PUT의 경로·본문까지 검증한다.
   나열하지 않은 경로는 거부해, 요청 함수의 경로가 틀리면 테스트가 잡아낸다. */
const mocks = vi.hoisted(() => ({ put: vi.fn() }))

vi.mock('@/shared/api/http', () => ({
  get: vi.fn((path: string) =>
    path === '/majors'
      ? Promise.resolve(MOCK_MAJORS)
      : Promise.reject(new Error(`요청하지 않아야 할 경로: ${path}`)),
  ),
  post: vi.fn(),
  put: mocks.put,
}))

const BACKEND = toMajorOption(MOCK_MAJORS.categories[0])

function renderPage() {
  return renderWithQuery(
    <MemoryRouter initialEntries={['/onboarding']}>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/" element={<p>대시보드</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

/** 전공 하나 + 경력 없음으로 1단계를 통과해 기술 스택 단계로 넘어간다. */
async function passMajorStep() {
  await userEvent.click(
    await screen.findByRole('button', { name: BACKEND.label }),
  )
  await userEvent.click(screen.getByRole('button', { name: '경력 없음' }))
  await userEvent.click(screen.getByRole('button', { name: '다음' }))
  await screen.findByText('기술 스택 선택')
}

describe('OnboardingPage', () => {
  beforeEach(() => {
    mocks.put.mockReset()
    mocks.put.mockResolvedValue({ message: 'ok' })
  })

  it('전공 선택으로 시작하고 2단계짜리 진행 표시를 보여준다', async () => {
    renderPage()

    expect(
      await screen.findByRole('button', { name: BACKEND.label }),
    ).toBeInTheDocument()

    const stepper = screen.getByRole('progressbar')
    // 회원가입(4단계)과 달리 온보딩은 전공·기술 스택 2단계뿐이다.
    expect(stepper).toHaveAttribute('aria-valuemax', '2')
    expect(stepper).toHaveAttribute('aria-valuenow', '1')
  })

  it('전공을 고르면 기술 스택 단계로 넘어가고 그 전공의 스택만 보여준다', async () => {
    renderPage()
    await passMajorStep()

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '2',
    )
    // 고른 전공(BACKEND)의 스택만 노출된다.
    expect(screen.getByRole('button', { name: 'Spring' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'React' })).toBeNull()
  })

  it('제출하면 전공과 기술 스택을 각 엔드포인트로 보내고 대시보드로 이동한다', async () => {
    renderPage()
    await passMajorStep()

    await userEvent.click(screen.getByRole('button', { name: 'Spring' }))
    await userEvent.click(screen.getByRole('button', { name: '시작하기' }))

    expect(await screen.findByText('대시보드')).toBeInTheDocument()

    expect(mocks.put).toHaveBeenCalledWith('/user/major', {
      personal_history: 'NO_EXPERIENCE',
      major_ids: [Number(BACKEND.id)],
    })
    expect(mocks.put).toHaveBeenCalledWith('/user/tech-stack', {
      skill_ids: [101],
    })
  })

  it('기술 스택은 전공이 저장된 뒤에 보낸다', async () => {
    renderPage()
    await passMajorStep()

    await userEvent.click(screen.getByRole('button', { name: 'Spring' }))
    await userEvent.click(screen.getByRole('button', { name: '시작하기' }))
    await screen.findByText('대시보드')

    // 기술 스택은 전공에 딸린 값이라 순서가 뒤집히면 서버가 붙일 곳을 못 찾는다.
    expect(mocks.put.mock.calls.map(([path]) => path)).toEqual([
      '/user/major',
      '/user/tech-stack',
    ])
  })

  it('전공 저장이 실패하면 기술 스택은 보내지 않는다', async () => {
    mocks.put.mockReset()
    mocks.put.mockRejectedValueOnce(new Error('boom'))

    renderPage()
    await passMajorStep()

    await userEvent.click(screen.getByRole('button', { name: 'Spring' }))
    await userEvent.click(screen.getByRole('button', { name: '시작하기' }))

    // 실패해도 화면에 머문다 — 사용자가 다시 제출할 수 있어야 한다.
    expect(await screen.findByText('기술 스택 선택')).toBeInTheDocument()
    expect(mocks.put).toHaveBeenCalledTimes(1)
  })
})
