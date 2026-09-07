import { Suspense } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getAccessToken } from '@/shared/api'
import { AppSidebar } from '@/shared/components/AppSidebar'
import { RouteFallback } from '@/shared/components/RouteFallback'

// fallback 엘리먼트를 모듈 스코프에 한 번만 만들어 재사용
const routeFallback = <RouteFallback />

// 사이드바 게이지 목데이터
const ROADMAP_PROGRESS = 64

/**
 * `<Outlet />` 영역만 교체되며 로딩된다(단 하나의 `<Suspense>` 경계)
 * @returns 사이드바 + Suspense로 감싼 `<Outlet />` 레이아웃
 */
export function RootLayout() {
  const location = useLocation()

  if (!getAccessToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // TODO: ThemeToggle이 있던 자리
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
