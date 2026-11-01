import type { Retrospect } from '../types'

// TODO: API 연동 때 지운다 — GET /retrospect

const LONG =
  "올해 초, 스스로 선언했던 '프론트엔드 역량 강화 로드맵'의 목표 기간이 마무리되었다. 당시 내가 설정했던 로드맵은 명확했다. React 깊이 있게 다루기, TypeScript 완벽 적용, 그리고 성능 최적화 경험 쌓기.\n결론부터 말하자면, 로드맵의 달성률은 약 70% 정도다. 처음에 세웠던 계획대로 완벽하게 진행되지는 않았다. 초반 2달 동안은 TypeScript의 타입 시스템을 익히느라 예상보다 훨씬 많은 시간을 보냈다.\n하지만 3개월 차에 접어들며 변화가 시작됐다. 프로젝트의 규모가 커질수록 초기 타입 설정이 제공하는 안정성과 에러 예방 효과를 체감할 수 있었다.\n다음 로드맵에서는 목표를 더 세분화하고, 실행 가능성에 초점을 맞추려 한다."
const SHORT =
  '오늘은 리엑트 핵심 개념을 학습했는데 좀 어려웠다. 그래서 내일 로드맵 진행 전에 한번 복습하려 한다. 내일도 화이팅~'

const CONTENTS = [LONG, SHORT, '벌써 21일째 🔥']

export const MOCK_RETROSPECTS: Retrospect[] = Array.from(
  { length: 12 },
  (_, index) => ({
    retrospectId: index + 1,
    dayNo: (index % 7) + 1,
    // 세 줄에 차례로 나뉘므로 3으로 나눈 몫까지 섞어 줄마다 내용이 달라지게 한다
    content: CONTENTS[(index + Math.floor(index / 3)) % CONTENTS.length],
    date: '2026-10-26',
    likeCount: [2, 1, 0, 12, 65, 4, 6][index % 7],
    liked: index % 3 === 1,
  }),
)
