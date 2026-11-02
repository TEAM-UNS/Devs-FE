import { Outlet } from 'react-router-dom'
import boardBackground from '@/assets/locked/board.jpg'
import chatBackground from '@/assets/locked/chat.jpg'
import myBackground from '@/assets/locked/my.jpg'
import roadmapBackground from '@/assets/locked/roadmap.jpg'
import stackBackground from '@/assets/locked/stack.jpg'
import weeklyBackground from '@/assets/locked/weekly.jpg'
import { getAccessToken } from '@/shared/api'
import { LoginRequired } from '@/shared/components/LoginRequired'

/* 배경은 Figma 각 화면(사이드바 제외 1200×900)을 반으로 줄인 JPEG. 흐리게 깔아서 해상도가 드러나지 않는다
   안내 문구는 주간리포트만 Figma(2166:10396)에 있고 나머지는 초안 */
const LOCKS = {
  weeklyReport: {
    title: '주간리포트',
    message: '매주 나의 전공 맞춤 주간 리포트를 받아보세요!',
    background: weeklyBackground,
  },
  stackCompare: {
    title: '기업 스택 비교',
    message: '관심 기업들의 기술 스택을 비교해보세요!',
    background: stackBackground,
  },
  roadmap: {
    title: '로드맵',
    message: '나에게 맞춘 학습 로드맵을 받아보세요!',
    background: roadmapBackground,
  },
  retrospect: {
    title: '익명 회고 게시판',
    message: '다른 러너들의 익명 회고를 둘러보세요!',
    background: boardBackground,
  },
  chat: {
    title: 'AI 챗봇',
    message: '커리어 고민을 AI 챗봇에게 물어보세요!',
    background: chatBackground,
  },
  myPage: {
    title: '마이페이지',
    message: '나의 전공과 기술 스택을 관리해보세요!',
    background: myBackground,
  },
} as const

interface AuthGateProps {
  /** 비로그인일 때 띄울 잠금 화면 */
  readonly lock: keyof typeof LOCKS
}

/**
 * 로그인해야 쓸 수 있는 화면 묶음. 로그인했으면 그대로, 아니면 그 화면의 잠금 안내를 그린다
 * 로그인으로 튕기지 않고 사이드바를 둔 채 안내만 바꿔서, 비로그인도 메뉴를 둘러볼 수 있다
 */
export function AuthGate({ lock }: AuthGateProps) {
  if (getAccessToken()) return <Outlet />
  return <LoginRequired {...LOCKS[lock]} />
}
