/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { RouteFallback } from '@/shared/components/RouteFallback'
import { RootLayout } from './RootLayout'

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const WeeklyReportPage = lazy(() => import('@/pages/WeeklyReportPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const SignupPage = lazy(() => import('@/pages/SignupPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const OAuthCallbackPage = lazy(() => import('@/pages/OAuthCallbackPage'))
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'))

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
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'weekly-report', element: <WeeklyReportPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
