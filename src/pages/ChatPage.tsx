import { Chat } from '@/features/chat'
import { PageTitle } from '@/shared/components/PageTitle'

/** AI 챗봇 페이지 */
export default function ChatPage() {
  return (
    <>
      <PageTitle name="AI 챗봇" />
      <Chat />
    </>
  )
}
