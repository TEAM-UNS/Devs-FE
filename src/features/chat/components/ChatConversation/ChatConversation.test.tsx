import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { ChatMessage } from '../../types/chat'
import { ChatConversation } from './ChatConversation'

const MESSAGE: ChatMessage = {
  id: 'message-1',
  role: 'user',
  content: '질문',
}

describe('ChatConversation', () => {
  it('reveals new bottom content while the user remains near the bottom', () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const { rerender } = render(
      <ChatConversation threadId="thread-1" messages={[]} pending={false} />,
    )

    rerender(
      <ChatConversation
        threadId="thread-1"
        messages={[MESSAGE]}
        pending={false}
      />,
    )

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'end' })
  })

  it('preserves the scroll position when the user has scrolled upward', () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const { container, rerender } = render(
      <ChatConversation threadId="thread-1" messages={[]} pending={false} />,
    )
    const scrollContainer = container.firstElementChild
    if (!(scrollContainer instanceof HTMLElement)) {
      throw new Error('대화 스크롤 영역을 찾지 못했습니다')
    }
    Object.defineProperties(scrollContainer, {
      scrollHeight: { configurable: true, value: 500 },
      clientHeight: { configurable: true, value: 200 },
      scrollTop: { configurable: true, value: 100 },
    })

    fireEvent.scroll(scrollContainer)
    scrollIntoView.mockClear()
    rerender(
      <ChatConversation
        threadId="thread-1"
        messages={[MESSAGE]}
        pending={true}
      />,
    )

    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('reveals the latest content after switching threads', () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const { container, rerender } = render(
      <ChatConversation threadId="thread-1" messages={[]} pending={false} />,
    )
    const scrollContainer = container.firstElementChild
    if (!(scrollContainer instanceof HTMLElement)) {
      throw new Error('대화 스크롤 영역을 찾지 못했습니다')
    }
    Object.defineProperties(scrollContainer, {
      scrollHeight: { configurable: true, value: 500 },
      clientHeight: { configurable: true, value: 200 },
      scrollTop: { configurable: true, value: 100 },
    })
    fireEvent.scroll(scrollContainer)
    scrollIntoView.mockClear()

    rerender(
      <ChatConversation
        threadId="thread-2"
        messages={[MESSAGE]}
        pending={false}
      />,
    )

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'end' })
  })
})
