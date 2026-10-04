import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './Checkbox'

// 제어 컴포넌트 경고 억제용 no-op — 인라인 함수 prop을 피해 react-perf 규칙을 지킨다.
const noop = () => {}

describe('Checkbox', () => {
  it('라벨을 입력과 연결해 체크박스로 렌더링한다', () => {
    render(<Checkbox label="이용약관 동의" />)
    // 접근 가능한 이름(label)으로 체크박스를 찾을 수 있어야 한다
    expect(
      screen.getByRole('checkbox', { name: '이용약관 동의' }),
    ).toBeInTheDocument()
  })

  it('라벨이 없어도 체크박스가 렌더링된다', () => {
    render(<Checkbox aria-label="전체 선택" />)
    expect(
      screen.getByRole('checkbox', { name: '전체 선택' }),
    ).toBeInTheDocument()
  })

  it('클릭하면 선택 상태가 토글되고 onChange가 호출된다', async () => {
    const onChange = vi.fn()
    render(<Checkbox label="동의" onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox', { name: '동의' })
    expect(checkbox).not.toBeChecked()

    await userEvent.click(checkbox)

    expect(checkbox).toBeChecked()
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('라벨 텍스트를 클릭해도 체크박스가 토글된다', async () => {
    render(<Checkbox label="마케팅 수신" />)

    await userEvent.click(screen.getByText('마케팅 수신'))

    expect(screen.getByRole('checkbox', { name: '마케팅 수신' })).toBeChecked()
  })

  it('defaultChecked로 초기 선택 상태를 지정한다', () => {
    render(<Checkbox label="기본 선택" defaultChecked />)
    expect(screen.getByRole('checkbox', { name: '기본 선택' })).toBeChecked()
  })

  it('disabled면 클릭해도 토글되지 않고 onChange가 호출되지 않는다', async () => {
    const onChange = vi.fn()
    render(<Checkbox label="비활성" disabled onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox', { name: '비활성' })
    await userEvent.click(checkbox)

    expect(checkbox).not.toBeChecked()
    expect(onChange).not.toHaveBeenCalled()
    expect(checkbox).toBeDisabled()
  })

  it('indeterminate prop을 input.indeterminate에 반영한다', () => {
    render(<Checkbox label="부분 선택" indeterminate />)

    const checkbox = screen.getByRole<HTMLInputElement>('checkbox', {
      name: '부분 선택',
    })
    expect(checkbox.indeterminate).toBe(true)
  })

  it('description을 aria-describedby로 연결해 노출한다', () => {
    render(
      <Checkbox
        label="약관"
        description="부가적인 설명이 필요할 경우 이곳에 설명이 들어갑니다."
      />,
    )

    const checkbox = screen.getByRole('checkbox', { name: '약관' })
    expect(checkbox).toHaveAccessibleDescription(
      '부가적인 설명이 필요할 경우 이곳에 설명이 들어갑니다.',
    )
  })

  it('제어 컴포넌트로 checked 값을 반영한다', () => {
    const { rerender } = render(
      <Checkbox label="제어" checked={false} onChange={noop} />,
    )
    expect(screen.getByRole('checkbox', { name: '제어' })).not.toBeChecked()

    rerender(<Checkbox label="제어" checked onChange={noop} />)
    expect(screen.getByRole('checkbox', { name: '제어' })).toBeChecked()
  })
})
