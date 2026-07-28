import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SignupStep4 } from './SignupStep4'
import { TECH_STACK_GROUPS } from './techStacks'

const noop = () => {}

// majors 배열도 모듈 스코프에 둔다 — JSX에서 새 배열을 만들면 react-perf 경고가 난다.
const ONLY_FRONTEND = ['frontend']
const FRONTEND_AND_BACKEND = ['frontend', 'backend']

const frontend = TECH_STACK_GROUPS.find((g) => g.majorId === 'frontend')!
const backend = TECH_STACK_GROUPS.find((g) => g.majorId === 'backend')!

describe('SignupStep4', () => {
  it('3단계에서 고른 전공의 그룹만 노출한다', () => {
    render(<SignupStep4 majors={ONLY_FRONTEND} onSubmit={noop} />)

    expect(
      screen.getByRole('button', { name: frontend.label }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: backend.label }),
    ).not.toBeInTheDocument()
    // 기본은 펼침 상태라 칩이 바로 보인다.
    expect(
      screen.getByRole('button', { name: frontend.tags[0].label }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '회원가입' })).toBeDisabled()
  })

  it('헤더를 누르면 접히고 다시 누르면 펼쳐진다', async () => {
    render(<SignupStep4 majors={ONLY_FRONTEND} onSubmit={noop} />)

    const header = screen.getByRole('button', { name: frontend.label })
    expect(header).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('button', { name: frontend.tags[0].label }),
    ).not.toBeInTheDocument()

    await userEvent.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'true')
  })

  it('선택 개수를 헤더에 전공별로 표시한다', async () => {
    render(<SignupStep4 majors={FRONTEND_AND_BACKEND} onSubmit={noop} />)

    await userEvent.click(
      screen.getByRole('button', { name: frontend.tags[0].label }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: frontend.tags[1].label }),
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
    render(<SignupStep4 majors={ONLY_FRONTEND} onSubmit={onSubmit} />)

    const submit = screen.getByRole('button', { name: '회원가입' })
    expect(submit).toBeDisabled()

    const tag = screen.getByRole('button', { name: frontend.tags[0].label })
    await userEvent.click(tag)
    expect(tag).toHaveAttribute('aria-pressed', 'true')
    expect(submit).toBeEnabled()

    await userEvent.click(submit)
    expect(onSubmit).toHaveBeenCalledWith({
      techStacks: { frontend: [frontend.tags[0].id] },
    })

    // 선택을 해제하면 다시 비활성화된다.
    await userEvent.click(tag)
    expect(submit).toBeDisabled()
  })
})
