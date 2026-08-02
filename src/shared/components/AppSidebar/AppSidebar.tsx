import { NavLink } from 'react-router-dom'
import {
  ChatBubbleIcon,
  ClipboardListIcon,
  HomeIcon,
  LayersIcon,
  RouteIcon,
  UNSLogo,
  UserIcon,
} from '@/shared/components/icons'
import { ROUTES } from '@/shared/constants'
import { cn } from '@/shared/utils/cn'

interface AppSidebarProps {
  /** 하단 게이지에 표시할 로드맵 진행도 (0~100) */
  roadmapProgress: number
}

// 아래 상수는 모듈 스코프 — 렌더마다 새로 만들지 않는다.

const NAV_ITEMS = [
  { to: ROUTES.home, label: '메인페이지', Icon: HomeIcon },
  { to: ROUTES.weeklyReport, label: '주간리포트', Icon: ClipboardListIcon },
  { to: ROUTES.stackCompare, label: '기업 스택 비교', Icon: LayersIcon },
  { to: ROUTES.roadmap, label: '로드맵', Icon: RouteIcon },
  { to: ROUTES.chat, label: 'AI 챗봇', Icon: ChatBubbleIcon },
  { to: ROUTES.myPage, label: '마이페이지', Icon: UserIcon },
] as const

// 항목 골격. 활성 항목만 좌측 2px 보더가 붙어 내용이 2px 안쪽으로 밀린다 — Figma 274:1470 렌더 그대로.
// TODO: hover 상태는 Figma에 스펙이 없어 비워 뒀다. 디자이너 확정 후 hover: 색을 넣는다.
const ITEM_BASE = 'flex w-full items-center gap-2 px-5 py-2 text-body-sm'
const ITEM_ACTIVE = 'border-l-2 border-primary-400 font-semibold text-gray-1000'
const ITEM_IDLE = 'text-gray-400'

// 키보드 포커스 링 — Figma엔 없지만 a11y용으로 추가 (모션/색은 앱 토큰).
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500'

/** 앱 전역 사이드바 — 로고 · 주요 화면 네비게이션 · 하단 로드맵 진행도 게이지. */
export function AppSidebar({ roadmapProgress }: AppSidebarProps) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col justify-between border-r border-element bg-container py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="px-5">
            <UNSLogo className="h-6" />
          </div>
          {/* 구분선은 좌우 20px 안쪽까지만 그어진다 (Figma: x20→x220). */}
          <div className="px-5">
            <div className="h-px bg-element" />
          </div>
        </div>
        <nav aria-label="주요 메뉴">
          <ul className="flex flex-col gap-1.5">
            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  className={({ isActive }) =>
                    cn(
                      ITEM_BASE,
                      FOCUS_RING,
                      isActive ? ITEM_ACTIVE : ITEM_IDLE,
                    )
                  }
                >
                  <Icon className="size-5 shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex flex-col gap-2 px-5">
        <div className="flex items-center justify-between text-body-sm">
          <span className="text-gray-1000">로드맵 진행도</span>
          <span className="text-primary-400">{roadmapProgress}%</span>
        </div>
        <div
          className="h-2 overflow-clip rounded-full border border-gray-200 bg-element"
          role="progressbar"
          aria-label="로드맵 진행도"
          aria-valuenow={roadmapProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* 데이터로 결정되는 폭이라 말단 엘리먼트에 한해 inline style을 쓴다 (CONVENTIONS §7 예외). */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-300"
            style={{ width: `${roadmapProgress}%` }}
          />
        </div>
      </div>
    </aside>
  )
}
