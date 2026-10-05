/**
 * 앱 전역에서 쓰는 구조적 상수. 특정 도메인(예: todo, user) 개념은 넣지 않는다.
 * 도메인 상수는 각 feature 폴더 안에서 관리한다.
 */
/**
 * 사이드바 네비게이션이 가리키는 경로. `stackCompare`·`roadmap`은 아직 라우트가 없어
 * 진입 시 NotFoundPage로 떨어진다 (화면 구현 시 routes.tsx에 추가).
 * `/`는 비로그인 방문자가 처음 보는 랜딩이고, 로그인 후 첫 화면(`home`)은 대시보드다
 */
export const ROUTES = {
  landing: '/',
  home: '/dashboard',
  login: '/login',
  signup: '/signup',
  weeklyReport: '/weekly-report',
  stackCompare: '/stack-compare',
  roadmap: '/roadmap',
  chat: '/chat',
  myPage: '/my',
  about: '/about',

  /* 아래 둘은 네비게이션에 없다. 사용자가 직접 치고 들어오는 주소가 아니라
     OAuth 리다이렉트가 도착하는 곳과 그 뒤에 이어지는 화면이다. */
  oauthCallback: '/oauth/callback',
  onboarding: '/onboarding',
} as const

export const MEDIA_QUERIES = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
} as const
