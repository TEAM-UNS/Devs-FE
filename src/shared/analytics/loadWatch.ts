declare global {
  interface Window {
    /** index.html의 로딩 이탈 감시가 만든다. 개발 빌드·키 없음이면 없다 */
    __pageLoad?: { appStarted: boolean; shown: boolean; sent?: boolean }
  }
}

/** 기본 코드가 실행됐다고 알린다. 이후 이탈은 페이지 코드를 받거나 그리는 중으로 센다 */
export function markAppStarted() {
  if (window.__pageLoad) window.__pageLoad.appStarted = true
}

/** 첫 페이지가 그려졌다고 알린다. Page Viewed와 같은 순간이라 이후로는 이탈로 세지 않는다 */
export function markPageShown() {
  if (window.__pageLoad) window.__pageLoad.shown = true
}
