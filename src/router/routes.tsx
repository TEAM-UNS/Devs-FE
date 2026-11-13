/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { RouteFallback } from '@/shared/components/RouteFallback'
import { ROUTES } from '@/shared/constants'
import { AuthGate } from './AuthGate'
import { RootLayout } from './RootLayout'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const WeeklyReportPage = lazy(() => import('@/pages/WeeklyReportPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const SignupPage = lazy(() => import('@/pages/SignupPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const OAuthCallbackPage = lazy(() => import('@/pages/OAuthCallbackPage'))
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const TermsPage = lazy(() => import('@/pages/TermsPage'))
const ChatPage = lazy(() => import('@/pages/ChatPage'))
const MyPage = lazy(() => import('@/pages/MyPage'))
const MyRetrospectsPage = lazy(() => import('@/pages/MyRetrospectsPage'))
const MajorEditPage = lazy(() => import('@/pages/MajorEditPage'))
const TechStackEditPage = lazy(() => import('@/pages/TechStackEditPage'))
const StackComparePage = lazy(() => import('@/pages/StackComparePage'))
const RoadmapPage = lazy(() => import('@/pages/RoadmapPage'))
const RoadmapCreatePage = lazy(() => import('@/pages/RoadmapCreatePage'))
const RetrospectBoardPage = lazy(() => import('@/pages/RetrospectBoardPage'))
const StackCompareResultPage = lazy(
  () => import('@/pages/StackCompareResultPage'),
)

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

function LandingRoute() {
  return (
    <Suspense fallback={authFallback}>
      <LandingPage />
    </Suspense>
  )
}

function NotFoundRoute() {
  return (
    <Suspense fallback={authFallback}>
      <NotFoundPage />
    </Suspense>
  )
}

function MajorEditRoute() {
  return (
    <Suspense fallback={authFallback}>
      <MajorEditPage />
    </Suspense>
  )
}

function TechStackEditRoute() {
  return (
    <Suspense fallback={authFallback}>
      <TechStackEditPage />
    </Suspense>
  )
}

/* 법률 문서는 랜딩처럼 비로그인 방문자도 보는 화면이라 가드(RootLayout) 밖에 둔다 */
function PrivacyRoute() {
  return (
    <Suspense fallback={authFallback}>
      <PrivacyPage />
    </Suspense>
  )
}

function TermsRoute() {
  return (
    <Suspense fallback={authFallback}>
      <TermsPage />
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
  /* OAuth 콜백은 가드 밖에 둠 이유는 도착 시점에는 아직 토큰이 없어서, 가드 안에 두면
     토큰 교환을 해보기도 전에 로그인 화면으로 튕김 */
  {
    path: '/oauth/callback',
    element: <OAuthCallbackRoute />,
  },
  {
    path: '/onboarding',
    element: <OnboardingRoute />,
  },
  /* 마이페이지 수정은 온보딩처럼 전체 화면이라 RootLayout 밖에 둔다
     잠금 화면은 RootLayout 안에서만 맞게 그려져서, 비로그인은 마이페이지(잠금 화면)로 보낸다 */
  {
    element: <AuthGate guestRedirect={ROUTES.myPage} />,
    children: [
      { path: '/my/major', element: <MajorEditRoute /> },
      { path: '/my/tech-stack', element: <TechStackEditRoute /> },
    ],
  },
  /* 랜딩은 비로그인 방문자용이라 가드(RootLayout) 밖에 둔다 */
  {
    path: '/',
    element: <LandingRoute />,
  },
  {
    path: '/privacy',
    element: <PrivacyRoute />,
  },
  {
    path: '/terms',
    element: <TermsRoute />,
  },
  /* 메인·소개는 비로그인도 본다. 나머지는 AuthGate가 비로그인이면 잠금 안내로 바꾼다 */
  {
    element: <RootLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'about', element: <AboutPage /> },
      {
        element: <AuthGate lock="weeklyReport" />,
        children: [{ path: 'weekly-report', element: <WeeklyReportPage /> }],
      },
      {
        element: <AuthGate lock="stackCompare" />,
        children: [
          { path: 'stack-compare', element: <StackComparePage /> },
          { path: 'stack-compare/result', element: <StackCompareResultPage /> },
        ],
      },
      {
        element: <AuthGate lock="roadmap" />,
        children: [
          { path: 'roadmap', element: <RoadmapPage /> },
          { path: 'roadmap/new', element: <RoadmapCreatePage /> },
        ],
      },
      {
        element: <AuthGate lock="retrospect" />,
        children: [{ path: 'retrospect', element: <RetrospectBoardPage /> }],
      },
      {
        element: <AuthGate lock="chat" />,
        children: [{ path: 'chat', element: <ChatPage /> }],
      },
      {
        element: <AuthGate lock="myPage" />,
        children: [
          { path: 'my', element: <MyPage /> },
          { path: 'my/retrospects', element: <MyRetrospectsPage /> },
        ],
      },
    ],
  },
  /* 없는 경로는 사이드바 없이 전체 화면 404 (Figma 662:7087). 가드 밖이라 로그인 여부와 상관없이 같다 */
  {
    path: '*',
    element: <NotFoundRoute />,
  },
]
