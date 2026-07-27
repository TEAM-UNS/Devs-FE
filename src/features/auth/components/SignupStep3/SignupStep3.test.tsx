import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MAX_MAJORS } from '../../types'
import { MAJORS } from './majors'
import { SignupStep3 } from './SignupStep3'

const noop = () => {}

describe('SignupStep3', () => {
  it('전공 카드·경력 토글·연차 드롭다운·다음 버튼을 렌더링한다', () => {
    render(<SignupStep3 onNext={noop} />)

    expect(screen.getByRole('button', { name: 'Backend' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Frontend' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '경력 없음' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '경력 있음' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled()
  })

  it('전공을 토글로 선택·해제할 수 있다', async () => {
    render(<SignupStep3 onNext={noop} />)

    const backend = screen.getByRole('button', { name: 'Backend' })
    expect(backend).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(backend)
    expect(backend).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(backend)
    expect(backend).toHaveAttribute('aria-pressed', 'false')
  })

  it(`전공은 최대 ${MAX_MAJORS}개까지만 선택되고 초과 선택은 무시된다`, async () => {
    render(<SignupStep3 onNext={noop} />)

    const cards = MAJORS.map(({ label }) =>
      screen.getByRole('button', { name: label }),
    )
    expect(cards.length).toBeGreaterThan(MAX_MAJORS) // 상한이 유효한 전제

    for (const card of cards.slice(0, MAX_MAJORS)) {
      await userEvent.click(card)
    }
    expect(screen.getByText(String(MAX_MAJORS))).toBeInTheDocument() // 카운터

    // 상한을 넘는 카드는 눌러도 선택되지 않는다.
    const overflowCard = cards[MAX_MAJORS]
    await userEvent.click(overflowCard)
    expect(overflowCard).toHaveAttribute('aria-pressed', 'false')

    // 이미 선택된 카드는 여전히 해제할 수 있다.
    await userEvent.click(cards[0])
    expect(cards[0]).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(overflowCard)
    expect(overflowCard).toHaveAttribute('aria-pressed', 'true')
  })

  it('전공 선택 + 경력 없음이면 다음이 활성화되고 onNext로 전달된다', async () => {
    const onNext = vi.fn()
    render(<SignupStep3 onNext={onNext} />)

    const next = screen.getByRole('button', { name: '다음' })

    await userEvent.click(screen.getByRole('button', { name: 'Backend' }))
    // 전공만으론 부족(경력 미선택)
    expect(next).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: '경력 없음' }))
    expect(next).toBeEnabled()

    await userEvent.click(next)
    expect(onNext).toHaveBeenCalledWith(
      expect.objectContaining({ majors: ['backend'], careerType: 'none' }),
    )
  })

  it('경력 있음이면 연차까지 선택해야 다음이 활성화된다', async () => {
    const onNext = vi.fn()
    render(<SignupStep3 onNext={onNext} />)

    await userEvent.click(screen.getByRole('button', { name: 'Frontend' }))
    await userEvent.click(screen.getByRole('button', { name: '경력 있음' }))

    const next = screen.getByRole('button', { name: '다음' })
    expect(next).toBeDisabled()

    const combobox = screen.getByRole('combobox')
    expect(combobox).toBeEnabled()
    await userEvent.click(combobox)
    await userEvent.click(screen.getByRole('option', { name: '1년~3년' }))

    expect(next).toBeEnabled()
    await userEvent.click(next)
    expect(onNext).toHaveBeenCalledWith(
      expect.objectContaining({
        majors: ['frontend'],
        careerType: 'has',
        careerLevel: '1to3',
      }),
    )
  })
})
