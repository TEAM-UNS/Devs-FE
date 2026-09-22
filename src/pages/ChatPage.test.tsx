import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithQuery } from '@/test/renderWithQuery'
import ChatPage from './ChatPage'

const { requestMockChatReply } = vi.hoisted(() => ({
  requestMockChatReply: vi.fn(),
}))

vi.mock('@/features/chat/api/mockChat', () => ({
  requestMockChatReply,
}))

function renderPage() {
  return renderWithQuery(
    <MemoryRouter initialEntries={['/chat']}>
      <ChatPage />
    </MemoryRouter>,
  )
}

describe('ChatPage', () => {
  beforeEach(() => {
    requestMockChatReply.mockReset()
    requestMockChatReply.mockResolvedValue('목 데이터 기반 답변입니다.')
  })

  it('renders the empty chat screen from the design', () => {
    renderPage()

    expect(screen.getByRole('link', { name: '메인페이지' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(screen.getByText('최근 대화가 없습니다.')).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'AI 챗봇에게 질문하기' }),
    ).toHaveAttribute('autocomplete', 'off')
    expect(
      screen.getByRole('textbox', { name: 'AI 챗봇에게 질문하기' }),
    ).toHaveAttribute('placeholder', '무엇이든 질문하세요.')
    expect(
      screen.getByRole('button', {
        name: '백엔드 중 가장 인기있는 기술 스택',
      }),
    ).toBeInTheDocument()
  })

  it('submits a question and shows the mock response in chat history', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(
      screen.getByRole('textbox', { name: 'AI 챗봇에게 질문하기' }),
      '로드맵 생성 기준은 무엇인가요?',
    )
    await user.click(screen.getByRole('button', { name: '질문 보내기' }))

    expect(screen.getAllByText('로드맵 생성 기준은 무엇인가요?')).toHaveLength(
      2,
    )
    expect(
      await screen.findByText('목 데이터 기반 답변입니다.'),
    ).toBeInTheDocument()
    expect(requestMockChatReply).toHaveBeenCalledWith(
      '로드맵 생성 기준은 무엇인가요?',
    )
  })

  it('starts a new empty chat while keeping the previous thread', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getAllByRole('button', {
        name: '백엔드 중 가장 인기있는 기술 스택',
      })[0],
    )
    await screen.findByText('목 데이터 기반 답변입니다.')
    await user.click(screen.getByRole('button', { name: '새 대화 시작' }))

    expect(screen.getByAltText('Devs')).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', {
        name: '백엔드 중 가장 인기있는 기술 스택',
      }),
    ).toHaveLength(2)
  })

  it('deletes a chat after confirming the Figma modal', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getAllByRole('button', {
        name: '백엔드 중 가장 인기있는 기술 스택',
      })[0],
    )
    await screen.findByText('목 데이터 기반 답변입니다.')
    await user.click(
      screen.getByRole('button', {
        name: '백엔드 중 가장 인기있는 기술 스택 삭제',
      }),
    )

    expect(
      screen.getByRole('dialog', {
        name: '정말 이 채팅을 삭제하시겠습니까?',
      }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '삭제' }))

    expect(screen.getByText('최근 대화가 없습니다.')).toBeInTheDocument()
    expect(screen.getByAltText('Devs')).toBeInTheDocument()
  })

  it('keeps the chat when deletion is cancelled', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', {
        name: '최근 한달 간 급하락중인 기술 스택',
      }),
    )
    await screen.findByText('목 데이터 기반 답변입니다.')
    await user.click(
      screen.getByRole('button', {
        name: '최근 한달 간 급하락중인 기술 스택 삭제',
      }),
    )
    await user.click(screen.getByRole('button', { name: '취소' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: '최근 한달 간 급하락중인 기술 스택 삭제',
      }),
    ).toBeInTheDocument()
  })

  it('shows an error above the composer when the response fails', async () => {
    requestMockChatReply.mockRejectedValue(new Error('failed'))
    const user = userEvent.setup()
    renderPage()

    await user.type(
      screen.getByRole('textbox', { name: 'AI 챗봇에게 질문하기' }),
      '오류 테스트',
    )
    await user.click(screen.getByRole('button', { name: '질문 보내기' }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(
      '답변을 불러오지 못했습니다. 다시 시도해 주세요.',
    )
  })

  it('shows the Figma spinner while waiting for a response', async () => {
    requestMockChatReply.mockReturnValue(new Promise(() => undefined))
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', {
        name: '로드맵 생성 기준은 무엇인가요?',
      }),
    )

    expect(
      screen.getByRole('status', { name: '답변 생성 중' }),
    ).toBeInTheDocument()
  })

  it('keeps a pending thread disabled while another chat is open', async () => {
    requestMockChatReply.mockReturnValue(new Promise(() => undefined))
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', {
        name: '백엔드 중 가장 인기있는 기술 스택',
      }),
    )
    await user.click(screen.getByRole('button', { name: '새 대화 시작' }))

    expect(
      screen.getByRole('textbox', { name: 'AI 챗봇에게 질문하기' }),
    ).toBeEnabled()

    await user.click(
      screen.getAllByRole('button', {
        name: '백엔드 중 가장 인기있는 기술 스택',
      })[0],
    )

    expect(
      screen.getByRole('textbox', { name: 'AI 챗봇에게 질문하기' }),
    ).toBeDisabled()
  })

  it('restores focus to the delete button after closing the modal', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', {
        name: '최근 한달 간 급하락중인 기술 스택',
      }),
    )
    await screen.findByText('목 데이터 기반 답변입니다.')
    const deleteButton = screen.getByRole('button', {
      name: '최근 한달 간 급하락중인 기술 스택 삭제',
    })

    await user.click(deleteButton)
    expect(screen.getByRole('button', { name: '삭제 모달 닫기' })).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(deleteButton).toHaveFocus()
  })

  it('moves focus to new chat after deleting the focused thread', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', {
        name: '로드맵 생성 기준은 무엇인가요?',
      }),
    )
    await screen.findByText('목 데이터 기반 답변입니다.')
    await user.click(
      screen.getByRole('button', {
        name: '로드맵 생성 기준은 무엇인가요? 삭제',
      }),
    )
    await user.click(screen.getByRole('button', { name: '삭제' }))

    expect(screen.getByRole('button', { name: '새 대화 시작' })).toHaveFocus()
  })
})
