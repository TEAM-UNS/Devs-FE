import * as amplitude from '@amplitude/unified'

/**
 * Amplitude 초기화 (이벤트 + 세션 리플레이)
 * 개발 중 클릭이 실제 지표에 섞이지 않도록 프로덕션 빌드에서만 킴
 * API 키는 환경변수(VITE_AMPLITUDE_API_KEY)로 주입하며 없으면 초기화를 건너뜀
 */
export function initAmplitude() {
  if (!import.meta.env.PROD) return

  const apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY
  if (!apiKey) {
    console.warn('Amplitude API key missing — analytics disabled')
    return
  }

  amplitude
    .initAll(apiKey, {
      analytics: { autocapture: true },
      // 베타 테스트까지는 1로 두고 추후 트래픽이 증가하면 낮춰야함
      sessionReplay: { sampleRate: 1 },
    })
    // 초기화가 실패해도 화면은 계속 돌아야 하기 때문에 예외처리가 필요함
    .catch(() => console.warn('Amplitude init failed — analytics disabled'))
}

/**
 * 나중에 다른 분석 SDK로 변경할 수도 있기 때문에 SDK에 직접 의존하지 않고 해당 함수를 거치도록 함
 */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  amplitude.track(name, properties)
}

/**
 * 로그아웃할 때 기기 식별을 새로 시작한다
 * 그대로 두면 같은 브라우저로 다음에 로그인한 사람의 행동이 이전 사람과 한 사용자로 묶인다
 */
export function resetAnalytics() {
  amplitude.reset()
}
