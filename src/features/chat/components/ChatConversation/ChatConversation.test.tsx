import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { ChatMessage } from '../../types/chat'
import { ChatConversation } from './ChatConversation'

const MESSAGE: ChatMessage = {
  id: 'message-1',
  role: 'user',
  content: '질문',
}

const ANSWER: ChatMessage = {
  id: 'message-2',
  role: 'assistant',
  content: '답변',
}

/** 맨 아래에 있다가 위로 올려 읽는 상태로 만든다 */
function scrollUp(container: HTMLElement) {
  const scrollContainer = container.querySelector('[aria-live]')
  if (!(scrollContainer instanceof HTMLElement)) {
    throw new Error('대화 스크롤 영역을 찾지 못했습니다')
  }
  Object.defineProperties(scrollContainer, {
    scrollHeight: { configurable: true, value: 600 },
    clientHeight: { configurable: true, value: 200 },
    scrollTop: { configurable: true, writable: true, value: 400 },
  })
  fireEvent.scroll(scrollContainer)
  scrollContainer.scrollTop = 100
  fireEvent.scroll(scrollContainer)
}

describe('ChatConversation', () => {
  it('reveals new bottom content while the user remains near the bottom', () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const { rerender } = render(
      <ChatConversation threadId="thread-1" messages={[]} pending={false} />,
    )

    scrollIntoView.mockClear()
    rerender(
      <ChatConversation
        threadId="thread-1"
        messages={[MESSAGE]}
        pending={false}
      />,
    )

    expect(scrollIntoView).toHaveBeenCalledWith({
      block: 'end',
      behavior: 'smooth',
    })
  })

  it('preserves the scroll position when the answer grows while the user reads above', () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const { container, rerender } = render(
      <ChatConversation
        threadId="thread-1"
        messages={[MESSAGE]}
        pending={true}
      />,
    )

    scrollUp(container)
    scrollIntoView.mockClear()
    rerender(
      <ChatConversation
        threadId="thread-1"
        messages={[MESSAGE, ANSWER]}
        pending={false}
      />,
    )

    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('keeps following while sliding down to the bottom', () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const { container, rerender } = render(
      <ChatConversation
        threadId="thread-1"
        messages={[MESSAGE]}
        pending={true}
      />,
    )
    scrollUp(container)
    fireEvent.click(screen.getByRole('button', { name: '최신 메시지로 이동' }))
    const scrollContainer = container.querySelector('[aria-live]')!
    // 부드럽게 내려가는 중이라 아직 맨 아래는 아니다
    scrollContainer.scrollTop = 250
    fireEvent.scroll(scrollContainer)

    scrollIntoView.mockClear()
    rerender(
      <ChatConversation
        threadId="thread-1"
        messages={[MESSAGE, ANSWER]}
        pending={false}
      />,
    )

    expect(scrollIntoView).toHaveBeenCalledWith({
      block: 'end',
      behavior: 'auto',
    })
  })

  it('moves to the bottom when a new question is sent while reading above', () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const { container, rerender } = render(
      <ChatConversation
        threadId="thread-1"
        messages={[MESSAGE, ANSWER]}
        pending={false}
      />,
    )

    scrollUp(container)
    scrollIntoView.mockClear()
    rerender(
      <ChatConversation
        threadId="thread-1"
        messages={[MESSAGE, ANSWER, { ...MESSAGE, id: 'message-3' }]}
        pending={true}
      />,
    )

    expect(scrollIntoView).toHaveBeenCalledWith({
      block: 'end',
      behavior: 'smooth',
    })
  })

  it('shows a button that moves to the bottom only after scrolling up', () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const { container } = render(
      <ChatConversation
        threadId="thread-1"
        messages={[MESSAGE, ANSWER]}
        pending={false}
      />,
    )
    expect(
      screen.queryByRole('button', { name: '최신 메시지로 이동' }),
    ).not.toBeInTheDocument()

    scrollUp(container)
    scrollIntoView.mockClear()
    fireEvent.click(screen.getByRole('button', { name: '최신 메시지로 이동' }))

    expect(scrollIntoView).toHaveBeenCalledWith({
      block: 'end',
      behavior: 'smooth',
    })
  })

  it('reveals the latest content after switching threads', () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const { container, rerender } = render(
      <ChatConversation threadId="thread-1" messages={[]} pending={false} />,
    )
    scrollUp(container)
    scrollIntoView.mockClear()

    rerender(
      <ChatConversation
        threadId="thread-2"
        messages={[MESSAGE]}
        pending={false}
      />,
    )

    expect(scrollIntoView).toHaveBeenCalledWith({
      block: 'end',
      behavior: 'auto',
    })
  })

  it('hides the button after switching to a thread without scroll movement', () => {
    Element.prototype.scrollIntoView = vi.fn()
    const { container, rerender } = render(
      <ChatConversation
        threadId="thread-1"
        messages={[MESSAGE, ANSWER]}
        pending={false}
      />,
    )
    scrollUp(container)

    rerender(
      <ChatConversation
        threadId="thread-2"
        messages={[MESSAGE]}
        pending={false}
      />,
    )

    expect(
      screen.queryByRole('button', { name: '최신 메시지로 이동' }),
    ).not.toBeInTheDocument()
  })

  it('shows the tool label next to the spinner', () => {
    Element.prototype.scrollIntoView = vi.fn()
    render(
      <ChatConversation
        threadId="thread-1"
        messages={[MESSAGE, ANSWER]}
        pending={true}
        pendingLabel="기술 연관 관계를 분석하고 있어요"
      />,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(
      screen.getByText('기술 연관 관계를 분석하고 있어요'),
    ).toBeInTheDocument()
  })
})
