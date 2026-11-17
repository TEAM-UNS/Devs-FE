import { Suspense, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLatestRoadmapProgress } from '@/features/roadmap'
import { getAccessToken } from '@/shared/api'
import { AppSidebar, SidebarDrawer } from '@/shared/components/AppSidebar'
import { MenuIcon } from '@/shared/components/icons'
import { ROUTES } from '@/shared/constants'
import { cn } from '@/shared/utils/cn'

/* 화면 코드는 금방 받으므로 본문은 비워 두고 사이드바만 보인다. 데이터를 기다리는 동안의 스켈레톤은
   각 화면이 카드 자리마다 그린다. 모듈 스코프에 한 번만 만들어 재사용 */
const routeFallback = (
  <div role="status">
    <span className="sr-only">페이지를 불러오는 중…</span>
  </div>
)

/**
 * `<Outlet />` 영역만 교체되며 로딩된다(단 하나의 `<Suspense>` 경계)
 * @returns 사이드바 + Suspense로 감싼 `<Outlet />` 레이아웃
 */
export function RootLayout() {
  const location = useLocation()
  const loggedIn = Boolean(getAccessToken())
  // 비로그인 챗봇은 잠금 안내라, 다른 화면처럼 앱 사이드바를 둬서 메뉴로 나갈 수 있게 한다
  const isChatPage = location.pathname === ROUTES.chat && loggedIn
  // 사이드바 진행도는 가장 최근 로드맵의 학습률. 로그인 전에는 부르지 않는다
  const roadmapProgress = useLatestRoadmapProgress(loggedIn)
  // 1024px 미만에서 햄버거로 여는 사이드바. 버튼과 메뉴가 둘 다 여기 있어 밖으로 꺼내지 않는다
  const [menuOpen, setMenuOpen] = useState(false)
  /* 뒤로가기처럼 메뉴 밖에서 화면이 바뀌어도 닫는다. 챗봇으로 가면 서랍이 빠져 onClose가 안 불리므로
     경로 변화를 직접 본다. effect 대신 렌더 중에 맞춰 열린 서랍이 한 번 그려지는 것도 막는다 */
  const [menuPathname, setMenuPathname] = useState(location.pathname)
  if (menuPathname !== location.pathname) {
    setMenuPathname(location.pathname)
    setMenuOpen(false)
  }

  // 비로그인이면 null — 로그인 링크
  const sidebar = (
    <AppSidebar roadmapProgress={loggedIn ? roadmapProgress : null} />
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
