import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useToastStore } from '@/shared/stores/useToastStore'
import { ToastViewport } from './ToastViewport'

beforeEach(() => {
  vi.useFakeTimers()
  useToastStore.setState({ toasts: [] })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('ToastViewport', () => {
  it('3초 뒤 퇴장 애니메이션을 시작하고, 끝나면 목록에서 지운다', () => {
    render(<ToastViewport />)
    act(() => useToastStore.getState().show({ type: 'error', title: '실패' }))

    const toast = screen.getByText('실패').closest('[role]') as HTMLElement
    expect(toast.className).toContain('animate-toast-in')

    act(() => vi.advanceTimersByTime(3000))
    expect(toast.className).toContain('animate-toast-out')
    expect(useToastStore.getState().toasts).toHaveLength(1)

    act(() => vi.advanceTimersByTime(200))
    expect(useToastStore.getState().toasts).toHaveLength(0)
    expect(screen.queryByText('실패')).not.toBeInTheDocument()
  })
})
