// ─────────────────────────────────────────────────────────────
// ⚠️ 레퍼런스 스캐폴드 — 디자인 시스템 구축 후 실제 UI로 대체 예정.
// (404 라우트 매핑 자체는 유지, 시각 표현만 교체)
// ─────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { PageTitle } from '@/shared/components/PageTitle'

/**
 * 404 페이지. 매칭되지 않는 경로(`*`)에서 렌더되며 홈으로 돌아가는 링크를 제공한다.
 *
 * @returns 404 안내 화면
 */
export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-md p-6 text-center">
      <PageTitle name="페이지를 찾을 수 없음" />
      <h1 className="text-2xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-600">페이지를 찾을 수 없습니다.</p>
      <Link to={ROUTES.home} className="mt-4 inline-block text-indigo-600">
        홈으로 돌아가기
      </Link>
    </section>
  )
}
