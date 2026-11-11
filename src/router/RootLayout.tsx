import { useQuery } from '@tanstack/react-query'
import { Suspense, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { roadmapQueries } from '@/features/roadmap'
import { getAccessToken } from '@/shared/api'
import { AppSidebar, SidebarDrawer } from '@/shared/components/AppSidebar'
import { MenuIcon } from '@/shared/components/icons'
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
  const loggedIn = Boolean(getAccessToken())
  // 비로그인 챗봇은 잠금 안내라, 다른 화면처럼 앱 사이드바를 둬서 메뉴로 나갈 수 있게 한다
  const isChatPage = location.pathname === ROUTES.chat && loggedIn
  /* 사이드바 진행도는 내 로드맵 학습률. 로드맵 화면과 같은 캐시라 항목을 체크하면 같이 바뀐다
     로그인 전에는 부르지 않는다 — 401만 돌아와 에러 토스트가 뜬다 */
  const roadmap = useQuery({ ...roadmapQueries.mine(), enabled: loggedIn })
  // 1024px 미만에서 햄버거로 여는 사이드바. 버튼과 메뉴가 둘 다 여기 있어 밖으로 꺼내지 않는다
  const [menuOpen, setMenuOpen] = useState(false)

  // 로드맵이 없거나(null) 만드는 중이면 0%. 비로그인이면 null — 로그인 링크
  const sidebar = (
    <AppSidebar
      roadmapProgress={loggedIn ? (roadmap.data?.learningRate ?? 0) : null}
    />
  )

  // TODO: ThemeToggle이 있던 자리
  return (
    <div className="flex h-full bg-canvas text-gray-1000">
      {!isChatPage && <div className="hidden h-full lg:block">{sidebar}</div>}
      <main
        className={cn(
          'relative min-w-0 flex-1 overflow-y-auto',
          // 여백 값은 index.css의 --page-* (폭마다 다름)
          isChatPage ? 'p-0' : 'p-page',
          // 메뉴가 열린 동안 뒤 화면이 같이 스크롤되지 않게 한다
          menuOpen && 'overflow-hidden',
        )}
      >
        {!isChatPage && (
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
            className="absolute top-[calc(var(--page-pt)-36px)] left-(--page-px) z-raised flex size-6 text-white focus-visible:outline-2 focus-visible:outline-primary-500 lg:hidden"
          >
            <MenuIcon className="size-full" />
          </button>
        )}
        <Suspense fallback={routeFallback}>
          <Outlet />
        </Suspense>
      </main>
      {!isChatPage && (
        <SidebarDrawer open={menuOpen} onClose={() => setMenuOpen(false)}>
          {sidebar}
        </SidebarDrawer>
      )}
    </div>
  )
}
