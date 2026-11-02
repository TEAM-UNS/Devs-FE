import { useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { roadmapQueries } from '@/features/roadmap'
import { getAccessToken } from '@/shared/api'
import { AppSidebar } from '@/shared/components/AppSidebar'
import { RouteFallback } from '@/shared/components/RouteFallback'
import { ROUTES } from '@/shared/constants'
import { cn } from '@/shared/utils/cn'

// fallback 엘리먼트를 모듈 스코프에 한 번만 만들어 재사용
const routeFallback = <RouteFallback />

/**
 * `<Outlet />` 영역만 교체되며 로딩된다(단 하나의 `<Suspense>` 경계)
 * @returns 사이드바 + Suspense로 감싼 `<Outlet />` 레이아웃
 */
export function RootLayout() {
  const location = useLocation()
  const isChatPage = location.pathname === ROUTES.chat
  const loggedIn = Boolean(getAccessToken())
  /* 사이드바 진행도는 내 로드맵 학습률. 로드맵 화면과 같은 캐시라 항목을 체크하면 같이 바뀐다
     로그인 전에는 부르지 않는다 — 401로 리슈를 돌리다 로그인 화면 이동과 겹친다 */
  const roadmap = useQuery({ ...roadmapQueries.mine(), enabled: loggedIn })

  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // TODO: ThemeToggle이 있던 자리
  return (
    <div className="flex h-full bg-canvas text-gray-1000">
      {!isChatPage && (
        // 로드맵이 없거나(null) 만드는 중이면 0%
        <AppSidebar roadmapProgress={roadmap.data?.learningRate ?? 0} />
      )}
      <main
        className={cn(
          'min-w-0 flex-1 overflow-y-auto',
          isChatPage ? 'p-0' : 'p-10',
        )}
      >
        <Suspense fallback={routeFallback}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
