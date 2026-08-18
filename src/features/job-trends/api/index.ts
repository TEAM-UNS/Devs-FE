// api 세그먼트 배럴. 외부(hooks·components)는 `../api`로만 접근한다.
// 목업 스토어는 숨기고, 쿼리 팩토리 + 뮤테이션 함수만 노출한다.
export { trendQueries } from './trendQueries'
export { dismissTrend } from './requests'
