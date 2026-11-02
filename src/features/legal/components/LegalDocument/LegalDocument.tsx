import { type ReactNode, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DevsLogo } from '@/shared/components/icons'
import { ROUTES } from '@/shared/constants'

/* 법률 문서 화면 — Figma에 디자인이 없어 디자인 토큰(타이포·회색 스케일·surface)으로 읽기 좋게 맞췄다
   본문은 팀이 준 문구 그대로 옮기고, 이 파일은 모양만 맡는다 */

interface LegalDocumentProps {
  readonly title: string
  /** 제목 아래 머리말 */
  readonly intro: ReactNode
  readonly children: ReactNode
}

/** 로고 바 + 가운데 정렬 본문. 로그인 없이 열리는 화면이라 앱 사이드바 없이 그린다 */
export function LegalDocument({ title, intro, children }: LegalDocumentProps) {
  /* 랜딩은 문서 전체가 스크롤돼서, 맨 아래 푸터 링크로 넘어오면 그 위치가 그대로 남아 문서 끝이 보인다
     문서는 처음부터 읽게 열 때 맨 위로 올린다 */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-full bg-canvas text-gray-1000">
      <header className="flex h-16 items-center border-b border-element px-12">
        <Link to={ROUTES.landing} aria-label="Devs 홈으로">
          <DevsLogo />
        </Link>
      </header>
      <main className="mx-auto flex max-w-[880px] flex-col gap-12 px-6 py-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-h1">{title}</h1>
          <p className="text-body-md text-gray-400">{intro}</p>
        </div>
        {children}
      </main>
    </div>
  )
}

interface LegalSectionProps {
  readonly title: string
  readonly children: ReactNode
}

/** 조 하나 — 제목과 본문 */
export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-h3">{title}</h2>
      <div className="flex flex-col gap-3 text-body-md text-gray-500">
        {children}
      </div>
    </section>
  )
}

/** 번호 목록 */
export function LegalList({ children }: { readonly children: ReactNode }) {
  return <ol className="flex list-decimal flex-col gap-2 pl-6">{children}</ol>
}

/** 점 목록 */
export function LegalBullets({ children }: { readonly children: ReactNode }) {
  return <ul className="flex list-disc flex-col gap-1.5 pl-6">{children}</ul>
}

/** 목록 항목 앞의 굵은 이름 */
export function Term({ children }: { readonly children: ReactNode }) {
  return <strong className="font-semibold text-gray-1000">{children}</strong>
}

interface LegalTableProps {
  readonly head: readonly string[]
  readonly rows: readonly (readonly ReactNode[])[]
}

/** 표. 칸이 많은 표(위탁·국외 이전)는 좁은 화면에서 가로로 스크롤한다 */
export function LegalTable({ head, rows }: LegalTableProps) {
  return (
    <div className="overflow-x-auto rounded-sm border border-element">
      <table className="w-full border-collapse text-left text-body-sm">
        <thead className="bg-container text-gray-1000">
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="border-b border-element px-4 py-3 font-semibold whitespace-nowrap"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            // 문서 내용이 고정이라 순서가 바뀌지 않는다
            <tr
              key={rowIndex}
              className="border-b border-element last:border-b-0"
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** 본문 속 외부 링크 */
export function ExternalLink({
  href,
  children,
}: {
  readonly href: string
  readonly children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary-300 underline underline-offset-2"
    >
      {children}
    </a>
  )
}
