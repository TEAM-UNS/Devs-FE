import { trackEvent } from './amplitude'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/**
 * 페이지 조회를 GA4(GTM)와 Amplitude에 보낸다
 * 두 도구의 자동 수집은 주소가 바뀌는 순간 제목을 읽는데, 페이지가 lazy 로딩이라 그때는
 * 아직 이전 페이지 제목이다. 그래서 자동 수집을 끄고 제목이 들어간 뒤 여기서 보낸다
 */
export function trackPageView(title: string) {
  const { href, pathname } = window.location

  // GTM의 맞춤 이벤트 트리거가 이 이름으로 GA4 page_view를 보낸다
  window.dataLayer?.push({
    event: 'spa_page_view',
    page_title: title,
    page_location: href,
  })
  trackEvent('Page Viewed', { page_title: title, page_path: pathname })
}
