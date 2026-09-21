export type ChatMessage = {
  readonly id: string
  readonly role: 'user' | 'assistant'
  readonly content: string
}

export type ChatThread = {
  readonly id: string
  readonly title: string
  readonly messages: readonly ChatMessage[]
}
