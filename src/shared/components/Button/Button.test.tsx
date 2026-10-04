import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

// JSX를 prop으로 인라인 전달하면 react-perf가 경고하므로 모듈 스코프로 올린다.
const startIcon = <svg data-testid="start" />
const endIcon = <svg data-testid="end" />

describe('Button', () => {
  it('자식 텍스트를 버튼으로 렌더링한다', () => {
    render(<Button>저장</Button>)
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument()
  })

  it('클릭하면 onClick 핸들러가 호출된다', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>클릭</Button>)

    await userEvent.click(screen.getByRole('button', { name: '클릭' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('disabled면 클릭이 무시된다', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        비활성
      </Button>,
    )

    await userEvent.click(screen.getByRole('button', { name: '비활성' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('start/end 아이콘 슬롯을 라벨과 함께 렌더링한다', () => {
    render(
      <Button startIcon={startIcon} endIcon={endIcon}>
        확인
      </Button>,
    )

    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument()
    expect(screen.getByTestId('start')).toBeInTheDocument()
    expect(screen.getByTestId('end')).toBeInTheDocument()
  })
})
