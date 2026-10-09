export type ChatMessage = {
  readonly id: string
  readonly role: 'user' | 'assistant'
  readonly content: string
}

/** 사이드바에 보이는 대화 하나 */
export type ChatThread = {
  readonly id: number
  readonly title: string
}
