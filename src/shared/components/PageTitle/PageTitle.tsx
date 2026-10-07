import { useEffect } from 'react'
import { trackPageView } from '@/shared/analytics'

const SERVICE_NAME = 'Devs'

interface PageTitleProps {
  /** 페이지 이름. 없으면 서비스 이름만 쓴다 */
  name?: string
}

/**
 * 브라우저 탭 제목과 페이지 조회 수집. React 19가 어디서 렌더링하든 <title>을 <head>로 올려 준다
 *
 * 페이지 조회를 여기서 보내는 이유: effect는 <title>이 반영된 커밋 뒤에 돌아서 새 제목이 확실히 들어가 있다
 * 페이지가 바뀔 때만 마운트되므로 주간 리포트처럼 쿼리만 바뀌는 이동은 조회로 세지 않는다
 */
export function PageTitle({ name }: PageTitleProps) {
  const title = name ? `${SERVICE_NAME} | ${name}` : SERVICE_NAME

  useEffect(() => {
    trackPageView(title)
  }, [title])

  return <title>{title}</title>
}
