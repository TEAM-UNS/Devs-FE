import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Dropdown } from './Dropdown'

// 배열/JSX를 prop으로 인라인 전달하면 react-perf가 경고하므로 모듈 스코프로 올린다.
const OPTIONS = [
  { label: '서울', value: 'seoul' },
  { label: '부산', value: 'busan' },
  { label: '대구', value: 'daegu' },
]

describe('Dropdown', () => {
  it('선택 전에는 placeholder를 보여주고 메뉴는 닫혀 있다', () => {
    render(
      <Dropdown label="지역" options={OPTIONS} placeholder="선택해주세요" />,
    )

    const trigger = screen.getByRole('combobox', { name: /지역/ })
    expect(trigger).toHaveTextContent('선택해주세요')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('트리거를 클릭하면 옵션 목록이 열린다', async () => {
    render(<Dropdown label="지역" options={OPTIONS} />)

    await userEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(OPTIONS.length)
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('옵션을 선택하면 onChange가 호출되고 라벨이 갱신되며 닫힌다', async () => {
    const onChange = vi.fn()
    render(<Dropdown label="지역" options={OPTIONS} onChange={onChange} />)

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: '부산' }))

    expect(onChange).toHaveBeenCalledWith('busan')
    expect(screen.getByRole('combobox')).toHaveTextContent('부산')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('선택된 옵션은 aria-selected=true 로 표시된다', async () => {
    render(<Dropdown options={OPTIONS} defaultValue="daegu" />)

    await userEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('option', { name: '대구' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('option', { name: '서울' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })

  it('Escape 키로 메뉴를 닫는다', async () => {
    render(<Dropdown options={OPTIONS} />)

    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('바깥을 클릭하면 메뉴가 닫힌다', async () => {
    render(
      <div>
        <button type="button">바깥</button>
        <Dropdown options={OPTIONS} />
      </div>,
    )

    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '바깥' }))

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('키보드(방향키+Enter)로 옵션을 선택할 수 있다', async () => {
    const onChange = vi.fn()
    render(<Dropdown options={OPTIONS} onChange={onChange} />)

    const trigger = screen.getByRole('combobox')
    trigger.focus()
    // 첫 ArrowDown: 열림(active=첫 항목) → 두 번째 ArrowDown: 두 번째 항목으로 이동
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}')

    expect(onChange).toHaveBeenCalledWith('busan')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('disabled면 클릭해도 열리지 않는다', async () => {
    const onChange = vi.fn()
    render(<Dropdown options={OPTIONS} disabled onChange={onChange} />)

    await userEvent.click(screen.getByRole('combobox'))

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })
})
