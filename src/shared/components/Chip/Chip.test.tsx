import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Chip } from './Chip'

// JSX를 prop으로 인라인 전달하면 react-perf가 경고하므로 모듈 스코프로 올린다.
const leadingIcon = <svg data-testid="icon" />

describe('Chip', () => {
  it('상호작용 prop이 없으면 정적 <span> 태그로 라벨을 렌더링한다', () => {
    render(<Chip>태그명</Chip>)

    expect(screen.getByText('태그명')).toBeInTheDocument()
    // 정적 칩은 버튼이 아니다 (탭 순서·스크린리더에 버튼으로 노출되지 않음).
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('라벨 앞 아이콘 슬롯을 렌더링한다', () => {
    render(<Chip icon={leadingIcon}>태그명</Chip>)

    expect(screen.getByText('태그명')).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('selected를 주면 aria-pressed 버튼이 되고 클릭 시 onClick이 호출된다', async () => {
    const onClick = vi.fn()
    render(
      <Chip selected onClick={onClick}>
        필터
      </Chip>,
    )

    const chip = screen.getByRole('button', { name: '필터' })
    expect(chip).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(chip)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('selected=false면 aria-pressed가 false로 노출된다', () => {
    render(<Chip selected={false}>필터</Chip>)

    expect(screen.getByRole('button', { name: '필터' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('selected 없이 onClick만 주면 aria-pressed 없는 클릭 칩이 된다', async () => {
    const onClick = vi.fn()
    render(
      <Chip icon={leadingIcon} onClick={onClick}>
        추가
      </Chip>,
    )

    const chip = screen.getByRole('button', { name: '추가' })
    expect(chip).not.toHaveAttribute('aria-pressed')

    await userEvent.click(chip)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('onRemove를 주면 라벨은 정적이고 전용 삭제 버튼만 클릭 가능하다', async () => {
    const onRemove = vi.fn()
    render(<Chip onRemove={onRemove}>태그명</Chip>)

    // 칩 본체는 버튼이 아니고, 삭제 컨트롤만 버튼이다.
    const removeButton = screen.getByRole('button', { name: '삭제' })
    expect(screen.getAllByRole('button')).toHaveLength(1)

    await userEvent.click(removeButton)
    expect(onRemove).toHaveBeenCalledOnce()
  })

  it('removeLabel로 삭제 버튼의 접근성 라벨을 바꿀 수 있다', () => {
    render(
      <Chip onRemove={vi.fn()} removeLabel="React 태그 제거">
        React
      </Chip>,
    )

    expect(
      screen.getByRole('button', { name: 'React 태그 제거' }),
    ).toBeInTheDocument()
  })
})
