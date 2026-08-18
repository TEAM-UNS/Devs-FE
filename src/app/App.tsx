import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { ToastViewport } from '@/shared/components/ToastViewport'
import { AppProviders } from './providers/AppProviders'
import { useApplyTheme } from './theme/useApplyTheme'

/**
 * 루트 컴포넌트: 전역 Provider로 감싼 뒤 라우터를 연결한다.
 *
 * @returns Provider + RouterProvider로 구성된 앱 루트
 */
export function App() {
  // 전역 테마 상태를 <html> class에 동기화 (다크/라이트 적용)
  useApplyTheme()

  // TODO(배포 전): Sentry 프로젝트 생성 후, 여기서 <RouterProvider>를
  // Sentry.ErrorBoundary로 감싸 렌더링 중 발생한 에러를 잡고 리포트한다.
  // (현재는 Sentry 계정/프로젝트 미설정 상태라 보류)
  return (
    <AppProviders>
      <RouterProvider router={router} />
      {/* 인증 화면과 앱 화면이 레이아웃을 공유하지 않아, 공통 조상인 여기에 둔다. */}
      <ToastViewport />
    </AppProviders>
  )
}
