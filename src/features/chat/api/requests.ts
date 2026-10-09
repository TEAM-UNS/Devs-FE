import { get } from '@/shared/api'
import type {
  ChatMessageListResponse,
  ChatSessionListResponse,
} from '../types/chatApi'

/** 최근 대화 목록. 서버 기본값대로 최근 20개만 받는다 */
export async function fetchChatSessions(): Promise<ChatSessionListResponse> {
  return get<ChatSessionListResponse>('/chat/sessions')
}

/** 한 대화의 전체 메시지. 남의 대화거나 없는 대화면 404 */
export async function fetchChatMessages(
  sessionId: number,
): Promise<ChatMessageListResponse> {
  return get<ChatMessageListResponse>(`/chat/sessions/${sessionId}/messages`)
}
