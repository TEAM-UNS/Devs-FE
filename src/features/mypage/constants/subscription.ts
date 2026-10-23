/**
 * 구독 분야 칩 표기. 회원가입은 영문(`majorLabel`)이지만 마이페이지 디자인(node 659:4785)은 한글이다
 * 표에 없는 코드가 오면 회원가입과 같은 영문 표기를 쓴다
 */
export const SUBSCRIPTION_LABELS: Record<string, string> = {
  BACKEND: '백엔드',
  FRONTEND: '프론트엔드',
  MOBILE: '모바일',
  DATA_AI: '데이터/AI',
  DEVOPS: 'Devops/인프라',
  SECURITY: '보안',
  EMBEDDED: '임베디드',
  GAME: '게임',
}
