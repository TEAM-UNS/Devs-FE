/* http.ts·queryClient.ts가 함께 쓰는 에러. 여러 테스트가 `@/shared/api`·`http`를 가짜로 바꿔 쓰는데,
   클래스가 거기 있으면 가짜 모듈에선 사라져 instanceof가 깨진다. 그래서 따로 둔다 */

/**
 * 로그인이 필요한 요청을 토큰 없이 보내려 할 때. 서버에 보내지 않고 바로 실패시킨다
 * 로그아웃 직후 아직 화면에 남은 쿼리가 다시 불리는 경우처럼 사용자가 알 필요 없는 실패라
 * 공통 에러 토스트는 이 에러를 띄우지 않는다
 */
export class NotLoggedInError extends Error {
  constructor(path: string) {
    super(`로그인이 필요한 요청을 토큰 없이 보내려 했다: ${path}`)
    this.name = 'NotLoggedInError'
  }
}
