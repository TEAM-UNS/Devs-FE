// api 세그먼트 배럴. 외부(hooks·components)는 `../api`로만 접근한다.
//
// 재발급(POST /reissue)은 여기 없다 — 401 재시도가 HTTP 층의 책임이라
// `shared/api/http`가 직접 호출한다. 두면 같은 엔드포인트가 두 곳에 생긴다.
export {
  signup,
  login,
  sendEmailCode,
  verifyEmail,
  exchangeOAuthToken,
  updateMajor,
  updateTechStack,
} from './requests'
