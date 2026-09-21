import { Link } from 'react-router-dom'
import arrowLeftIcon from '@/assets/chat/arrow-left.svg'
import deleteIcon from '@/assets/chat/delete.svg'
import plusIcon from '@/assets/chat/plus.svg'
import { ROUTES } from '@/shared/constants'
import { cn } from '@/shared/utils/cn'
import type { ChatThread } from '../../types/chat'

interface ChatHistorySidebarProps {
  readonly threads: readonly ChatThread[]
  readonly activeThreadId?: string
  readonly onThreadSelect: (threadId: string) => void
  readonly onThreadDelete: (threadId: string) => void
  readonly onNewChat: () => void
}

interface ChatHistoryItemProps {
  readonly thread: ChatThread
  readonly selected: boolean
  readonly onSelect: (threadId: string) => void
  readonly onDelete: (threadId: string) => void
}

function ChatHistoryItem({
  thread,
  selected,
  onSelect,
  onDelete,
}: ChatHistoryItemProps) {
  function handleSelect() {
    onSelect(thread.id)
  }

  function handleDelete() {
    onDelete(thread.id)
  }

  return (
    <li className="group flex h-[37px] items-center px-5 py-2 has-[button:active]:bg-element">
      <button
        type="button"
        onClick={handleSelect}
        className={cn(
          'min-w-0 flex-1 truncate text-left text-body-sm text-gray-1000 focus-visible:outline-2 focus-visible:outline-primary-500',
          selected
            ? 'font-semibold'
            : 'text-gray-400 group-hover:text-gray-1000',
        )}
      >
        {thread.title}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        aria-label={`${thread.title} 삭제`}
        className="ml-3 hidden size-4 shrink-0 items-center justify-center group-hover:flex group-focus-within:flex focus-visible:outline-2 focus-visible:outline-primary-500"
      >
        <img src={deleteIcon} alt="" className="size-4" />
      </button>
    </li>
  )
}

/** 이전 대화를 선택하거나 삭제할 수 있는 챗봇 사이드바 */
export function ChatHistorySidebar({
  threads,
  activeThreadId,
  onThreadSelect,
  onThreadDelete,
  onNewChat,
}: ChatHistorySidebarProps) {
  return (
    <aside className="relative flex h-full w-60 shrink-0 flex-col bg-container py-12 after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-element">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-4 px-3">
          <Link
            to={ROUTES.home}
            className="flex items-center gap-1 text-body-md text-gray-1000 focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            <img src={arrowLeftIcon} alt="" className="size-6" />
            메인페이지
          </Link>
          <div className="mx-2 h-px bg-element" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <h2 className="px-5 text-body-sm text-gray-300">최근</h2>
          {threads.length === 0 ? (
            <p className="flex flex-1 items-center justify-center text-body-sm text-gray-300">
              최근 대화가 없습니다.
            </p>
          ) : (
            <ul className="scrollbar-slim min-h-0 flex-1 overflow-y-auto">
              {threads.map((thread) => (
                <ChatHistoryItem
                  key={thread.id}
                  thread={thread}
                  selected={thread.id === activeThreadId}
                  onSelect={onThreadSelect}
                  onDelete={onThreadDelete}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="flex items-center gap-1 px-5 py-3 text-body-md text-gray-1000 focus-visible:outline-2 focus-visible:outline-primary-500"
      >
        <img src={plusIcon} alt="" className="size-6" />새 대화 시작
      </button>
    </aside>
  )
}
