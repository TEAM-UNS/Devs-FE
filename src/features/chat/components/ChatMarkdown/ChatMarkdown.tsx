import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

/* 답변 속 마크다운 태그마다 입힐 스타일. 디자인에 답변 서식 스펙이 없어 기존 토큰으로만 임시로 맞췄다 */
const COMPONENTS: Components = {
  h1: ({ children }) => (
    <h3 className="text-body-lg font-semibold">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="text-body-lg font-semibold">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="text-body-md font-semibold">{children}</h4>
  ),
  p: ({ children }) => <p>{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
  hr: () => <hr className="border-element" />,
  // AI가 공고 링크를 붙일 수 있다. 대화를 잃지 않게 새 탭으로 열고, 열린 페이지가 이 창을 건드리지 못하게 한다
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-500 underline"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded-sm bg-element px-1 text-body-sm">{children}</code>
  ),
  // 표는 폭이 넓을 수 있어 답변 폭 안에서 가로로 스크롤한다
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="border-collapse text-body-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-element px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-element px-3 py-2">{children}</td>
  ),
}

/** remark-gfm: 표·취소선 같은 GitHub 확장 문법. AI가 비교 답변에 표를 쓸 수 있다 */
const REMARK_PLUGINS = [remarkGfm]

interface ChatMarkdownProps {
  readonly content: string
}

/**
 * 챗봇 답변을 마크다운으로 그린다
 * react-markdown은 HTML 태그를 그리지 않는다. 답변 재료가 채용공고 원문이라 섞여 온 HTML이
 * 실행되면 안 되므로, 이 기본값을 바꾸는 rehype-raw 같은 플러그인은 넣지 않는다
 */
export function ChatMarkdown({ content }: ChatMarkdownProps) {
  return (
    <div className="flex min-w-0 flex-col gap-3 text-body-md text-gray-1000">
      <Markdown remarkPlugins={REMARK_PLUGINS} components={COMPONENTS}>
        {content}
      </Markdown>
    </div>
  )
}
