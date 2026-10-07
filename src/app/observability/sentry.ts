import * as Sentry from '@sentry/react'

/**
 * Sentry 초기화 (에러 + Performance Monitoring).
 * DSN은 환경변수(VITE_SENTRY_DSN)로 주입하며, 없으면 초기화를 건너뛴다.
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [
      // Performance Monitoring: 페이지 로드/네비게이션 트랜잭션 자동 수집
      Sentry.browserTracingIntegration(),
    ],
    /* 성능 추적만 솎아낸다. 에러는 샘플링과 무관하게 전부 올라간다
       화면 이동마다 트랜잭션이 쌓여 무료 할당량을 금방 먹으므로 20%만 보낸다 */
    tracesSampleRate: 0.2,
  })
}

const captureRenderError = Sentry.reactErrorHandler()

/**
 * createRoot 에러 훅. 라우터가 자체 에러 경계로 페이지 렌더링 에러를 먼저 잡아서
 * 바깥 ErrorBoundary나 전역 핸들러로는 Sentry까지 오지 않는다
 * React 19는 어느 경계가 잡든 이 훅을 부르므로 여기서 보고한다
 */
export function reportRenderError(
  ...[error, errorInfo]: Parameters<typeof captureRenderError>
) {
  captureRenderError(error, errorInfo)
  // 훅을 넘기면 React 기본 콘솔 출력이 사라져 다시 남긴다
  console.error(error)
}
