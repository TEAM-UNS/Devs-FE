import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface PageContainerProps {
  readonly className?: string
  readonly children: ReactNode
}

/**
 * 앱 화면 본문 폭 — 메인·마이페이지와 같은 1120px 그리드(Figma 290:1054)
 * 화면이 넓어도 본문이 이 폭을 넘지 않고 가운데로 모여, 페이지마다 옆 여백이 같다
 * 배경을 화면 끝까지 까는 화면(챗봇·익명 게시판)은 쓰지 않는다
 */
export function PageContainer({ className, children }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[1120px]', className)}>
      {children}
    </div>
  )
}
