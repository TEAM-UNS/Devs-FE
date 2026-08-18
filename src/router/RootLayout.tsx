import { Suspense } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getAccessToken } from '@/shared/api'
import { AppSidebar } from '@/shared/components/AppSidebar'
import { RouteFallback } from '@/shared/components/RouteFallback'

// fallback 엘리먼트를 모듈 스코프에 한 번만 만들어 재사용한다.
// (렌더마다 <RouteFallback /> 를 새로 만들지 않도록 — react-perf)
const routeFallback = <RouteFallback />

// 사이드바 게이지 목데이터 — 로드맵 API 연동 시 교체한다.
const ROADMAP_PROGRESS = 64

/**
 * 로그인 후 화면을 감싸는 앱 셸. 좌측 사이드바는 라우트가 바뀌어도 유지되고,
 * `<Outlet />` 영역만 교체되며 로딩된다(단 하나의 `<Suspense>` 경계).
 *
 * @returns 사이드바 + Suspense로 감싼 `<Outlet />` 레이아웃
 */
export function RootLayout() {
  const location = useLocation()

  // 라우트 가드 — accessToken이 없으면 로그인 화면으로 보낸다.
  // 만료 여부는 여기서 보지 않는다. 만료된 토큰은 요청이 401로 돌아올 때
  // HTTP 층이 재발급을 시도하고, 그마저 실패하면 토큰을 지워 다음 이동에서 걸린다.
  // `state.from`: 로그인 후 원래 가려던 곳으로 돌려보내려고 남긴다.
  if (!getAccessToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // TODO: ThemeToggle이 있던 자리. Figma 메인페이지에 토글 슬롯이 없어 이번
  // 퍼블리싱에서 화면에서 빠졌다(컴포넌트는 shared에 그대로 있다). 노출 위치 확정 후 되살린다.
  return (
    <div className="flex h-full bg-canvas text-gray-1000">
      <AppSidebar roadmapProgress={ROADMAP_PROGRESS} />
      <main className="min-w-0 flex-1 overflow-y-auto p-10">
        <Suspense fallback={routeFallback}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
