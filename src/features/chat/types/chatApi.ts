/* 서버 응답 타입. Swagger에 required가 없어 null 여부는 백엔드 엔티티로 확인했다 */

import type { ZodNumber } from 'zod'

/** 대화 기록에서 사용하는 역할 */
export type ChatRole = 'user' | 'assistant'

export interface ChatSessionDto {
  id: ZodNumber
  title: string | null
  lastMessageAt: string
}

/** GET /chat/sessions */
export interface ChatSessionListResponse {
  sessions: ChatSessionDto[]
}

export interface ChatMessageDto {
  id: number
  role: ChatRole
  /** 답변은 마크다운이 섞인 텍스트 */
  content: string
}

/** GET /chat/sessions/{sessionId}/messages */
export interface ChatMessageListResponse {
  sessionId: number
  title: string | null
  messages: ChatMessageDto[]
}

/** POST /chat/messages sessionId가 없으면 서버가 새 대화를 만든다 */
export interface ChatSendRequest {
  sessionId?: number
  message: string
}

/*
 * SSE 이벤트. 백엔드가 AI 서버 스트림을 가공 없이 넘겨서 data 필드가 snake_case
 * `event:` 줄이 이벤트 종류, `data:` 줄이 JSON 내용이다
 */
export type ChatStreamEvent =
  /** 맨 처음 한 번 새 대화면 is_new가 true */
  | { event: 'session'; data: { session_id: number; is_new: boolean } }
  /** 새 대화일 때만 답변 도중 아무 때나 도착한다 */
  | { event: 'title'; data: { title: string } }
  /** label은 "기술 연관 관계를 분석하고 있어요" 같은 진행 문구 */
  | { event: 'tool_start'; data: { tool: string; label: string } }
  /** 답변 텍스트 조각 이어 붙이면 마크다운 답변이 된다 */
  | { event: 'token'; data: { text: string } }
  /** 정상 종료 tools_used·usage 등도 오지만 화면에서 쓰는 것만 둔다 */
  | { event: 'done'; data: { message_id: number } }
  /**
   * 스트림 도중 오류. 이 이벤트 뒤에 스트림이 끝난다
   * AI 서버는 JSON을 보내지만 백엔드가 직접 만드는 에러는 평문 문장이라 code가 없을 수 있다
   */
  | {
      event: 'error'
      data: { code?: string; message: string; recoverable?: boolean }
    }
