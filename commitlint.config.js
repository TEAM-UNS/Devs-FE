// Conventional Commits 검사 (커밋 설명은 한글).
// subject-case는 라틴 문자 대소문자 규칙이라, 한글 설명에 영어 용어(CI/API 등)가
// 섞여 대문자로 시작하면 오탐이 난다 → 비활성화. (type/scope/비어있음 검사는 유지)
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0],
  },
}
