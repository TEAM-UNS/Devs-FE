import { PageTitle } from '@/shared/components/PageTitle'

// ─────────────────────────────────────────────────────────────
// ⚠️ 레퍼런스 스캐폴드 — 디자인 시스템/실제 화면 구축 후 대체 예정.
// ─────────────────────────────────────────────────────────────
/**
 * 정적 소개 페이지. 기본 export로 두어 라우트 lazy 로딩 대상이 된다.
 *
 * @returns 서비스 소개 화면
 */
export default function AboutPage() {
  return (
    <section className="mx-auto max-w-md p-6">
      <PageTitle name="소개" />
      <h1 className="text-2xl font-bold text-gray-900">소개</h1>
      <p className="mt-2 text-gray-600">팀 UNS의 첫 번째 프로젝트입니다.</p>
    </section>
  )
}
