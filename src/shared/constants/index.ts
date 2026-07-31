/**
 * 앱 전역에서 쓰는 구조적 상수. 특정 도메인(예: todo, user) 개념은 넣지 않는다.
 * 도메인 상수는 각 feature 폴더 안에서 관리한다.
 */
/**
 * 사이드바 네비게이션이 가리키는 경로. `home` 외 5개는 아직 라우트가 없어
 * 진입 시 NotFoundPage로 떨어진다 (화면 구현 시 routes.tsx에 추가).
 */
export const ROUTES = {
  home: '/',
  weeklyReport: '/weekly-report',
  stackCompare: '/stack-compare',
  roadmap: '/roadmap',
  chat: '/chat',
  myPage: '/my',
  about: '/about',
} as const

export const MEDIA_QUERIES = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
} as const
