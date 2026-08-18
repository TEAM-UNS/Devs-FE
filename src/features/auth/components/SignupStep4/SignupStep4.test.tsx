import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MOCK_MAJORS } from '@/test/fixtures/majors'
import { renderWithQuery } from '@/test/renderWithQuery'
import { toMajorOption } from '../SignupStep3/majors'
import { SignupStep4 } from './SignupStep4'

// 기술 스택 목록도 GET /majors에서 온다(전공 안에 중첩).
vi.mock('../../api/requests', () => ({
  fetchMajors: vi.fn(() => Promise.resolve(MOCK_MAJORS)),
}))

const noop = () => {}

const [backendCategory, frontendCategory] = MOCK_MAJORS.categories
const backend = toMajorOption(backendCategory)
const frontend = toMajorOption(frontendCategory)

/** 전공의 기술 스택을 화면 표기(문자열 id) 기준으로 바꾼다. */
const tagsOf = (category: (typeof MOCK_MAJORS)['categories'][number]) =>
  category.techStacks.map((stack) => ({
    id: String(stack.id),
    label: stack.name,
  }))

const frontendTags = tagsOf(frontendCategory)

// majors 배열도 모듈 스코프에 둔다 — JSX에서 새 배열을 만들면 react-perf 경고가 난다.
const ONLY_FRONTEND = [frontend.id]
const FRONTEND_AND_BACKEND = [frontend.id, backend.id]

describe('SignupStep4', () => {
  it('3단계에서 고른 전공의 그룹만 노출한다', async () => {
    renderWithQuery(<SignupStep4 majors={ONLY_FRONTEND} onSubmit={noop} />)

    expect(
      await screen.findByRole('button', { name: frontend.label }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: backend.label }),
    ).not.toBeInTheDocument()
    // 기본은 펼침 상태라 칩이 바로 보인다.
    expect(
      screen.getByRole('button', { name: frontendTags[0].label }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '회원가입' })).toBeDisabled()
  })

  it('헤더를 누르면 접히고 다시 누르면 펼쳐진다', async () => {
    renderWithQuery(<SignupStep4 majors={ONLY_FRONTEND} onSubmit={noop} />)

    const header = await screen.findByRole('button', { name: frontend.label })
    expect(header).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('button', { name: frontendTags[0].label }),
    ).not.toBeInTheDocument()

    await userEvent.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'true')
  })

  it('선택 개수를 헤더에 전공별로 표시한다', async () => {
    renderWithQuery(
      <SignupStep4 majors={FRONTEND_AND_BACKEND} onSubmit={noop} />,
    )

    await userEvent.click(
      await screen.findByRole('button', { name: frontendTags[0].label }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: frontendTags[1].label }),
    )

    // 접근성 이름 계산은 노드별로 공백을 trim하므로 사이 공백은 느슨하게 매칭한다.
    expect(
      screen.getByRole('button', {
        name: new RegExp(`^${frontend.label}\\s*\\(2개 선택됨\\)$`),
      }),
    ).toBeInTheDocument()
    // 다른 전공 그룹의 카운트는 영향을 받지 않는다.
    expect(
      screen.getByRole('button', { name: backend.label }),
    ).toBeInTheDocument()
  })

  it('기술 스택을 1개 이상 선택해야 회원가입이 활성화되고 전공별로 전달된다', async () => {
    const onSubmit = vi.fn()
    renderWithQuery(<SignupStep4 majors={ONLY_FRONTEND} onSubmit={onSubmit} />)

    const submit = screen.getByRole('button', { name: '회원가입' })
    expect(submit).toBeDisabled()

    const tag = await screen.findByRole('button', {
      name: frontendTags[0].label,
    })
    await userEvent.click(tag)
    expect(tag).toHaveAttribute('aria-pressed', 'true')
    expect(submit).toBeEnabled()

    await userEvent.click(submit)
    expect(onSubmit).toHaveBeenCalledWith({
      techStacks: { [frontend.id]: [frontendTags[0].id] },
    })

    // 선택을 해제하면 다시 비활성화된다.
    await userEvent.click(tag)
    expect(submit).toBeDisabled()
  })
})
