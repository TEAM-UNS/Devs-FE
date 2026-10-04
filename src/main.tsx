import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Pretendard 가변 폰트 자체호스팅 (외부 CDN 요청 없이 Vite가 번들)
// TODO(perf): 전체 가변폰트(~2MB) → dynamic-subset으로 교체해 초기 로딩 최적화
//   (import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css')
import 'pretendard/dist/web/variable/pretendardvariable.css'
import './index.css'
import { App } from '@/app/App'
import { initSentry } from '@/app/observability/sentry'
import { reportWebVitals } from '@/app/observability/reportWebVitals'
import { initAmplitude } from '@/shared/analytics'

// 개발 환경에서만 why-did-you-render를 로드해 리렌더 원인을 콘솔에 출력.
// 동적 import이므로 프로덕션 번들에는 포함되지 않으며, React를 패치해야 하므로
// 첫 렌더 이전에 await 한다.
if (import.meta.env.DEV) {
  await import('@/app/observability/wdyr')
}

initSentry()
initAmplitude()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Core Web Vitals 수집 시작 (LCP/CLS/INP)
reportWebVitals()
