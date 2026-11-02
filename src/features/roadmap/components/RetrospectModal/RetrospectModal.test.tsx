import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RetrospectModal } from './RetrospectModal'

function renderModal() {
  const onClose = vi.fn()
  render(
    <RetrospectModal
      title="Day1"
      submitting={false}
      onClose={onClose}
      onSubmit={vi.fn()}
    />,
  )
  return onClose
}

describe('RetrospectModal 배경 클릭', () => {
  it('비어 있으면 배경을 눌러 닫는다', async () => {
    const onClose = renderModal()

    await userEvent.click(screen.getByRole('dialog'))

    expect(onClose).toHaveBeenCalled()
  })

  it('쓴 회고가 있으면 배경을 눌러도 닫지 않는다', async () => {
    const onClose = renderModal()

    await userEvent.type(screen.getByLabelText('회고'), '오늘 배운 것')
    await userEvent.click(screen.getByRole('dialog'))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('모달 안쪽을 눌러도 닫지 않는다', async () => {
    const onClose = renderModal()

    await userEvent.click(screen.getByRole('heading', { name: 'Day1' }))

    expect(onClose).not.toHaveBeenCalled()
  })
})
