/* 이 파일은 컴포넌트 모듈이 아니라 "라우트 설정" 모듈이라 fast-refresh 대상이 아니다.
   lazy 컴포넌트 정의와 routes 배열(비컴포넌트)을 함께 export 하므로 해당 규칙을 끈다. */
/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { RouteFallback } from '@/shared/components/RouteFallback'
import { RootLayout } from './RootLayout'

/**
 * ── 라우트 단위 코드 스플리팅 ──
 * 각 페이지를 React.lazy로 감싸면 Vite가 페이지별 청크(DashboardPage.[hash].js 등)를
 * 분리 생성한다. 최초 진입 시에는 진입한 라우트의 청크만 내려받고, 다른 페이지는
 * 실제로 이동할 때 네트워크로 가져온다 → 초기 번들 크기와 LCP를 줄인다.
 *
 * lazy를 "라우트 경계"에 적용하는 이유:
 * - 사용자는 보통 한 번에 하나의 페이지만 본다. 페이지는 자연스러운 분할 단위다.
 * - RootLayout(공통 네비게이션)은 lazy로 감싸지 않는다. 항상 즉시 필요하고,
 *   여기에 Suspense 경계를 두어 자식 청크 로딩을 한 곳에서 처리하기 때문이다.
 */
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const SignupPage = lazy(() => import('@/pages/SignupPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const OAuthCallbackPage = lazy(() => import('@/pages/OAuthCallbackPage'))
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'))

// 인증 화면은 전체 화면(네비 없음)이라 RootLayout 밖에 두고 자체 Suspense로 감싼다.
const authFallback = <RouteFallback />

function SignupRoute() {
  return (
    <Suspense fallback={authFallback}>
      <SignupPage />
    </Suspense>
  )
}

function LoginRoute() {
  return (
    <Suspense fallback={authFallback}>
      <LoginPage />
    </Suspense>
  )
}

function OAuthCallbackRoute() {
  return (
    <Suspense fallback={authFallback}>
      <OAuthCallbackPage />
    </Suspense>
  )
}

function OnboardingRoute() {
  return (
    <Suspense fallback={authFallback}>
      <OnboardingPage />
    </Suspense>
  )
}

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginRoute />,
  },
  {
    path: '/signup',
    element: <SignupRoute />,
  },
  /* OAuth 콜백은 가드 밖에 둔다 — 도착 시점에는 아직 토큰이 없어서, 가드 안에 두면
     토큰 교환을 해보기도 전에 로그인 화면으로 튕긴다.
     온보딩은 이미 로그인된 상태로 보는 화면이지만 회원가입처럼 전체 화면이라
     RootLayout(사이드바) 밖에 둔다. */
  {
    path: '/oauth/callback',
    element: <OAuthCallbackRoute />,
  },
  {
    path: '/onboarding',
    element: <OnboardingRoute />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
